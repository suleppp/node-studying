'use strict';

class InstrumentedCache {
  constructor() {
    this.store = new Map();
    this.commands = [];
  }

  async get(key) {
    const value = this.store.get(key) ?? null;
    this.commands.push({ command: 'GET', key, value });
    return value;
  }

  async set(key, value) {
    this.commands.push({ command: 'SET', key, value });
    this.store.set(key, value);
  }
}

const cache = new InstrumentedCache();
let databaseReads = 0;

async function readDatabase(tenantId, userId) {
  databaseReads += 1;
  return { tenantId, id: userId, name: 'Ada' };
}

function readKey(tenantId, userId) {
  return `tenant:${tenantId}:user:${userId}`;
}

function writeKey(tenantId, userId) {
  return `tenant:${tenantId}:users:${userId}`;
}

async function getUser(tenantId, userId) {
  const raw = await cache.get(readKey(tenantId, userId));
  if (raw !== null) return JSON.parse(raw);

  const user = await readDatabase(tenantId, userId);
  await cache.set(writeKey(tenantId, userId), JSON.stringify(user));
  return user;
}

async function main() {
  await getUser('acme', 'u1');
  await getUser('acme', 'u1');

  console.log('commands', cache.commands);
  console.log('databaseReads', databaseReads);
  if (databaseReads !== 1) {
    console.log('BUG REPRODUCED: expected one database read, actual=', databaseReads);
  } else {
    console.log('Bug was fixed; add cross-tenant regression coverage.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

