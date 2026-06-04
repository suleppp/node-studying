let redisClient;

function initRedis(redis) {
    redisClient = redis;
}


async function getString(key) {
    try {
        return JSON.parse(await redisClient.get(key));
    } catch (err) {
        throw new DataError(DataError.REDIS_ERROR_CODE, "Redis获取string失败");
    }
}

async function setString(key, value, ttl) {
    try {
        if(ttl === undefined){
            return await redisClient.set(key, JSON.stringify(value));
        }
        else {
            return await redisClient.set(key, JSON.stringify(value), 'EX', ttl);
        }
    } catch (err) {
        throw new DataError(DataError.REDIS_ERROR_CODE, "Redis设置string失败");
    }
}

async function delString(key) {
    try {
        return await redisClient.del(key);
    } catch (err) {
        throw new DataError(DataError.REDIS_ERROR_CODE, "Redis删除string失败");
    }
}

module.exports = {
    initRedis,
    getString,
    setString,
    delString
};