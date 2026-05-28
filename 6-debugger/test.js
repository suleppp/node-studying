const http = require('http');

// 1. 模拟一个每秒跳动一次的后台心跳任务
setInterval(() => {
    console.log(`[心跳] 当前时间: ${new Date().getSeconds()}秒`);
}, 1000);

// 2. 模拟一个处理网络请求的 Web 服务器
const server = http.createServer((req, res) => {
    if (req.url === '/debug') {
        console.log('>> 进入 /debug 路由，即将触发断点...');
        
        // 触发断点，此时主线程会被卡住
        debugger; 
        
        res.end('Debug finished');
    } else {
        res.end('Hello');
    }
});

server.listen(3000, () => console.log('服务器启动在 3000 端口'));