// 表示URI编解码的时候传入了无效的参数
try {
    decodeURI("%")
} catch (e) {
    console.log(e instanceof URIError)  // true
    console.log(e.message)              // "URI malformed"
}