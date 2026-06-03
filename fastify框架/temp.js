const Fastify = require('fastify')
const fastify = Fastify({ logger: true });

// 在路由或插件里
fastify.log.info('服务启动');
fastify.log.error('出错了');