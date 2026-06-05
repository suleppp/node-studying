const DataError = require('../errors/DataError');

let redisClient;
const prefix = "trialOne:";

function initRedis(redis) {
    redisClient = redis;
}


async function getString(key) {
    try {
        return JSON.parse(await redisClient.get(prefix + key));
    } catch (err) {
        throw new DataError(DataError.REDIS_ERROR_CODE, err.message);
    }
}

async function setString(key, value, ttl) {
    try {
        if(ttl === undefined){
            return await redisClient.set(prefix + key, JSON.stringify(value));
        }
        else {
            return await redisClient.set(prefix + key, JSON.stringify(value), 'EX', ttl);
        }
    } catch (err) {
        throw new DataError(DataError.REDIS_ERROR_CODE, err.message);
    }
}

async function delString(key) {
    try {
        return await redisClient.del(prefix + key);
    } catch (err) {
        throw new DataError(DataError.REDIS_ERROR_CODE, err.message);
    }
}

module.exports = {
    initRedis,
    getString,
    setString,
    delString
};