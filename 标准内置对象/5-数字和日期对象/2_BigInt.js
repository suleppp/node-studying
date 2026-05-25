// 用来表示超过Number.MAX_SAFE_INTEGER的大整数
// 且不会丢失精度
// 不要用new，和Symbol一样
// 原因是返回的是一个包装对象，不是基本类型
//有三种创建方式
console.log(9007199254740991n)           // 字面量，加 n 后缀
console.log(BigInt(9007199254740991))    // 函数调用
console.log(BigInt("9007199254740991"))  // 传字符串

// 不能和Number混合运算，必须同类型

const n = 255n

console.log(n.toString())     // "255"，转成十进制字符串
console.log(n.toString(16))   // "ff"，转成十六进制字符串
console.log(n.toString(2))    // "11111111"，转成二进制字符串
console.log(n.valueOf())      // 255n，返回原始 BigInt 值
console.log(n.toLocaleString())  // "255"，本地化字符串