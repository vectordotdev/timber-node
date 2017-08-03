import winston from 'winston'
import HTTPS from './https'
import attach from '../utils/attach'


/**
 * The Timber Winston transport allows you to seamlessly install
 * Timber in your apps that use winston as the logger.
 */
class WinstonTransport extends winston.Transport {
  /**
   * @param {Object} [options] - Configuration options for the transport
   * @param {string} [options.apiKey] - Timber API Key
   */
  constructor({ apiKey, ...options } = {}) {
    if (!apiKey) {
      throw new Error('You cannot set up the timber winston transport without an apiKey')
    }

    super(options)

    this.name = 'timberWinston'
    this.level = options.level || 'info'

    // Create the HTTPS stream to timber's ingestion api
    const transport = new HTTPS(apiKey)

    // attach https transport to winston transport
    attach([transport], process.stdout)
  }

  /**
   * @param {string} [level] - Level of the log (info, warn, error)
   * @param {string} [msg] - The log message
   * @param {Object} [meta] - Additional metadata for the log message
   * @param {function} [callback] - Winston's success callback
   */
  log = (level, msg, meta, callback) => {
    callback(null, true)
  }
}

export default WinstonTransport
