const fs = require('fs');

// 异步获取状态
fs.stat('./res/测试文本.txt',(err,data) => {
    if(err) throw err;
    console.log(data)
})

