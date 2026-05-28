console.log(null == undefined);// true
console.log(null == 0); // false
console.log(null == false); // false
console.log(undefined == 0);// false
console.log(undefined == false);//false


const obj = new String("0")
console.log(obj == "0")   // true，obj 转成 "0" 再比较
console.log(obj == 0)     // true，obj 转成 "0"，"0" 再转成 0

console.log(true == 1)    // true，true 转成 1
console.log(false == 0)   // true，false 转成 0
console.log(true == "1")  // true，true 转成 1，"1" 转成 1

console.log(0 == "0")     // true，"0" 转成 0
console.log(0 == "")      // true，"" 转成 0
console.log(1 == "1")     // true，"1" 转成 1

console.log(Symbol() == 1)  // false，Symbol不和其他类型相等