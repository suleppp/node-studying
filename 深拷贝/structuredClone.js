const obj = {
    name: 'test',
    date: new Date(),
    map: new Map([['key', 'value']]),
    nested: { arr: [1, 2, 3] }
};

const copy = structuredClone(obj);

copy.nested.arr.push(444);
console.log("copy：",copy);
console.log("obj：",obj);

// copy： {
//   name: 'test',
//   date: 2026-05-29T09:55:18.279Z,
//   map: Map(1) { 'key' => 'value' },
//   nested: { arr: [ 1, 2, 3, 444 ] }
// }


// obj： {
//   name: 'test',
//   date: 2026-05-29T09:55:18.279Z,
//   map: Map(1) { 'key' => 'value' },
//   nested: { arr: [ 1, 2, 3 ] }
// }