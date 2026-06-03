import redis from './单机连接.js';

await redis.set("a", 1);

// 设置过期时间（秒）
await redis.expire("a", 60);

// 设置过期时间（毫秒）
await redis.pexpire("a", 60000);

// 设置到某个时间点过期，unix时间戳，秒
await redis.expireat("a", Math.floor(Date.now()/1000) +60);

// 设置到某个时间点过期，unix时间戳，毫秒
await redis.pexpireat("a", Date.now() + 60000);

// 查询剩余过期时间（秒）， -1表示永不过期，-2表示key不存在
const ttl = await redis.ttl("a");
console.log(ttl);

// 查询剩余过期时间（毫秒）
const pttl = await redis.pttl("a");
console.log(pttl);

// 移除过期时间，变成永久
await redis.persist("a");
console.log(await redis.ttl("a"));