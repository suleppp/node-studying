// 表示值的类型不符合预期，是最常见的错误之一
try{
    const x = 1;
    x();
}catch(e){
    console.log("错误信息："+e);
    // 错误信息：TypeError: x is not a function
}

// 一般来说可以手动抛出
function add(a, b) {
    if (typeof a !== "number" || typeof b !== "number") {
        throw new TypeError("参数必须是数字");
    }
    return a + b;
}

try{
    add("a","b");
}catch(e){
    console.log("错误信息："+e);
    // 错误信息：TypeError: 参数必须是数字
}