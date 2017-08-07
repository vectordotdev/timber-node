import Event from '../event'

/**
 * The Custom event allows you to past arbitrary events to timber.
 */
class Custom extends Event {
  /**
   * @param {String} [type] - This is the type of your event. It should be something unique       and unchanging. It will be used to identify this event.
   * @param {Array} [data] - An object containing the event data
   */
  constructor({ type, data } = {}) {
    super()

    // check for required attributes
    this.required({ type })

    // bind context attributes to the class
    this.custom = { [type]: data }
  }
}

export default Custom
