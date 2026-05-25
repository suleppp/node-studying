const fs = require('fs');
fs.unlink('./res/删除文本.txt',err => {
    console.log("执行文件删除");
})

// fs.rm(参数同上)