import redis from './单机连接.js';

// eval(脚本,key数量,key1,....,arg1,...)
const value = await redis.eval(
  'return redis.call("set", KEYS[1], ARGV[1])',
  1,
  'abc',
  '1'
)

console.log(value); // OK


// evalsha 先注册脚本拿到sha，然后用sha调用
const sha = await redis.script('load', 'return redis.call("get", KEYS[1])')
const result = await redis.evalsha(sha, 1, "abc");
console.log(result); // 1