import Fastify from 'fastify'

const app = Fastify();

// 这里加上async是因为插件系统的要求
// 因为注册插件这个动作本身是同步的，但是插件内部可能会有异步操作
// 比如数据库连接，读取配置文件等
// fastify需要所有插件都初始化完成后，再开始监听端口接收请求
// 虽然下面的userRoutes内部没有异步操作，但是fastify不知道，并且对
// 所有插件都是一视同仁，fastify需要拿到你插件初始化完成的信号
// 因此加上async，fastify会等这个函数的promise resolve之后再继续
// 如果不加async，可以在函数内部调用done()来通知fastify
async function userRoutes(fastify, options) {
  fastify.get('/', async () => ({ msg: '获取用户列表' }))     // 实际为 GET /api/v1/users/
  fastify.get('/:id', async () => ({ msg: '获取单个用户' }))  // 实际为 GET /api/v1/users/:id
}

// 在fastify实例上注册这组路由，并统一分配前缀
app.register(userRoutes, { prefix: '/api/v1/users' })