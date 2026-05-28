// 传统写法
const add = function(a,b){
    return a+b;
};

// 箭头函数
const add2 = (a,b) => {
    return a+b;
};

// 如果函数体只有单行表达式
// 可以省略花括号和return
const add3 = (a,b) => a+b;

// 如果参数只有一个，括号也可以省略
const double = a => a*2;

// 需要注意的是
// 如果像隐式的返回一个对象，那么需要加上括号
const getUser = () => ({name: "张三"});
console.log(getUser());