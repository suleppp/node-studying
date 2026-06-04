const {createDeviceSchema, queryDeviceListSchema, queryDeviceStateSchema, changeDeviceStateSchema, deleteDeviceSchema} = require('../schemas/device');
const deviceService = require('../services/deviceService');
async function deviceRoutes(fastify, options) {
    fastify.post('/', {schema: createDeviceSchema}, createDevice);
    fastify.get('/list', {schema: queryDeviceListSchema}, queryDeviceList);
    fastify.get('/state', {schema: queryDeviceStateSchema}, queryDeviceState);
    fastify.put('/state', {schema: changeDeviceStateSchema}, changeDeviceState);
    fastify.delete('/', {schema: deleteDeviceSchema}, deleteDevice);
}

async function createDevice(request, reply) {
    const {apikey, deviceid, online, state} = request.body;
    const param = {apikey, deviceid, online, state};
    await deviceService.createDevice(param);
    reply.success();
}

async function queryDeviceList(request, reply) {
    const apikey = request.query.apikey;
    reply.success(await deviceService.queryDeviceList(apikey));
}

async function queryDeviceState(request, reply) {

}

async function changeDeviceState(request, reply) {

}

async function deleteDevice(request, reply) {

}

module.exports = deviceRoutes;