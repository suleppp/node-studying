// 和parseFloat类似
// 只返回整数部分
console.log(parseInt(3.14)); // 3
console.log(parseInt("3.14")); // 3

console.log(parseInt("abc")); // NaN
console.log(parseInt("3.14abc")); // 3

console.log(parseInt("abc3.14")); // NaN，第一个就无法解析

console.log(parseInt("3.2abc3.14"));// 3

// 这个函数有两个参数，第二个参数radix指定进制
// 这是parseInt特有的，建议永远写第二个参数
// 如果不写的话js会猜进制

// 只是告诉字符串是什么进制的，解析完成后统一返回十进制
console.log(parseInt("10",2));// 2，把一零当成二进制解析
console.log(parseInt("ff",16));// 255