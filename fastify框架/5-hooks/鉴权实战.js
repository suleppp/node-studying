const Fastify = require('fastify');
const fp = require('fastify-plugin');

const app = Fastify({ logger: false });


// ===== 全局 Hook：所有路由都会触发 =====

// 最早执行，body 还没解析，适合限流、记录请求日志
app.addHook('onRequest', async (request, reply) => {
    request.startTime = Date.now(); // 记录请求开始时间
    console.log(`[onRequest]  ${request.method} ${request.url}`);
});

// 解析 body 之前
app.addHook('preParsing', async (request, reply) => {
    console.log(`[preParsing] ${request.method} ${request.url}`);
});

// Schema 校验之前
app.addHook('preValidation', async (request, reply) => {
    console.log(`[preValidation] ${request.method} ${request.url}`);
});

// 进入路由处理函数之前，body 已解析，校验已通过，最常用
app.addHook('preHandler', async (request, reply) => {
    console.log(`[preHandler] ${request.method} ${request.url}`);
});

// 响应发出之前，可以修改响应数据
app.addHook('onSend', async (request, reply, payload) => {
    console.log(`[onSend]     ${request.method} ${request.url}`);
    return payload; // 必须返回 payload，否则响应为空
});

// 响应发出之后，适合记录耗时、统计
app.addHook('onResponse', async (request, reply) => {
    const duration = Date.now() - request.startTime;
    console.log(`[onResponse] ${request.method} ${request.url} 耗时 ${duration}ms`);
    console.log('---');
});


// ===== 模拟数据 =====
const users = [
    { id: 1, name: '张三', email: 'zhangsan@test.com' },
    { id: 2, name: '李四', email: 'lisi@test.com' }
];

// 模拟 token 验证，实际项目里是 jwt 解码
const validTokens = {
    'user-token-123': { id: 1, name: '张三', role: 'user' },
    'admin-token-456': { id: 2, name: '李四', role: 'admin' }
};


// ===== 公开路由插件：不需要登录 =====
async function publicRoutes(fastify, options) {
    // 这里没有局部 Hook，只受全局 Hook 影响

    // GET /public/hello
    fastify.get('/hello', async () => {
        return { msg: '这是公开接口，不需要登录' };
    });

    // GET /public/users
    fastify.get('/users', async () => {
        return users;
    });
}


// ===== 需要登录的路由插件：有局部鉴权 Hook =====
async function protectedRoutes(fastify, options) {

    // 局部 Hook：只对这个插件内的路由生效
    // 在 preHandler 阶段验证 token
    fastify.addHook('preHandler', async (request, reply) => {
        const token = request.headers['authorization'];

        if (!token) {
            reply.code(401);
            throw new Error('未携带 token');
        }

        const user = validTokens[token];
        if (!user) {
            reply.code(401);
            throw new Error('token 无效');
        }

        // 把当前用户挂到 request 上，路由里直接用
        request.currentUser = user;
        console.log(`[局部鉴权 Hook] 用户 ${user.name} 通过验证`);
    });

    // GET /protected/profile  需要登录
    fastify.get('/profile', async (request, reply) => {
        return { msg: '获取个人信息', user: request.currentUser };
    });

    // GET /protected/dashboard  需要登录
    fastify.get('/dashboard', async (request, reply) => {
        return { msg: '进入控制台', user: request.currentUser };
    });
}


// ===== 管理员路由插件：需要登录 + 管理员权限 =====
async function adminRoutes(fastify, options) {

    // 局部 Hook：先验证 token，再验证是否是管理员
    fastify.addHook('preHandler', async (request, reply) => {
        const token = request.headers['authorization'];

        if (!token) {
            reply.code(401);
            throw new Error('未携带 token');
        }

        const user = validTokens[token];
        if (!user) {
            reply.code(401);
            throw new Error('token 无效');
        }

        if (user.role !== 'admin') {
            reply.code(403);
            throw new Error('权限不足，需要管理员权限');
        }

        request.currentUser = user;
        console.log(`[管理员鉴权 Hook] 管理员 ${user.name} 通过验证`);
    });

    // GET /admin/users  需要管理员权限
    fastify.get('/users', async (request, reply) => {
        return { msg: '管理员获取用户列表', operator: request.currentUser, users };
    });
}


// ===== 注册路由 =====
app.register(publicRoutes,    { prefix: '/public' });
app.register(protectedRoutes, { prefix: '/protected' });
app.register(adminRoutes,     { prefix: '/admin' });


async function start() {
    try {
        await app.listen({ port: 3000 });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

start();