'use strict';

const { setTimeout: delay } = require('node:timers/promises');

class FakeRedis {
  constructor({ latencyMs = 5 } = {}) {
    this.latencyMs = latencyMs;
    this.status = 'idle';
    this.store = new Map();
    this.commands = [];
  }

  async connect() {
    if (this.status === 'ready') return this;
    if (this.status !== 'idle') {
      throw new Error(`cannot connect while status=${this.status}`);
    }

    this.status = 'connecting';
    await delay(this.latencyMs);
    this.status = 'ready';
    return this;
  }

  assertReady() {
    if (this.status !== 'ready') {
      throw new Error(`Redis is not ready: status=${this.status}`);
    }
  }

  async get(key) {
    this.assertReady();
    await delay(this.latencyMs);
    this.commands.push({ command: 'GET', key });

    const entry = this.store.get(key);
    if (!entry) return null;

    if (entry.expiresAt !== null && entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  async set(key, value, { ttlMs = null } = {}) {
    this.assertReady();
    await delay(this.latencyMs);
    this.commands.push({ command: 'SET', key, ttlMs });
    this.store.set(key, {
      value: String(value),
      expiresAt: ttlMs === null ? null : Date.now() + ttlMs,
    });
  }

  async del(key) {
    this.assertReady();
    await delay(this.latencyMs);
    this.commands.push({ command: 'DEL', key });
    return this.store.delete(key) ? 1 : 0;
  }

  async quit() {
    if (this.status === 'closed') return;
    await delay(this.latencyMs);
    this.status = 'closed';
  }
}

module.exports = { FakeRedis };

