const events = require("events");
const emitter = new events();


emitter.on("data",(msg1,msg2) => {
    console.log("拿到的消息1：",msg1);
    console.log("拿到的消息2：",msg2);
})
emitter.once("data",msg => {
    console.log("我是once",msg);
})



emitter.emit("data","这是消息1","我是消息2");
emitter.emit("data","第二次消息1","第二次消息2")


console.log(emitter.listenerCount("data"))//1

console.log(emitter.eventNames("data"));//[ 'data' ]

let func = function(msg){
    console.log(msg);
}
emitter.on("data2",func);
emitter.emit("data2","我是data2")
emitter.off("data2",func);
emitter.emit("data2","我是data2 +1")


function handler1(msg) { console.log('1', msg); }
function handler2(msg) { console.log('2', msg); }

emitter.on('data', handler1);
emitter.on('data', handler2);
emitter.on('error', handler1);

// 移除 data 事件下的所有监听器
emitter.removeAllListeners('data');
console.log(emitter.listenerCount('data'));   // 0
console.log(emitter.listenerCount('error'));  // 1，error 的监听器还在

// 不传参数，移除所有事件的所有监听器
emitter.removeAllListeners();
console.log(emitter.listenerCount('error'));  // 0