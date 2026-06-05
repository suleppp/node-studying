const device = require('../models/device');
const AppError = require('../errors/AppError');
const BusinessError = require('../errors/BusinessError');
const deviceRepo = require('../repositories/deviceRepo');


async function createDevice(data) {
    let ret = null;
    try {
        ret = await deviceRepo.createDevice(data);
    } catch (err) {
        return {success: false , code: AppError.DATA_ERROR_CODE, msg: AppError.DATA_ERROR_MSG};
    }
    return {success: true, data: ret};
}

async function queryDeviceList(apikey) {
    let ret = null;
    try {
        ret = await deviceRepo.findDeviceListByApikey(apikey);
    } catch (err) {
        return {success: false , code: AppError.DATA_ERROR_CODE, msg: AppError.DATA_ERROR_MSG};
    }
    return {success: true, data: ret};
}

async function queryDeviceState(apikey, deviceid) {
    let data = null;
    try {
        data = await deviceRepo.findDeviceByDeviceid(deviceid);
    } catch (err) {
        return {success: false , code: AppError.DATA_ERROR_CODE, msg: AppError.DATA_ERROR_MSG};
    }
    
    if(!data) {
        return {success: false, code: AppError.NO_RESOURCES_ERROR_CODE, msg: AppError.NO_RESOURCES_ERROR_MSG};
    }

    if(data.apikey !== apikey) {
        return {success: false, code: AppError.FORBIDDEN_ERROR_CODE, msg: AppError.FORBIDDEN_ERROR_MSG};
    }
    
    if(data.online === false) {
        return {success: false, code: BusinessError.DEVICE_OFFLINE_ERROR_CODE, msg: BusinessError.DEVICE_OFFLINE_ERROR_MSG};
    }
    return {success: true, data: {state: data.state}};
}

async function changeDeviceState(apikey, deviceid, state) {
    let exist = null;
    try {
        exist = await deviceRepo.findDeviceByDeviceid(deviceid);
    } catch (err) {
        return {success: false, code: AppError.DATA_ERROR_CODE, msg: AppError.DATA_ERROR_MSG};
    }
    if(!exist) {
        return {success: false, code: AppError.NO_RESOURCES_ERROR_CODE, msg: AppError.NO_RESOURCES_ERROR_MSG};
    }
    if(exist.apikey !== apikey) {
        return {success: false, code: AppError.FORBIDDEN_ERROR_CODE, msg: AppError.FORBIDDEN_ERROR_MSG};
    }
    let updated = null;
    try {
        updated = await deviceRepo.updateDeviceState(deviceid, state);
    } catch (err) {
        return {success: false, code: AppError.DATA_ERROR_CODE, msg: AppError.DATA_ERROR_MSG};
    }
    return {success: true, data: {deviceid: updated.deviceid}};
}


async function deleteDevice(apikey, deviceid) {
    let exist = null;
    try {
        exist = await deviceRepo.findDeviceByDeviceid(deviceid);
    } catch (err) {
        return {success: false, code: AppError.DATA_ERROR_CODE, msg: AppError.DATA_ERROR_MSG};
    }
    if(!exist) {
        return {success: false, code: AppError.NO_RESOURCES_ERROR_CODE, msg: AppError.NO_RESOURCES_ERROR_MSG};
    }
    if(exist.apikey !== apikey) {
        return {success: false, code: AppError.FORBIDDEN_ERROR_CODE, msg: AppError.FORBIDDEN_ERROR_MSG};
    }

    try {
        await deviceRepo.deleteDevice(deviceid);
    } catch (err) {
        return {success: false, code: AppError.DATA_ERROR_CODE, msg: AppError.DATA_ERROR_MSG};
    }
    return {success: true, data: {}};
}

module.exports = {createDevice, queryDeviceList, queryDeviceState, changeDeviceState, deleteDevice};