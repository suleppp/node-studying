const fs = require('fs');

// 异步写入
fs.appendFile('./测试文本.txt','\r\nhaha',err => {
    console.log('执行成功');
})

// 同步写入
fs.appendFileSync('./测试文本.txt','haha2');

// 使用writeFile也可以实现追加写入
fs.writeFile('./测试文本.txt','love love love',{flag:'a'},err => {
    console.log('writeFile')
})