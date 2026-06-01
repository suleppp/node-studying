const Fastify = require('fastify');
const { createUserSchema, getUserSchema } = require('./schemas/user');

const app = Fastify({ logger: false });

// 模拟数据库
const users = [
    { id: 1, name: '张三', age: 18, email: 'zhangsan@test.com', password: '123456' },
    { id: 2, name: '李四', age: 25, email: 'lisi@test.com', password: '654321' }
];

// 路由里直接引用 schema
app.get('/users/:id', { schema: getUserSchema }, async (request, reply) => {
    const { id } = request.params;
    const user = users.find(u => u.id === id);

    if (!user) {
        reply.code(404);
        return { msg: '用户不存在' };
    }

    return user;
});

app.post('/users', { schema: createUserSchema }, async (request, reply) => {
    const { name, age, email } = request.body;
    const newUser = { id: users.length + 1, name, age, email, password: '123456' };
    users.push(newUser);
    reply.code(201);
    return newUser;
});

async function start() {
    try {
        await app.listen({ port: 3000 });
        console.log('服务启动成功：http://localhost:3000');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

start();