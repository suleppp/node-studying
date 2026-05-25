// 对象永远是一个真值
console.log(Boolean({}));

// 有两个主要用途
// 转换布尔值 和 创建Boolean对象

const b = new Boolean(true);

console.log(b.toString()); //"true"
console.log(b.valueOf()); //true

