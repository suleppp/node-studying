// 导出方 math.js
function add(a, b) {
    return a + b;
}

// 把 add 函数暴露出去，供别人使用
module.exports = {
    add: add
};