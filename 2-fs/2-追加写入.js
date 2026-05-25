const { error } = require('console');
const fs = require('fs');

// 异步写入
fs.appendFile('./座右铭.txt','\r\n牛逼',err => {
    console.log('执行成功');
})

// 同步写入
fs.appendFileSync('./座右铭.txt','牛逼2');

// 使用writeFile也可以实现追加写入
fs.writeFile('./座右铭.txt','love love love',{flag:'a'},err => {
    console.log('writeFile')
})