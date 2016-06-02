'use strict';
// @flow


/**
 *
 */
module.exports = (store:Object) => (next:Function) => (action:Object) => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result
};