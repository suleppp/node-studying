// map
const users = [{id:123,name:"zhangsan"},{id:243,name:"lisi"}];
const ids = users.map(user => user.id);
// console.log(ids); // [ 123, 243 ]

// const numArr = [1,2,3,4,5,6];
// const over5 = numArr.filter(num => num>5);
// console.log(over5); //[ 6 ]

users.forEach((item,index) => {
    console.log(`第${index}个：${item.name}`)
})
//第0个：zhangsan
//第1个：lisi

console.log(users.find(user => user.id = 123));
//{ id: 123, name: 'zhangsan' }

console.log(ids.includes(123));// true

console.log(ids.push(666));// 3

console.log(users.slice(0,1));// [ { id: 123, name: 'zhangsan' } ]
console.log(users.slice(0));// [ { id: 123, name: 'zhangsan' }, { id: 243, name: 'lisi' } ]
console.log(users.slice(-1));// [ { id: 243, name: 'lisi' } ]


let fruits = ['苹果', '香蕉', '橘子'];
let removed = fruits.splice(1, 1, '芒果'); 
console.log(fruits);
console.log(removed);
// fruits 变成了 ['苹果', '芒果', '橘子'] （香蕉被删掉，芒果塞入了）
// removed 是 ['香蕉'] （被删除的）


let str =  fruits.join("+");
console.log(str);// 苹果+芒果+橘子

let flag = fruits.some(fru => fru==="苹果")
console.log(flag);// true
flag =  fruits.every(fru => fru==="苹果");
console.log(flag);// false

const arr = [5,5,5];
const res = arr.reduce((total,item)=>{
    return total+item;
},0);
console.log(res);// 15