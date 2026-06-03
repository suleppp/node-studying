import redis from './单机连接.js'

// 设置单个字段
await redis.hset("user:1", "name", "tom");
await redis.hset("user:1", "age", 18);

// 一次设置多个字段
await redis.hset("user:2", "name", "andy", "age", 18, "city", "beijing");

// 读取单个字段
console.log(await redis.hget("user:1", "name"));// tom
console.log(await redis.hget("user:2", "name"));// andy

// 读取多个字段
console.log(await redis.hmget("user:2", "name", "age")); // [ 'andy', '18' ]

// 读取所有字段
console.log(await redis.hgetall("user:1"));// { name: 'tom', age: '18' }

// 判断字段是否存在
console.log(await redis.hexists("user:1", "name")); // 1

// 删除字段
await redis.hdel("user:2", "city");

// 获取所有字段名
console.log(await redis.hkeys("user:1")); // [ 'name', 'age' ]

// 获取字段数量
console.log(await redis.hlen("user:1")); // 2