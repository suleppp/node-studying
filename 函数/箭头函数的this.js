const user = {
    name: "张三",
    sayHi: function(){
        // 这里的this指向user
        setTimeout(function() {
            // 这里的this指向global
            // 输出undefined
            console.log(this.name)
        }, 1000);
    }
}
user.sayHi()

const user2 = {
    name: "张三",
    sayHi: function() {
        // 外层是 sayHiDelay 方法，this 指向 user
        setTimeout(() => {
            // 箭头函数自己没 this，直接用外层的 this
            console.log(this.name); // "张三"
        }, 1000);
    }
};
user2.sayHi();

const obj = {
    name: "lisi",
    sayHi: () => {
        // 这里的外层不是 obj 本身，而是定义 obj 的那个环境 global
        console.log(this.name); // 输出 undefined
    }
};
obj.sayHi();