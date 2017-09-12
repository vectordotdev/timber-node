// import transform from '../transform'
import compose from 'composable-middleware'
import addRequestId from 'express-request-id'
import bodyParser from 'body-parser'
import HTTP from '../contexts/http'
import { HTTPRequest, HTTPResponse } from '../events'
import log from '../log'

/**
 * The express middleware takes care of automatically logging
 * each http event with the appropriate context events attached.
 *
 * This middleware is composed of three separate middlewares:
 * - `addRequestId` automatically attaches a unique uuid to every request
 * - `bodyParser` allows parsing of JSON encoded request bodies
 * - `expressMiddleware` automatically logs http events to timber
 *
 * @param {object} [options] - configuration options
 * @param {boolean} [options.capture_request_body] - whether the http request body data will be captured (off by default)
 * @param {boolean} [options.combine_http_events] - If true, HTTPRequest and HTTPResponse events will be combined in a single log message (off by defaut)
*/
const expressMiddleware = ({ ...options }) => compose(
  addRequestId(),
  bodyParser.json(),
  (req, res, next) => {
    // save a reference of the start time so that we can determine
    // the amount of time each http request takes
    req.start_time = new Date().getTime()

    // destructure the request object for ease of use
    const {
      headers: { host, ...headers },
      method,
      id: request_id,
      path,
      protocol: scheme,
      body: reqBody,
      connection,
    } = req

    // determine the ip address of the client
    // https://stackoverflow.com/a/10849772
    const remote_addr = headers['x-forwarded-for'] || connection.remoteAddress

    // send the request body if the capture_request_body flag is true (off by default)
    // and the request body is not empty
    let body = options.capture_request_body && Object.keys(reqBody).length > 0
      ? JSON.stringify(reqBody)
      : undefined

    // create the HTTP context item
    const http = new HTTP({
      method,
      path,
      request_id,
      remote_addr,
    })

    // add the http context information to the metadata object
    const metadata = {
      context: {
        http,
      },
    }

    const http_request = new HTTPRequest({
      direction: 'incoming',
      body,
      host,
      path,
      request_id,
      scheme,
      method,
    })

    // add the http_request event to the metadata object
    metadata.event = { http_request }


    // Override the response end event
    // This event will send the http_client_response event to timber
    // If combine_http_events is true, this will be the only log generated
    const end = res.end
    res.end = (chunk, encoding) => {
      // Emit the original res.end event
      res.end = end
      res.end(chunk, encoding)

      // destructure the response object for ease of use
      const { body: resBody, statusCode: status } = res

      // calculate the duration of the http request
      const time_ms = new Date().getTime() - req.start_time

      // send the response body if the capture_response_body flag is true (off by default)
      body = options.capture_response_body ? JSON.stringify(resBody) : undefined

      const http_response = new HTTPResponse({
        direction: 'outgoing',
        request_id,
        time_ms,
        status,
        body,
      })

      // If we're combining http events, append the request event
      if (options.combine_http_events) {
        http_response.request = http_request
      }

      // add the http_response event to the metadata object
      metadata.event = { http_response }

      const message = options.combine_http_events
        ? `${method} ${host}${path} - ${status} in ${time_ms}ms`
        : http_response.message()

      // log the http response with metadata
      log('info', message, metadata)
    }

    // If we're not combining http events, log the http request
    if (!options.combine_http_events) {
      log('info', http_request.message(), metadata)
    }
    next()
  }
)

export default expressMiddleware
