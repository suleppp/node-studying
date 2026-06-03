import redis from './单机连接.js'

// 添加成员
await redis.zadd("rank", 100, "tom", 200, "jerry", 150, "bob");

// 获取成员分数
console.log(await redis.zscore('rank', "tom")); // 100

// 获取成员排名，从小到大，0是第一名，tom-->jerry-->bob
console.log(await redis.zrank("rank", "tom")); // 0

// 获取成员排名，从大到小，jerry-->bob-->tom
console.log(await redis.zrevrank("rank", "tom")); // 2


// 按排名范围获取成员，从小到大
console.log(await redis.zrange("rank", 0, -1)); // [ 'tom', 'bob', 'jerry' ]

// 按排名范围获取成员，从小到大，带上分数
console.log(await redis.zrange("rank", 0, -1, "WITHSCORES"));// [ 'tom', '100', 'bob', '150', 'jerry', '200' ]

// 按排名范围获取成员，从大到小
console.log(await redis.zrevrange("rank", 0, -1)); // [ 'jerry', 'bob', 'tom' ]

// 按排名范围获取成员，从大到小，带上分数
console.log(await redis.zrevrange("rank", 0, -1, "WITHSCORES")); // [ 'jerry', '200', 'bob', '150', 'tom', '100' ]

// 获取成员数量
console.log(await redis.zcard("rank")); // 3

// 分数加减
await redis.zincrby("rank", 50, "tom");
console.log(await redis.zscore("rank", "tom")); // 150

// 删除成员
await redis.zrem("rank", "jerry");

// 按分数范围获取成员
console.log(await redis.zrangebyscore("rank", 100, 200)); //[ 'bob', 'tom' ]