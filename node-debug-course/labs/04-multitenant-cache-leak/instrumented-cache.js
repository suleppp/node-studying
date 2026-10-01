'use strict';

const { setTimeout: delay } = require('node:timers/promises');

class InstrumentedCache {
  constructor() {
    this.store = new Map();
    this.commands = [];
  }

  async get(key) {
    await delay(2);
    const value = this.store.get(key) ?? null;
    this.commands.push({ command: 'GET', key, value });
    return value;
  }

  async set(key, value) {
    await delay(2);
    this.commands.push({ command: 'SET', key, value });
    this.store.set(key, value);
  }
}

module.exports = { InstrumentedCache };

