import connect from './connect';
import HTTPSStream from './transports/https';

/**
 * The main Timber client responsible for decorating
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

module.exports = { install, Timber }
