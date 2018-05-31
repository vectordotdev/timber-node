import { Writable } from 'stream'
import { stripMetadata } from '../utils/metadata'
import errors from '../data/errors'
import config from '../config'
import debug from './debug'
import LogEntry from '../log_entry'

/**
 * Attaches a transport stream to a writeable stream.
 *
 * @param {Array} transports - array of transports to attach to the stream
 * @param {Writable} toStream - the stream your transport will attach to
 * @param {Object} options - configuration options
 * @param {boolean} options.applyBackPressure
 */
const attach = (transports, toStream, { applyBackPressure = false } = {}) => {
  // Ensure all the streams are Writable
  for (let i = 0; i < transports.length; i++) {
    if (!(transports[i] instanceof Writable)) {
      throw new Error(errors.attach.notWritable)
    }
  }

  // Store refs to standard logging utilities
  const originalWrite = toStream.write

  debug(`attaching ${transports.length} transports to stream`)

  // Override the target stream's write method to route through the transports
  // before calling it with the associated arguments
  toStream.write = (message, encoding, fd) => {
    // Check if this is a Timber log entry or a message string
    const log = message instanceof LogEntry ? message : new LogEntry(message)

    // Don't cause an infinite loop with debug lines
    if (message.indexOf('[timber-debug]') !== -1) {
      return originalWrite.apply(toStream, [log.data.message])
    }

    // Write the message to every supplied transport
    for (let i = 0; i < transports.length; i++) {
      const transport = transports[i]

      const written = transport.write(
        transport.acceptsObject ? log.data : log.data.message,
        encoding,
        fd
      )

      if (!written && applyBackPressure) {
        transport.once('drain', () => transport.write(...arguments))
      }
    }

    // When writing the log to the original stream,
    // strip the metadata if we're not in production
    // this keeps logs cleaner during development
    originalWrite.apply(toStream, [
      config.append_metadata || process.env.NODE_ENV === 'production'
        ? log.data.message
        : stripMetadata(log.data.message),
    ])
  }

  if (toStream === process.stdout) {
    config._attached_stdout = true
  } else if (toStream === process.stderr) {
    config._attached_stderr = true
  }

  return {
    detach: () => {
      toStream.write = originalWrite
    },
  }
}

export default attach
