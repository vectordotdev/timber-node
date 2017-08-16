import Event from '../event'

/**
 * The HTTP request event tracks incoming and outgoing
 * HTTP requests to your server.
 */
class HTTPRequest extends Event {
  /**
   * @param {String} [body] - the body of the request
   * @param {String} [direction] - incoming or outgoing
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
      direction,
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
    this.direction = direction
    this.headers = headers
    this.host = host
    this.method = method
    this.path = path
    this.port = port
    this.query_string = query_string
    this.request_id = request_id
    this.scheme = scheme
  }

  message() {
    return `Started ${this.method} "${this.path}"`
  }
}

export default HTTPRequest
