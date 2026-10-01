# 第十章：CommonJS、`require()` 与模块缓存

## 从单文件调试跨出第一步

前九章刻意把主要状态放在一个文件中。真实 Node 项目不会如此：入口 require 配置，Service require Repository，连接模块导出 client。你在 `redis-client.js` 下断点一次，却看到五个调用者都在使用它；或者修改模块顶层变量后，另一个文件也观察到变化。

要解释这些现象，仍然从第一章的进程边界开始：模块缓存属于某个加载器所在的进程。再叠加第二章的模块包装和第七章的对象引用，就能得到 CommonJS 的状态共享模型。

本章先保持同步，只增加文件边界。学完后，你应能画出模块依赖图，指出每个文件首次执行时机、导出的对象引用和缓存所属范围。

### 纸上推演

假设 `a.js` 与 `b.js` 都 `require('./counter')`，counter 顶层把 `count` 初始化为 0。`a` 加一后 `b` 读取，结果是什么？再假设 `a.js` 与 `b.js` 分别由两个 Node 进程执行，答案是否改变？写出“为什么”，而不是只写数字。

## 10.1 `require()` 不是文本粘贴

```js
const counter = require('./counter');
```

可以用四个词理解：**解析、加载、执行、缓存**。

1. 解析请求 `./counter`，确定实际文件；
2. 若缓存已有该模块，通常直接取缓存导出；
3. 否则读取并解析文件，创建 Module 对象；
4. 在模块包装作用域中执行顶层代码；
5. 返回 `module.exports`，并缓存模块。

它不是把 `counter.js` 文本复制进当前文件。两个文件有各自模块作用域，但可以通过导出的对象共享引用。

## 10.2 三类请求的解析起点

```js
require('node:fs');       // Node 内置模块
require('./counter');     // 相对于“发起 require 的模块”解析
require('some-package');  // 包解析，会查找 node_modules/exports 等
```

相对 `require('./x')` 不是相对于 `process.cwd()`，而是相对于当前模块所在目录。这与 `fs.readFileSync('./x')` 常按工作目录解析形成鲜明对比。

遇到“加载的不是我想的文件”，使用：

```js
console.log(require.resolve('./counter'));
```

先拿到绝对解析结果，再检查同名文件、扩展名、包入口和工作区。

## 10.3 `module.exports` 与 `exports`

模块最终返回的是 `module.exports`。

```js
exports.add = (a, b) => a + b;
```

开始时 `exports` 是 `module.exports` 的快捷引用，因此给它添加属性有效。下面写法无效：

```js
exports = function add(a, b) {
  return a + b;
};
```

这里只让局部变量 `exports` 指向新函数，没有修改 `module.exports`。要整体替换应写：

```js
module.exports = function add(a, b) {
  return a + b;
};
```

调试空导出 `{}` 时，在模块最后同时观察 `exports === module.exports` 和两个对象的值。

## 10.4 缓存意味着“同一进程中通常只执行一次”

```js
// state.js
console.log('state module initialized');
let count = 0;
module.exports = {
  increment() { count += 1; },
  getCount() { return count; }
};
```

两个模块只要解析到同一个文件，通常拿到同一份缓存导出，闭包中的 `count` 也被共享。模块顶层初始化日志只打印一次。

边界必须说清：

- 缓存属于当前 Node 进程，不跨进程共享；
- 缓存键与解析后的文件名有关；
- 不同解析结果可能得到不同模块实例；
- worker thread 有自己的模块环境；
- ESM 有自己的加载与缓存机制，不使用 `require.cache`；
- 手工删除 `require.cache` 可以触发重新加载，但容易留下旧引用和重复资源，不应当作常规热重载方案。

## 10.5 “单例”并不等于全系统只有一个

很多连接模块这样写：

```js
const client = createClient();
module.exports = client;
```

它最多表示每个模块缓存实例一份。如果 nodemon 启动了新子进程，集群有四个 worker，或者测试进程并行运行，就会有多份 client。它们可以连接同一外部 Redis，但不是同一个 JavaScript 对象，也不是同一条网络连接。

真实问题要问：“每个什么范围单例？”可能是每个模块加载器、每个进程、每个容器，还是整个部署。

## 10.6 模块顶层副作用

```js
// redis-client.js
const client = connectImmediately();
module.exports = client;
```

首次 `require` 就建立连接，这会导致：

- 导入顺序影响启动；
- 测试难以在连接前替换配置；
- 循环依赖时拿到半初始化对象；
- 只想读取一个辅助函数也触发外部资源；
- 错误可能发生在入口业务代码之前。

更可控的设计是显式生命周期：

```js
let client;

async function connect(options) {
  if (client) return client;
  client = await createClient(options);
  return client;
}

function getClient() {
  if (!client) throw new Error('Redis client is not connected');
  return client;
}

module.exports = { connect, getClient };
```

这仍需要考虑并发调用 `connect()`：更严谨的版本通常缓存“正在连接的 Promise”，避免同时建立多条连接。

## 10.7 循环依赖与部分导出

若 `a.js` require `b.js`，而 `b.js` 又 require `a.js`，Node 为了完成循环可能把“尚未执行完成”的 exports 交给其中一方。症状常见为某个函数在启动时是 `undefined`，但换一下导入顺序似乎又好了。

调试步骤：

1. 看完整警告和栈；
2. 在两个模块顶层第一行、require 前后、最后一行设断点；
3. 观察 `module.loaded`、`module.children` 和导出键；
4. 画依赖环；
5. 把共享接口抽到第三个无副作用模块，或通过依赖注入打破环。

不要通过随机移动 require 顺序“修好”而不理解环；它往往只是改变哪个模块先看到半成品。

## 10.8 实验

```bash
node examples/06-commonjs/app.js
```

依次观察：

- 同一个模块初始化日志出现几次；
- `first === second` 为什么为真；
- 两个消费者为什么共享计数；
- `require.resolve('./counter')` 的绝对路径；
- `require.cache[resolved].loaded` 和导出内容。

## 停止阅读检查

1. 为什么 `require('./x')` 与读取 `./x` 文件的相对基准可能不同？
2. `exports = value` 为什么通常不能整体导出 value？
3. CommonJS 单例在哪些情况下会变成多份？
4. 循环依赖为什么会暴露部分初始化的导出？

## 本章收束：文件边界不等于状态副本

`require()` 把代码组织成模块，但解析到同一文件的调用者通常共享缓存导出。这个结论解释了为什么连接模块可以向多个 Service 提供同一个 client，也解释了测试污染和模块顶层副作用为什么难查。

下一章把导出的普通 counter 换成一个具有连接生命周期和外部数据语义的 Redis client。你会第一次同时观察“模块内共享对象”和“对象内部状态机”。异步机制暂时只使用最低限度的 `await` 契约，完整原因留到第十二章。


参考：[Node.js CommonJS 官方文档](https://nodejs.org/api/modules.html)。
