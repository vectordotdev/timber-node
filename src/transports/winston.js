import winston from 'winston'
import Augment from '../utils/augment'
import { Custom } from '../events'
import errors from '../data/errors'

/**
 * The Timber Winston transport allows you to seamlessly install
 * Timber in your apps that use winston as the logger.
 */
class WinstonTransport extends winston.Transport {
  /**
   * @param {Object} [options] - Configuration options for the transport
   * @param {string} [options.stream] - Stream to write to
   */
  constructor({ stream, ...options } = {}) {
    if (!stream) {
      throw new Error(errors.transports.winston.stream)
    }

    super(options)

    this.name = 'timberWinston'
    this.level = options.level || 'info'

    // Attach the provided stream
    this.stream = stream
  }

  /**
   * @param {string} [level] - Level of the log (info, warn, error)
   * @param {string} [msg] - The log message
   * @param {Object} [meta] - Additional metadata for the log message
   * @param {Object} [meta.event] - Event object to augment the log with
   * @param {Object} [meta.context] - Context object to augment the log with
   * @param {function} [callback] - Winston's success callback
   */
  log = (level, msg, { event, context, ...meta }, callback) => {
    // Create a structured log object out of the log message
    const structuredLog = new Augment(msg, { level })

    // If custom metadata was provided with the log, append it
    if (Object.keys(meta).length) {
      structuredLog.append({ meta })
    }

    // If the event key exists, append a custom event
    if (event) {
      for (const eventName in event) {
        if (!event[eventName]) continue
        structuredLog.append({
          event: new Custom({ type: eventName, data: event[eventName] }),
        })
      }
    }

    // If a context object was provided with the log, append it
    if (context) {
      structuredLog.append({
        context,
      })
    }

    // Write our structured log to the timber https stream
    this.stream.write(structuredLog.data)
    callback(null, true)
  }
}

export default WinstonTransport
