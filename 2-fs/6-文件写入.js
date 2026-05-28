const fs = require('fs');

// 方式一 readFile
let data = fs.readFile('./测试文本.txt',(err,data) => {
    if(err){
        console.log("文件读取失败");
        return ;
    }

    fs.writeFile('./测试文本-2.txt', data, (err) => {
    if(err) {
        console.log("文件写入失败");
        return;
    }
    console.log("写入成功");
    });   
});


// 方式二 流式操作
const rs = fs.createReadStream('./测试文本.txt');
const ws = fs.createWriteStream('./测试文本-3.txt');

rs.on('data',chunk => {
    ws.write(chunk);
})