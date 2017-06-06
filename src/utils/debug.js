import util from 'util'
import { globals } from '../config'

/**
 * Convenience function for retrieving a reference to
 * the debug_logger stream.
 *
 * @private
 */
export const debug_logger = () => globals().debug_logger

/**
 * Convenience function for logging debug messages
 * to the configured debug_logger
 *
 * This works much like the builtin console.log function,
 * accepting any amount of mixed arguments and concatenating
 * them into a single string to be sent to the debug_logger stream
 *
 * @private
 * @param {...*} args
 */
const debug = (...args) => {
  if (debug_logger()) {
    debug_logger().write(`${util.format.apply(null, args)}\n`)
  }
}

export default debug
