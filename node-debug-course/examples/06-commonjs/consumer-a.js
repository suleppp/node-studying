'use strict';

const counter = require('./counter');

module.exports = function runA() {
  return counter.increment('consumer-a');
};

