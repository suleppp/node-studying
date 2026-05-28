// const complexData = {
//     level1: {
//         level2: {
//             level3: {
//                 level4: { secret: "层级4" }
//             }
//         }
//     }
// };

// // 使用 log 打印
// console.log(complexData);
// // { level1: { level2: { level3: [Object] } } }

// console.dir(complexData,{depth:null})
// //{ level1: { level2: { level3: [Object] } } }
// //{
// //  level1: {
// //    level2: { level3: { level4: { secret: '层级4' } } }
// //  }
// //}

// 按下秒表
console.time("标签1"); 

for(let i = 0; i < 1000000; i++) {} 

// 必须传入一模一样的标签
console.timeEnd("标签1"); 
// 标签1: 2.219ms