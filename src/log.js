import Augment from './utils/augment'
import config from './config'

const loggers = {
  console: {
    detect: () => config.logger.constructor.name === 'Console',
    handler: (level, message, metadata) => {
      if (metadata) {
        return config.logger[level](new Augment(message, metadata))
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
      config.logger[level]({ metadata }, message)
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
