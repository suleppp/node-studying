// let multiply = new Function("x","y","return x*y");
// console.log(multiply(2,3)); // 6

// const hello = function hi(){
//     console.log("hello");
// }

// hello();
// hi();// 报错，hi is not defined

//匿名函数表达式

// let hello = function(){
//     console.log("hello");
//     throw new Error;
// }
// hello();

//命名函数表达式
const hello = function hi(){
    throw new Error;
}

hello(); //会显示hi报错