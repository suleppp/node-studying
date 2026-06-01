const Fastify = require('fastify');

const app = Fastify({logger: false});

// 模拟一个异步方法
function asyncFunction(){
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 500);
    })
}

// 模拟一个同步方法
function syncFunction(){
    console.log("同步方法执行了");
}

// async函数，推荐
async function pluginA(fastify, options){
    console.log("---> 1. pluginA开始执行")
    await asyncFunction();
    console.log("---> 1. pluginA执行完毕")
}

// 同步操作
function pluginB(fastify, options, done){
    console.log('---> 2. pluginB 开始执行');
    syncFunction();
    console.log('---> 2. pluginB 执行完毕');
    // 必须手动done，fastify才能知道执行完毕了
    done();
}

// 异步回调
function pluginC(fastify, options, done){
    console.log("---> 3. pluginC 开始执行");
    setTimeout(() => {
        console.log("---> 3. pluginC 执行完毕");
        done();
    },3000);
}


// 路由插件，一般注册在最后
async function userRoutes(fastify, options){
    console.log("---> 4. 路由插件开始执行");
    fastify.get("/", async () => {
        return {msg: "这是一个用户列表"};
    });
    fastify.get("/:id", async (request, reply) => {
        return {msg: "查找用户成功"};
    })
    console.log("---> 4. 路由插件执行完毕");
}

// 按顺序注册插件
app.register(pluginA);
app.register(pluginB);
app.register(pluginC);
app.register(userRoutes,{prefix: "/users"});

async function start() {
    try {
        await app.listen({port: 3000});
    } catch (err) {
        console.log(err);
    }
}

start();