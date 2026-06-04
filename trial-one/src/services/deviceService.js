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

async function queryDeviceState(apikey, deviceid) {
    const data = await device.findOne({apikey, deviceid});
    if(!data) {
        throw new AppError(AppError.NO_RESOURCES_ERROR_CODE, AppError.NO_RESOURCES_ERROR_MSG);
    }
    if(data.online === false) {
        throw new BusinessError(BusinessError.DEVICE_OFFLINE_ERROR_CODE, BusinessError.DEVICE_OFFLINE_ERROR_MSG);
    }
    const result = {};
    result.state = data.state;
    return result;
}

async function changeDeviceState(param) {
    const {apikey, deviceid, state} = param;
    const updated = await device.findOneAndUpdate(
        {apikey, deviceid},
        {
            $set: {state: state}
        },
        {
            new: true,
            runValidators: true
        }
    );
    if (!updated) {
        throw new AppError(AppError.NO_RESOURCES_ERROR_CODE, AppError.NO_RESOURCES_ERROR_MSG);
    }
    const result = {};
    result.deviceid = updated.deviceid;
    return result;
}

async function deleteDevice(apikey, deviceid) {
    const data = await device.deleteOne({apikey, deviceid});
    if(data.deletedCount === 0) {
        throw new AppError(AppError.NO_RESOURCES_ERROR_CODE, AppError.NO_RESOURCES_ERROR_MSG);
    }
}

module.exports = {createDevice, queryDeviceList, queryDeviceState, changeDeviceState, deleteDevice};