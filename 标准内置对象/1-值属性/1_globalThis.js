// 在任何环境中都指向全局对象
// 在浏览器中就是window，在nodejs中就是global
console.log(globalThis === global)

// globalThis在任何环境都等同于全局对象
globalThis.console.log('hello1');
global.console.log('hello2')

// 什么是全局对象？
// 全局对象是一个特殊的对象，挂在上面的属性和方法不需要任何前缀，
// 在任何地方直接用。比如 console.log、setTimeout，
// 你没有导入任何东西就能直接用，因为它们挂在全局对象上。