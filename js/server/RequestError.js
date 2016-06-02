'use strict';
// @flow


/**
 * Request error.
 * @constructor
 */
function RequestError(message:string, status:number) {
  this.name = 'RequestError';
  this.message = message || 'Something went wrong';
  this.status = status || 400;
  if (status >= 500 || status < 400) {
    console.warn('Assigning status of ' + status + ' to RequestError');
  }
}

RequestError.prototype = Error.prototype;

module.exports = RequestError;