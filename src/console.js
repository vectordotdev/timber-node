import util from 'util'
import Augment from './utils/augment'
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
  // Allow custom metadata and event logging
  // https://github.com/timberio/timber-node/issues/41
  if (
    args.length === 2 &&
    typeof args[0] === 'string' &&
    typeof args[1] === 'object'
  ) {
    if (args[1].meta && typeof args[1].meta === 'object') {
      return new Augment(args[0], { level, meta: { ...args[1].meta } }).format()
    } else if (args[1].event && typeof args[1].event === 'object') {
      return new Augment(args[0], {
        level,
        event: { custom: { ...args[1].event } },
      }).format()
    }
  }
  const log = args[0] instanceof Augment
    ? args[0]
    : new Augment(`${util.format.apply(null, args)}\n`)
  log.setLevel(level)
  return log.format()
}

const originalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error
}

console.log = (...args) =>
  config._attached_stdout || config.append_metadata
    ? process.stdout.write(transformConsoleLog({ args, level: 'info' }))
    : originalConsole.log(...args)

console.info = (...args) =>
  config._attached_stdout || config.append_metadata
    ? process.stdout.write(transformConsoleLog({ args, level: 'info' }))
    : originalConsole.info(...args)

console.warn = (...args) =>
  config._attached_stdout || config.append_metadata
    ? process.stdout.write(transformConsoleLog({ args, level: 'warn' }))
    : originalConsole.warn(...args)

console.error = (...args) =>
  config._attached_stderr || config.append_metadata
    ? process.stderr.write(transformConsoleLog({ args, level: 'error' }))
    : originalConsole.error(...args)
