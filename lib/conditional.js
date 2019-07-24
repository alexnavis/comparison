'use strict';
const numeric = require('numeric');
const deepEqual = require('deep-equal');
const moment = require('moment');

/**
 * 
 * Checks the validity of the date string
 * 
 * @param {string} value string value of date
 * @return Returns whether the argument was in the correct ISO date format or not
 */
const _isDate = function (value) {
  return (typeof value === 'string' && moment(value, moment.ISO_8601, true).isValid());
};

/**
 * Check for the presence of null value in the comparison value
 * 
 * @param {*} value comparison value 
 * @return Returns whether the value contains null value or not
 */
const _checkNullValues = function (value) {
  if (Array.isArray(value)) {
    return value.includes(null);
  } else {
    return value === null;
  }
}

const EVALUATIONS = {
  gt: function (value) {
    if (_checkNullValues([ value, this._getcompare() ])) return false;
    if (_isDate(value)) value = Date.parse(value);
    if (this.percision) return numeric.gt(this._getcompare(), value);
    return this._getcompare() > value;
  },
  lt: function (value) {
    if (_checkNullValues([ value, this._getcompare() ])) return false;
    if (_isDate(value)) value = Date.parse(value);
    if (this.percision) return numeric.lt(this._getcompare(), value);
    return this._getcompare() < value;
  },
  cap: function (value) {
    if (_checkNullValues([ value, this._getcompare() ])) return false;
    let compare = this._getcompare();
    if (_isDate(value)) value = Date.parse(value);
    if (compare !== 0 && !compare) return true;
    if (this.percision) return numeric.leq(this._getcompare(), value);
    return compare <= value;
  },
  floor: function (value) {
    if (_checkNullValues([ value, this._getcompare() ])) return false;
    let compare = this._getcompare();
    if (_isDate(value)) value = Date.parse(value);
    if (compare !== 0 && !compare) return false;
    if (this.percision) return numeric.geq(this._getcompare(), value);
    return compare >= value;
  },
  range: function (value1, value2) {
    if (_checkNullValues([ value1, value2, this._getcompare() ])) return false;
    let compare = this._getcompare();
    if (_isDate(value1)) value1 = Date.parse(value1);
    if (_isDate(value2)) value2 = Date.parse(value2);
    if (compare !== 0 && !compare) return false;
    if (this.percision) {
      if (numeric.gt(value1, value2)) return (numeric.leq(compare, value1) && numeric.geq(compare, value2));
      return (numeric.geq(compare, value1) && numeric.leq(compare, value2));
    } else {
      if (value1 > value2) return (compare <= value1 && compare >= value2);
      return (compare >= value1 && compare <= value2);
    }
  },
  equal: function (value) {
    if (_checkNullValues([ value, this._getcompare() ])) return false;
    let compare = this._getcompare();
    if (_isDate(value)) value = Date.parse(value);
    if (typeof compare === 'number' && typeof value === 'number' && this.percision) return numeric.eq(compare, value);
    return this._getcompare() === value;
  },
  isin: function (value) {
    let compare = this._getcompare();
    if (value && typeof value === 'object' && !Array.isArray(compare)) {
      if (Array.isArray(value)) return value.indexOf(compare) !== -1;
      else return Object.keys(value).indexOf(compare) !== -1;
    } else if (Array.isArray(compare) && typeof value === 'string') return compare.indexOf(value) !== -1;
    else if (!Array.isArray(compare) && typeof value === 'string') return value.split(',').indexOf(compare) !== -1;
    return false;
  },
  exists: function () {
    let compare = this._getcompare();
    if (typeof compare === 'number') return true;
    return Boolean(compare);
  },
  deepequal: function (value) {
    return deepEqual(this._getcompare(), value, { strict: true, });
  },
  isnull: function () {
    let compare = this._getcompare();
    return (compare === null);
  },
  isnotnull: function () {
    let compare = this._getcompare();
    return (compare !== null);
  },
};

/**
 * Convenience method for generating all evaluation functions with a bound "this" reference
 * @return {Object} Returns an object indexed by evaluations type with each function as its value but with a bound "this"
 */
const INSTANTIATE_EVALUATIONS = function () {
  return Object.keys(EVALUATIONS).reduce((evaluations, key) => {
    evaluations[ key ] = EVALUATIONS[ key ].bind(this);
    return evaluations;
  }, {});
};

/**
 * @class Conditional
 * @description Constructs an object that contains methods for evaluating a value ie. less than, greater than, within a range etc
 * @example conditional = new Conditional(); conditional.compare(1).range(0, 2) => true; conditional.compare(1).not.range(0, 2) => false;
 */
const Conditional = class Conditional {
  /**
   * @constructor {Funtion} Constructs and instanceof Conditional and exposes class methods as well as a .not property that has access to negated versions of evaluations
   * @example comparison = conditional.compare('fizz'); comparison.in(['fizz', 'buzz']) => true; comparison.not.in(['fizz', 'buzz']) => false;
   */
  constructor(options = {}) {
    let _compare;
    this.percision = options.percision;
    this._setcompare = function (value) {
      if (typeof value === 'string' && _isDate(value)) value = Date.parse(value);
      _compare = value;
    };
    this._getcompare = () => _compare;
    this.not = Object.keys(EVALUATIONS).reduce((negated, key) => {
      negated[ key ] = function () {
        return !EVALUATIONS[ key ].call(this, ...arguments);
      }.bind(this);
      return negated;
    }, {});
  }
  /**
   * Determines if comparison value is greater than value argument
   * @param {number} value Value to compare against comparison value
   * @return {boolean} Returns true if comparison value is less than value argument
   */
  gt(value) {
    return EVALUATIONS.gt.call(this, value);
  }
  /**
   * Determines if comparison value is less than value argument
   * @param {number} value Value to compare against comparison value
   * @return {boolean} Returns true if comparison value is more than value argument
   */
  lt(value) {
    return EVALUATIONS.lt.call(this, value);
  }
  /**
   * Determines if comparison value is less than or equal to value argument
   * @param {number} value Value to compare against comparison value
   * @return {boolean} Returns true if comparison value is less than value argument
   */
  cap(value) {
    return EVALUATIONS.cap.call(this, value);
  }
  /**
   * Determines if comparison value is greater than or equal to value argument
   * @param {number} value Value to compare against comparison value
   * @return {boolean} Returns true if comparison value is more than value argument
   */
  floor(value) {
    return EVALUATIONS.floor.call(this, value);
  }
  /**
   * Determines if comparison value between the value1 and value2 arguments
   * @param {number} value1 upper or lower bound of a range
   * @param {number} value2 upper or lower bound of a range
   * @return {boolean} Returns true if comparison value between the value1 and value2 arguments (it doesnt matter which order the arguments are passed ie. range(1, 3) === range(3, 1))
   */
  range(value1, value2) {
    return EVALUATIONS.range.apply(this, [ value1, value2, ]);
  }
  /**
   * Determines if comparison value is exactly equal to value argument
   * @param {number} value Value to compare against comparison value
   * @return {boolean} Returns true if comparison value is equal to value argument
   */
  equal(value) {
    return EVALUATIONS.equal.call(this, value);
  }
  /**
   * Determines if comparison value is not equal to value argument
   * @param {number} value Value to compare against comparison value
   * @return {boolean} Returns true if comparison value is equal to value argument
   */
  notequal(value) {
    return !EVALUATIONS.equal.call(this, value);
  }
  /**
   * Determines if comparison value is contained within value argument
   * @param {string|string[]|number[]} value Value to compare against comparison value
   * @return {boolean} Returns true if comparison value exists within the value argument array (value argument can be comma delimited list ie. in(['a', 'b', 'c']) === in('a,b,c'))
   */
  in(value) {
    return EVALUATIONS.isin.call(this, value);
  }
  /**
   * Determines if comparison value isnt contained within value argument
   * @param {string|string[]|number[]} value Value to compare against comparison value
   * @return {boolean} Returns true if comparison value exists within the value argument array (value argument can be comma delimited list ie. in(['a', 'b', 'c']) === in('a,b,c'))
   */
  notin(value) {
    return !EVALUATIONS.isin.call(this, value);
  }
  /**
   * @alias Conditional.cap
   */
  ceil(value) {
    return this.cap(value);
  }
  /**
   * Determines if comparison value exists or not
   * @return {boolean} Returns true if value is a truthy value or 0
   */
  exists() {
    return EVALUATIONS.exists.call(this);
  }
  /**
   * Determines if comparison value is null
   * @return {boolean} Returns true if value is equal to null
   */
  isnull() {
    return EVALUATIONS.isnull.call(this);
  }
  /**
   * Determines if comparison value is not null
   * @return {boolean} Returns true if value is not equal to null
   */
  isnotnull() {
    return EVALUATIONS.isnotnull.call(this);
  }
  /**
   * Sets value of comparison object this method must be called to stage comparison value
   * @example conditional.compare(1).cap(2) => true
   * @param {number|string}  value Comparison value
   * @return {Object} Returns "this" for chaining
   */
  compare(value) {
    this._setcompare(value);
    return this;
  }
  /**
   * @alias Conditional.compare
   */
  evalute(value) {
    return this.compare(value);
  }
  /**
   * @alias Conditional.compare
   */
  condition(value) {
    return this.compare(value);
  }
};

module.exports = Conditional;
