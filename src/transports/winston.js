import winston from 'winston'
import HTTPS from './https'
import Log from '../log'

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

    // Create a new timber https stream
    this.stream = new HTTPS(apiKey)
  }

  /**
   * @param {string} [level] - Level of the log (info, warn, error)
   * @param {string} [msg] - The log message
   * @param {Object} [meta] - Additional metadata for the log message
   * @param {function} [callback] - Winston's success callback
   */
  log = (level, msg, meta, callback) => {
    // Create a structured log object out of the log message
    const structuredLog = new Log(msg, { level })

    // If custom metadata was provided with the log, append it
    if (Object.keys(meta).length) {
      structuredLog.append({ meta })
    }

    // Write our structured log to the timber https stream
    this.stream.write(structuredLog.data)
    callback(null, true)
  }
}

export default WinstonTransport
