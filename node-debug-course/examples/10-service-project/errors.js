'use strict';

class DependencyUnavailableError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = 'DependencyUnavailableError';
    this.statusCode = 503;
  }
}

module.exports = { DependencyUnavailableError };

