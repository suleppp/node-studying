const Fastify = require('fastify');
const fp = require('fastify-plugin');

const app = Fastify({looger: false});


// 身份插件
const authPlugin = fp(
    async function (fastify, options) {
        fastify.decorateRequest('user', null);

        fastify.addHook('preHandler', async (request, reply) => {
            const token = request.headers['authorization'];
            if (token) {
                request.user = {id: 1, name: "张三"};
            }
        })
    }
);

const replyPlugin = fp(
    async function (fastify, options) {
        // 声明方法
        // 这里不用箭头函数的原因在于需要用到this
        fastify.decorateReply('success', function (data) {
            this.code(200).send({code: 200, data, msg: 'success'});
        });

        fastify.decorateReply('fail', function (msg, code) {
            this.code(400).send({code: code, data: null, msg: msg});
        });
    }
);


async function userRoutes(fastify, options) {

    fastify.get('/profile', async (request, reply) => {
        if (!request.user) {
            return reply.fail('未登录', 401);
        }
        return reply.success(request.user);
    });
 

    fastify.get('/', async (request, reply) => {
        const users = [
            { id: 1, name: '张三' },
            { id: 2, name: '李四' }
        ];
        return reply.success(users);
    });
 
}
 
 
app.register(authPlugin);
app.register(replyPlugin);
app.register(userRoutes, { prefix: '/users' });

async function start() {
    try {
        await app.listen({port: 3000});
    } catch (err) {
        console.log(err);
    }
}

start();