const mem = process.memoryUsage();
console.log(`总占用物理内存: ${Math.round(mem.rss / 1024 / 1024)} MB`);
console.log(`实际使用堆内存: ${Math.round(mem.heapUsed / 1024 / 1024)} MB`);

console.log(process.cpuUsage())

// 总占用物理内存: 29 MB
// 实际使用堆内存: 4 MB
// { user: 0, system: 31000 }

process.exit(0);