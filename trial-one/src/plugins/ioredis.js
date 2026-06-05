const Redis = require('ioredis');
const fp = require('fastify-plugin');
const redisUtil = require('../utils/redisUtil');
const process = require('process');

// todo 后期修改为从环境中读取
const defaultOptions = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    db: process.env.REDIS_DB || 0
}

// 因为require拿到的是Redis这个类，为了避免每次都new导致多个连接
// 所以只new一次然后挂在fastify身上
async function redisPlugin (fastify, options = defaultOptions) {
    try {
        const redis = new Redis(options);
        fastify.decorate('redis', redis);
        redisUtil.initRedis(redis);

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