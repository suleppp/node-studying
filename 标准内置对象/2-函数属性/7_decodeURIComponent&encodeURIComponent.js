// 和encodeURI区别就一条，保留字符也会被编码
// 一般来说，参数值永远用encodeURIComponent编码
let uri = encodeURIComponent("?a=1&b=2");
console.log(uri);
// %3Fa%3D1%26b%3D2


try{
    decodeURIComponent(uri+"%E0%A4%A");
}catch(e){
    console.error("报错信息："+e);
}