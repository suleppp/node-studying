const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log("【1秒时刻】真实业务内部打印");
        resolve("业务数据拿到啦！");
    }, 1000);
});

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log("【3秒时刻】超时控制内部打印");
        reject("超时错误！");
    }, 3000);
});

console.log("【0秒时刻】比赛开始");

Promise.race([p1, p2])
    .then((data) => {
        console.log("【1秒时刻】race 宣布最终结果：", data);
    })
    .catch((error) => {
        console.log("race 报错了：", error);
    });