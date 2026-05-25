// 1. alloc
let buf = Buffer.alloc(10);
//console.log(buf)
// 2. allocUnsafe
let buf_2 = Buffer.allocUnsafe(1000);
//console.log(buf_2);
// 3. from
let buf_3 = Buffer.from('hello');
console.log(buf_3);