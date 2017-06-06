import Event from '../event'

/**
 * The HTTP server request event tracks incoming HTTP requests to your HTTP server.
 */
class HTTPServerResponse extends Event {

  /**
   * The HTTP server request event tracks incoming HTTP requests to your HTTP server.
   *
   * @param {String} [body] - the body of the request
   * @param {Array} [headers] - the headers of the request
   * @param {String} [request_id] - the uuid of the request
   * @param {String} status - the HTTP status code
   * @param {String} time_ms - the total duration of the request in milliseconds
   */
  constructor({
    body,
    headers,
    request_id,
    status,
    time_ms
   } = {}) {
    super()

    // check for required attributes
    this.required({ status, time_ms })

    // bind context attributes to the class
    this.body = body
    this.headers = headers
    this.request_id = request_id
    this.status = status
    this.time_ms = time_ms
  }

  message() {
    const parts = ['Outgoing HTTP response']

    if (this.service_name) {
      parts.push(`from ${this.service_name}`)
    }

    parts.push(`${this.status} in ${this.time_ms}ms`)

    return parts.join(' ')
  }


}

export default HTTPServerResponse
