const deviceService = require('../services/deviceService');

async function createDevice(request, reply) {
    const {apikey, deviceid, online, state} = request.body;
    const param = {apikey, deviceid, online, state};
    const ret = await deviceService.createDevice(param);
    if(ret.success) {
        return reply.success(ret.data);
    }
    return reply.fail(ret.code, ret.msg);
}

async function queryDeviceList(request, reply) {
    const apikey = request.query.apikey;
    const ret = await deviceService.queryDeviceList(apikey)
    if(ret.success) {
        return reply.success(ret.data);
    }
    return reply.fail(ret.code, ret.msg);
}

async function queryDeviceState(request, reply) {
    const {apikey, deviceid} = request.query;
    const ret = await deviceService.queryDeviceState(apikey, deviceid);
    if(ret.success) {
        return reply.success(ret.data);
    }
    return reply.fail(ret.code, ret.msg);
}

async function changeDeviceState(request, reply) {
    const {apikey, deviceid, state} = request.body;
    const ret = await deviceService.changeDeviceState(apikey, deviceid, state);
    if(ret.success) {
        return reply.success(ret.data);
    }
    return reply.fail(ret.code, ret.msg);
}

async function deleteDevice(request, reply) {
    const {apikey, deviceid} = request.query;
    const ret = await deviceService.deleteDevice(apikey, deviceid)
    if(ret.success) {
        return reply.success(ret.data);
    }
    return reply.fail(ret.code, ret.msg);
}

// ===== Schema =====

const createDeviceSchema = {
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

const queryDeviceListSchema = {
    querystring: {
        type: 'object',
        required: ['apikey'],
        properties: {
            apikey: {type: 'string'}
        }
    }
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

const changeDeviceStateSchema = {
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

module.exports = {
    createDevice: {
        schema: createDeviceSchema,
        handler: createDevice
    },

    queryDeviceList: {
        schema: queryDeviceListSchema,
        handler: queryDeviceList
    },

    queryDeviceState: {
        schema: queryDeviceStateSchema,
        handler: queryDeviceState
    },

    changeDeviceState: {
        schema: changeDeviceStateSchema,
        handler: changeDeviceState
    },

    deleteDevice: {
        schema: deleteDeviceSchema,
        handler: deleteDevice
    }
};