/**
 * Transforms a log message or object into a format
 * that timber expects, ex 'log message' @timber.io {"dt": "…", "level": "info", "context": {…}}
 * see https://github.com/timberio/log-event-json-schema for specs
 * "$schema": "https://raw.githubusercontent.com/timberio/log-event-json-schema/master/schema.json"
 * look into https://github.com/jquense/yup for schema normalization
 */


function transform(message) {
  if (typeof message === "string") {
    return { dt: new Date(), message }
  }

  return {
    dt: new Date(),
    message: JSON.stringify(message)
  }
}
 
export default transform;