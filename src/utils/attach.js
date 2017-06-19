import { Writable } from 'stream'
import Log from '../log'
import debug from './debug'

const attach = (stream, toStream, { applyBackPressure = false } = {}) => {
  // Ensure the stream is Writable
  if (!(stream instanceof Writable)) {
    throw new Error('stream must be of type Writable')
  }

  // Store refs to standard logging utilities
  const originalWrite = toStream.write

  toStream.write = (write => {
    return function(message, encoding, fd) {
      const log = message instanceof Log ? message : new Log(message)
      // transform the message string into a schema adhering object
      const written = stream.write(log.data, encoding, fd)

      debug(`Logged: ${JSON.stringify(log.data, null, 2)}`)

      // If we want to allow back pressure, listen for
      // the drain event and try once the buffer is cleared
      if (!written && applyBackPressure) {
        stream.once('drain', () => stream.write(...arguments))
      }

      return written
    }
  })(process.stdout.write)

  return {
    detach: () => {
      toStream.write = originalWrite
    },
  }
}

export default attach
