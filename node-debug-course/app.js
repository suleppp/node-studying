console.log('1. 程序开始');

function add(a, b) {
  console.log('3. 进入 add');
  const result = a + b;
  console.log('4. 准备离开 add');
  return result;
}

console.log('2. 准备调用 add');

const result = add(10, 20);

console.log('5. add 已经执行完成，result =', result);
console.log('6. 程序结束');
