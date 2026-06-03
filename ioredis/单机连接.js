import Redis from 'ioredis';

// 对象配置
const redis = new Redis({
    host: 'localhost',
    port: 6379,
    db: 0 // 数据库编号，默认0，范围0-15
})

// // URL写法
// const redis = new Redis('redis://@localhost:6379/0');

// await redis.set("key","val")

// // 重连策略
// const redis = new Redis({
//     host: 'localhost',
//     port: 6379,
//     retryStrategy(times) {
//         if(times > 10) { // 超过10次就放弃重连
//             return null;
//         }
//         return Math.min(times * 200, 2000); // 最长不超过2000
//     }
// })

export default redis;
