// const arr = [1,2,3];
// console.log(typeof arr); // object
// console.log(Array.isArray(arr)) //true

// const arrayLike = {
//     length: 2,
//     0:"zero",
//     1:"one"
// };

// const trueArr = Array.from(arrayLike)
// console.log(trueArr)//[ 'zero', 'one' ]
// //第二个参数相当于map，在转换数组的瞬间就转换成Number
// Array.from(arrayLike,Number);


let a = new Array(1,2,3);
console.log(a)// [ 1, 2, 3 ]

let b = new Array(3);
console.log(b);//[ <3 empty items> ] 创建三个空槽

let c = Array.of(1,2,3);
console.log(c);// [ 1, 2, 3 ]

let d = Array.of(3);
console.log(d);// [ 3 ]