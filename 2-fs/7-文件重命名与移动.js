const fs = require('fs');

// 重命名
fs.rename('./测试文本.txt','./测试文本.txt',err => {
    console.log('重命名已执行');

    // 文件移动，不会自动创建目录
    fs.rename('./测试文本.txt','./res/测试文本.txt',err => {
        console.log('文件已移动');
    })
})
