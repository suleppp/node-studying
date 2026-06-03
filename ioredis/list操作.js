import redis from "./单机连接.js"


// 从左边插入
await redis.lpush("list", "a", "b", "c");
console.log(await redis.lrange("list", 0, -1)); // [ 'c', 'b', 'a' ]

// 从右边插入
await redis.rpush("list", "d", "e", "f");
console.log(await redis.lrange("list", 0, -1)); // [ 'c', 'b', 'a', 'd', 'e', 'f' ]


// 从左边弹出
const left = await redis.lpop("list");
console.log(left);

// 从右边弹出
const right = await redis.rpop("list");
console.log(right);

// 获取指定范围
console.log(await redis.lrange("list", 0, -1));

// 获取指定元素的下标
const item = await redis.lindex("list", 0);
console.log(item);

// 获取列表长度
const len = await redis.llen("list");
console.log(len);

// 只保留指定范围，其余删除
await redis.ltrim("list", 0, 1);
console.log(await redis.lrange("list", 0, -1));