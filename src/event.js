/**
 * This is the base class for all event types
 */
class Event {

  /**
   * required checks for the existence of the given attributes.
   * If any of the values provided are undefined, an error will be thrown
   *
   * @private
   * @param {object} attributes - key/value pair of required attributes
   */
  required(attributes) {
    for (const attribute in attributes) {
      if (!attributes[attribute] && attributes[attribute] !== 0) {
        throw new Error(`${attribute} is required`)
      }
    }
  }
}

export default Event
