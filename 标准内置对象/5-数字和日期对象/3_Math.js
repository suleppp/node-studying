// 静态属性
console.log(Math.PI)      // 3.141592653589793，圆周率
console.log(Math.E)       // 2.718281828459045，自然常数
console.log(Math.SQRT2)   // 1.4142135623730951，根号 2
console.log(Math.LN2)     // 0.6931471805599453，ln2
console.log(Math.LN10)    // 2.302585092994046，ln10
// 静态方法
console.log(Math.floor(1.9))   // 1，向下取整
console.log(Math.ceil(1.1))    // 2，向上取整
console.log(Math.round(1.5))   // 2，四舍五入
console.log(Math.trunc(1.9))   // 1，直接去掉小数部分
console.log(Math.trunc(-1.9))  // -1，和 floor 不同

console.log(Math.max(1, 2, 3))   // 3
console.log(Math.min(1, 2, 3))   // 1
console.log(Math.max(...[1, 2, 3]))  // 3，配合展开运算符处理数组

console.log(Math.pow(2, 10))   // 1024，2 的 10 次方
console.log(Math.sqrt(9))      // 3，平方根
console.log(Math.cbrt(27))     // 3，立方根
console.log(Math.abs(-5))      // 5，绝对值

console.log(Math.random())           // 0 到 1 之间的随机数，不含 1
// 生成 0 到 n 之间的随机整数
console.log(Math.floor(Math.random() * 10))  // 0 到 9
