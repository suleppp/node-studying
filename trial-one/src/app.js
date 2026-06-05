const Fastify = require('fastify')
const mongoPlugin = require('./plugins/ioredis');
const redisPlugin = require('./plugins/mongo');
const responsePlugin = require('./plugins/response');
const {requestLogWithBody, /** requestLogWithoutBody,*/ responseLog} = require('./utils/logger');
const deviceRoutes = require('./routes/device');
const BusinessError = require('./errors/BusinessError');
const AppError = require('./errors/AppError');
const DataError = require('./errors/DataError');

const app = Fastify({logger: true});

// 插件挂载
app.register(mongoPlugin);
app.register(redisPlugin);
app.register(deviceRoutes, {prefix: '/api/devices'});

// 全局错误处理，setErrorHandler只能设置一次
app.setErrorHandler(async (error, request, reply) => {
    console.log("【全局错误】", error);
    if (error.statusCode === 400) {
        reply.code(400).send({error: 400, msg: '参数错误', data: {}});
    } else {
        reply.code(500).send({error: 500, msg: error.message || '未知错误', data: {}});
    }
});

// 全局返回
app.register(responsePlugin);

// 日志钩子
// app.addHook("onRequest", async (request, reply) => {
//     requestLogWithoutBody(request, reply);
// })

app.addHook("preHandler", async (request, reply) => {
    requestLogWithBody(request, reply);
})

app.addHook("onSend", async (request, reply, payload) => {
    responseLog(request, reply, payload);
})

async function start () {
    try {
        await app.listen({port: 3000});
        console.log("服务启动成功：http://localhost:3000");
        console.log("本地日志：C:/Users/yigan/AppData/Local/Temp/logger.log")
    } catch (error) {
        console.error("服务启动失败：", error.message);
    }
}

start();