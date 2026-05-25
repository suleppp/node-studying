const fs = require('fs');

// 创建写入流对象
const ws = fs.createWriteStream('./座右铭.txt');

//覆盖写入
ws.write('流式写入测试');

ws.close();
