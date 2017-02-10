'use strict';
import https from 'http';

import fs from 'fs';
import path from 'path';
var logger = fs.createWriteStream('timber.log', { flags: 'a' });

function connect(stream) {
  const oldOutWrite = process.stdout.write;

  process.stdout.write = (function(write) {
    return function(...args) {
      const written = stream.write(...args);
      write.apply(process.stdout, args);

      // if (!written && applyBackPressure) {
      //   stream.once('drain', () => stream.write(...args));
      // }

      return written;
    }
  })(process.stdout.write);
  
  const oldErrWrite = process.stderr.write;

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