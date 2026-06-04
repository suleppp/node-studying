const Fastify = require('fastify')
const mongoPlugin = require('./plugins/ioredis');
const redisPlugin = require('./plugins/mongo');
const responsePlugin = require('./plugins/response');
const {requestLogWithBody, /** requestLogWithoutBody,*/ responseLog} = require('./utils/logger');

const app = Fastify({logger: true});

// 插件挂载
app.register(mongoPlugin);
app.register(redisPlugin);

// 全局错误处理，setErrorHandler只能设置一次
app.setErrorHandler(async (error, request, reply) => {
    if (error instanceof BusinessError) {
        reply.send({
            error: error.error,
            msg: error.message,
            data: {}
        })
    }
    else if (error instanceof AppError) {
        reply.code(error.error).send({
            error: error.error,
            msg: error.message,
            data: {}
        })
    }
    else {
        reply.send({
            error: 500,
            msg: error.message || "未知错误",
            data: {}
        })
    } 
});

// 全局返回
app.register(responsePlugin);

// 日志钩子
app.addHook("onRequest", async (request, reply) => {
    requestLogWithoutBody(request, reply);
})

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
    } catch (error) {
        console.error("服务启动失败：", error.message);
    }
}

start();