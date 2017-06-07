import schema from '../schema'
import { metadata_delimiter } from './formatter'

/**
 * Transforms a log message or object into a rich structured format
 * that timber expects, ex 'log message' @timber.io {"dt": "…", "level": "info", "context": {…}}
 * see https://github.com/timberio/log-event-json-schema for specs
 */
class Log {
  /**
   * @param {String} raw - the log message before transforming
   */
  constructor(raw) {
    /**
     * Reference to original log message
     * @type {String}
     */
    this.raw = raw

    /**
     * Structured log data
     * @type {Date}
     */
    this.data = {
      ...schema,
      dt: new Date(),
    }

    this.parse(raw)
  }

  /**
   * Appends data to the end of the structured log object
   *
   * @param {Object} data
   */
  append(data) {
    this.data = {
      ...this.data,
      ...data,
    }
  }

  /**
   * Parses a raw log message into a rich structured log.
   * If there's any context attached to the line via @metadata,
   * it will be extracted, parsed, and appended to the structured log.
   *
   * @param {String} raw - the raw log message
   */
  parse(raw) {
    // parse the metadata from the log line
    const [message, context] = raw.split(metadata_delimiter)

    // This ensures there's a newline at the end of the message
    // when a log line contained @metadata, it will be split
    // meaning that it will no longer end in a newline.
    const format = str => (context ? `${str}\n` : str)

    /**
     * Parsed log message
     * @private
     * @type {String}
     */
    this.message = typeof message === 'string'
      ? format(message)
      : JSON.stringify(message)

    // Append the message and context (if there is any) to the structured log
    this.append({
      message: this.message,
      ...(context ? JSON.parse(context) : {}),
    })
  }

  /**
   * Convenience function for setting the log level
   *
   * @param {String} level - `info` `warn` `error` `debug`
   */
  setLevel(level) {
    this.append({ level })
  }
}

export default Log
