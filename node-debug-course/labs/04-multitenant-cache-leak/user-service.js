'use strict';

class UserService {
  constructor({ database, cache }) {
    this.database = database;
    this.cache = cache;
  }

  cacheKey(userId) {
    return `user:${userId}`;
  }

  async getById(tenantId, userId) {
    const key = this.cacheKey(userId);
    const raw = await this.cache.get(key);
    if (raw !== null) {
      return { user: JSON.parse(raw), source: 'cache' };
    }

    const user = await this.database.findById(tenantId, userId);
    if (user !== null) {
      await this.cache.set(key, JSON.stringify(user));
    }
    return { user, source: 'database' };
  }
}

module.exports = { UserService };

