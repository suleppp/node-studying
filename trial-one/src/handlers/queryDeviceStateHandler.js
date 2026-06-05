const deviceService = require('../services/deviceService');


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