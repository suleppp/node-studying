'use strict';

const { setTimeout: delay } = require('node:timers/promises');

async function repositoryFind(id) {
  await delay(10);
  return { id, name: 'Ada' }; // 在此暂停，查看异步调用链。
}

async function serviceGet(id) {
  const user = await repositoryFind(id); // 分别在 await 前后暂停。
  return { ...user, displayName: user.name.toUpperCase() };
}

async function controller(id) {
  const result = await serviceGet(id);
  console.log('controller result', result);
}

controller('u1').catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

