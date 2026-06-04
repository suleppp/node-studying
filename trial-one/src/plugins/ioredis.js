const Redis = require('ioredis');
const fp = require('fastify-plugin');

// todo 后期修改为从环境中读取
const defaultOptions = {
    host: 'localhost',
    port: 6379,
    db: 0
}

async function redisPlugin (fastify, options = defaultOptions) {
    try {
        const redis = new Redis(options);
        fastify.decorate('redis', redis);

        // 事件监听
        redis.on("connect", () => {
            console.log("Redis-->连接成功");
        })

        redis.on("error", (err) => {
            console.error("Redis-->连接错误");
        })

        redis.on("reconnecting", () => {
            console.log("Redis-->正在重连");
        })

        redis.on("close", () => {
            console.log("Redis-->连接关闭");
        })

        console.log("Redis连接成功");
    } catch (error) {
        console.log("Redis连接失败");
        throw error;
    }
}

module.exports = fp(redisPlugin);