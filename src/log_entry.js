import config from './config'
import errors from './data/errors'

const JSON_SCHEMA_URL = 'https://raw.githubusercontent.com/timberio/log-event-json-schema/v3.1.3/schema.json';

/**
 * This class is instantiated before
 * Transforms a log message or object into a rich structured format
 * that timber expects, ex 'log message' @timber.io {"dt": "…", "level": "info", "context": {…}}
 * see https://github.com/timberio/log-event-json-schema for specs
 */
class LogEntry {
  /**
   * @param {String} message - the log message before transforming
   * @param {Object} [context] - context to be attached to message
   */
  constructor(message, context = {}, level) {
    // Throw an error if no message is provided
    if (!message) throw new Error(errors.log.noMessage)

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
      $schema: JSON_SCHEMA_URL,
      dt: new Date(),
      message,
      level,
      ...context,
    }
  }

  /**
   * Adds the to the log entry. A log entry can only contain a single
   * event.
   *
   * @param {Event} event
   */
  addEvent(event) {
    this.append({event: event})
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
    const { dt, message, ...rest } = this.data

    let log = this.raw.endsWith('\n')
      ? this.raw.substring(0, this.raw.length - 1)
      : this.raw

    if (config.timestamp_prefix) {
      log = `${dt.toISOString()} ${log}`
    }

    if (withMetadata) {
      const data = config.timestamp_prefix ? rest : { dt, ...rest }
      log += ` ${config.metadata_delimiter} ${JSON.stringify(data)}`
    }

    return `${log}\n`
  }
}

export default LogEntry
