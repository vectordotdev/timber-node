import path from 'path'
import finder from 'find-package-json'

const filename = (require.main && require.main.filename) || __dirname
const projectPath = path.dirname(filename)
const userConfig = finder(projectPath).next().value.timber

/**
 * The configuration options here are use throughout the timber library.
 * Any of the values can be changed in two different ways:
 *
 * ## Using your package.json
 *
 * To configure timber from your `package.json`, simply add a `timber`
 * object at the root level containing your desired overrides:
 *
 * ```json
 * "timber": {
 *   "capture_request_body": true,
 *   "capture_response_body": true
 * },
 * ```
 *
 * __Note:__ you cannot set the `debug_logger` option from the `package.json`.
 * This is because you must set it as a writeable stream. (see next section)
 *
 * ## Using inline overrides
 *
 * You can also configure timber by overriding the config options inline:
 *
 * ```js
 * const timber = require('timber');
 * timber.config.debug_logger = process.stdout;
 * ```
 *
 * __Note:__ inline overrides will override any options you have set
 * in your `package.json` file.
 *
 * @param {String} metadata_delimiter - delimiter between log message and log data (@metadata by default)
 * @param {boolean} append_metadata - append @metadata { ... } to all logs. If disabled, metadata will only be appended when `NODE_ENV === 'production'` (off by default)
 * @param {Writable} debug_logger - a writeable stream for internal debug messages to be sent to (disabled when undefined)
 * @param {boolean} timestamp_prefix - When `true`, log output should be prefixed with a timestamp in ISO 8601 format (off by default)
 */
const config = {
  _attached_stdout: false,
  _attached_stderr: false,
  logger: console,
  metadata_delimiter: '@metadata', // This should not be changed! The timber service only recognizes @metadata
  append_metadata: false,
  debug_logger: undefined,
  timestamp_prefix: false,
  ...userConfig,
}

export default config
