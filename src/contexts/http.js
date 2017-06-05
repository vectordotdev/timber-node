import Context from '../context'

/**
 * The HTTP context adds data about the current HTTP request being processed
 * to your logs.This allows you to tail and filter by this data.
 */
class HTTP extends Context {

  static keyspace = 'http'

  constructor({ method, path, remote_addr, request_id } = {}) {
    super()

    // check for required attributes
    this.required({ method, path })

    // bind context attributes to the class
    this.method = method
    this.path = path
    this.remote_addr = remote_addr
    this.request_id = request_id
  }
}

export default HTTP
