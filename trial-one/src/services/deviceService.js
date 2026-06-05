const device = require('../models/device');
const AppError = require('../errors/AppError');
const BusinessError = require('../errors/BusinessError');
const deviceRepo = require('../repositories/deviceRepo');


async function createDevice(data) {
    await deviceRepo.createDevice(data);
}

async function queryDeviceList(apikey) {
    return await deviceRepo.findDeviceListByApikey(apikey);
}

async function queryDeviceState(apikey, deviceid) {
    const data = await deviceRepo.findDeviceByDeviceid(deviceid);
    if(!data) {
        throw new AppError(AppError.NO_RESOURCES_ERROR_CODE, AppError.NO_RESOURCES_ERROR_MSG);
    }

    if(data.apikey !== apikey) {
        throw new AppError(AppError.FORBIDDEN_ERROR_CODE, AppError.FORBIDDEN_ERROR_CODE);
    }
    
    if(data.online === false) {
        throw new BusinessError(BusinessError.DEVICE_OFFLINE_ERROR_CODE, BusinessError.DEVICE_OFFLINE_ERROR_MSG);
    }
    return {state: data.state};
}

async function changeDeviceState(apikey, deviceid, state) {
    const exist = await deviceRepo.findDeviceByDeviceid(deviceid);
    if(!exist) {
        throw new AppError(AppError.NO_RESOURCES_ERROR_CODE, AppError.NO_RESOURCES_ERROR_MSG);
    }
    if(existing.apikey !== apikey) {
        throw new AppError(AppError.FORBIDDEN_ERROR_CODE, AppError.FORBIDDEN_ERROR_MSG);
    }
    const updated = await deviceRepo.updateDeviceState(deviceid, state);
    return { deviceid: updated.deviceid };
}


async function deleteDevice(apikey, deviceid) {
    const exist = await deviceRepo.findDeviceByDeviceid(deviceid);
    if(!exist) {
        throw new AppError(AppError.NO_RESOURCES_ERROR_CODE, AppError.NO_RESOURCES_ERROR_MSG);
    }
    if(existing.apikey !== apikey) {
        throw new AppError(AppError.FORBIDDEN_ERROR_CODE, AppError.FORBIDDEN_ERROR_MSG);
    }
    await deviceRepo.deleteDevice(deviceid);
}

module.exports = {createDevice, queryDeviceList, queryDeviceState, changeDeviceState, deleteDevice};