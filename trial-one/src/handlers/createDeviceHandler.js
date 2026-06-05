const deviceService = require('../services/deviceService');

/**
 * 新增设备
 * @param {string} request.body.apikey 用户唯一标识 
 * @param {string} request.body.deviceid 设备id
 * @param {boolean} request.body.online 设备是否在线
 * @param {object} request.body.state 设备状态  
 */
async function createDevice(request, reply) {
    const {apikey, deviceid, online, state} = request.body;
    const param = {apikey, deviceid, online, state};
    const ret = await deviceService.createDevice(param);
    if(ret.success) {
        return reply.success({});
    }
    return reply.fail(ret.code, ret.msg);
}

const headers = {
    type: 'object',
    required: ['content-type'],
    properties: {
        'content-type': {
            type: 'string',
            pattern: 'application/json'
        }
    }
}

const createDeviceSchema = {
    headers,
    body: {
        type: 'object',
        required: ['apikey', 'deviceid', 'online', 'state'],
        properties: {
            apikey: {type: 'string'},
            deviceid: {type: 'string'},
            online: {type: 'boolean'},
            state: {type: 'object'}
        }
    }
}

module.exports = {createDevice, createDeviceSchema};