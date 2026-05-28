const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 这里会把提示语写到process.stdout上
rl.question('输入名字：', (answer) => {
  console.log('你好，', answer);

  // 继续问
  rl.question('输入年龄：', (age) => {
    console.log('你今年', age, '岁');
    rl.close();  // 问完了关闭，否则进程不退出
  });
});

rl.on('close', () => {
  console.log('再见');
  process.exit(0);  // 关闭后退出进程
});