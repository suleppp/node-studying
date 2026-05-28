// 导入模块
const fs = require('fs');
异步写入
fs.writeFile('./测试文本.txt','hahah',err => {
    if(err){
        console.log('写入失败');
    }
    else{
        console.log('写入成功')
    }
})

console.log(1+2);

// 同步写入
fs.writeFileSync('./测试文本.txt','text')