const controller = new AbortController();
const signal = controller.signal;


const events = require("events");
const emitter = new events();


emitter.addListener("data",(msg) => {
    console.log("hahaha",msg);
},
{signal:signal});

emitter.emit("data","wuwuwu");


// 取消
controller.abort()

emitter.emit("data","wuwu2")