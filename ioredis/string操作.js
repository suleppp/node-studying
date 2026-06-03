import redis from './单机连接.js';

// 存值
await redis.set('name','tom');

// 读取
const value = await redis.get('name');
console.log(value);

// 删除
await redis.del('name');

// 判断是否存在
const exists =await redis.exists('name')
console.log(exists)

// 设置过期时间 EX是秒，PX是毫秒
await redis.set('token', "abc123", 'EX', 3600);

// 条件设置
// NX not exists key不存在的时候才写入，已存在就跳过
// XX exists key存在的时才写入，不存在就跳过
await redis.set('lock', '1', 'EX', 10, 'NX'); // lock不存在写入成功，返回ok
await redis.set('lock', '2', 'EX', 10, 'NX');// 已经存在了，跳过，不会设置成2
console.log(await redis.get('lock'),"条件设置");

await redis.set('onetwo', '1', 'EX', 10, 'XX'); // 不存在，跳过，未写入
await redis.set('lock', '2', 'EX', 10, 'XX');// lock存在，写入成功
console.log("XX=> ", await redis.get('onetwo'));
console.log("XX=> ", await redis.get('lock'));

// 数字操作
await redis.set('count', 0);
await redis.incr('count');
await redis.incrby('count', 5);
await redis.decr('count');
await redis.decrby("count", 3);
const count = await redis.get('count');
console.log(count);

// 批量写
await redis.mset('a','1','b','2','c','3');
// 批量读
const values = await redis.mget('a','b','c');
console.log(values);

// 删除
await redis.del('name');
console.log(await redis.get('name'));