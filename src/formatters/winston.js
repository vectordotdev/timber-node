import Augment from '../utils/augment'
import { Custom } from '../events'

const WinstonFormatter = ({
  message: raw,
  level,
  meta: metadata,
  timestamp,
}) => {
  const message = timestamp ? `${timestamp()} - ${raw}` : raw
  const structuredLog = new Augment(message, { level })
  const { event, context, ...meta } = metadata

  // If custom metadata was provided with the log, append it
  if (Object.keys(meta).length) {
    structuredLog.append({ meta })
  }

  // If the event key exists, append a custom event
  if (event) {
    for (const eventName in event) {
      if (!event[eventName]) continue
      structuredLog.append({
        event: new Custom({ type: eventName, data: event[eventName] }),
      })
    }
  }

  // If a context object was provided with the log, append it
  if (context) {
    structuredLog.append({
      context,
    })
  }

  return structuredLog.format()
}

export default WinstonFormatter
