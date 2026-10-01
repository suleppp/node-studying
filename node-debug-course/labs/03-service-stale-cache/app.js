'use strict';

class FakeDatabase {
  constructor() {
    this.users = new Map([['u1', { id: 'u1', name: 'Ada' }]]);
    this.commands = [];
  }

  async findById(id) {
    this.commands.push({ command: 'findById', id });
    const user = this.users.get(id);
    return user ? { ...user } : null;
  }

  async updateName(id, name) {
    this.commands.push({ command: 'updateName', id, name });
    const user = this.users.get(id);
    if (!user) return null;
    user.name = name;
    return { ...user };
  }
}

class FakeCache {
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

  async del(key) {
    this.commands.push({ command: 'DEL', key });
    return this.store.delete(key) ? 1 : 0;
  }
}

class UserService {
  constructor({ database, cache }) {
    this.database = database;
    this.cache = cache;
  }

  key(id) {
    return `user:${id}`;
  }

  async getById(id) {
    const raw = await this.cache.get(this.key(id));
    if (raw !== null) return { user: JSON.parse(raw), source: 'cache' };

    const user = await this.database.findById(id);
    if (user !== null) await this.cache.set(this.key(id), JSON.stringify(user));
    return { user, source: 'database' };
  }

  async updateName(id, name) {
    const updated = await this.database.updateName(id, name);
    return updated;
  }
}

async function main() {
  const database = new FakeDatabase();
  const cache = new FakeCache();
  const service = new UserService({ database, cache });

  const before = await service.getById('u1');
  const updated = await service.updateName('u1', 'Grace');
  const after = await service.getById('u1');

  console.log({ before, updated, after });
  console.log('database commands', database.commands);
  console.log('cache commands', cache.commands);

  if (updated.name === 'Grace' && after.user.name === 'Ada') {
    console.log('BUG REPRODUCED: database is Grace but cached response is Ada');
  } else {
    console.log('Bug was fixed; add failure-path and concurrency regression tests.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

