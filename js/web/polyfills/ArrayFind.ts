'use strict';

/* eslint-disable no-extend-native */

(Array.prototype as any).find = function (test: Function, self?: any) {
  if (typeof test !== 'function') {
    throw new Error('find must be called with a function');
  }
  if (self == null) {
    self = this;
  }
  return self[(this as any).findIndex(test, self)];
};

(Array.prototype as any).findIndex = function (test: Function, self?: any) {
  if (typeof test !== 'function') {
    throw new Error('findIndex must be called with a function');
  }
  if (self == null) {
    self = this;
  }
  for (let i = 0; i < self.length; i++) {
    if (test(self[i], i, self)) {
      return i;
    }
  }
  return -1;
};
