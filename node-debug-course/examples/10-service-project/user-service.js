'use strict';

class UserService {
  constructor({ repository, redis, cacheTtlMs = 1_000, logger = console }) {
    this.repository = repository;
    this.redis = redis;
    this.cacheTtlMs = cacheTtlMs;
    this.logger = logger;
  }

  cacheKey(id) {
    return `user:${id}`;
  }

  async getById(id, { requestId = 'unknown' } = {}) {
    const key = this.cacheKey(id);
    let raw = null;

    try {
      raw = await this.redis.get(key);
    } catch (error) {
      this.logger.warn({ requestId, key, message: error.message }, 'cache read failed');
    }

    if (raw !== null) {
      return { user: JSON.parse(raw), source: 'cache' };
    }

    const user = await this.repository.findById(id);
    if (user === null) {
      return { user: null, source: 'mongo' };
    }

    try {
      await this.redis.set(key, JSON.stringify(user), { ttlMs: this.cacheTtlMs });
    } catch (error) {
      this.logger.warn({ requestId, key, message: error.message }, 'cache write failed');
    }

    return { user, source: 'mongo' };
  }

  async updateName(id, name, { requestId = 'unknown' } = {}) {
    const user = await this.repository.updateName(id, name);
    if (user === null) return null;

    const key = this.cacheKey(id);
    try {
      await this.redis.del(key);
    } catch (error) {
      this.logger.warn({ requestId, key, message: error.message }, 'cache invalidation failed');
    }

    return user;
  }
}

module.exports = { UserService };

