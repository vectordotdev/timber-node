'use strict';
import https from 'http';
import { Writable } from 'stream';

function connect(stream, applyBackPressure = false) {
  if(!(stream instanceof Writable)) {
    throw new Error("stream must be of type Writable");
  }

  const oldOutWrite = process.stdout.write;
  const oldErrWrite = process.stderr.write;

  process.stdout.write = (function(write) {
    return function(...args) {
      const written = stream.write(...args);
      write.apply(process.stdout, args);

      // If we want to allow back pressure, listen for
      // the drain event and try once the buffer is cleared
      // if (!written && applyBackPressure) {
      //   stream.once('drain', () => stream.write(...args));
      // }

      return written;
    }
  })(process.stdout.write);

  process.stderr.write = (function(write) {
    return function(string, encoding, fd) {
      stream.write(string, encoding, fd);
      write.apply(process.stderr, arguments);
    }
  })(process.stderr.write);

  return function() {
    process.stdout.write = oldOutWrite;
    process.stderr.write = oldErrWrite;
  };
}

module.exports = connect;