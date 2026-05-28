const fs = require('fs');

const rs = fs.createReadStream('./res/test.txt',{
    highWaterMark: 5 //每次读5个字节
})

rs.on("data",(chunk) => {
    console.log("收到数据",chunk.toString());

    // 暂停
    rs.pause();
    console.log("暂停了");

    setTimeout(() => {
        // 恢复
        rs.resume();
        console.log("恢复了");
    },1000)
});

rs.on("end" ,() => {
    console.log("读完了");
})

rs.on("error",(err) => {
    console.log("出错了")
    //销毁流，释放资源
    rs.destroy();
})