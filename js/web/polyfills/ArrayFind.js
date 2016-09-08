'use strict';

Array.prototype.find = function (test, self) {
  if (typeof test !== 'function') {
    throw new Error('find must be called with a function');
  }
  if (self == null) {
    self = this;
  }
  return self[this.findIndex(test, self)];
};

Array.prototype.findIndex = function (test, self) {
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