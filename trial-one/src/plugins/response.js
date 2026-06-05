const fp = require('fastify-plugin');


async function responsePlugin(fastify, options) {
    fastify.decorateReply('success', function(data, msg = "") {
        this.code(200).send({
            error: 0,
            msg: msg,
            data: data
        })
    });

    // 这里throw出去的错误不能被全局异常处理器捕捉到
    fastify.decorateReply('fail', function(code, msg = "未知异常") {
        this.code(200).send({
            error: code,
            msg: msg,
            data: {}
        })
    })
}

module.exports = fp(responsePlugin);