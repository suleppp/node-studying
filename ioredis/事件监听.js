import redis from './单机连接.js';

redis.on('connect', () => {
    console.log("连接成功")
})

redis.on("error", (err) => {
    console.error("连接错误")
})

redis.on("reconnecting", () => {
    console.log("正在重连");
})

redis.on("close", () => {
    console.log("连接关闭")
})