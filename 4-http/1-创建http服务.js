const http = require('http');

// 类似 Java 中配置 Servlet，每次请求进来执行回调
// 回调函数类似 Java 中的 doGet/doPost 方法
// req 类似 HttpServletRequest，res 类似 HttpServletResponse
const server = http.createServer((req, res) => {

    // req.method 类似 request.getMethod()
    // req.url 类似 request.getRequestURI()
    // req.headers 类似 request.getHeader()

    // 根据请求路径返回不同内容，类似 Servlet 中根据 url-pattern 分发
    if(req.url === '/') {
        // res.end 类似 response.getWriter().write()，写完自动关闭
        res.end('首页');
    } else if(req.url === '/user') {
        res.end('用户页');
    } else {
        // 类似 response.setStatus(404)
        res.statusCode = 404;
        res.end('404');
    }
});

// 类似 Tomcat 启动并监听端口
server.listen(3000, () => {
    console.log('服务已启动，端口 3000');
});