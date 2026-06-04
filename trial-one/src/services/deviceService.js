const device = require('../models/device');
const AppError = require('../errors/AppError');
const BusinessError = require('../errors/BusinessError');

async function createDevice(param) {
    const doc = new device({
        apikey: param.apikey,
        deviceid: param.deviceid,
        online: param.online,
        state: param.state
    })
    try {
        await doc.save();
    } catch (error) {
        if (error.code === 11000) {
        throw new AppError(AppError.PARAMETER_ERROR_CODE, '设备已存在');
    }
        throw new AppError(AppError.SERVICE_ERROR_CODE, AppError.SERVICE_ERROR_MSG);
    }
}

async function queryDeviceList(apikey) {
    const data = await device.find({apikey: apikey});
    const result = {
        devices: {}
    };
    for(let ele of data) {
        result.devices[ele.deviceid] = {
            online: ele.online,
            state: ele.state
        };
    }
    return result;
}

module.exports = {createDevice, queryDeviceList};