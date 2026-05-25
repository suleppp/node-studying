// Error是一个构造函数
const e = new Error("出错了");
console.log(e.message);// "出错了"
console.log(e.name);// "Error" 错误类型名
console.log(e.stack);// 错误堆栈，包含调用链信息
console.log(e.cause); //原始错误，传了cause才有

console.log(e.toString()); // "Error: 出错了"
