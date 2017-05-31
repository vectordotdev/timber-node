// import transform from '../transform'
import compose from 'composable-middleware'
import addRequestId from 'express-request-id'
import formatter from '../utils/formatter'
// import console from 'console';

/*
 * The TimberExpress middleware takes care of automatically logging
 * each http event with the appropriate context events attached.
 * Currently what's logged is:
 * - http request event
 * - http response event
 *
 * TODO: allow additional context items (i.e. user) to be attached
*/
const TimberExpress = (req, res, next) => {
  // save a reference of the start time so that we can determine
  // the amount of time each http request takes
  req.start_time = (new Date()).getTime()

  // destructure the request object for ease of use
  const { headers, method, id: request_id, path } = req

  // determine the ip address of the client
  // https://stackoverflow.com/a/10849772
  const remote_addr = headers['x-forwarded-for'] || req.connection.remoteAddress

  // add the context object to the request object so that
  // it gets passed down through the middleware chain
  req.context = {
    context: {
      http: {
        method,
        request_id,
        remote_addr,
        path
      }
    }
  }

  // add an event to get  triggered when the request finishes
  // this event will send the http_client_response event to timber
  req.on('end', () => {
    // calculate the duration of the http request
    const time_ms = ((new Date()).getTime() - req.start_time)
    req.context.event = {
      server_side_app: {
        http_client_response: {
          request_id,
          time_ms,
          status: res.statusCode,
          service_name: 'flybot_api',
          body: res.body
        }
      }
    }

    // log the http response with context
    console.info(formatter(`Outgoing HTTP response ${res.statusCode} in ${time_ms}ms ${req.path}`, req.context))
  })

  // log the http request with context
  console.info(formatter(`Outgoing HTTP request [${req.method}] ${req.path}`, req.context))
  next()
}

// compose multiple middlewares as a single express middleware
// - addRequestId takes care of appending a unique uuid to each request
// - TimberExpress is the official timber middleware for express
const middleware = compose(
  addRequestId(),
  TimberExpress
)

export default middleware
