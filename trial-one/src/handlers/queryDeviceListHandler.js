const deviceService = require('../services/deviceService');

/**
 * 通过apikey查询设备列表
 * @param {string} request.body.apikey 用户唯一标识   
 */
async function queryDeviceList(request, reply) {
    const apikey = request.query.apikey;
    const ret = await deviceService.queryDeviceList(apikey)
    if(ret.success) {
        return reply.success(ret.data);
    }
    return reply.fail(ret.code, ret.msg);
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


module.exports = {queryDeviceList, queryDeviceListSchema};