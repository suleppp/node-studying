// 语法错误，解析代码的时候就会抛出
try{
    eval("hello }") ;
}catch(e){
    console.log("错误信息："+e)
}