const fs = require('fs');

// 异步创建文件夹
fs.mkdir('./temp', err => {
    console.log('111');
})

// 递归异步创建文件夹
fs.mkdir('./1/2/3',{recursive: true}, err => {
    console.log('222');
})

// 递归同步创建文件夹
fs.mkdirSync('./1/2/3/4/5',{recursive: true});

// ====
// 异步读取文件夹
fs.readdir('.',(err,data) => {
    if(err){
        console.log(err);
        return;
    }
    console.log(data);
})

// 同步读取文件夹
let data = fs.readdirSync('.');
console.log('同步读取\r\n'+data);


// ====
// 异步删除文件夹 不能递归删除 报错会显示文件夹不为空 报错如果没有被catch，后面代码就不会执行
fs.rmdir('./1',err => {
    if(err){
        throw err;
    }
    console.log('删除成功');
})

// 递归异步删除文件夹，但是rmdir现在被废弃，用rm代替
fs.rmdir('./1',{recursive: true},err => {
    if(err){
        throw err;
    }
    console.log('删除成功');
})