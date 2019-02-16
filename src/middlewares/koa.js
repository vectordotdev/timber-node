// import transform from '../transform'
import compose from 'koa-compose'
import addRequestId from 'koa-requestid'
import bodyParser from 'koa-bodyparser'
import HTTPContext from '../contexts/http'
import { HTTPRequest, HTTPResponse } from '../events'
import log from '../utils/log'
import config from '../config'

/**
 * The koa middleware takes care of automatically logging
 * each http event with the appropriate context events attached.
 *
 * This middleware is composed of three separate middlewares:
 * - `addRequestId` automatically attaches a unique uuid to every request
 * - `bodyParser` allows parsing of JSON encoded request bodies
 * - `koaMiddleware` automatically logs http events to timber
 *
 * @param {object} [options] - An object with configuration options
 * @param {object} [options.logger] - A custom logger to log http events to (usually either: console, winston, or bunyan)
 * @param {boolean} [options.capture_request_body] - Whether the http request body data will be captured (off by default)
 * @param {boolean} [options.combine_http_events] - If true, HTTPRequest and HTTPResponse events will be combined in a single log message (off by defaut)
 */
const koaMiddleware = ({ ...options }) => {
  // If a custom logger was provided, use it to log http events
  if (options.logger) {
    config.logger = options.logger
  }
  return compose([
    addRequestId({ header: 'X-Request-Id', expose: 'X-Request-Id' }),
    bodyParser(),
    (ctx, next) => {
      // save a reference of the start time so that we can determine
      // the amount of time each http request takes
      ctx.state.request_start = new Date().getTime()

      // destructure the request object for ease of use
      const {
        headers: { host },
        method,
        path,
        protocol: scheme,
        body: reqBody,
        ip: remote_addr
      } = ctx.request

      const { id: request_id } = ctx.state

      // send the request body if the capture_request_body flag is true (off by default)
      // and the request body is not empty
      let body = options.capture_request_body && Object.keys(reqBody).length > 0
        ? JSON.stringify(reqBody)
        : undefined

      // create the HTTP context item
      const http_context = new HTTPContext({
        method,
        path,
        request_id,
        remote_addr,
      })

      // add the http context information to the metadata object
      const metadata = {
        context: {
          http: http_context,
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

      // If we're not combining http events, log the http request
      if (!options.combine_http_events) {
        log('info', http_request.message(), metadata)
      }

      return next().then(() => {
        // destructure the response object for ease of use
        const { body: resBody, status } = ctx.response

        // calculate the duration of the http request
        const time_ms = new Date().getTime() - ctx.state.request_start

        // send the response body if the capture_response_body flag is true (off by default)
        body = JSON.stringify(resBody)

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
      })
    }]
  )
}

export default koaMiddleware

module.exports = koaMiddleware
