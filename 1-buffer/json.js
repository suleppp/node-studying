const buf = Buffer.from("hello")
const jsonStr = JSON.stringify(buf);
console.log(jsonStr);
// {"type":"Buffer","data":[104,101,108,108,111]}

const parsedObj = JSON.parse(jsonStr);
console.log(parsedObj);
// { type: 'Buffer', data: [ 104, 101, 108, 108, 111 ] }

try{
    // 调用Buffer专属api
    parsedObj.subarray(0,1);
    parsedObj.data.subarray(0,1);
}catch(e){
    console.log("调用报错");
}


// 真正的处理方式
if(parsedObj && parsedObj.type === 'Buffer'){
    const restoredBuf = Buffer.from(parsedObj.data);
    console.log(restoredBuf.toString());
}