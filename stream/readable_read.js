const fs = require('fs');

const rs = fs.createReadStream('./res/test.txt',{
    highWaterMark:5
})

rs.on('readable',() => {
    let chunk;
    while((chunk = rs.read()) !== null){
        console.log(chunk.toString());
    }
});

rs.on("end",() => {
    console.log("读完了")
})