// 标准输出 stdout
process.stdout.write("你好\n");

// 标准错误 stderr
process.stderr.write("出错了\n");

// 标准输入 stdin
process.stdin.on('data', (data) => {
  console.log('收到输入：', data.toString());
});

// 标准输出 stdout
console.log("普通输出");

// 标准错误 stderr
console.error("错误输出");

// 标准输入 stdin，console 没有对应的方法