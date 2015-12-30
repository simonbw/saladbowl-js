var ID_COUNT = 0;

/**
 * Provides a variety of utility functions.
 */
module.exports = {

  /**
   * Generate a new unique integer
   * @returns {number} - A unique id
   */
  uniqueId: function() {
    ID_COUNT += 1;
    return ID_COUNT;
  }
};