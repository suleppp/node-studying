'use strict';

const { DependencyUnavailableError } = require('./errors');

class UserRepository {
  constructor(mongo) {
    this.mongo = mongo;
  }

  async findById(id) {
    try {
      return await this.mongo.findById(id);
    } catch (error) {
      throw new DependencyUnavailableError(`repository failed to find user ${id}`, { cause: error });
    }
  }

  async updateName(id, name) {
    try {
      return await this.mongo.updateName(id, name);
    } catch (error) {
      throw new DependencyUnavailableError(`repository failed to update user ${id}`, { cause: error });
    }
  }
}

module.exports = { UserRepository };
