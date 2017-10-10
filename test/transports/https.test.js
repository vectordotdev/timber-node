'use strict';

import EventEmitter from 'events';
import HTTPSStream from '../../src/transports/https';

// Allows time travel for ticks/timeouts/intervals
jest.useFakeTimers();

// Mimics http.Request behavior so that we can assert usage below.
class FakeRequest extends EventEmitter {
  constructor(options = {}) {
    super();
    this.endCallCount = 0;
    this.options = options;
    this.writtenMessages = [];
  }

  end() {
    this.endCallCount++;
  }

  write(message) {
    this.writtenMessages.push(message);
  }
}

// Mimics https behavior so that we can assert usage below.
class FakeHTTPSClient {
  constructor(fakeRequest) {
    this.fakeRequest = null;
    this.requestCallCount = 0;
  }

  request(options) {
    this.requestCallCount += 1;
    return this.fakeRequest = new FakeRequest(options);
  }
}

describe("HTTPS Stream", () => {

  describe("initialization", () => {

    it("sets the apiKey", () => {
      let httpsStream = new HTTPSStream('my_api_key', {});
      expect(httpsStream.apiKey).toBe('my_api_key');
    });

    it("sets the flushInterval default", () => {
      let httpsStream = new HTTPSStream('my_api_key');
      expect(httpsStream.flushInterval).toBe(1000);
    });

    it("starts the flusher and flushes messages", () => {
      let fakeHTTPSClient = new FakeHTTPSClient();
      let httpsStream = new HTTPSStream('my_api_key', {
          httpsClient: fakeHTTPSClient,
          flushInterval: 1000
      });

      expect(fakeHTTPSClient.requestCallCount).toBe(0);

      // Send a few messages
      httpsStream.write('message 1');
      httpsStream.write('message 2');

      jest.runOnlyPendingTimers();
      jest.runAllTicks();

      expect(fakeHTTPSClient.requestCallCount).toBe(1);
    });
  });

  describe("transport", function() {
    it("sends a bulk HTTP request to Timber with 1 message", () => {
      let fakeHTTPSClient = new FakeHTTPSClient();
      let httpsStream = new HTTPSStream('my_api_key', { httpsClient: fakeHTTPSClient, flushInterval: 2500 });

      // Write the message and flush it
      httpsStream.write('message 1');
      httpsStream._flush();
      jest.runAllTicks();

      expect(fakeHTTPSClient.requestCallCount).toBe(1);

      let fakeRequest = fakeHTTPSClient.fakeRequest;
      const messages = fakeRequest.writtenMessages;

      expect(messages.length).toBe(1);
      expect(JSON.parse(messages[0])[0]).toBe('message 1');
      expect(fakeRequest.endCallCount).toBe(1);
    });

    it("sends a bulk HTTP request to Timber with multiple messages", () => {
      let fakeHTTPSClient = new FakeHTTPSClient();
      let httpsStream = new HTTPSStream('my_api_key', { httpsClient: fakeHTTPSClient, flushInterval: 2500 });
      httpsStream.write('message 1');
      httpsStream.write('message 2');
      httpsStream._flush();
      jest.runAllTicks();

      expect(fakeHTTPSClient.requestCallCount).toBe(1);

      let fakeRequest = fakeHTTPSClient.fakeRequest;
      const messages = fakeRequest.writtenMessages;

      expect(messages.length).toBe(1);
      expect(JSON.parse(messages[0])[0]).toBe('message 1');
      expect(JSON.parse(messages[0])[1]).toBe('message 2');
      expect(fakeRequest.endCallCount).toBe(1);
    });

    // it("handles logs sent as strings", () => {});
    // it("handles logs sent as objects", () => {});
    // it("throws a warning when the buffer is full", () => {});
    // it("does not crash when the /frames endpoint times out", () => {});
    // it("retries requests when backPressure is allowed", () => {});

  });
});

// assert(requestOptions.agent);
// assert.equal(requestOptions.auth, 'my_api_key');
// assert.equal(requestOptions.hostname, 'api.timber.io');
// assert.equal(requestOptions.path, '/frames');
// assert.equal(requestOptions.headers['Content-Type'], 'application/msgpack');
// assert(requestOptions.headers['User-Agent'].startsWith('Timber Node HTTPS Stream'));