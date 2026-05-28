const fs = require('fs');

// 异步打开文件
fs.open('./res/测试文本.txt','r',(err,fd) => {
    if(err){
        console.log("打开文件失败",err.message);
        return;
    }
    console.log("fd：",fd);
    
    // 申请一块空间，就算是读也要一块空容器
    const buf = Buffer.alloc(5);
    // read(fd,buffer,写入起点,长度，文件起点,callback)
    fs.read(fd,buf,0,5,5,(err,bytesRead,buffer) => {
        if(err){
            console.log("读取报错",err.message);
        }
        else{
            console.log("成功读取",bytesRead,"个字节");
            console.log("内容是：",buffer.toString('utf8'));
        }

        fs.close(fd,err => {
            if(err){
                console.log("关闭fd失败",err.message);
            }
            else {
                console.log("关闭成功");
            }
        })
    })
})