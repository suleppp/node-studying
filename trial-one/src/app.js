const Fastify = require('fastify')
const mongoPlugin = require('./plugins/ioredis');
const redisPlugin = require('./plugins/mongo');

const app = Fastify({logger: true});

// 插件挂载
app.register(mongoPlugin);
app.register(redisPlugin);

async function start () {
    try {
        await app.listen({port: 3000});
        console.log("服务启动成功：http://localhost:3000");
    } catch (error) {
        console.error("服务启动失败：", error.message);
    }
}

start();