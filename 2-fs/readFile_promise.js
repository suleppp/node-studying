const fsPromise = require('fs/promises');

fsPromise.readFile('./res/测试文本.txt','utf8')
.then((data) => {
    console.log(data);
})
.catch(err => {
    console.log("读取失败",err.message)
})