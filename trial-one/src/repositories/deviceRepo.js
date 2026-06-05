const mongoUtil = require('../utils/mongoUtil');
const redisUtil = require('../utils/redisUtil');
const device = require('../models/device');

const DEVICE_CACHE_KEY = (deviceid) => `cache_device_${deviceid}`;
const DEVICE_LIST_CACHE_KEY = (apikey) => `cache_devices_${apikey}`;

async function createDevice(data) {
    const newDevice = await mongoUtil.create(device, data);
    const cacheValue = {
        online: newDevice.online,
        state: newDevice.state
    };
    await redisUtil.setString(DEVICE_CACHE_KEY(newDevice.deviceid), cacheValue);
    return newDevice;
}

async function findDeviceListByApikey(apikey) {
    const cached = await redisUtil.getString(DEVICE_LIST_CACHE_KEY(apikey));
    if(cached) {
        return cached;
    }
    const list = await mongoUtil.findAll(device, {apikey});
    const result = {devices: {}};
    for (let ele of list) {
        result.devices[ele.deviceid] = {
            online: ele.online,
            state: ele.state
        };
    }
    await redisUtil.setString(DEVICE_LIST_CACHE_KEY(apikey), result);
    return result;
}

async function findDeviceByDeviceid(deviceid) {
    const cached = await redisUtil.getString(DEVICE_CACHE_KEY(deviceid));
    if(cached) {
        return cached;
    }
    const doc = await mongoUtil.findOne(device, {deviceid});
    if(doc) {
        const cacheValue = {
            apikey: doc.apikey,
            online: doc.online,
            state: doc.state
        };
        await redisUtil.setString(DEVICE_CACHE_KEY(deviceid), cacheValue);
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
        await redisUtil.setString(DEVICE_CACHE_KEY(deviceid), cacheValue);
    }
    return updated;
}

async function deleteDevice(deviceid) {
    await mongoUtil.deleteOne(device, { deviceid });
    await redisUtil.delString(DEVICE_CACHE_KEY(deviceid));
}

module.exports = {
    createDevice,
    findDeviceListByApikey,
    findDeviceByDeviceid,
    updateDeviceState,
    deleteDevice
};