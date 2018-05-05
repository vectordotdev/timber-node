import util from 'util'
import config from '../config'

/**
 * Convenience function for retrieving a reference to
 * the debug_logger stream.
 *
 * @private
 */
export const debug_logger = () => config.debug_logger

/**
 * Generate a timestamp string to use in debug lines
 *
 * @private
 */
const timestamp = () => new Date().toISOString()

/**
 * Convenience function for logging debug messages
 * to the configured debug_logger
 *
 * This works much like the built in console.log function,
 * accepting any amount of mixed arguments and concatenating
 * them into a single string to be sent to the debug_logger stream
 *
 * @private
 * @param {...*} args
 */
const debug = (...args) => {
  if (debug_logger()) {
    debug_logger().write(`[${timestamp()}][timber-debug]: ${util.format.apply(null, args)}\n`)
  }
}

export default debug
