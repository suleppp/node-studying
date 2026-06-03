const Fastify = require('fastify');
const fp = require('fastify-plugin');

const app = Fastify({logger: false});

// 以下都是全局路由

app.decorateRequest('startTime', 0);
// onRqeust body还没开始解析
app.addHook("onRequest", async (request, reply) => {
    request.startTime = Date.now();
    console.log("1---> onRequest","startTime：",request.startTime);
})

// preParsing 解析body之前
app.addHook("preParsing", async (reqeust, reply) => {
    console.log("2---> preParsing");
})

// preValidation schema校验之前
app.addHook("preValidation", async (request, reply) => {
    console.log("3---> preValidation");
})

// preHandler 进入路由函数处理之前
app.addHook("preHandler", async (request, reply) => {
    console.log("4---> preHandler");
})

// onSend 响应发出之前，可以修改响应数据
app.addHook("onSend", async (request, reply, payload) => {
    console.log("5---> onSend");

    //必须返回payload
    return payload;
})

// onResponse 响应发出之后
app.addHook('onResponse', async (request, reply) => {
    const endTime = Date.now();
    const duration = endTime - request.startTime;
    console.log("6---> onResponse", " endTime：",endTime, " duration：", duration);
})


// 模拟数据
const users = [
    {id: 1, name: "张三", email: "zs@test.com"},
    {id: 2, name: "李四", email: "ls@test.com"}
]

// token对应的用户
const tokens = {
    "user-token-123": {id: 1, name: "张三", role: "user"},
    "admin-token-456": {id: 2, name: "李四", role: "admin"}
}

// 公开路由插件，不需要登录就能获取数据
async function publicRoutes(fastify, options){
    // 没有局部hook，受全局hook影响
    fastify.get("/hello", async () => {
        return {msg: "公开接口"}
    });


    fastify.get("/users", async () => {
        return users;
    })
}


// 需要鉴权的路由插件
async function protectedRoutes(fastify, options) {
    fastify.decorateRequest('currentUser', null);
    fastify.addHook("preHandler", async (request, reply) => {
        const token = request.headers['authorization'];

        if(!token){
            reply.code(401);
            throw new Error("未携带token")
        }

        const user = tokens[token];

        if(!user){
            reply.code(401);
            throw new Error("token无效");
        }

        request.currentUser = user;
    });


    fastify.get("/profile", async (request, reply) => {
        return {msg: "获取个人信息", user: request.currentUser};
    });

    fastify.get("/home", async (request, reply) => {
        return {msg: "首页", user: request.currentUser};
    })
};


app.register(publicRoutes, {prefix: "/public"});
app.register(protectedRoutes, {prefix: "/protected"});


async function start() {
    try {
        await app.listen({port: 3000});
    } catch (err) {
        console.log(err)
    }
}


start();