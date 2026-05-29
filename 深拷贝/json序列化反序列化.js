const obj = {
    name: "Tom",
    age: 18,
    address: {
        city: "上海"
    }
}

const copy = JSON.parse(JSON.stringify(obj));
console.log(copy)
// { name: 'Tom', age: 18, address: { city: '上海' } }

const obj2 = {
    fn: function() {},       // 丢失
    sym: Symbol('test'),     // 丢失
    date: new Date(),        // 变成字符串
    undef: undefined         // 丢失
};

const copy2 = JSON.parse(JSON.stringify(obj2));
console.log(copy2); // { date: '2026-05-29T09:46:54.778Z' }，其他都没了