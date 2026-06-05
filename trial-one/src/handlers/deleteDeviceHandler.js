const deviceService = require('../services/deviceService');


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