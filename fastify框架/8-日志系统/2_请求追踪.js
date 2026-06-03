const Fastify = require('fastify');

const app = Fastify({
    logger: {
        level: 'debug',
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard'
            }
        }
    }
});

app.get('/user', async (request, reply) => {
    // 带reqId
    request.log.info('开始查询用户列表');

    request.log.info("查询完成");
    return [{id: 1, name: '张三'}, {id: 2, name: '李四'}];
})

async function start() {
    app.log.info('服务启动');
    await app.listen({port: 3000});
    app.log.info("服务启动成功")
}

start();

