// const buf = Buffer.alloc(1024);
// console.log(buf);
// // <Buffer 00 00 00 00   ... more bytes>

// const buf2 = Buffer.from("buffer","utf8")
// console.log(buf2) // <Buffer 62 75 66 66 65 72>

// console.log(buf2.toString());// buffer
// console.log(buf2.toString("utf8"));// buffer
// console.log(buf2.toString("ascii"));// buffer


// const chunk1 = Buffer.from("深入理解")
// const chunk2 = Buffer.from("Java")
// const chunk3 = Buffer.from("虚拟机")

// const list =[chunk1,chunk2,chunk3];
// const concatChunk = Buffer.concat(list);
// console.log(concatChunk.toString());//深入理解Java虚拟机

// const buf1 = Buffer.from("JavaScript");
// const buf2 = buf1.subarray(0,4);
// console.log(buf2.toString()); // Java

// buf2[0] = 73;
// console.log(buf1.toString());// IavaScript


// const str = "你好,Node";
// console.log(str.length);// 7
// console.log(Buffer.byteLength(str));// 11 3*2+1*5

const safeBuf = Buffer.alloc(1000);
console.log(safeBuf);

const unsafeBuf = Buffer.allocUnsafe(10000);
console.log(unsafeBuf);