const deviceService = require('../services/deviceService');

async function changeDeviceState(request, reply) {
    const {apikey, deviceid, state} = request.body;
    const ret = await deviceService.changeDeviceState(apikey, deviceid, state);
    if(ret.success) {
        return reply.success(ret.data);
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

const changeDeviceStateSchema = {
    headers,
    body: {
        type: 'object',
        required: ['apikey', 'deviceid', 'state'],
        properties: {
            apikey: {type: 'string'},
            deviceid: {type: 'string'},
            state: {type: 'object'}
        }
    }
}

module.exports = {changeDeviceState, changeDeviceStateSchema};