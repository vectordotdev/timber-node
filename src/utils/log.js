import schema from '../schema'
import config from '../config'

/**
 * Transforms a log message or object into a rich structured format
 * that timber expects, ex 'log message' @timber.io {"dt": "…", "level": "info", "context": {…}}
 * see https://github.com/timberio/log-event-json-schema for specs
 */
class Log {
  /**
   * @param {String} message - the log message before transforming
   * @param {Object} context - context to be attached to message
   */
  constructor(message, context = {}) {
    /**
     * Reference to original log message
     * @type {String}
     */
    this.raw = message

    /**
     * Structured log data
     * @type {Date}
     */
    this.data = {
      ...schema,
      message,
      dt: new Date(),
      ...context,
    }
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
   * Convenience function for setting the log level
   *
   * @param {String} level - `info` `warn` `error` `debug`
   */
  setLevel(level) {
    this.append({ level })
  }

  /**
   * Transforms the structured log into a string
   * i.e. `Log message @metadata { ... }`
   */
  format({ withMetadata = true } = {}) {
    let message = this.raw.endsWith('\n')
      ? this.raw.substring(0, this.raw.length - 1)
      : this.raw

    if (withMetadata) {
      message += ` ${config.metadata_delimiter} ${JSON.stringify(this.data)}`
    }

    return `${message}\n`
  }
}

export default Log
