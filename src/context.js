/**
 * This is the base class for all context types
 */
class Context {
  /**
   * required checks for the existence of the given attributes.
   * If any of the values provided are undefined, an error will be thrown
   *
   * @private
   * @param {object} attributes - key/value pair of required attributes
   */
  required(attributes) {
    for (const attribute in attributes) {
      if (!attributes[attribute]) {
        throw new Error(`${attribute} is required`)
      }
    }
  }
}

export default Context
