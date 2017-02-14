import schema from './schema';

/**
 * Transforms a log message or object into a format
 * that timber expects, ex 'log message' @timber.io {"dt": "…", "level": "info", "context": {…}}
 * see https://github.com/timberio/log-event-json-schema for specs
 */

export default function transform(message) {
  let log = {
    ...schema,
    message: typeof message === 'string' ? message : JSON.stringify(message),
    dt: new Date()
  }

  function setLevel(level) {
    return {...log, level }
  }

  log.setLevel = setLevel;
  return log;
}