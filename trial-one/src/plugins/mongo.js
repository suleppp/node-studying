// require出来的本身就是一个实例，不需要new
const mongoose = require('mongoose');
const fp = require('fastify-plugin');
const process = require('process');

// TODO URI和连接配置可以从环境变量中读取，不需要硬编码
const defaultURI = 'mongodb://localhost:27017/trialOneDB';

const defaultOptions = {
    maxPoolSize: process.env.MONGO_MAX_POOL_SIZE || 50,
    minPoolSize: process.env.MONGO_MIN_POOL_SIZE|| 10,
    serverSelectionTimeoutMS: process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS|| 5000,
    autoIndex: process.env.MONGO_AUTO_INDEX || false,
}

async function mongoPlugin(fastify, options = defaultOptions) {
    try {
        await mongoose.connect(defaultURI, options);
        // 作为参数传入的fastify，如果重新require，那么本文件中的fastify和app中的不一致
        fastify.decorate('mongoose', mongoose);

        // 事件监听
        const mongoConnect = mongoose.connection;

        mongoConnect.on("connected", () => {
            console.log("MongoDB-->已连接");
        })

        mongoConnect.on("error", (error) => {
            console.error("MongoDB-->连接报错：", error.message);
        })

        mongoConnect.on("disconnected", () => {
            console.warn("MongoDB-->断开连接");
        })

        mongoConnect.on("reconnected", () => {
            console.log("MongoDB-->重新建立连接");
        })

        console.log("MongoDB启动成功");
    } catch (error) {
        console.log("MongoDB启动失败：", error.message);
        // 抛出错误，因为是被app.register()调用的，因此抛出错误，fastify会终止流程
        throw error;
    }
}




module.exports = fp(mongoPlugin);