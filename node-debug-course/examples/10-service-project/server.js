'use strict';

const http = require('node:http');
const { randomUUID } = require('node:crypto');
const { FakeMongo } = require('./fake-mongo');
const { FakeRedis } = require('./fake-redis');
const { UserRepository } = require('./user-repository');
const { UserService } = require('./user-service');

function writeJson(response, statusCode, body) {
  const payload = JSON.stringify(body);
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(payload),
  });
  response.end(payload);
}

function parseUserId(pathname) {
  const match = /^\/users\/([^/]+)$/.exec(pathname);
  if (!match) return null;

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

function createHttpServer({ userService, mongo, redis, logger = console }) {
  return http.createServer(async (request, response) => {
    const requestId = request.headers['x-request-id'] || randomUUID();
    const url = new URL(request.url, 'http://localhost');

    try {
      if (request.method === 'GET' && url.pathname === '/debug/stats') {
        writeJson(response, 200, {
          requestId,
          pid: process.pid,
          mongo: { status: mongo.status, commands: mongo.commands },
          redis: { status: redis.status, commands: redis.commands },
        });
        return;
      }

      const id = parseUserId(url.pathname);
      if (request.method !== 'GET' || id === null) {
        writeJson(response, 404, { requestId, error: 'route not found' });
        return;
      }

      if (!/^[a-zA-Z0-9_-]{1,40}$/.test(id)) {
        writeJson(response, 400, { requestId, error: 'invalid user id' });
        return;
      }

      const result = await userService.getById(id, { requestId });
      if (result.user === null) {
        writeJson(response, 404, { requestId, error: 'user not found', meta: { source: result.source } });
        return;
      }

      writeJson(response, 200, {
        requestId,
        data: result.user,
        meta: { source: result.source },
      });
    } catch (error) {
      logger.error({ requestId, error }, 'request failed');
      const statusCode = error.statusCode === 503 ? 503 : 500;
      const message = statusCode === 503 ? 'dependency unavailable' : 'internal error';
      writeJson(response, statusCode, { requestId, error: message });
    }
  });
}

async function listen(server, port, host) {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, resolve);
  });
}

async function closeServer(server) {
  if (!server.listening) return;
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

async function startApplication({ port = 3000, host = '127.0.0.1', logger = console } = {}) {
  const mongo = new FakeMongo([
    { id: 'u1', name: 'Ada', role: 'admin' },
    { id: 'u2', name: 'Lin', role: 'reader' },
  ]);
  const redis = new FakeRedis();

  await mongo.connect();
  await redis.connect();

  const repository = new UserRepository(mongo);
  const userService = new UserService({ repository, redis, logger });
  const server = createHttpServer({ userService, mongo, redis, logger });
  await listen(server, port, host);

  const address = server.address();
  logger.log('service listening', { pid: process.pid, host: address.address, port: address.port });

  let closePromise;
  async function close() {
    if (closePromise) return closePromise;
    closePromise = (async () => {
      await closeServer(server);
      await Promise.all([redis.close(), mongo.close()]);
    })();
    return closePromise;
  }

  return { server, mongo, redis, repository, userService, address, close };
}

async function main() {
  const port = Number.parseInt(process.env.PORT || '3000', 10);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error(`invalid PORT: ${process.env.PORT}`);
  }

  const application = await startApplication({ port });
  let closing = false;

  async function shutdown(signal) {
    if (closing) return;
    closing = true;
    console.log('shutdown started', { signal, pid: process.pid });

    const forceTimer = setTimeout(() => {
      console.error('shutdown timed out');
      process.exit(1);
    }, 2_000);
    forceTimer.unref();

    await application.close();
    console.log('shutdown complete');
  }

  process.once('SIGINT', () => {
    shutdown('SIGINT').catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  });
  process.once('SIGTERM', () => {
    shutdown('SIGTERM').catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  });
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = { createHttpServer, parseUserId, startApplication };
