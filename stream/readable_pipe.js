const fs = require('fs')

const rs = fs.createReadStream("./res/test.txt");
const ws = fs.createWriteStream("./res/test2.txt");


// // data事件监听
// rs.on("data",(chunk) => {
//     ws.write(chunk);
// })

// rs.on("end",() => {
//     ws.end(); //手动结束
// })

rs.pipe(ws); // 一行解决，还自动转发，背压，结束