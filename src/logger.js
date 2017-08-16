import winston from 'winston'
import config from './config'
import Log from './log'

const loggers = {
  console: {
    detect: () => config.logger.constructor.name === 'Console',
    handler: (message, metadata) => {
      if (metadata) {
        return config.logger.log(new Log(message, metadata))
      }
      return config.logger.log(message)
    },
  },
  winston: {
    detect: () =>
      config.logger.Container &&
      config.logger.Logger &&
      config.logger.Transport,
    handler: (message, metadata = {}) => config.logger.log('info', message, metadata),
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
