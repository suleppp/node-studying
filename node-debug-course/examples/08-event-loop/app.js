'use strict';

console.log('1. synchronous start');

setTimeout(() => {
  console.log('timer (exact position relative to immediate is context-dependent)');
}, 0);

setImmediate(() => {
  console.log('immediate (exact position relative to timer is context-dependent)');
});

Promise.resolve().then(() => {
  console.log('4. promise microtask');
});

queueMicrotask(() => {
  console.log('5. queueMicrotask');
});

process.nextTick(() => {
  console.log('3. nextTick (CommonJS top-level)');
});

console.log('2. synchronous end');

