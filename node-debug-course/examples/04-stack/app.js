'use strict';

function factorial(n) {
  if (n <= 1) {
    return 1; // 在这里下断点，查看多个 factorial 栈帧。
  }

  const smaller = factorial(n - 1);
  const result = n * smaller;
  return result;
}

function main() {
  const answer = factorial(4);
  console.log('factorial(4) =', answer);
}

main();

