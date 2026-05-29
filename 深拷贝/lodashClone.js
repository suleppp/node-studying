const lodash = require('lodash')


const obj = {
    name: 'test',
    fn: function() { return 'hello'; },
    date: new Date(),
    nested: { arr: [1, 2, 3] }
};

const copy = lodash.cloneDeep(obj);
copy.nested.arr.push(444);
console.log("copy：",copy);
console.log("obj：",obj);

// copy： {
//   name: 'test',
//   fn: [Function: fn],
//   date: 2026-05-29T09:59:36.034Z,
//   nested: { arr: [ 1, 2, 3, 444 ] }
// }
// obj： {
//   name: 'test',
//   fn: [Function: fn],
//   date: 2026-05-29T09:59:36.034Z,
//   nested: { arr: [ 1, 2, 3 ] }
// }