new Promise((resolve,rejected) => {
    console.log("立即执行")// 立即执行
})

const p = new Promise((resolve) => {
    resolve(100); // 仓库里存入了 100
});

// // 消费者 A 来提货
// p.then((data) => { 
//     console.log("A 拿到：", data); // A 拿到： 100
// });

// // 消费者 B 来提货
// p.then((data) => { 
//     console.log("B 拿到：", data); // B 拿到： 100
// });

// const p = new Promise((resolve) => {
//     resolve(100); 
// });

// 链式调用
p.then((data) => {
    console.log("第一层：", data); // 100
    return data + 50;                     // 把处理后的 150 传给下一站
})
.then((data2) => {
    console.log("第二层拿到：", data2); // 150
    return data2 * 2;                     // 把处理后的 300 传给下一站
})
.then((data3) => {
    console.log("第三层拿到：", data3);       // 300
});