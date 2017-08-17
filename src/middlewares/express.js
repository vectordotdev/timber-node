// import transform from '../transform'
import compose from 'composable-middleware'
import addRequestId from 'express-request-id'
import bodyParser from 'body-parser'
import config from '../config'
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
 * @param {object} req - the request object
 * @param {object} res - the response object
 * @param {function} next - the next middleware to run
*/
const expressMiddleware = compose(
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
    let body = config.capture_request_body && Object.keys(reqBody).length > 0
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

    // add an event to get  triggered when the request finishes
    // this event will send the http_client_response event to timber
    req.on('end', () => {
      // destructure the response object for ease of use
      const { body: resBody, statusCode: status } = res

      // calculate the duration of the http request
      const time_ms = new Date().getTime() - req.start_time

      // send the response body if the capture_response_body flag is true (off by default)
      body = config.capture_response_body ? JSON.stringify(resBody) : undefined

      const http_response = new HTTPResponse({
        direction: 'outgoing',
        request_id,
        time_ms,
        status,
        body,
      })

      // add the http_response event to the metadata object
      metadata.event = { http_response }

      // log the http response with metadata
      log(http_response.message(), metadata)
    })

    // log the http request with metadata
    log(http_request.message(), metadata)
    next()
  }
)

export default expressMiddleware
