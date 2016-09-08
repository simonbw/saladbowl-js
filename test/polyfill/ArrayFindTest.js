'use strict';


require('../../js/web/polyfills/ArrayFind');
const expect = require('expect');

describe('ArrayFind', () => {
  describe('find', () => {
    it('should find things', () => {
      expect([10, 20, 30].find((x) => x > 10)).toEqual(20);
    });

    it('should return undefined for things not found', () => {
      expect([1, 2, 3].find((x) => x > 100)).toEqual(undefined);
    })
  });

  describe('findIndex', () => {
    it('should find things', () => {
      expect([10, 20, 30].findIndex((x) => x > 10)).toEqual(1);
    });

    it('should return -1 for things not found', () => {
      expect([1, 2, 3].findIndex((x) => x > 100)).toEqual(-1);
    })
  });
});