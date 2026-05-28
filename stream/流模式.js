const {Transform} = require('stream')

const binStream = new Transform(
    {
        transform(chunk, encoding, callback){
            console.log("binary：",chunk);
            this.push(chunk);
            callback();
        }
    }
)


binStream.write("hello");
// binary： <Buffer 68 65 6c 6c 6f>

const objStream = new Transform(
    {
        objectMode: true,
        transform(chunk, encoding, callback){
            console.log("object：",chunk);
            this.push(chunk);
            callback();
        }
    }
)

objStream.write({ name: 'tom', age: 30 });
// object： { name: 'tom', age: 30 }