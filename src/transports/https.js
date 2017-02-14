'use strict';

import https from 'http';
import { Writable } from 'stream';

const HOSTNAME = 'api.timber.io';
const PATH = '/frames';
const CONTENT_TYPE = 'application/msgpack';
const USER_AGENT = `Timber Node HTTPS Stream/${require('../../package.json').version}`;

// For debugging purposes, writes to /timber.log
import fs from 'fs';
import path from 'path';
var logger = fs.createWriteStream('timber.log', { flags: 'a' });

/**
 * A highly efficient stream for sending logs to Timber via HTTPS. It uses batches,
 * keep-alive connections (and in the future maybe msgpack) to deliver logs with high-throughput
 * and little overhead. It also implements the Stream.Writable interface so that it can be treated
 * like a stream. This is beneficial when using something like Morgan, where you can pass a custom stream.
*/

class HTTPSStream extends Writable {
  /**
    * @constructor
    * @param {string} apiKey - Timber API Key
    * @param {Object} [options] - Various options to adjust the stream behavior.
    * @param {string} [options.flushInterval=60000] - How often, in milliseconds, the messages written to the stream should be delivered to Timber.
    * @param {string} [options.httpsAgent] - Your own custom https.Agent. We use agents to maintain connection pools and keep the connections alive. This avoids the initial connection overhead every time we want to communicate with Timber. See https.Agent for options.
  */
  constructor(apiKey, {
      flushInterval = 2500,
      httpsAgent,
      httpsClient
    } = {})
  {
    super({
      objectMode: true,
      highWaterMark: 5000
    });

    this.apiKey = apiKey;
    this.flushInterval = flushInterval;
    this.httpsAgent = httpsAgent || new https.Agent({
      keepAlive: true,
      maxSockets: 3,
      keepAliveMsecs: (1000 * 60) // Keeps the connection open for 1 minute, avoiding reconnects
    });
    this.httpsClient = httpsClient || https;

    // Cork the stream so we can utilize the internal Buffer. We do *not* want to
    // send a request for every message. The _flusher will take care of flushing the stream
    // on an interval.
    this.cork();

    // In the event the _flusher is not fast enough, we need to monitor the buffer size.
    // If it fills before the next flush event, we should immediately flush.

    if (flushInterval !== undefined && flushInterval > 0) {
      this._startFlusher();
    }
  }

  /**
   * _writev is a Stream.Writeable methods that, if present, will write multiple chunks of
   * data off of the buffer. Defining it means we do not need to define _write.
   */
  _writev(chunks, next) {
    const messages = chunks.map(chunk => chunk.chunk);

    logger.write(`sending: ${typeof messages}: ${JSON.stringify(messages)} \n`);

    const body = JSON.stringify(messages);
    const options = {
      headers: {
        'Content-Type': "application/json",
        'Content-Length': Buffer.byteLength(body),
        'User-Agent': USER_AGENT
      },
      agent: this.httpsAgent,
      auth: this.apiKey,
      hostname: 'localhost',
      port: 8080,
      path: '/',
      agent: false,
      method: 'POST'
    };

    const req = this.httpsClient.request(options, (res) => {});
    req.on('error', (e) => {});
    req.write(body);
    req.end();
    next();
  }

  _write(chunk, encoding, next) {
    logger.write(`${typeof chunk}: writing chunk: ${chunk}`);
    this._writev([{chunk: chunk, encoding: encoding}], next);
  }

  /**
   * Expressive function to flush the buffer contents. uncork flushes the buffer and write
   * the contents. Cork allows us to continue buffering the messages until the next flush.
   */
  _flush() {
    logger.write(`Flushing buffer after ${this.flushInterval}ms \n`);
    // nextTick is recommended here to allows batching of write calls I think
    process.nextTick(() => {
      this.uncork();
      this.cork();
    });
  }

  /**
   * Interval to call _flush continuously. This ensures log lines get sent on this.flushInterval
   * intervals.
   */
  _startFlusher() {
    setInterval(() => this._flush(), this.flushInterval);
  }
}

module.exports = HTTPSStream;