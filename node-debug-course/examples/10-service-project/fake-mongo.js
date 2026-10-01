'use strict';

const { setTimeout: delay } = require('node:timers/promises');

class FakeMongo {
  constructor(seed = [], { latencyMs = 12 } = {}) {
    this.status = 'idle';
    this.latencyMs = latencyMs;
    this.documents = new Map(seed.map((document) => [document.id, { ...document }]));
    this.commands = [];
  }

  async connect() {
    if (this.status === 'ready') return this;
    if (this.status !== 'idle') {
      throw new Error(`cannot connect Mongo while status=${this.status}`);
    }

    this.status = 'connecting';
    await delay(this.latencyMs);
    this.status = 'ready';
    return this;
  }

  assertReady() {
    if (this.status !== 'ready') {
      throw new Error(`Mongo is not ready: status=${this.status}`);
    }
  }

  async findById(id) {
    this.assertReady();
    await delay(this.latencyMs);
    this.commands.push({ command: 'findById', id });
    const document = this.documents.get(id);
    return document ? { ...document } : null;
  }

  async updateName(id, name) {
    this.assertReady();
    await delay(this.latencyMs);
    this.commands.push({ command: 'updateName', id, name });
    const document = this.documents.get(id);
    if (!document) return null;
    document.name = name;
    return { ...document };
  }

  async close() {
    if (this.status === 'closed') return;
    await delay(this.latencyMs);
    this.status = 'closed';
  }
}

module.exports = { FakeMongo };

