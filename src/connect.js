'use strict'
// import https from 'http'
// import util from 'util'
import { Writable } from 'stream'
import Log from './utils/log'

function connect(stream, applyBackPressure = false) {
  // Ensure the stream is Writable
  if (!(stream instanceof Writable)) {
    throw new Error('stream must be of type Writable')
  }

  // Store refs to standard logging utilities
  const oldOutWrite = process.stdout.write
  const oldErrWrite = process.stderr.write

  process.stdout.write = (function(write) {
    return function(message, encoding, fd) {
      const log = new Log(message)
      // transform the message string into a schema adhering object
      const written = stream.write(log.data, encoding, fd)

      write.apply(process.stdout, [JSON.stringify(log.data)])

      // If we want to allow back pressure, listen for
      // the drain event and try once the buffer is cleared
      if (!written && applyBackPressure) {
        stream.once('drain', () => stream.write(...arguments))
      }

      return written
    }
  })(process.stdout.write)

  process.stderr.write = (function(write) {
    return function(message, encoding, fd) {
      const log = new Log(message)
      const written = stream.write(
        log.data,
        encoding,
        fd
      )
      write.apply(process.stderr, arguments)

      // If we want to allow back pressure, listen for
      // the drain event and try once the buffer is cleared
      if (!written && applyBackPressure) {
        stream.once('drain', () => stream.write(...arguments))
      }

      return written
    }
  })(process.stderr.write)

  return function() {
    process.stdout.write = oldOutWrite
    process.stderr.write = oldErrWrite
  }
}

module.exports = connect
