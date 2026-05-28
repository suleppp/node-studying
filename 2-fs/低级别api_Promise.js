const { resolve } = require('dns');
const fs = require('fs')

new Promise((resolve,reject) => {
    fs.open("./res/测试文本.txt",'r',(err,fd) => {
        if(err){
            reject(err);
        } else{
            resolve(fd);
        }
    })
})

.then((fd) => {
    console.log("fd：",fd);
    const buf = Buffer.alloc(5);

    return new Promise((resolve,reject) => {
        fs.read(fd,buf,0,5,5,(err,bytesRead,buffer) => {
            if(err){
                reject({err,fd});
            }
            else{
                resolve({bytesRead,buffer,fd});
            }
        })
    })
})

.then(({bytesRead,buffer,fd}) => {
    console.log("成功读取", bytesRead, "个字节");
    console.log("内容是：", buffer.toString('utf8'));

    return new Promise((resolve,reject) => {
        fs.close(fd,(err) => {
            if(err){
                reject(err);
            } else{
                resolve();
            }
        })
    })
})

.then(() => {
    console.log("关闭成功");
})

.catch((errorData) => {
    if (errorData.fd) {
        console.log("读取报错", errorData.err.message);
        // 即使读取报错，也要手动释放 fd
        fs.close(errorData.fd, () => console.log("报错后兜底关闭成功"));
    } else {
        console.log("打开或关闭文件报错", errorData.message);
    }
})