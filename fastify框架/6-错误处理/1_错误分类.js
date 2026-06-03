const Fastify = require('fastify');

const app = Fastify({logger: false});

class BusinessError extends Error {
    constructor(msg, code = 400) {
        super(msg);
        this.name = "BusinessError";
        this.code = code;
    }
}


// 全局错误处理器
app.setErrorHandler(async (error, request, reply) => {
    // schema 校验错误，fastify自动抛出
    if(error.validation) {
        return reply.code(400).send({
            code: -1,
            msg: "schema校验错误",
            detail: error.validation
        });
    }

    // 业务错误
    if (error instanceof BusinessError) {
        return reply.code(error.code).send({
            code: -1,
            msg: error.message
        });
    }

    // 系统错误
    return reply.code(500).send({
        code: -1,
        msg: "服务器错误"
    });
})


// 模拟数据
const users = [
    {id: 1, name: "张三", email: "zs@test.com"},
    {id: 2, name: "李四", email: "ls@test.com"}
]

app.get('/users/:id',
    {
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {type: 'integer'}
                }
            }
        }
    },
    async (request, reply) => {
        const {id} = request.params;
        const user =users.find(u => u.id === id);

        if(!user) throw new BusinessError("用户不存在", 404);
        return user;
    }
)

app.get("/error", async (request, reply) => {
    throw new Error("系统内部错误");
})


async function start() {
    await app.listen({port: 3000});
}

start();