const Fastify = require('fastify');

const app = Fastify({
    ajv: {
        customOptions: {
            removeAdditional: false // 关掉自动移除
        }
    }
});


// params校验
console.log("GET");
console.log("http://localhost:3000/users/:id/:role");
app.get('/users/:id/:role',{
    schema: {
        params: {
            type: "object",
            properties :{
                id: {type: 'integer'},
                role: {type: 'string', enum: ['admin','normal']},
            }
        }
    }
},
    async (request, reply) => {
        const {id, role} = request.params;
        return {id, role};
    }
);
console.log("=====================================");


// queryString校验
console.log('GET');
console.log("http://localhost:3000/users?page=1&size=10&sort=asc");
app.get("/users",
    {
        schema: {
            querystring: {
                type: "object",
                required: ['page', 'size'],
                properties: {
                    page: {type: 'integer', minimum: 1},
                    size: {type: 'integer', minimum: 1,maximum: 100},
                    sort: {type: 'string', enum: ['asc','desc']}
                }
            }
        }
    },
    async (request, reply) => {
        return request.query;
    }
);
console.log("=====================================");

// headers校验
console.log('GET')
console.log('GET http://localhost:3000/admin')
app.get('/admin',
    {
        schema: {
            headers: {
                type: 'object',
                required: ['authorization'],
                additionalProperties: false,
                properties: {
                    authorization: {type: 'string'},
                    'x-request-id': {type: 'string'}
                }
            }
        }
    },
    async (request, reply) => {
        return {
            token: request.headers['authorization'],
            'x-request-id': request.headers['x-request-id']
        }
    }
);
console.log("=====================================");

console.log("POST");
console.log("http://localhost:3000/users")
app.post('/users',
    {
        schema: {
        body: {
            type: 'object',
            required: ['name', 'age', 'email'],
            additionalProperties: false,
            properties: {
                name:   { type: 'string', minLength: 2, maxLength: 20 },
                age:    { type: 'integer', minimum: 0, maximum: 100 },
                email:  { type: 'string', format: 'email' },
                gender: { type: 'string', enum: ['male', 'female'] },
                tags: {
                    type: 'array',
                    items: { type: 'string', maxLength: 10 },
                    minItems: 1,
                    maxItems: 5,
                    uniqueItems: true
                },
                address: {
                    type: 'object',
                    required: ['city'],
                    properties: {
                        city:    { type: 'string' },
                        zipCode: { type: 'string', pattern: '^[0-9]{6}$' }
                    }
                }
            }
        }
    }
    },
    async (request, reply) => {
        console.log(request.body);
        reply.code(201);
        return request.body;
    }
);
console.log("=====================================");

async function start() {
    try {
        await app.listen({port: 3000});
        console.log("http://localhost:3000");
    } catch (err) {
        console.log("错误原因：",err);
        console.error("启动失败");
    }
}

start();