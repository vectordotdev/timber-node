// import transform from '../transform'
import compose from 'composable-middleware'
import addRequestId from 'express-request-id'
import formatter from '../utils/formatter'
// import console from 'console';

const TimberExpress = (req, res, next) => {
  // save a reference of the start time so that we can determine
  // the amount of time each http request takes
  req.start_time = (new Date()).getTime()

  // add the context object to the request object so that
  // it gets passed down through the middleware chain
  req.context = {
    context: {
      http: {
        method: req.method,
        request_id: req.id,
        remote_addr: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        path: req.path
      }
    }
  }

  // add an event to get  triggered when the request finishes
  // this event will send the http_client_response event to timber
  req.on('end', () => {
    const time_ms = ((new Date()).getTime() - req.start_time)
    req.context.event = {
      server_side_app: {
        http_client_response: {
          request_id: req.id,
          time_ms,
          status: res.statusCode,
          service_name: 'flybot_api',
          body: res.body
        }
      }
    }
    console.info(formatter(`Outgoing HTTP response ${res.statusCode} in ${time_ms}ms ${req.path}`, req.context))
  })
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
