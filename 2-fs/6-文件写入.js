const fs = require('fs');

// 方式一 readFile
let data = fs.readFile('./座右铭.txt',(err,data) => {
    if(err){
        console.log("文件读取失败");
        return ;
    }

    fs.writeFile('./座右铭-2.txt', data, (err) => {
    if(err) {
        console.log("文件写入失败");
        return;
    }
    console.log("写入成功");
    });   
});


// 方式二 流式操作
const rs = fs.createReadStream('./座右铭.txt');
const ws = fs.createWriteStream('./座右铭-3.txt');

rs.on('data',chunk => {
    ws.write(chunk);
})