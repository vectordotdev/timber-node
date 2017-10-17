/*
 * @private
 *
 * This module is meant to be *private* and should not be used directly.
 * It's an internal function used by the Timber library to log within our
 * integrations. It an abstraction on top of the various loggers our clients
 * could use, ensuring we use the proper logger within each integration.
 *
 * For example, take Express. We provide a single middleware for capturing context
 * and logging HTTP request and response events. We need to log to winston if the
 * client is using winston, or the console if they are not. But a client should know
 * which logger they are using and use that directly.
 */

import config from '../config'
import LogEntry from '../log_entry'

const loggers = {
  console: {
    detect: () => config.logger.constructor.name === 'Console' || config.logger.constructor.name === 'CustomConsole',
    handler: (level, message, metadata) => {
      if (metadata) {
        return config.logger[level](new LogEntry(message, metadata))
      }
      return config.logger[level](message)
    },
  },
  winston: {
    detect: () =>
      config.logger.Container &&
      config.logger.Logger &&
      config.logger.Transport,
    handler: (level, message, metadata = {}) =>
      config.logger.log(level, message, metadata),
  },
  bunyan: {
    detect: () => config.logger.constructor.name === 'Logger',
    handler: (level, message, metadata) => {
      config.logger[level](metadata, message)
    },
  },
}

const log = (...args) => {
  // Iterate through the loggers object to detect
  // which logger is set in the timber config.
  for (const name in loggers) {
    // If we successfully detected the logger...
    if (loggers[name].detect()) {
      // Pass the provded arguments to the logger
      return loggers[name].handler(...args)
    }
  }
}

export default log
