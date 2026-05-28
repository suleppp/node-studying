const readline = require('readline');
const fs = require('fs');

// 创建 readline 实例，指定输入输出
const rl = readline.createInterface({
  input: fs.createReadStream('./res/test.txt'),
  output: process.stdout,
});

let lineCount = 0;

// 每读到一行触发
rl.on('line', (line) => {
  lineCount++;
  console.log(`第${lineCount}行：`, line);
});

// 读完了
rl.on('close', () => {
  console.log(`共读了${lineCount}行`);
});

// 出错了
rl.on('error', (err) => {
  console.log('出错了：', err.message);
});