import Event from '../event'

/**
 * The HTTP server request event tracks incoming HTTP requests to your HTTP server.
 */
class HTTPServerRequest extends Event {
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
   * @param {String} [request_id] - the uuid attached to the request
   * @param {String} scheme - `HTTP` or `HTTPS`
   */
  constructor(
    {
      body,
      headers,
      host,
      method,
      path,
      port,
      query_string,
      request_id,
      scheme,
    } = {}
  ) {
    super()

    // check for required attributes
    this.required({ host, method, scheme })

    // bind context attributes to the class
    this.body = body
    this.headers = headers
    this.host = host
    this.method = method
    this.path = path
    this.port = port
    this.query_string = query_string
    this.request_id = request_id
    this.scheme = scheme
  }

  message = () => `Started ${this.method} "${this.path}"`
}

export default HTTPServerRequest
