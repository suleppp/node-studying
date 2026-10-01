'use strict';

const { FakeDatabase } = require('./fake-database');
const { InstrumentedCache } = require('./instrumented-cache');
const { UserService } = require('./user-service');

async function main() {
  const database = new FakeDatabase();
  const cache = new InstrumentedCache();
  const service = new UserService({ database, cache });

  const acme = await service.getById('acme', 'u1');
  const beta = await service.getById('beta', 'u1');

  console.log('runtime', {
    pid: process.pid,
    ppid: process.ppid,
    cwd: process.cwd(),
    entry: process.argv[1],
  });
  console.log('responses', { acme, beta });
  console.log('cache commands', cache.commands);
  console.log('database commands', database.commands);

  if (beta.user.tenantId !== 'beta') {
    console.log('BUG REPRODUCED: beta received data belonging to', beta.user.tenantId);
  } else {
    console.log('Bug was fixed; now run the full isolation regression matrix.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

