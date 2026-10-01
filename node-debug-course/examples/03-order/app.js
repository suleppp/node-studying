'use strict';

function getLeft() {
  console.log('2. getLeft');
  return 10;
}

function getRight() {
  console.log('3. getRight');
  return 20;
}

function combine(left, right) {
  console.log('4. combine', { left, right });
  return left + right;
}

function maybeReport(allow, value) {
  console.log('5. test allow');
  if (allow && report(value)) {
    console.log('7. report accepted');
  }
}

function report(value) {
  console.log('6. report', value);
  return true;
}

console.log('1. before expression');
const result = combine(getLeft(), getRight());
maybeReport(true, result); // 把 true 改为 false，观察短路。
console.log('8. result', result);

