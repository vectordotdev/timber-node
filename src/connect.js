'use strict';

// import fs from 'fs';
// import path from 'path';
// var appDir = path.dirname(require.main.filename);
// fs.writeFile(`${appDir}/timber.log`, string);

import intercept from 'intercept-stdout';

function connect(stream) {
  // var stdoutHandler = function(txt) {
  //       stream.write(txt);
  //       return txt;
  //   };
   
  //   var stderrHandler = function(txt) {
  //       stream.write(txt);
  //       return txt;
  //   };

  //   intercept(stdoutHandler, stderrHandler);
  // const oldOutWrite = process.stdout.write;

  process.stdout.write = (function(write) {
    return function(string, encoding, fd) {
      write.apply(process.stdout, arguments);
      stream.write(string, encoding, fd);
    }
  })(process.stdout.write);
  
  
  // process.stdout.write = () => (...args) => {
  //   // stream.write(...args);
  //   oldOutWrite.apply(process.stdout, args);
  // }

  // var oldErrWrite = process.stderr.write;

  // process.stderr.write = (function(write) {
  //   return function(string, encoding, fd) {
  //     write.apply(process.stderr, arguments);
  //     stream.write(string, encoding, fd);
  //   }
  // })(process.stderr.write);

  // return function() {
  //   process.stdout.write = oldOutWrite;
  //   process.stderr.write = oldErrWrite;
  // };
}

module.exports = connect;