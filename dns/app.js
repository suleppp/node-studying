const dns = require('dns');

let ip;
// 域名转ip，行为和浏览器一样，会看本地hosts文件
dns.lookup("baidu.com",(err,address,family) => {
    ip = address;
    console.log("ip：",address);
    console.log("协议：",family);

    // 反向查询，ip转域名
    dns.reverse(ip,(err,hostnames) => {
        console.log(hostnames)
    })
})





// 查询所有ip，不走hosts，一个域名可能对应多个ip
dns.resolve("baidu.com",(err,addresses) => {
    console.log(addresses);
})