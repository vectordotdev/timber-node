import attach from './utils/attach'

/**
 * Installs the timber logger to route all stdout logs to the provided stream
 *
 * @param {Stream} transport - the stream that all logs will go through
 */
function install(transport) {
  if (!transport) throw Error('No transport was provided.')

  // attach our transport stream to stdout/stderr
  attach(transport, process.stdout)
  attach(transport, process.stderr)
}

export default install
