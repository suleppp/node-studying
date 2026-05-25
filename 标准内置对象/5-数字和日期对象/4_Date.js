const { doesNotMatch } = require("node:assert")
const { errors } = require("undici-types")

console.log(new Date())                        // 当前时间
console.log(new Date(1000))                    // 时间戳，1970年1月1日后1000毫秒
console.log(new Date(1995, 11, 17))            // 年月日，月份从0开始，11是12月
console.log(new Date(1995, 11, 17, 3, 24, 0)) // 年月日时分秒





