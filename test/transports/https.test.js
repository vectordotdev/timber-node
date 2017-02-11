// 'use strict';

// const assert = require('assert');
// const EventEmitter = require('events');
// const HTTPSStream = require('../../../lib/transports/https_stream');
// const msgpack = require('msgpack');

// // Mimics http.Request behavior so that we can assert usage below.
// class FakeRequest extends EventEmitter {
//   constructor(options = {}) {
//     super();
//     this.endCallCount = 0;
//     this.options = options;
//     this.writtenMessages = [];
//   }

//   end() {
//     this.endCallCount++;
//   }

//   write(message) {
//     this.writtenMessages.push(message);
//   }
// }

// // Mimics https behavior so that we can assert usage below.
// class FakeHTTPSClient {
//   constructor(fakeRequest) {
//     this.fakeRequest = null;
//     this.requestCallCount = 0;
//   }

//   request(options) {
//     this.requestCallCount++;
//     return this.fakeRequest = new FakeRequest(options);
//   }
// }

// describe("HTTPSStream", () => {
//   describe(".constructor", () => {
//     it("sets the apiKey", () => {
//       let httpsStream = new HTTPSStream('my_api_key', {});
//       assert.equal(httpsStream.apiKey, 'my_api_key');
//     });

//     it("sets the flushInterval default", () => {
//       let httpsStream = new HTTPSStream('my_api_key');
//       assert.equal(httpsStream.flushInterval, 1000);
//     });

//     it("starts the flusher and flushes messages", (done) => {
//       let fakeHTTPSClient = new FakeHTTPSClient();
//       let httpsStream = new HTTPSStream('my_api_key', {httpsClient: fakeHTTPSClient, flushInterval: 1});
//       httpsStream.write('message 1');
//       httpsStream.write('message 2');
//       setTimeout(() => {
//         assert.equal(fakeHTTPSClient.requestCallCount, 1);
//         done()
//       }, 10);
//     });
//   });

//   describe("write", function() {
//     it("sends a bulk HTTP request to Timber with 1 message", () => {
//       let fakeHTTPSClient = new FakeHTTPSClient();
//       let httpsStream = new HTTPSStream('my_api_key', {httpsClient: fakeHTTPSClient, flushInterval: 0});
//       httpsStream.write('message 1');
//       httpsStream._flush();

//       assert.equal(fakeHTTPSClient.requestCallCount, 1);

//       let fakeRequest = fakeHTTPSClient.fakeRequest;

//       let requestOptions = fakeRequest.options;
//       assert(requestOptions.agent);
//       assert.equal(requestOptions.auth, 'my_api_key');
//       assert.equal(requestOptions.hostname, 'api.timber.io');
//       assert.equal(requestOptions.path, '/frames');
//       assert.equal(requestOptions.headers['Content-Type'], 'application/msgpack');
//       assert(requestOptions.headers['User-Agent'].startsWith('Timber Node HTTPS Stream'));

//       const messages = msgpack.unpack(fakeRequest.writtenMessages[0]);
//       assert.equal(messages.length, 1);
//       assert.equal(messages[0].toString(), 'message 1');

//       assert.equal(fakeRequest.endCallCount, 1);
//     });

//     it("sends a bulk HTTP request to Timber with multiple messages", () => {
//       let fakeHTTPSClient = new FakeHTTPSClient();
//       let httpsStream = new HTTPSStream('my_api_key', {httpsClient: fakeHTTPSClient, flushInterval: 0});
//       httpsStream.write('message 1');
//       httpsStream.write('message 2');
//       httpsStream._flush();

//       assert.equal(fakeHTTPSClient.requestCallCount, 1);

//       let fakeRequest = fakeHTTPSClient.fakeRequest;

//       let requestOptions = fakeRequest.options;
//       assert(requestOptions.agent);
//       assert.equal(requestOptions.auth, 'my_api_key');
//       assert.equal(requestOptions.hostname, 'api.timber.io');
//       assert.equal(requestOptions.path, '/frames');
//       assert.equal(requestOptions.headers['Content-Type'], 'application/msgpack');
//       assert(requestOptions.headers['User-Agent'].startsWith('Timber Node HTTPS Stream'));

//       const messages = msgpack.unpack(fakeRequest.writtenMessages[0]);
//       assert.equal(messages.length, 2);
//       assert.equal(messages[0].toString(), 'message 1');
//       assert.equal(messages[1].toString(), 'message 2');

//       assert.equal(fakeRequest.endCallCount, 1);
//     });
//   });
// });