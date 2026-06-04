const {createDeviceSchema, queryDeviceListSchema, queryDeviceStateSchema, changeDeviceStateSchema, deleteDeviceSchema} = require('../schemas/device');
const deviceService = require('../services/deviceService');


async function deviceRoutes(fastify, options) {
    fastify.post('/', {schema: createDeviceSchema}, createDevice);
    fastify.get('/list', {schema: queryDeviceListSchema}, queryDeviceList);
    fastify.get('/state', {schema: queryDeviceStateSchema}, queryDeviceState);
    fastify.put('/state', {schema: changeDeviceStateSchema}, changeDeviceState);
    fastify.delete('/', {schema: deleteDeviceSchema}, deleteDevice);
}


module.exports = deviceRoutes;