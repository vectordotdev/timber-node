import connect from './connect';
import HTTPSStream from './transports/https';

/**
 * The main Timber client responsible for aggregating
 * and transporting logs to the Timber platform.
 */

class Timber {
  
  /**
   * @constructor
   * @param {Object} options - Options to initialize Timber
   */

  constructor(options) {
    this.transport = options.transport || 'stdout'; // where to send the logs to (https, stdout, etc.)
    this.source = options.source || 'stdout'; // could be winston, bunyan, etc.

    if (this.transport === 'https') {
      this.transportStream = new HTTPSStream(...options);
      connect(this.transportStream);
    }
  }
}

function install(options) {
  return new Timber(options);
}

export default install;


// Example instantiation:
// const timber = require('timber');
// timber.install({
//   apiKey: '12345',
//   transport: 'https',
//   source: 'stdout',
//   flushInterval: 2500,
//   maxRetries: 3,
//   maxSockets: 3,
//   keepAlive: 100 * 60,
//   highWaterMark: 6000
// });