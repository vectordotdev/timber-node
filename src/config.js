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
 * This is because you must set it as a writeable stream.
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
 */
const config = {
  metadata_delimiter: '@metadata',
  append_metadata: true,
  debug_logger: undefined,
  capture_request_body: false,
  capture_response_body: false,
  ...userConfig,
}

export default config
