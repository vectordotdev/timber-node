import connect from './connect'
import debug from './utils/debug'

/**
 * Installs the timber logger to route all stdout logs to the provided stream
 *
 * @param {Stream} transport - the stream that all logs will go through
 */
function install({ transport }) {
  if (!transport) throw Error('No transport was provided.')

  // connect our transport stream to stdout
  connect(transport)
}

export default install
