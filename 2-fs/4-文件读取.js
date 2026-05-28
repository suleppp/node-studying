const fs = require('fs');

// 异步读取
fs.readFile('./res/测试文本.txt',(err, data) => {
    if(err){
        console.log('读取失败');
        return ;
    }
    // 如果不用toString那么输出的是buffer
    console.log(data.toString());
})

// 同步读取
let data = fs.readFileSync('./res/测试文本.txt','utf8');
console.log(data)