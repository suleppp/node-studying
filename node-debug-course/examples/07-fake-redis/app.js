'use strict';

const { setTimeout: delay } = require('node:timers/promises');
const connection = require('./connection');

async function main() {
  const [first, second] = await Promise.all([
    connection.connect(),
    connection.connect(),
  ]);

  console.log('shared connection:', first === second);
  console.log('status:', first.status);

  const key = 'user:u1';
  const miss = await first.get(key);
  console.log('first GET:', miss);

  await first.set(key, JSON.stringify({ id: 'u1', name: 'Ada' }), { ttlMs: 40 });
  const hit = await first.get(key);
  console.log('second GET:', JSON.parse(hit));

  await delay(50);
  const expired = await first.get(key);
  console.log('after TTL:', expired);
  console.log('commands:', first.commands);

  await connection.close();
  console.log('closed:', first.status);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

