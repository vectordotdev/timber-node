'use strict';
import https from 'http';

function testRequest() {
  const body = "hello";
  let options = {
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
    hostname: 'localhost',
    port: 8080,
    path: '/',
    agent: false,
    method: 'POST'
  };

  let req = https.request(options);

  req.on('error', (e) => {
    console.log(e);
    console.log(`Timber request error: ${e.message}`);
  });

  req.write(body);
  req.end();
}

function connect(stream) {
  const oldOutWrite = process.stdout.write;

  process.stdout.write = (function(write) {
    return function(string, encoding, fd) {
      stream.write(string, encoding, fd);
      // logger.write(string);
      write.apply(process.stdout, arguments);
    }
  })(process.stdout.write);
  
  const oldErrWrite = process.stderr.write;

  process.stderr.write = (function(write) {
    return function(string, encoding, fd) {
      stream.write(string, encoding, fd);
      // logger.write(string);
      write.apply(process.stderr, arguments);
    }
  })(process.stderr.write);

  return function() {
    process.stdout.write = oldOutWrite;
    process.stderr.write = oldErrWrite;
  };
}

module.exports = connect;