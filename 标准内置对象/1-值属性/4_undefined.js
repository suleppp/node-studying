// 表示这个变量存在，但是没有被赋值，js自动给的默认值
let x;
console.log(x); // undefined

function fn(){};
console.log(fn());// 没有return就返回undefined

// 和null的区别在于
// undefined是存在但没有赋值，是js自动给的
// null是开发者主动赋的，故意没有值

console.log(null === undefined); // 不做类型转换
console.log(null == undefined); // 做类型转换 true

// typeof返回的是字符串
console.log(typeof y === "undefined");

// 如果y没声明直接比较会报错
console.log(y === undefined);