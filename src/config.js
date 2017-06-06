import path from 'path'
import finder from 'find-package-json'

const filename = (require.main && require.main.filename) || __dirname
const projectPath = path.dirname(filename)
const userConfig = finder(projectPath).next().value.timber

const config = {
  debug_logger: undefined,
  capture_request_body: false,
  capture_response_body: false,
  ...userConfig,
}

/**
 * Retrieves the global settings
 *
 * TODO: use a better storage method than global object
 */
export const globals = () => global.timber_config

/**
 * Appends the provided settings object to the end of the global
 * settings object. It will override any existing settings using
 * the same key name.
 *
 * @param {Object} settings - appends settings object to globals
 */
export const setGlobals = settings => {
  global.timber_config = { ...globals(), ...settings }
}

export default config
