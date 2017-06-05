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
   * @param {String} host - the server's hostname
   * @param {String} method - `CONNECT` `DELETE` `GET` `HEAD` `OPTIONS` `PATCH` `POST` `PUT` `TRACE`
   * @param {String} [path] - the path of the request
   * @param {Number} [port] - the port of the request
   * @param {String} [query_string] - the query parameters present on the url
   * @param {String} [request_id] - the uuid attached to the rest
   * @param {String} scheme - `HTTP` or `HTTPS`
   */
  constructor({
    body,
    headers,
    request_id,
    service_name,
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
    this.service_name = service_name
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
