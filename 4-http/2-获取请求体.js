const http = require('http');

const server = http.createServer((req,res) => {
    let body = '';
    // 绑定事件，不同对象上有不同的data事件
    req.on('data',chunk => {
        body += chunk.toString();
    })

    req.on('end',() => {
        console.log("接收完毕");
        console.log(body);
        res.end("收到")
    })
})

server.listen(3000,() => {
    console.log('服务已启动，端口 3000');
})