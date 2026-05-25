// 判断一个值是否为有限数
console.log(isFinite(1)); // true
console.log(isFinite(Infinity)); // false
console.log(isFinite("1")); // true，会转换字符串，因此不推荐使用

// 推荐使用Number对象上的isFinite()，而不是全局对象上的
// 不会进行类型转换
console.log(Number.isFinite("1")); // false