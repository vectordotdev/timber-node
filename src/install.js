import attach from './utils/attach'
import errors from './data/errors'

/**
 * Installs the timber logger to route all stdout logs to the provided stream
 *
 * @param {Stream} transport - the stream that all logs will go through
 */
function install(transport) {
  if (!transport) throw Error(errors.install.noTransport)

  // attach our transport stream to stdout/stderr
  attach([transport], process.stdout)
  attach([transport], process.stderr)
}

export default install
