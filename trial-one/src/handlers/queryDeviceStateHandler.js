const deviceService = require('../services/deviceService');

/**
 * 查询单个设备的状态，离线设备不可查询
 * @param {string} request.body.apikey 用户唯一标识 
 * @param {string} request.body.deviceid 设备id  
 */
async function queryDeviceState(request, reply) {
    const {apikey, deviceid} = request.query;
    const ret = await deviceService.queryDeviceState(apikey, deviceid);
    if(ret.success) {
        return reply.success(ret.data);
    }
    return reply.fail(ret.code, ret.msg);
}


const queryDeviceStateSchema = {
    querystring: {
        type: 'object',
        required: ['apikey', 'deviceid'],
        properties: {
            apikey: {type: 'string'},
            deviceid: {type: 'string'}
        }
    }
}

module.exports = {queryDeviceState, queryDeviceStateSchema};