'use strict';

import https from 'http';
import msgpack from 'msgpack';
import stream, { Writable } from 'stream';

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
 * keep-alive connections, and msgpack to deliver logs with high-throughput and little overhead.
 * It also implements the Stream.Writable interface so that it can be treated like a stream.
 * This is beneficial in situation like Morgan, where you can pass a custom stream.
*/

class HTTPSStream extends Writable {
  /**
    * @constructor
    * @param {string} apiKey - Timber API Key
    * @param {Object} [options] - Various opptions to adjust the stream behavior.
    * @param {string} [options.flushInterval=60000] - How often, in milliseconds, the messages written to the stream should be delivered to Timber.
    * @param {string} [options.httpsAgent] - Your own custom https.Agent. We use agents to maintain connection pools and keep the connections alive. This avoids the initial connection overhead every time we want to communicate with Timber. See https.Agent for options.
  */
  constructor(apiKey, { flushInterval = 10000, httpsAgent, httpsClient } = {}) {
    super({
      objectMode: true,
      highWaterMark: 5000
    }); // pass {objectMode: true } ?
    // Writable.call(this, { objectMode: true});

    this.apiKey = apiKey;
    this.flushInterval = flushInterval;
    this.httpsAgent = httpsAgent || new https.Agent({
      keepAlive: true,
      maxSockets: 1,
      keepAliveMsecs: (1000 * 60) // Keeps the connection open for 1 minute, avoiding reconnects
    });
    this.httpsClient = httpsClient || https;

    // Cork the stream so we can utilize the internal Buffer. We do *not* want to
    // send a request for every message. The _flusher will take care of flushing the stream
    // on an interval.
    this.cork();

    // // In the event the _flusher is not fast enough, we need to monitor the buffer size.
    // // If it fills before the next flush event, we should immediately flush.

    if (flushInterval !== undefined && flushInterval > 0) {
      this._startFlusher();
    }
  }

  // write(...args) {
  //   if (this.length >= this.highWaterMark) {
  //     logger.write("flushing, buffer is full")
  //     if this.httpsAgent.freeSockets == 0 {
  //       return false
  //     } else {
  //       this._flush();
  //     }
  //   } else {
  //     logger.write("writing, buffer is not full")
  //   }
  //   super(...args);
  // }

  /**
   * _writev is a Stream.Writeable methods that, if present, will write multiple chunks of
   * data off of the buffer. Defining it means we do not need to define _write.
   */
  // let options = {
  //     agent: this.httpsAgent,
  //     auth: this.apiKey,
  //     hostname: HOSTNAME,
  //     path: PATH,
  //     headers: {
  //       'Content-Type': CONTENT_TYPE,
  //       'User-Agent': USER_AGENT
  //     }
  //   };
  _writev(chunks, next) {
    const messages = chunks.map((chunk) => { return chunk.chunk; });
    logger.write(`${typeof chunks}: sending: ${messages.length} messages \n`);

    const body = JSON.stringify(messages); //msgpack.pack(messages);
    let options = {
      headers: {
        'Content-Type': CONTENT_TYPE,
        'Content-Length': Buffer.byteLength(body),
        'User-Agent': USER_AGENT
      },
      hostname: 'localhost',
      port: 8080,
      path: '/',
      agent: false,
      method: 'POST'
    };

    let req = this.httpsClient.request(options, (res) => {
      next();
    });

    req.on('error', (e) => {
      logger.write(`Timber request error: ${e.message}`);
    });

    req.write(body);
    req.end();
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