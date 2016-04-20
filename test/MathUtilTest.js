'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;
const expect = require('expect');
const MathUtil = require('../js/shared/MathUtil');

describe('MathUtil', () => {

  describe('mod', () => {

    it('should work', () => {
      expect(MathUtil.mod(10, 12)).toEqual(10);
      expect(MathUtil.mod(4, 2)).toEqual(0);
      expect(MathUtil.mod(10, 3)).toEqual(1);
      expect(MathUtil.mod(-1, 3)).toEqual(2);
      expect(MathUtil.mod(-4, 3)).toEqual(2);
      expect(MathUtil.mod(-4, 3)).toEqual(2);
    });

  });

});