const fs = require('fs');
const ws = fs.createWriteStream('./res/test3.txt', {
  highWaterMark: 10  // 调成 10 个字节，为了快速触发满缓冲区
});

let i = 0;
function write() {
  let ok = true;
  while (i < 100 && ok) {
    i++;
    ok = ws.write('这是第' + i + '行数据\n');
    console.log('write 返回：', ok);  
  }
  if (i < 100) {
    ws.once('drain', () => {
      console.log('drain 触发，缓冲区排空了，继续写');
      write();
    });
  } else {
    ws.end();
  }
}

ws.on('finish', () => {
  console.log('finish 触发，所有数据都写完了');
});

ws.on('error', (err) => {
  console.log('error 触发：', err.message);
});

write();