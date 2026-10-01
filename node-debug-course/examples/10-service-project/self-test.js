'use strict';

const assert = require('node:assert/strict');
const { startApplication } = require('./server');
const { getJson } = require('./http-client');

const quietLogger = {
  log() {},
  warn() {},
  error() {},
};

async function main() {
  const application = await startApplication({ port: 0, logger: quietLogger });
  const port = application.address.port;

  try {
    const first = await getJson({ port, path: '/users/u1', requestId: 'test-1' });
    const second = await getJson({ port, path: '/users/u1', requestId: 'test-2' });
    const missing = await getJson({ port, path: '/users/nope', requestId: 'test-3' });

    assert.equal(first.statusCode, 200);
    assert.equal(first.body.meta.source, 'mongo');
    assert.equal(second.statusCode, 200);
    assert.equal(second.body.meta.source, 'cache');
    assert.deepEqual(second.body.data, first.body.data);
    assert.equal(missing.statusCode, 404);

    const mongoFinds = application.mongo.commands.filter((entry) => entry.command === 'findById');
    assert.equal(mongoFinds.filter((entry) => entry.id === 'u1').length, 1);
    assert.equal(application.redis.commands.filter((entry) => entry.command === 'GET').length, 3);

    const updated = await application.userService.updateName('u1', 'Grace', { requestId: 'test-update' });
    assert.equal(updated.name, 'Grace');
    const afterUpdate = await getJson({ port, path: '/users/u1', requestId: 'test-4' });
    assert.equal(afterUpdate.body.data.name, 'Grace');
    assert.equal(afterUpdate.body.meta.source, 'mongo');

    application.mongo.status = 'closed';
    const unavailable = await getJson({ port, path: '/users/dependency-failure', requestId: 'test-5' });
    assert.equal(unavailable.statusCode, 503);
    assert.equal(unavailable.body.error, 'dependency unavailable');
    application.mongo.status = 'ready';

    console.log('service self-test passed');
  } finally {
    await application.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
