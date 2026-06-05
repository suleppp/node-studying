const deviceHandler = require('../handlers/device');

async function deviceRoutes(fastify, options) {
    fastify.post('/', {schema: deviceHandler.createDevice.schema}, deviceHandler.createDevice.handler);
    fastify.get('/list', {schema: deviceHandler.queryDeviceList.schema}, deviceHandler.queryDeviceList.handler);
    fastify.get('/state', {schema: deviceHandler.queryDeviceState.schema}, deviceHandler.queryDeviceState.handler);
    fastify.put('/state', {schema: deviceHandler.changeDeviceState.schema}, deviceHandler.changeDeviceState.handler);
    fastify.delete('/', {schema: deviceHandler.deleteDevice.schema}, deviceHandler.deleteDevice.handler);
}

module.exports = deviceRoutes;