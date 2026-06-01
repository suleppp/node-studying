const Fastify = require('fastify');

const app = Fastify({logger: false});

// 路由隔离
async function pluginA(fastify, options) {
    fastify.get("/hello", async () => {
        return {msg: "pluginA"};
    });
    // 插件A内部还可以嵌套一个子插件
    fastify.register(async function pluginAA(fastify, options){
        // 子插件可以继承父插件的prefix
        fastify.get("/child", async () => {
            return {msg: "pluginAA"};
        })
    })
};

async function pluginB(fastify, options){
    fastify.get("/hello", async () => {
        return {msg: "pluginB"};
    })
};

app.register(pluginA, {prefix: '/a'});
app.register(pluginB, {prefix: '/b'});


async function start() {
    try {
        await app.listen({port:3000});
        console.log("服务启动完成");
    } catch(err) {
        console.log(err);
    }
};

start();