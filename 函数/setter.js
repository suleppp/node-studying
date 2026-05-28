let user = {
    _age: 18, // 真实存放数据的属性（加下划线代表私有，不希望外部直接碰，但是也能碰）

    // 当外部执行 user.age = xxx 时，会自动触发这个隐藏函数
    set age(value) {
        if (value < 0 || value > 150) {
            console.error("年龄不合法，拒绝修改");
            return;
        }
        this._age = value; // 验证通过，才把值存进真实的 _age 里
    }
};

user.age = 25;   // 表面上是变量赋值，底层执行了 set age(25)
console.log(user._age); // 25

user.age = -10;  // 控制台打印报错，赋值被拦截
console.log(user._age); // 依然是 25

// 直接修改
user._age = 9999;
console.log(user._age); //被修改了