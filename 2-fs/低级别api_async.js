const { resolve } = require('dns');
const fs = require('fs')


async function main(){
    let fd = null;

    try {
        // await相当于then，接住resolve中的值
        fd = await new Promise((resolve,reject) => {
            fs.open("./res/测试文本.txt","r",(err,fd) => {
                if(err) reject(err);
                else resolve(fd);
            })
        })

        console.log(fd);

        const buf = Buffer.alloc(5);
        const {bytesRead,buffer} = await new Promise((resolve,reject) => {
            fs.read(fd,buf,0,5,5,(err,bytesRead,buffer) => {
                if(err) reject(err);
                else resolve({bytesRead,buffer});
            })
        })

        console.log("成功读取", bytesRead, "个字节");
        console.log("内容是：", buffer.toString('utf8'));

        await new Promise((resolve,reject) => {
            fs.close(fd,(err) => {
                if(err) reject(err);
                else resolve();
            })
        })

        console.log("关闭成功")
    } catch(err){
        if (fd !== null) {
            console.log("读取报错", err.message);
            fs.close(fd, () => console.log("报错后兜底关闭成功"));
        } else {
            console.log("打开或关闭文件报错", err.message);
        }
    }
}

main();