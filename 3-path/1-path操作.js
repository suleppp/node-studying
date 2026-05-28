// path 模块用来处理文件路径，
// 核心解决的问题是：不同操作系统路径分隔符不一样，
// Windows 是 \，Mac/Linux 是 /，用 path 模块可以抹平差异。
// 只是处理字符串，不管路径是否真实存在，不涉及文件系统，文件系统是fs的事
// Path模块所有操作都是同步的。
// 因为它只是处理字符串，不涉及任何 I/O 操作，不需要等待，所以没有异步版本。


const path = require('path');


// // 获取当前操作系统的路径分隔符
// console.log(path.sep);

// // 把路径字符串拆解成各个部分
// console.log(path.parse('/a/b/test.txt'));

// // 取文件名加扩展名
// console.log(path.basename('/a/b/test.txt'));
// // 第二个参数去掉扩展名
// console.log(path.basename('a/b/test.txt', '.txt'));

// // 取所在目录
// console.log(path.dirname('/a/b/test.txt'));

// // 取扩展名
// console.log(path.extname('/a/b/test.txt'));

// // 生成绝对路径 (严格从右往左解析，遇到绝对路径就停止向左读取)
// let data = path.resolve('a', 'b', 'c');
// console.log(data); // 补上当前工作目录/a/b/c
// data = path.resolve('/a', 'b', 'c');
// console.log(data); // /a/b/c
// data = path.resolve('a', '/b', 'c');
// console.log(data); // /b/c (因为从右往左读，读到 /b 时已经是绝对路径，直接丢弃最左边的 'a')


// // 纯粹的路径拼接
// // 它不关心是不是绝对路径，只会把所有参数连起来，
// // 并自动处理多余的斜杠和相对路径符 '..'
// console.log(path.join('/a', 'b', '..', 'c')); // 输出: /a/c

// // 将对象重新拼装回路径字符串
// const pathObj = { root: '/', dir: '/a/b', base: 'test.txt' };
// console.log(path.format(pathObj)); // 输出: /a/b/test.txt

// // 环境变量的分隔符
// // Windows 下是 ';'，POSIX 下是 ':'
// console.log(path.delimiter); 

// // 判断是否是绝对路径
// console.log(path.isAbsolute('/a/b')); // true
// console.log(path.isAbsolute('a/b'));  // false

// 清理和规范化杂乱的路径字符串
// 自动消除多余的斜杠和中间的 '.' 或 '..'
console.log(path.normalize('/a//b/./c/../d')); // 输出: /a/b/d

// 计算相对路径
// 告诉你从路径 A 走到路径 B 应该怎么走
console.log(path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb')); 
// 输出: ..\..\impl\bbb

// 强制使用特定操作系统的规则
// 无论你当前在什么系统，都可以强制调用另一套系统的解析规则
console.log(path.posix.join('a', 'b')); // 强制用 / 拼接
console.log(path.win32.join('a', 'b')); // 强制用 \ 拼接
