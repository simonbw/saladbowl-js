'use strict';

/**
 * Creates the database connection.
 */

module.exports = require('promised-mongo')('localhost:27017/saladbowl');