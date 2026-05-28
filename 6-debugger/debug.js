function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

function calculate(x, y) {
  const sum = add(x, y);        // Step Into 可以进入 add
  const product = multiply(x, y); // Step Over 直接跳过 multiply
  return sum + product;
}

const results = [];
for (let i = 0; i < 10; i++) {
  const result = calculate(i, i + 1);  // 条件断点：i === 5
  results.push(result);
}

console.log(results);  // Continue 直接跳到这里