function add(a, b) {}
console.log(add.length);  // 2，期望的参数个数
console.log(add.name);   // "add"，函数名

// call和apply，传入一个对象，
// 然后这个对象就会成为函数执行时的this
const tom = { name: "Tom" };

function greet(greeting) {
    return `${greeting}, ${this.name}`;
}

// 想让greet用tom作为this执行
// call和apply的区别体现在参数传递上
greet.call(tom, "Hello")     // 参数直接传
greet.apply(tom, ["Hello"])  // 参数用数组包起来传

// bind 
// 不立刻调用，返回一个新函数，
// 新函数的this永远绑定到指定的值
function hello(){
    return `hello,${this.name}`;
}

const user = {name: 'Tom'};
const boundHello = hello.bind(user);
console.log(boundHello()); // hello,Tom  this永远是user

// 可以用字符串创建函数，不推荐，和eval一样有安全和性能问题
const add2 = new Function("a", "b", "return a + b");
console.log(add2(1, 2))  // 3