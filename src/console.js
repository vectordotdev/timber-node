/**
 * @module timber/console
 *
 * This module transparently augments console messages with structured data. Continue
 * to use `console` as you normally would and also pass an object as a second
 * parameter to log structured data. In the examples below you will notice logs are
 * appended with `@metadata ...`. This is what we mean by "augment". The timber.io
 * service will strip and parse this data. See timber.io/docs for more details.
 *
 * @example <caption>Logging a string</caption>
 * console.log('Hello world')
 * // Hello world @metadata {'dt': '2017-10-09T02:42:12.235421Z', 'level': 'info', ...}
 *
 * @example <caption>Logging a structured data</caption>
 * console.warn('Payent rejected', event: {payment_rejected: { customer_id: "abcd1234", amount: 100, reason: "Card expired" }})
 * // Payent rejected @metadata {'dt': '2017-10-09T02:42:12.235421Z', 'level': 'warn', 'event': {'payment_rejected': {'customer_id': 'abcd1234', 'amount': 100, 'reason': 'Card expired'}}}
 */

import util from 'util'
import config from './config'
import LogEntry from './log_entry'

/**
 * Transforms an ordinary console.log message into a structured Log object.
 * It also allows you to pass a Log object directly to a console.log function
 * It will automatically detect whether or not you are passing a structured
 * log into the console before attempting to transform it.
 *
 * This is also what is responsible for assigning the correct level to the log.
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
      return new LogEntry(args[0], { level, meta: { ...args[1].meta } }).format()
    } else if (args[1].event && typeof args[1].event === 'object') {
      return new LogEntry(args[0], {
        level,
        event: { custom: { ...args[1].event } },
      }).format()
    }
  }
  const log = args[0] instanceof LogEntry
    ? args[0]
    : new LogEntry(`${util.format.apply(null, args)}\n`)
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
