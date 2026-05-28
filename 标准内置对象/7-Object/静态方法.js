const user = { id: 101, name: "张三", role: "admin" };
const keys = Object.keys(user); 
console.log(keys)// ["id", "name", "role"]

const vals = Object.values(user);
console.log(vals);// [ 101, '张三', 'admin' ]

const ents = Object.entries(user);
console.log(ents);// [ [ 'id', 101 ], [ 'name', '张三' ], [ 'role', 'admin' ] ]

const back = Object.fromEntries(ents);
console.log(back);// { id: 101, name: '张三', role: 'admin' }

console.log(Object.hasOwn(user,"role"));// true


const config1 = { env: "dev" };
const config2 = { timeout: 3000 };

// 把config2塞进了config1里
const merged = Object.assign(config1, config2);

console.log(config1); //config1已经被永远改变了，变成了 { env: 'dev', timeout: 3000 }
console.log(merged);// { env: 'dev', timeout: 3000 }