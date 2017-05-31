import schema from '../schema'
import { metadata_delimiter } from './formatter'
/**
 * Transforms a log message or object into a format
 * that timber expects, ex 'log message' @timber.io {"dt": "…", "level": "info", "context": {…}}
 * see https://github.com/timberio/log-event-json-schema for specs
 */
export default function transform(raw) {
  const [message, rawContext] = raw.split(metadata_delimiter)

  const context = rawContext ? JSON.parse(rawContext) : {}

  // append a newline to the end of a log if it doesn't already end with one
  const format = str => str.endsWith('\n') ? str : `${str}\n`

  const log = {
    ...schema,
    message: typeof message === 'string' ? format(message) : JSON.stringify(message),
    dt: new Date(),
    ...context
  }

  // append data to the end of the log object
  log.append = data => ({ ...log, ...data })

  // convenience function for setting the log's level
  log.setLevel = level => log.append({ level })

  return log
}

