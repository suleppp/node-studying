function* stepByStep(){
    console.log("开始执行");
    yield "A完成"

    console.log("继续执行")
    yield "B完成"

    console.log("最终执行")
    yield "C完成"
}

const runner = stepByStep();// 此时函数不会执行

let data = runner.next();// 调用next才会执行
console.log(data); //{ value: 'A完成', done: false }
// done为false说明没完成

data =runner.next();//继续执行
console.log(data);//{ value: 'B完成', done: false }

data = runner.next();
console.log(data);//{ value: 'C完成', done: false }

data =runner.next();
console.log(data);// { value: undefined, done: true }