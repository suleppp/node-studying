console.log(Object.is(+0, -0))   // false，===  认为相等，Object.is 认为不等
console.log(Object.is(NaN, NaN)) // true，=== 认为不等，Object.is 认为相等