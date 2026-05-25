// 首先补充一下URI和URL的概念
// URI是一个更大的概念，包含URL，
// 所有URL都是URI，但URI不一定是URL
// URI是统一资源标识符，只能代表这个资源的唯一标识
// URL是统一资源定位符，在前者的基础上加上了位置信息，告诉你怎么找

// URL中只能包含ASCII字符
// 对于中文，空格和某些特殊字符不能直接放在URL当中
// 需要先转成%xx格式，这就是URI编码，
// encodeURI负责编码，decodeURI负责解码

// encodeURI
let uri = encodeURI("https://example.com/你好?a=1&b=2");
console.log(uri);
// https://example.com/%E4%BD%A0%E5%A5%BD?a=1&b=2
// 中文被编码，?，=和&被保留，因为这些字符在URL中有特定含义
// 如果这三个字符也被编码了，
// URL结构就被破坏了，浏览器没法正确解析这个URL了
// 完整的保留字符有
// ; , / ? : @ & = + $
// #
// 字母，数字
// - _ . ! ~ * ' ( )
// 由于这些字符被保留了，所以不适合编码查询参数值
// 因为如果参数值中带有这些参数，会被误判

// decodeURI
uri = decodeURI(uri);
console.log(uri);
// https://example.com/你好?a=1&b=2

// 如果是不完整的编码序列，会抛出URIError
try{
    decodeURI("%E0%A4%A");
}catch(e){
    console.error("报错信息："+e);
}