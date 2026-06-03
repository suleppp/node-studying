import redis from './单机连接.js'

// 添加成员
await redis.sadd('tags', 'js', 'java', 'node', 'redis');

// 判断成员是否存在
console.log(await redis.sismember("tags", "node"));

// 获取所有成员
console.log(await redis.smembers("tags"));

// 获取成员数量
console.log(await redis.scard("tags"));

// 删除成员
await redis.srem("tags", "redis");

// 随机查出一个成员
console.log(await redis.srandmember("tags"));

// 随机弹出一个成员并删除
console.log(await redis.spop("tags"));

// 集合运算
await redis.sadd("a", '1', '2', '3');
await redis.sadd('b', '2', '3', '4');

// 交集
console.log(await redis.sinter("a", "b"));

// 并集
console.log(await redis.sunion("a", "b"));

// 差集
console.log(await redis.sdiff("a", "b"));