// 每次创建都是唯一的，永远不会重复
const s1 = Symbol("foo"); //里面传入的字符串是描述
const s2 = Symbol("foo");
console.log(s1 === s2)  // false，描述一样但不是同一个

console.log(s1.description); //"foo"

// 主要用途是作为对象唯一key
const id = Symbol("id")

const user = {
    name: "Tom",
    [id]: 123  // 用 Symbol 作为 key，方括号语法
}

console.log(user[id]);// 123

//跨文件共享同一个Symbol
const s3 = Symbol.for("id");
const s4 = Symbol.for("id");
console.log(s3 ===  s4);

//返回字符串描述
console.log(s3.toString());//"Symbol(id)"
console.log(s3.valueOf())// Symbol(id)