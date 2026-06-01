const Fastify = require('fastify');

const app = Fastify({logger: false});

// 模拟数据库返回的原始数据
const users = [
    {
        id: 1,
        name: '张三',
        age: 18,
        email: 'zhangsan@test.com',
        password: '123456',       // 敏感字段，不返回
        salt: 'abc123',           // 敏感字段，不返回
    },
    {
        id: 2,
        name: '李四',
        age: 25,
        email: 'lisi@test.com',
        password: '654321',
        salt: 'def456',
    }
];

// 对单个对象的过滤
app.get('/users/:id',
    {
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {type: 'integer'}
                }
            },
            // 响应过滤
            response: {
                // 针对200状态码的响应定义
                200: {
                    type: 'object',
                    properties: {
                        id: {type: 'integer'},
                        name: {type: 'string'},
                        age: {type: 'integer'},
                        email: {type: 'string'}
                    }
                }
            }
        }
    },
    async (request, reply) => {
        const {id} = request.params;
        // 模拟数据库搜索
        const user = users.find(u => u.id === id);

        if(!user){
            reply.code(404);
            return {msg: "用户不存在"};
        }
        return user;
    }
);


// 对数组的过滤
app.get("/users",
    {
        schema: {
            response: {
                200: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {type: 'integer'},
                            name: {type: 'string'},
                            email: {type: 'string'}
                        }
                    }
                }
            }
        }
    },
    async (request, reply) => {
        return users;
    }
);


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