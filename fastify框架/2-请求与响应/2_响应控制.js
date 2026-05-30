import Fastify from 'fastify'

const app = Fastify({logger: false});


app.get("/users", async (request, reply) => {
    return {msg: "默认就是200+application/json"}
})

app.post("/users", async (request, reply) => {
    reply.code(201);
    return {msg: "状态码201"};
})

app.post("/orders", async (request, reply) => {
    const orderId = "order_123";
    reply
        .code(201)
        .header("X-Order-Id", orderId); // 自定义响应头

    return {msg: "自定义响应头"}
})

app.get('/users/:id', async (request, reply) => {
    const {id} = request.params;

    reply.code(404);
    return null;
})

app.delete('/users/:id',async (request, reply) => {
    const {id} = request.params;
    reply.code(204).send();
})

async function start() {
    try {
        await app.listen({port: 3000});
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

start();