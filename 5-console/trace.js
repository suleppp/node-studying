function A() {
    B();
}

function B() {
    C();
}

function C() {
    console.trace("看看到底是从哪条路走过来的");
}

// 启动程序
A();

//Trace: 看看到底是从哪条路走过来的
//    at C (C:\Users\yigan\code\node-studying\5-console\trace.js:10:13)
//    at B (C:\Users\yigan\code\node-studying\5-console\trace.js:6:5)
//    at A (C:\Users\yigan\code\node-studying\5-console\trace.js:2:5)
//    at Object.<anonymous> (C:\Users\yigan\code\node-studying\5-console\trace.js:14:1)
//    at Module._compile (node:internal/modules/cjs/loader:1781:14)
//    at Object..js (node:internal/modules/cjs/loader:1913:10)
//    at Module.load (node:internal/modules/cjs/loader:1505:32)
//    at Function._load (node:internal/modules/cjs/loader:1309:12)
//    at wrapModuleLoad (node:internal/modules/cjs/loader:254:19)
//    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:171:5)