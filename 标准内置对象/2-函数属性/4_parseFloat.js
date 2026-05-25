// 因为js当中没有区分整数和浮点数，底层都是用number
// 所以parseFloat只是从其他语言借鉴过来的
// 含义就是解析带小数点的数字

// 把字符串转成浮点数，
// 遇到无法解析的字符就停止，返回已解析的部分
console.log(parseFloat(3)); // 3
console.log(parseFloat("3")); // 3

console.log(parseFloat("3.14")); // 3.14

console.log(parseFloat("3.1.2.3")); // 3.1

console.log(parseFloat("      3.14     ")) // 3.14

console.log(parseFloat("abc")); //NaN