const {Transform} = require('stream');

const transform = new Transform(
    {
        transform(chunk,encoding,callback){
            this.push(chunk.toString().toUpperCase())
            callback();
        }
    }
)


transform.write('hello');
transform.write('world');
transform.end();

transform.on('data', chunk => {
  console.log(chunk.toString());  // HELLO WORLD
});