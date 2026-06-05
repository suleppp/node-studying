const mongoUtil = require('../utils/mongoUtil');
const redisUtil = require('../utils/redisUtil');
const device = require('../models/device');

const DEVICE_CACHE_KEY = (deviceid) => `cache_device_${deviceid}`;
const DEVICE_LIST_CACHE_KEY = (apikey) => `cache_devices_${apikey}`;

async function createDevice(data) {
    // 如果mongo出错，直接将异常向上冒，这层只做原子性的处理，出错补偿
    const newDevice = await mongoUtil.create(device, data);
    const cacheValue = {
        online: newDevice.online,
        state: newDevice.state,
        apikey: newDevice.apikey
    };
    try {
        await redisUtil.setString(DEVICE_CACHE_KEY(newDevice.deviceid), cacheValue, 3600);
    } catch (err) {
        await mongoUtil.deleteOne(device, {deviceid: newDevice.deviceid});
        throw err;
    }
    return newDevice;
}

async function findDeviceListByApikey(apikey) {
    let cached = null;
    try {
        cached = await redisUtil.getString(DEVICE_LIST_CACHE_KEY(apikey));
    } catch (err) {
        // 读缓存失败不影响后续数据库查询
    }

    if(cached) {
        return cached;
    }

    const list = await mongoUtil.findAll(device, {apikey});
    const result = {devices: {}};
    for (let ele of list) {
        result.devices[ele.deviceid] = {
            online: ele.online,
            state: ele.state,
            apikey: ele.apikey
        };
    }
    try {
        await redisUtil.setString(DEVICE_LIST_CACHE_KEY(apikey), result, 1800);
    } catch (err) {
        // 写缓存失败不影响后续返回
    }
    return result;
}

async function findDeviceByDeviceid(deviceid) {
    let cached = null;
    try {
        cached = await redisUtil.getString(DEVICE_CACHE_KEY(deviceid));
    } catch (err) {
        // 如果查缓存失败，不影响后续逻辑
    }
            
    if(cached) {
        return cached;
    }
    // 查数据库，查不到往上冒
    const doc = await mongoUtil.findOne(device, {deviceid});
    if(doc) {
        const cacheValue = {
            apikey: doc.apikey,
            online: doc.online,
            state: doc.state
        };
        try {
            await redisUtil.setString(DEVICE_CACHE_KEY(deviceid), cacheValue, 3600);
        } catch (err){
            // 重构缓存失败，跳过
        }
    }
    return doc;
}

async function updateDeviceState(deviceid, state) {
    const updated = await mongoUtil.updateOne(
        device,
        {deviceid},
        {$set: {state}},
    );
    if(updated) {
        const cacheValue = {
            apikey: updated.apikey,
            online: updated.online,
            state: updated.state
        };
        await redisUtil.setString(DEVICE_CACHE_KEY(deviceid), cacheValue, 3600);
    }
    return updated;
}

async function deleteDevice(deviceid) {
    await mongoUtil.deleteOne(device, {deviceid});
    try {
        await redisUtil.delString(DEVICE_CACHE_KEY(deviceid));
    } catch (err) {
        // 删失败，等ttl过期
    }
}

module.exports = {
    createDevice,
    findDeviceListByApikey,
    findDeviceByDeviceid,
    updateDeviceState,
    deleteDevice
};