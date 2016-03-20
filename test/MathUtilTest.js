var expect = require('expect');
var MathUtil = require('../shared/MathUtil');

describe('MathUtil', function () {

  describe('mod', function () {

    it('should work', function () {
      expect(MathUtil.mod(10, 12)).toEqual(10);
      expect(MathUtil.mod(4, 2)).toEqual(0);
      expect(MathUtil.mod(10, 3)).toEqual(1);
      expect(MathUtil.mod(-1, 3)).toEqual(2);
      expect(MathUtil.mod(-4, 3)).toEqual(2);
      expect(MathUtil.mod(-4, 3)).toEqual(2);
    });

  });

});