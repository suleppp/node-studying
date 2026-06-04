const mongoUtil = require('../utils/mongoUtil');
const redisUitl = require('../utils/redisUtil');
const device = require('../models/device');

async function createDevice(data) {
    const result = {};
    try {
        const newDevice = await mongoUtil.create(device, data);
        const deviceid = newDevice.deviceId;
        const online = newDevice.online;
        const state = newDevice.state;
        result[deviceid].online = online;
        result[deviceid].state = state; 
        await redisUitl.setString(`cache_device_<${deviceid}>`, result);
    } catch (err) {
        
    }
}

async function findDeviceListByApikey(apikey) {

}

async function findDeviceByDeviceid(deviceid) {

}

async function updateDeviceState(deviceid, state) {

}

async function deleteDevice(deviceid) {

}