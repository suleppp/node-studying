const fs = require('fs');

//监控文件变化
fs.watch('./res/测试文本.txt',(eventType,filename) => {
    console.log("事件类型：",eventType);
    console.log("文件名：",filename);
})
// 一次修改中可能触发多次回调，这是操作系统层面的问题
// 事件类型： change
// 文件名： 测试文本.txt
// 事件类型： change
// 文件名： 测试文本.txt
// 事件类型： change
// 文件名： 测试文本.txt
// 事件类型： change
// 文件名： 测试文本.txt

//监控文件夹变化
fs.watch('./res',(eventType,filename) => {
    console.log("事件类型：",eventType);
    console.log("文件名：",filename);
});
