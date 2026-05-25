console.log(typeof NaN); // number

// 以下五种情况会出现NaN
console.log(parseInt("abc")); // 字符串转数字
console.log(Math.sqrt(-1)); // 负数开方
console.log(Infinity*0); // 不定式
console.log(7*"abc"); // 无效运算，如果是7*"7"，那么会类型转换49
console.log(new Date("abc").getTime()); // 无效值转数字

// NaN不等于任何值，包括他自己
console.log(NaN === NaN);
console.log(NaN > 100);

// 判断一个值等于NaN
console.log(Number.isNaN(NaN));

// 特殊情况
console.log(NaN ** 0 === 1); // true