'use strict';
const path = require('path');
const Conditional = require(path.join(__dirname, './lib/conditional'));

module.exports = function (options = {}) {
  let conditional = new Conditional(options);
  return conditional.compare.bind(conditional);
};

module.exports.Conditional = Conditional;