'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;
const expect = require('expect');
const MathUtil = require('../js/shared/MathUtil');

describe('MathUtil', () => {
  it('mod should work', () => {
    expect(MathUtil.mod(10, 12)).toEqual(10);
    expect(MathUtil.mod(4, 2)).toEqual(0);
    expect(MathUtil.mod(10, 3)).toEqual(1);
    expect(MathUtil.mod(-1, 3)).toEqual(2);
    expect(MathUtil.mod(-4, 3)).toEqual(2);
    expect(MathUtil.mod(-4, 3)).toEqual(2);
  });

  it('sum should work', () => {
    expect(MathUtil.sum([])).toEqual(0);
    expect(MathUtil.sum([1, 2, 3])).toEqual(6);
    expect(MathUtil.sum([5, 5, -10])).toEqual(0);
  });

  it('clamp should work', () => {
    expect(MathUtil.clamp(5, 0, 10)).toEqual(5);
    expect(MathUtil.clamp(5, 0, 3)).toEqual(3);
    expect(MathUtil.clamp(4, -10, 4)).toEqual(4);
    expect(MathUtil.clamp(-10, -5, 10)).toEqual(-5);
    expect(MathUtil.clamp(3, 2, 2)).toEqual(2);
  });

  it('mean should work', () => {
    expect(MathUtil.mean([])).toEqual(NaN);
    expect(MathUtil.mean([4, 4])).toEqual(4);
    expect(MathUtil.mean([3, 3, 3])).toEqual(3);
    expect(MathUtil.mean([2, 4, 6])).toEqual(4);
    expect(MathUtil.mean([1, 1, 4])).toEqual(2); // TODO: Account for some floating point error
  });

  it('median should work', () => {
    expect(MathUtil.median([])).toEqual(NaN);
    expect(MathUtil.median([1])).toEqual(1);
    expect(MathUtil.median([1, 1])).toEqual(1);
    expect(MathUtil.median([3, 1])).toEqual(2);
    expect(MathUtil.median([2, 3, 1])).toEqual(2);
    expect(MathUtil.median([5, 5, 5, 5, 3, 9, 5, 5, 5, 5, 5])).toEqual(5);
  });
});