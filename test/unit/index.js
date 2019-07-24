'use strict';
const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const Conditional = require('../../index').Conditional;

chai.use(require('chai-spies'));

describe('Comparison Class', function () {
  let conditional = new Conditional()
  let compare = conditional.compare.bind(conditional);
  describe('gt evaluations', function () {
    it('should return true if the comparison value is greater than the argument', () => {
      expect(compare(10).gt(5)).to.be.true;
    });
    it('should return false if the comparison value is smaller than the argument', () => {
      expect(compare(10).gt(20)).to.be.false;
    });
    it('should return false if the values are equal', () => {
      expect(compare(10).gt(10)).to.be.false;
    });
    it('should handle date comparisons', () => {
      expect(compare(new Date('2018-06-11')).gt('2000-06-11')).to.be.true;
      expect(compare(new Date('2000-06-11')).gt('2018-06-11')).to.be.false;
    });
    it('should return false if any of the values are null', () => {
      expect(compare(null).gt(5)).to.be.false;
      expect(compare(5).gt(null)).to.be.false;
      expect(compare(null).gt(null)).to.be.false;
    });
    it('should return false for values that are undefined', () => {
      expect(compare(undefined).gt(10)).to.be.false;
      expect(compare(5).gt(undefined)).to.be.false;
      expect(compare(undefined).gt(undefined)).to.be.false;
    });
    it('should return true for values that are comparing against positive infinity', () => {
      expect(compare(Infinity).gt(10)).to.be.true;
      expect(compare(Infinity).gt(Infinity)).to.be.false;
    });
    it('should return false for values that are comparing against negative infinity', () => {
      expect(compare(-Infinity).gt(-5)).to.be.false;
      expect(compare(-Infinity).gt(-Infinity)).to.be.false;
    });
  });

  describe('lt evaluations', function () {
    it('should return true if the comparison value is less than the argument', () => {
      expect(compare(5).lt(10)).to.be.true;
    });
    it('should return false if the comparison value is greater than the argument', () => {
      expect(compare(20).lt(10)).to.be.false;
    });
    it('should return false if the values are equal', () => {
      expect(compare(10).lt(10)).to.be.false;
    });
    it('should handle date comparisons', () => {
      expect(compare(new Date('2000-06-11')).lt('2018-06-11')).to.be.true;
      expect(compare(new Date('2018-06-11')).lt('2000-06-11')).to.be.false;
    });
    it('should return false if any of the values are null', () => {
      expect(compare(null).lt(5)).to.be.false;
      expect(compare(5).lt(null)).to.be.false;
      expect(compare(null).lt(null)).to.be.false;
    });
    it('should return false for values that are undefined', () => {
      expect(compare(undefined).lt(10)).to.be.false;
      expect(compare(5).lt(undefined)).to.be.false;
      expect(compare(undefined).lt(undefined)).to.be.false;
    });
    it('should return true for values that are comparing against positive infinity', () => {
      expect(compare(Infinity).lt(10)).to.be.false;
      expect(compare(Infinity).lt(Infinity)).to.be.false;
    });
    it('should return false for values that are comparing against negative infinity', () => {
      expect(compare(-Infinity).lt(-5)).to.be.true;
      expect(compare(-Infinity).lt(-Infinity)).to.be.false;
    });
  });

  describe('cap evaluations', function () {
    it('should return true if the comparison value is less than the argument', () => {
      expect(compare(5).cap(10)).to.be.true;
    });
    it('should return false if the comparison value is greater than the argument', () => {
      expect(compare(20).cap(10)).to.be.false;
    });
    it('should return true if the values are equal', () => {
      expect(compare(10).cap(10)).to.be.true;
    });
    it('should handle date comparisons', () => {
      expect(compare(new Date('2000-06-11')).cap('2018-06-11')).to.be.true;
      expect(compare(new Date('2018-06-11')).cap('2000-06-11')).to.be.false;
    });
    it('should return false if any of the values are null', () => {
      expect(compare(null).cap(5)).to.be.false;
      expect(compare(5).cap(null)).to.be.false;
      expect(compare(null).cap(null)).to.be.false;
    });
    it('should return false for values that are undefined', () => {
      expect(compare(undefined).cap(10)).to.be.true;
      expect(compare(5).cap(undefined)).to.be.false;
      expect(compare(undefined).cap(undefined)).to.be.true;
    });
    it('should return true for values that are comparing against positive infinity', () => {
      expect(compare(Infinity).cap(10)).to.be.false;
      expect(compare(Infinity).cap(Infinity)).to.be.true;
    });
    it('should return false for values that are comparing against negative infinity', () => {
      expect(compare(-Infinity).cap(-5)).to.be.true;
      expect(compare(-Infinity).cap(-Infinity)).to.be.true;
    });
  });

  describe('floor evaluations', function () {
    it('should return true if the comparison value is greater than the argument', () => {
      expect(compare(10).floor(5)).to.be.true;
    });
    it('should return false if the comparison value is smaller than the argument', () => {
      expect(compare(10).floor(20)).to.be.false;
    });
    it('should return true if the values are equal', () => {
      expect(compare(10).floor(10)).to.be.true;
    });
    it('should handle date comparisons', () => {
      expect(compare(new Date('2018-06-11')).floor('2000-06-11')).to.be.true;
      expect(compare(new Date('2000-06-11')).floor('2018-06-11')).to.be.false;
    });
    it('should return false if any of the values are null', () => {
      expect(compare(null).floor(5)).to.be.false;
      expect(compare(5).floor(null)).to.be.false;
      expect(compare(null).floor(null)).to.be.false;
    });
    it('should return false for values that are undefined', () => {
      expect(compare(undefined).floor(10)).to.be.false;
      expect(compare(5).floor(undefined)).to.be.false;
      expect(compare(undefined).floor(undefined)).to.be.false;
    });
    it('should return true for values that are comparing against positive infinity', () => {
      expect(compare(Infinity).floor(10)).to.be.true;
      expect(compare(Infinity).floor(Infinity)).to.be.true;
    });
    it('should return false for values that are comparing against negative infinity', () => {
      expect(compare(-Infinity).floor(-5)).to.be.false;
      expect(compare(-Infinity).floor(-Infinity)).to.be.true;
    });
  });

  describe('range evaluations', function () {
    it('should return true if the argument is within the range', () => {
      expect(compare(10).range(5, 15)).to.be.true;
    });
    it('should return false if argument does not fall in range', () => {
      expect(compare(20).range(5, 15)).to.be.false;
    });
    it('should return false if argument is not provided', () => {
      expect(compare(-2).range(-5)).to.be.false;
    });
    it('should return true if the value is equal to any of the bounds', () => {
      expect(compare(5).range(5, 10)).to.be.true;
      expect(compare(10).range(5, 10)).to.be.true;
    });
    it('should handle date comparisons', () => {
      expect(compare(new Date('2018-06-11')).range('2016-06-11', '2020-06-11')).to.be.true;
      expect(compare(new Date('2000-06-11')).range('2016-06-11', '2020-06-11')).to.be.false;
    });
    it('should return false if any of the values are null', () => {
      expect(compare(null).range(5, 10)).to.be.false;
      expect(compare(5).range(null, 10)).to.be.false;
      expect(compare(null).range(null, null)).to.be.false;
    });
    it('should return false for values that are undefined', () => {
      expect(compare(undefined).range(5, 10)).to.be.false;
      expect(compare(5).range(undefined, 10)).to.be.false;
      expect(compare(undefined).range(undefined, undefined)).to.be.false;
    });
    it('should return true for values that are comparing against upper limit of positive infinity', () => {
      expect(compare(Infinity).range(5, 10)).to.be.false;
      expect(compare(Infinity).range(Infinity, Infinity)).to.be.true;
      expect(compare(Infinity).range(0, Infinity)).to.be.true;
    });
    it('should return false for values that are comparing against lower limit of negative infinity', () => {
      expect(compare(-Infinity).range(-5, -10)).to.be.false;
      expect(compare(-Infinity).range(-Infinity, -Infinity)).to.be.true;
      expect(compare(-Infinity).range(-Infinity, 0)).to.be.true;
    });
  });
  
  describe('equal evaluations', function () {
    it('should handle numeric values', () => {
      expect(compare(10).equal(10)).to.be.true;
      expect(compare(10).equal(9.99)).to.be.false;
      expect(compare(10).equal(11)).to.be.false;
    });
    it('should handle string values', () => {
      expect(compare('john').equal('john')).to.be.true;
      expect(compare('john').equal('johnny')).to.be.false;
    });
    it('should handle boolean values', () => {
      expect(compare(true).equal(true)).to.be.true;
      expect(compare(true).equal(false)).to.be.false;
      expect(compare(false).equal(false)).to.be.true;
      expect(compare(true).equal(1)).to.be.false;
    });
    it('should handle date values', () => {
      expect(compare('2018-06-11').equal('2018-06-11')).to.be.true;
      expect(compare('2018-06-11').equal('2018-06-12')).to.be.false;
    });
    it('should return false for values that are undefined', () => {
      expect(compare(undefined).equal(10)).to.be.false;
      expect(compare(5).equal(undefined)).to.be.false;
      expect(compare(undefined).equal(undefined)).to.be.true;
    });
    it('should return true for values that are comparing against positive infinity', () => {
      expect(compare(Infinity).equal(10)).to.be.false;
      expect(compare(Infinity).equal(Infinity)).to.be.true;
    });
    it('should return false for values that are comparing against negative infinity', () => {
      expect(compare(-Infinity).equal(-5)).to.be.false;
      expect(compare(-Infinity).equal(-Infinity)).to.be.true;
    });
  });

  describe('notequal evaluations', function () {
    it('should handle numeric values', () => {
      expect(compare(10).notequal(10)).to.be.false;
      expect(compare(10).notequal(9.99)).to.be.true;
      expect(compare(10).notequal(11)).to.be.true;
    });
    it('should handle string values', () => {
      expect(compare('john').notequal('john')).to.be.false;
      expect(compare('john').notequal('johnny')).to.be.true;
    });
    it('should handle boolean values', () => {
      expect(compare(true).notequal(true)).to.be.false;
      expect(compare(true).notequal(false)).to.be.true;
      expect(compare(false).notequal(false)).to.be.false;
      expect(compare(true).notequal(1)).to.be.true;
    });
    it('should handle date values', () => {
      expect(compare('2018-06-11').notequal('2018-06-11')).to.be.false;
      expect(compare('2018-06-11').notequal('2018-06-12')).to.be.true;
    });
    it('should return false for values that are undefined', () => {
      expect(compare(undefined).notequal(10)).to.be.true;
      expect(compare(5).notequal(undefined)).to.be.true;
      expect(compare(undefined).notequal(undefined)).to.be.false;
    });
    it('should return true for values that are comparing against positive infinity', () => {
      expect(compare(Infinity).notequal(10)).to.be.true;
      expect(compare(Infinity).notequal(Infinity)).to.be.false;
    });
    it('should return false for values that are comparing against negative infinity', () => {
      expect(compare(-Infinity).notequal(-5)).to.be.true;
      expect(compare(-Infinity).notequal(-Infinity)).to.be.false;
    });
  });

  describe('in evaluations', function () {
    it('should handle numeric values', () => {
      expect(compare(10).in([ 0, 10, 20, 30, 40, 50 ])).to.be.true;
      expect(compare(10).in([ 0, 20, 30, 40, 50 ])).to.be.false;
    });
    it('should handle string values', () => {
      expect(compare('john').in([ 'joe', 'john', 'johnathan', 'jacob' ])).to.be.true;
      expect(compare('john').in([ 'emily', 'churchill', 'bobbi' ])).to.be.false;
    });
  });

  describe('notin evaluations', function () {
    it('should handle numeric values', () => {
      expect(compare(10).notin([ 0, 10, 20, 30, 40, 50 ])).to.be.false;
      expect(compare(10).notin([ 0, 20, 30, 40, 50 ])).to.be.true;
    });
    it('should handle string values', () => {
      expect(compare('john').notin([ 'joe', 'john', 'johnathan', 'jacob' ])).to.be.false;
      expect(compare('john').notin([ 'emily', 'churchill', 'bobbi' ])).to.be.true;
    });
  });

  describe('exists evaluations', function () {
    it('should return true if value is a truthy value or 0', () => {
      expect(compare(10).exists()).to.be.true;
      expect(compare(0).exists()).to.be.true;
      expect(compare(new Date()).exists()).to.be.true;
      expect(compare('test').exists()).to.be.true;
      expect(compare(true).exists()).to.be.true;
      expect(compare('false').exists()).to.be.true;
      expect(compare(false).exists()).to.be.false;
      expect(compare(null).exists()).to.be.false;
      expect(compare('').exists()).to.be.false;
      expect(compare(undefined).exists()).to.be.false;
      expect(compare().exists()).to.be.false;
    });
  });

  describe('isnull evaluations', function () {
    it('should return true if value is a truthy value or 0', () => {
      expect(compare(null).isnull()).to.be.true;
      expect(compare(0).isnull()).to.be.false;
      expect(compare(undefined).isnull()).to.be.false;
      expect(compare(Infinity).isnull()).to.be.false;
      expect(compare('').isnull()).to.be.false;
    });
  });

  describe('isnotnull evaluations', function () {
    it('should return true if value is a truthy value or 0', () => {
      expect(compare(null).isnotnull()).to.be.false;
      expect(compare(0).isnotnull()).to.be.true;
      expect(compare(Infinity).isnotnull()).to.be.true;
      expect(compare(undefined).isnotnull()).to.be.true;
      expect(compare('').isnotnull()).to.be.true;
    });
  });
});