const user = { id: 101, name: "张三", role: "admin" };
console.log(user.toString());// [object Object]

const arr = [1,2];
console.log(Object.prototype.toString.call(arr));// [object Array]

const date = new Date()
console.log(Object.prototype.toString.call(date));//[object Date]

