const os = require('os')


// console.log("loadavg数组：",os.loadavg());
// console.log("过去1分钟负载：",os.loadavg()[0]);
// console.log("过去5分钟负载：",os.loadavg()[1]);
// console.log("过去15分钟负载：",os.loadavg()[2]);


// console.log("主机名：",os.hostname());
// // 主机名： DESKTOP-BRCKNOC

// console.log(os.tmpdir());
// // C:\Users\yigan\AppData\Local\Temp

console.log(os.platform());
// win32