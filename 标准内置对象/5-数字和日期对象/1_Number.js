console.log(Number.MAX_SAFE_INTEGER)  // 9007199254740991
console.log(Number.MIN_SAFE_INTEGER)  // -9007199254740991

console.log(9007199254740991 + 1)     // 9007199254740992，正确
console.log(9007199254740991 + 2)     // 9007199254740992，错了，精度丢失


console.log(Number.MAX_VALUE)          // 1.7976931348623157e+308
console.log(Number.MIN_VALUE)          // 5e-324
console.log(Number.POSITIVE_INFINITY)  // Infinity
console.log(Number.NEGATIVE_INFINITY)  // -Infinity
console.log(Number.NaN)                // NaN
console.log(Number.EPSILON)            // 两个可表示数之间的最小间隔2.220446049250313e-16


console.log(Number.isFinite(1))                    // true
console.log(Number.isInteger(1.0))                 // true
console.log(Number.isNaN(NaN))                     // true
console.log(Number.isSafeInteger(9007199254740991)) // true
console.log(Number.parseInt("123"))                // 123
console.log(Number.parseFloat("1.5"))              // 1.5

const n = 1234.5678

console.log(n.toFixed(2))        // "1234.57"，保留两位小数，返回字符串
console.log(n.toExponential(2))  // "1.23e+3"，指数表示法
console.log(n.toPrecision(4))    // "1235"，指定有效数字位数
console.log(n.toString(16))      // "4d2"，转成十六进制字符串
console.log(n.toString(2))       // 转成二进制字符串

console.log(Number("123"))     // 123
console.log(Number(""))        // 0
console.log(Number(null))      // 0
console.log(Number(undefined)) // NaN
console.log(Number(true))      // 1
console.log(Number(false))     // 0
console.log(Number("abc"))     // NaN