'use strict';

const { setTimeout: delay } = require('node:timers/promises');

class FakeDatabase {
  constructor() {
    this.users = new Map([
      ['acme:u1', { tenantId: 'acme', id: 'u1', name: 'Ada' }],
      ['beta:u1', { tenantId: 'beta', id: 'u1', name: 'Lin' }],
      ['acme:u2', { tenantId: 'acme', id: 'u2', name: 'Grace' }],
    ]);
    this.commands = [];
  }

  async findById(tenantId, userId) {
    await delay(5);
    this.commands.push({ command: 'findById', tenantId, userId });
    const user = this.users.get(`${tenantId}:${userId}`);
    return user ? { ...user } : null;
  }
}

module.exports = { FakeDatabase };

