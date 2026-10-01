'use strict';

const resolved = require.resolve('./counter');
const first = require('./counter');
const second = require('./counter');
const runA = require('./consumer-a');
const runB = require('./consumer-b');

console.log('same exports object:', first === second);
console.log('resolved filename:', resolved);
console.log('cache loaded:', require.cache[resolved].loaded);

runA();
runB();

console.log('shared final count:', first.getCount());

