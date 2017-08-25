import { Writable } from 'stream'
import { Custom } from '../events'
import Augment from '../utils/augment'
import errors from '../data/errors'

/**
 * The Timber Bunyan transport allows you to seamlessly install
 * Timber in your apps that use bunyan as the logger.
 */
class BunyanTransport extends Writable {
  /**
   * @param {Object} [options] - Configuration options for the transport
   * @param {string} [options.stream] - Stream to write to
   */
  constructor({ stream, ...options } = {}) {
    if (!stream) {
      throw new Error(errors.transports.bunyan.stream)
    }

    super(options)

    this.name = 'timberBunyan'
    this.level = options.level || 'info'

    // Attach the provided stream
    this.stream = stream
  }

  /**
   * @param {string} [level] - Level of the log (info, warn, error)
   * @param {string} [msg] - The log message
   * @param {Object} [meta] - Additional metadata for the log message
   * @param {function} [callback] - Bunyan's success callback
   */
  _write = (level, msg, { event, ...meta }, callback) => {
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

    // Write our structured log to the timber https stream
    this.stream.write(structuredLog.data)
    callback(null, true)
  }
}

export default BunyanTransport

