const mongoose = require('mongoose');
require('./2_生命周期事件监听')

const uri = 'mongodb://localhost:27017/testdb';

const options = {
    // 连接池最大连接数，默认是10
    maxPoolSize: 50,
    // 连接池最小连接数，常驻连接
    minPoolSize: 10,

    // 超时控制，连接最大等待时间
    serverSelectionTimeoutMS: 5000,

    // 是否在启动的时候自动调用ensureIndex创建Schema中定义的索引
    autoIndex: false
};

async function startMongoServer() {
    try {
        await mongoose.connect(uri, options);
        console.log("连接建立成功");
    } catch (err) {
        console.log(err);
    }
}

startMongoServer()