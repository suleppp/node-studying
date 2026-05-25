const fs = require('fs');

// 创建读取流对象
const rs = fs.createReadStream('./座右铭.txt');

// 绑定data事件
rs.on('data',chunk => {
    // 一次读取64kb
    console.log(chunk.toString());
})

rs.on('end',() => {
    console.log('读取完成');
})