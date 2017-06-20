import Log from '../log'
import debug from './debug'

/**
 * Attaches a transport stream to a writeable stream.
 *
 * @param {Array} transports - array of transports to attach to the stream
 * @param {Writable} toStream - the stream your transport will attach to
 * @param {Object} options - configuration options
 * @param {boolean} options.applyBackPressure
 */
const attach = (transports, toStream, { applyBackPressure = false } = {}) => {
  // Store refs to standard logging utilities
  const originalWrite = toStream.write

  debug(`attaching ${transports.length} transports to stream`)

  toStream.write = (message, encoding, fd) => {
    const log = message instanceof Log ? message : new Log(message)

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
  }

  return {
    detach: () => {
      toStream.write = originalWrite
    },
  }
}

export default attach
