const http = require('http');
const url = require('url');

const server = http.createServer((req,res) => {
    console.log(req.url);

    let data = url.parse(req.url,true);// 加了true才会解析成对象，不加就是原始字符串
    console.log(data);

    // 路径
    console.log(data.pathname);

    // 查询字符串
    console.log(data.query.keyword)

    res.end('好的')
})


server.listen('3000',() => {
    console.log('服务已启动，端口 3000');
})