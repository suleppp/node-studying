module.exports = {
    env: {
        node: true,
        es2021: true
    },
    rules: {
        'no-undef': 'error',        // 用了未定义的变量报错
        'no-unused-vars': 'warn',   // 定义了没用的变量警告
    }
}