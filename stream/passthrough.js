const {PassThrough} = require('stream')

const pass = new PassThrough();

pass.write("hello");

pass.end();

pass.on("data",chunk => {
    console.log(chunk.toString()); // hello
})