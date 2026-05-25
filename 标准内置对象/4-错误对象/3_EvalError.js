try{
    throw new EvalError("hello");
}catch(e){
    console.log(e);
}
/**
 * EvalError: hello
    at Object.<anonymous> (C:\Users\yigan\code\node-studying\标准内置对象\4-错误对象\3_EvalError.js:2:11)
    at Module._compile (node:internal/modules/cjs/loader:1781:14)
    at Object..js (node:internal/modules/cjs/loader:1913:10)
    at Module.load (node:internal/modules/cjs/loader:1505:32)
    at Function._load (node:internal/modules/cjs/loader:1309:12)
    at wrapModuleLoad (node:internal/modules/cjs/loader:254:19)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:171:5)
    at node:internal/main/run_main_module:36:49
 */