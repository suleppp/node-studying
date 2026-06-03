const mongoose = require('mongoose');

const db = mongoose.connection;

db.on('connected', () => {
    console.log("已连接");
})

db.on("error", (err) => {
    console.err("连接报错");
})

db.on("disconnected", () => {
    console.warn("断开连接");
}) 

db.on("reconnected", () => {
    console.log("重新建立连接")
})