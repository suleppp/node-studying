import redis from './单机连接.js'

const pipeline = redis.pipeline();

pipeline.set('abc', 1).set("abcd", "2").get("abc");
pipeline.get("abcd");

const res = await pipeline.exec();

console.log(res);
// [ [ null, 'OK' ], [ null, 'OK' ], [ null, '1' ], [ null, '2' ] ]