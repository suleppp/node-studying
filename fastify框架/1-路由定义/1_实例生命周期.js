import Fastify from 'fastify'

// 创建实例，Fastify()工厂函数，返回一个实例
const app = Fastify();

// 启动并监听端口
async function start() {
    try {
        await app.listen({port: 3000})
        console.log("服务已启动：http://localhost:3000")
    } catch(err){
        console.error(err);
        process.exit(1);
    }
}

// 执行启动
start();