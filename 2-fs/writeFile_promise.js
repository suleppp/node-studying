const fsPromise = require('fs/promises')

fsPromise.writeFile('./res/测试文本.txt',"hahahah")
.then(() => {
    console.log("写入成功");
})
.catch(err => {
    console.log("写入失败")
})