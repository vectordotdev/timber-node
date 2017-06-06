import path from 'path'
import finder from 'find-package-json'

const filename = (require.main && require.main.filename) || __dirname
const projectPath = path.dirname(filename)
const userConfig = finder(projectPath).next().value.timber

const config = {
  capture_request_body: false,
  capture_response_body: false,
  ...userConfig,
}

export default config
