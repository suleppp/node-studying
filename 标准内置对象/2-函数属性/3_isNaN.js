// 同isFinite，不推荐使用全局对象下的，推荐使用Number对象下的
// 因为前者会进行类型转换，而后者不会

console.log(isNaN(""))        // false，空字符串转成 0，0 不是 NaN
console.log(isNaN("37"))      // false，"37" 转成 37，37 不是 NaN
console.log(isNaN(undefined)) // true，undefined 转成 NaN
console.log(isNaN({}))        // true，对象转成 NaN

console.log(Number.isNaN(undefined))