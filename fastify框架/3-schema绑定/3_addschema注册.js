const Fastify = require('fastify');

const app = Fastify({looger: false});


// 模拟数据库
const users = [
    {
        id: 1,
        name: '张三',
        email: 'zhangsan@test.com',
        password: '123456',
        address: { city: '北京', zipCode: '100000' }
    },
    {
        id: 2,
        name: '李四',
        email: 'lisi@test.com',
        password: '654321',
        address: { city: '上海', zipCode: '200000' }
    }
];


// 地址schema
app.addSchema({
    // 给schema一个唯一id
    $id: 'Address',
    type: 'object',
    required: ['city'],
    properties: {
        city: {type: 'string'},
        zipCode: {type: 'string', pattern: '^[0-9]{6}$'}
    }
});

// 用户schema，内部引用了address
app.addSchema({
    $id: 'User',
    type: 'object',
    properties: {
        id: {type: 'integer'},
        name: {type: 'string'},
        email: {type: 'string'},
        // 引用上面注册的Address
        address: {$ref: 'Address#'}
    }
});


app.get('/users/:id' ,
    {
        schema: {
            params: {
                type: 'object',
                properties:{
                    id: {type: 'integer'}
                }
            },
            response: {
                200: {$ref: 'User#'}
            }
        }
    },
    async (request, reply) => {
        const {id} = request.params;
        const user = users.find(u => u.id === id);

        if(!user) {
            reply.code(404);
            return {msg: '用户不存在'};
        }

        return user;
    }
);


app.post('/users', 
    {
        schema: {
            body: {
                type: 'object',
              // address不是必传，但如果传了address，那里面的city必传
                required: ['name', 'email', 'password'],
                properties: {
                    name: {type: 'string', minLength: 2},
                    email: {type: 'string',format: 'email'},
                    address: {$ref: 'Address#'}
                }
            }
        },
        response: {
            201: {$ref: 'User#'}
        }
    },
    async (request, reply) => {
        const {name, email, address, password} = request.body;
        const newUser = {
            id: users.length + 1,
            name: name,
            email: email,
            address: address,
            password: password
        };
        users.push(newUser);
        console.log(users);
        reply.code(201);
        return newUser;
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