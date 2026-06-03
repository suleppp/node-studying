import redis from './单机连接.js'


const results = await redis.multi()
                        .set('a', '1')
                        .set('b', '2')
                        .get('a')
                        .get('b')
                        .exec();

console.log(results);
// [ [ null, 'OK' ], [ null, 'OK' ], [ null, '1' ], [ null, '2' ] ]

// discard放弃事务
const multi = redis.multi()
                .set('a', '1')
                .set('b', '2');

multi.discard();

// watch 监听key，exec之前如果这个key被其他客户端修改则事务取消
await redis.set("balance", 200);
await redis.watch("balance");
const balance = await redis.get("balance");

if(Number(balance) < 100){
    await redis.unwatch();
    console.log("余额不足");
} else {
    const r = await redis.multi()
                    .decrby("balance", 100)
                    .exec();
    if(r === null){
        console.log("balance 被其他客户端修改，事务被取消")
    } else {
        console.log(r);
        // [ [ null, 100 ] ]
    }
}
