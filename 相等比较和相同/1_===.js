// 类型不同直接返回false
console.log(0 === "0")       // false，类型不同
console.log(0 === false)     // false，类型不同
console.log(null === undefined)  // false，类型不同

console.log(+0 === -0)  // true
console.log(NaN === NaN)  // false
console.log(NaN !== NaN)  // true，不等于自身，包括自己

const arr = [1,NaN,3];
console.log(arr.indexOf(NaN)); // -1，找不到
// 原因在于逐个匹配
// 1===NaN false
// NaN===NaN false
// 3===NaN false

//对于switch也是同理，不会执行
switch(NaN){
    case NaN:
        console.log("已执行")
}

