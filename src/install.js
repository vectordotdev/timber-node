import connect from './connect'
import { setGlobals } from './config'
import debug from './utils/debug'

/**
 * Installs the timber logger to route all stdout logs to the provided stream
 *
 * @param {Stream} transport - the stream that all logs will go through
 */
function install({ transport, debug_logger }) {
  if (!transport) throw Error('No transport was provided.')

  // setup the debug logger
  setGlobals({ debug_logger })
  debug('debug logger installed')

  // connect our transport stream to stdout
  connect(transport)
}

export default install
