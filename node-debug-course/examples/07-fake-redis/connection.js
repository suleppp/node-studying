'use strict';

const { FakeRedis } = require('./fake-redis');

let client;
let connecting;

function connect() {
  if (client) return Promise.resolve(client);
  if (connecting) return connecting;

  const candidate = new FakeRedis();
  connecting = candidate.connect()
    .then(() => {
      client = candidate;
      return client;
    })
    .finally(() => {
      connecting = undefined;
    });

  return connecting;
}

function getClient() {
  if (!client || client.status !== 'ready') {
    throw new Error('Redis client has not been connected');
  }
  return client;
}

async function close() {
  if (!client) return;
  await client.quit();
  client = undefined;
}

module.exports = { connect, getClient, close };

