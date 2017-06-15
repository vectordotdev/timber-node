import util from 'util'
import Log from './utils/log'
import config from './config'

/**
 * Transforms an ordinary console.log message into a structured Log object
 * It also allows you to pass a Log object directly to a console.log function
 * It will automatically detect whether or not you are passing a structured
 * log into the console before attempting to transform it.
 *
 * This is also what is responsible for assigning the correct level to the log
 *
 * @param {Array} args - argument list passed to console
 * @param {String} level - `info` `warn` `error` `debug` `fatal`
 */
const transformConsoleLog = ({ args, level }) => {
  const log = args[0] instanceof Log
    ? args[0]
    : new Log(`${util.format.apply(null, args)}\n`)
  log.setLevel(level)
  return log.format({
    withMetadata: config.append_metadata,
  })
}

console.info = (...args) => {
  process.stdout.write(transformConsoleLog({ args, level: 'info' }))
}

console.log = (...args) => {
  process.stdout.write(transformConsoleLog({ args, level: 'info' }))
}

console.warn = (...args) => {
  process.stdout.write(transformConsoleLog({ args, level: 'warn' }))
}

console.error = (...args) => {
  process.stderr.write(transformConsoleLog({ args, level: 'error' }))
}

export default console
