// path 模块用来处理文件路径，
// 核心解决的问题是：不同操作系统路径分隔符不一样，
// Windows 是 \，Mac/Linux 是 /，用 path 模块可以抹平差异。
// 只是处理字符串，不管路径是否真实存在，不涉及文件系统，文件系统是fs的事
// Path模块所有操作都是同步的。
// 因为它只是处理字符串，不涉及任何 I/O 操作，不需要等待，所以没有异步版本。


const path = require('path');

// 获取当前操作系统的路径分隔符，这只是一个属性
console.log(path.sep)

// 把路径字符串拆解成各个部分
// root根目录，dir所在目录，base文件名加扩展名，ext扩展名，name文件名
console.log(path.parse('/a/b/test.txt'));

// 取文件名加扩展名
console.log(path.basename('/a/b/test.txt'));
// 第二个参数去掉扩展名
console.log(path.basename('a/b/test.txt','.txt'));


// 取所在目录
console.log(path.dirname('/a/b/test.txt'));

// 取扩展名
console.log(path.extname('/a/b/test.txt'));

// 生成绝对路径，从左往右拼接，遇到绝对路径就停
let data = path.resolve('a','b','c');
console.log(data);
data = path.resolve('/a','b','c');
console.log(data);
data = path.resolve('a','/b','c');
console.log(data);