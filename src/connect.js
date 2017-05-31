'use strict'
import https from 'http'
import util from 'util'
import { Writable } from 'stream'
import transform from './utils/transform'

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
      // transform the message string into a schema adhering object
      const log = transform(message).append({level: 'info'});
      const written = stream.write(
        log,
        encoding,
        fd
      );
      // write.apply(process.stdout, [log]);
      // write.apply(process.stdout, [JSON.stringify(arguments)])
      write.apply(process.stdout, [log.message])

      // If we want to allow back pressure, listen for
      // the drain event and try once the buffer is cleared
      if (!written && applyBackPressure) {
        stream.once('drain', () => stream.write(...args));
      }

      return written;
    }
  })(process.stdout.write)

  process.stderr.write = (function(write) {
    return function(log, encoding, fd) {
      const written = stream.write(
        transform(log).append({level: 'error'}),
        encoding,
        fd
      )
      write.apply(process.stderr, arguments)

      // If we want to allow back pressure, listen for
      // the drain event and try once the buffer is cleared
      if (!written && applyBackPressure) {
        stream.once('drain', () => stream.write(...args))
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
