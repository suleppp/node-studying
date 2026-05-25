const fs = require('fs');

// 异步读取
fs.readFile('./座右铭.txt',(err, data) => {
    if(err){
        console.log('读取失败');
        return ;
    }
    // 如果不用toString那么输出的是buffer
    console.log(data.toString());
})

// 同步读取
let data = fs.readFileSync('./座右铭.txt');
console.log(data)