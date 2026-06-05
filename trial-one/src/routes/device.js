//const deviceHandler = require('../handlers/device');
const { createDevice, createDeviceSchema } = require('../handlers/createDeviceHandler');
const { queryDeviceList, queryDeviceListSchema } = require('../handlers/queryDeviceListHandler');
const { changeDeviceState, changeDeviceStateSchema } = require('../handlers/changeDeviceStateHandler');
const { queryDeviceState, queryDeviceStateSchema } = require('../handlers/queryDeviceStateHandler');
const { deleteDevice, deleteDeviceSchema } = require('../handlers/deleteDeviceHandler');

async function deviceRoutes(fastify, options) {
    fastify.post('/', {schema: createDeviceSchema}, createDevice);
    fastify.get('/list', {schema: queryDeviceListSchema}, queryDeviceList);
    fastify.get('/state', {schema: queryDeviceStateSchema}, queryDeviceState);
    fastify.put('/state', {schema: changeDeviceStateSchema}, changeDeviceState);
    fastify.delete('/', {schema: deleteDeviceSchema}, deleteDevice);
}

module.exports = deviceRoutes;