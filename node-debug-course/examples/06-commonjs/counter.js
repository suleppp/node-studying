'use strict';

console.log('counter module initialized once per process');

let count = 0;

function increment(source) {
  count += 1;
  console.log('increment', { source, count });
  return count;
}

function getCount() {
  return count;
}

module.exports = { increment, getCount };

