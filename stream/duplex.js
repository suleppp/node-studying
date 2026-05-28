const fs = require('fs')
const {Duplex} = require('stream')

// 没有类似createReadStream或者createWriteStream这样的工厂方法

const rs = fs.createReadStream("./res/test.txt");
const ws = fs.createWriteStream("./res/test2.txt");

const duplex = new Duplex({
    read(){
        rs.on("data",(chunk) => {
            this.push(chunk);
        });
        rs.on("end",(chunk) => {
            this.push(null);
        })
    },

    write(chunk,encoding,callback){
        ws.write(chunk);
        callback();
    }
})

// 先写
duplex.write('写入内容');
duplex.end();

// 读端
duplex.on('data', chunk => console.log('读端：', chunk.toString()));

duplex.on('finish', () => console.log('写端结束'));
duplex.on('end', () => console.log('读端结束'));