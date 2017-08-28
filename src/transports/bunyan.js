import bunyan from 'bunyan'
import { Writable } from 'stream'
import { Custom } from '../events'
import Augment from '../utils/augment'
import errors from '../data/errors'

/**
 * The Timber Bunyan transport allows you to seamlessly install
 * Timber in your apps that use bunyan as the logger.
 */
class BunyanTransport extends Writable {
  /**
   * @param {Object} [options] - Configuration options for the transport
   * @param {string} [options.stream] - Stream to write to
   */
  constructor({ stream, ...options } = {}) {
    if (!stream) {
      throw new Error(errors.transports.bunyan.stream)
    }

    super(options)

    this.name = 'timberBunyan'
    this.level = options.level || 'info'

    // Attach the provided stream
    this.stream = stream
  }

  /**
   * @param {buffer|string} [chunk] - The chunk to be written. Will always be a buffer unless the decodeStrings option was set to false or the stream is operating in object mode.
   * @param {string} [encoding] - If the chunk is a string, then encoding is the character encoding of that string. If chunk is a Buffer, or if the stream is operating in object mode, encoding may be ignored.
   * @param {function} [next] - Call this function (optionally with an error argument) when processing is complete for the supplied chunk.
   */
  _write(chunk, encoding, next) {
    // Parse the JSON object
    const data = JSON.parse(chunk.toString())
    const { msg, event, meta } = data
    // Convert the level integer into a string representation
    const level = bunyan.nameFromLevel[data.level]

    // Create a structured log object out of the log message
    const structuredLog = new Augment(msg, { level })

    // If custom metadata was provided with the log, append it
    if (meta && Object.keys(meta).length) {
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

    // Write our structured log to the timber https stream
    this.stream.write(structuredLog.data)
    next()
  }
}

export default BunyanTransport
