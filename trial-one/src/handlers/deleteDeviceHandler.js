const deviceService = require('../services/deviceService');

/**
 * 删除设备
 * @param {string} request.body.apikey 用户唯一标识 
 * @param {string} request.body.deviceid 设备id  
 */
async function deleteDevice(request, reply) {
    const {apikey, deviceid} = request.query;
    const ret = await deviceService.deleteDevice(apikey, deviceid)
    if(ret.success) {
        return reply.success({});
    }
    return reply.fail(ret.code, ret.msg);
}



const deleteDeviceSchema = {
    querystring: {
        type: 'object',
        required: ['apikey', 'deviceid'],
        properties: {
            apikey: {type: 'string'},
            deviceid: {type: 'string'}
        }
    }
}

module.exports = {deleteDevice, deleteDeviceSchema};