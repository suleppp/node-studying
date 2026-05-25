// 首先Object是一个函数
console.log(typeof Object); // function，因此有prototype

console.log(Object.__proto__ === Function.prototype); // true

console.log(Object.prototype.__proto__); // null


// 静态方法
// 把一个或多个源对象的属性复制到目标对象，返回目标对象，浅拷贝
const target = {a: 1};
const source ={b: 2, c: 3};
Object.assign(target,source);
console.log(target); // { a: 1, b: 2, c: 3 }

// 返回自有的可枚举属性，不包括原型链上的
console.log(Object.keys(target));
console.log(Object.values(target));
console.log(Object.entries(target));
// [ 'a', 'b', 'c' ]
// [ 1, 2, 3 ]
// [ [ 'a', 1 ], [ 'b', 2 ], [ 'c', 3 ] ]

// 把键值对数组转成对象
const entries = [["a", 1], ["b", 2]];
console.log(Object.fromEntries(entries))  // { a: 1, b: 2 }

// 判断属性是否是对象自身的，不查原型链
console.log(Object.hasOwn(target,"a")); //true
console.log(Object.hasOwn(target,"toString")); //false;

// 判断对象是否可以添加新属性
console.log(Object.isExtensible(target)); //true


// 实例方法
const father = { a: 1 };
const son = Object.create(father);
// 判断一个对象是否在另一个对象的原型链上
console.log(father.isPrototypeOf(son));   // true，father 在 son 的原型链上
console.log(son.isPrototypeOf(father));   // false

// 把对象转成字符串，默认返回[Object,Object]
console.log(target.toString());

// 这个对象当做数字用的时候，值是多少
const obj = {
    valueOf() { return 42; }
};
console.log(obj.valueOf());// 42
console.log(obj + 1);   
// JS 发现 obj 是对象，
// 自动调用 obj.valueOf() 拿到 42，然后 42 + 1 = 43