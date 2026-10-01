'use strict';

const counter = require('./counter');

module.exports = function runB() {
  return counter.increment('consumer-b');
};

