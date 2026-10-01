# 第十二章：Promise、`async/await` 与 Event Loop

## 承接第十一章：把 `await` 黑箱打开

第十一章把 `await redis.get(key)` 暂时读作“等待结果再继续”。这个说法能写代码，却不足以调试：如果忘记 await，变量为什么变成 Promise？等待期间调用栈为什么消失？两个请求为什么交错？在 timer、Promise 和 I/O 日志之间怎样判断稳定顺序？

本章不会把 Event Loop 教成一张需要死背的阶段图。我们只建立足以预测和定位异步故障的模型：同步代码先运行到栈清空，异步操作的完成会安排 continuation，Promise handler 通过微任务恢复，Node 在不同阶段处理 timer 和 I/O。

学完后，你应该能在每个 `await` 两侧标出：立即执行了什么、向调用者返回了什么、什么事件会使 continuation 恢复、恢复后哪些局部绑定才完成初始化。

### 纸上推演

对下面程序写出三行日志顺序，并画出 `load()` 调用后调用者拿到的值：

```js
async function load() {
  console.log('B');
  return 42;
}

console.log('A');
const result = load();
console.log('C', result);
```

如果把 `result` 写成 42，先不要改；读完 12.3 后再解释它实际上是什么。

## 12.1 异步不是“这一行在另一个线程跑”

```js
const text = await readConfig();
```

`await` 左右仍有 JavaScript 在主事件循环线程执行。真正的 I/O 可能由操作系统机制或 libuv worker pool 推进，完成后再安排 JavaScript continuation。不要把每个 Promise 想象成自动获得一条新线程。

## 12.2 Promise 是未来结果的容器

Promise 有三类状态：pending、fulfilled、rejected。一旦 settled（fulfilled/rejected），状态和结果不会再次改变。

```js
const promise = loadUser('u1');
```

这里只立即得到 Promise，并不等于用户数据已经得到。要观察：

- 调用函数是否在返回 Promise 前执行了一段同步代码；
- Promise 当前是否 pending；
- 由什么事件让它 settle；
- 谁注册了 fulfillment/rejection handler；
- handler 何时被调度执行。

Promise 构造器的 executor 会同步执行：

```js
new Promise((resolve) => {
  console.log('executor now');
  resolve(1);
});
```

而 `.then(...)` 中的 handler 不会在当前同步栈中立即执行。

## 12.3 `async` 函数一定返回 Promise

```js
async function answer() {
  return 42;
}
```

调用 `answer()` 得到 fulfilled Promise，而不是裸 `42`。在 `async` 函数中抛出错误，会使返回 Promise rejected：

```js
async function fail() {
  throw new Error('boom');
}
```

因此缺少 `await` 常见症状是：

```js
const user = loadUser();
console.log(user.name); // user 是 Promise，不是用户对象
```

第一断点放在赋值后一行，检查 `user` 的真实类型与构造器，而不是先钻进 `loadUser`。

## 12.4 `await` 的暂停与恢复

```js
async function service() {
  const user = await repository.find();
  return format(user);
}
```

概念过程：

1. 同步调用 `repository.find()`，取得一个值/thenable/Promise；
2. 当前 `service` 的此次异步执行暂停；
3. `service` 立即向调用者返回一个 pending Promise；
4. 当前同步调用栈继续并最终清空；
5. 等待对象 fulfilled 后，安排 continuation；
6. continuation 恢复，初始化 `user`，再调用 `format`；
7. `service` 返回的 Promise 随最终结果 settle。

这里“暂停的是 async 函数 continuation”，不是冻结整个 Node 进程。其他可运行回调仍可被事件循环处理。

## 12.5 一个够用的调度模型

先按以下层次理解：

1. 当前同步 JavaScript 运行到栈清空；
2. Node 处理 `process.nextTick` 队列；
3. 处理 Promise/`queueMicrotask` 微任务；
4. 事件循环在不同阶段处理到期 timer、I/O 回调、`setImmediate` 等；
5. 每次适当边界之后还会处理 next tick 与微任务。

Node 当前文档把 `process.nextTick()` 标为 Legacy，通常优先 `queueMicrotask()`。在 CommonJS 顶层，`nextTick` 与 Promise 微任务的常见先后和 ESM 顶层也可能不同，因为 ESM 本身在微任务语境中求值。

不要背诵一个适用于所有上下文的 `setTimeout(0)` 与 `setImmediate` 固定顺序。它们的先后会受注册上下文和事件循环状态影响。从 I/O 回调内部注册时，`setImmediate` 常更有确定性地先进入相应后续阶段；在入口顶层不要把观察到的一次顺序当规范承诺。

## 12.6 `await` 与 `try/catch`

```js
try {
  const user = await loadUser();
  return user;
} catch (error) {
  return fallback(error);
}
```

`await` 会把 rejection 在恢复位置表现为抛出，因此同一 `try/catch` 可以捕获。但如果忘了 `await`：

```js
try {
  return loadUser();
} catch (error) {
  // 通常捕获不到 loadUser 返回 Promise 的稍后 rejection
}
```

使用 `return await loadUser()` 可以让 rejection 在当前 `try` 内被捕获；没有 catch/finally 等需求时是否保留 `return await` 要根据栈追踪、风格和工具决定，不要机械删改。

## 12.7 并发与串行

```js
const a = await loadA();
const b = await loadB();
```

`loadB` 要等 `loadA` 完成后才启动。若彼此独立：

```js
const [a, b] = await Promise.all([loadA(), loadB()]);
```

二者先后启动并并发等待。`Promise.all` 在一个输入拒绝时立即拒绝，但其他已启动操作不会自动取消。调试失败时仍可能看到其他 I/O 后续完成并产生日志/副作用。

并发 bug 要记录请求 ID、开始/结束时间和输入；只靠逐行暂停会改变时序，导致故障消失（Heisenbug）。这时 Logpoint、结构化日志和可控延迟更有价值。

## 12.8 Event Loop 阻塞

“用了 async”不保证不阻塞：

```js
async function expensive() {
  let total = 0;
  for (let i = 0; i < 2_000_000_000; i += 1) total += i;
  return total;
}
```

函数直到遇到真正异步让出点之前都同步运行，巨量循环会阻塞事件循环。同步文件 API、大 JSON 处理、灾难性正则和 CPU 计算也会让所有请求等待。断点本身也会人为阻塞当前 JavaScript 执行，所以测性能时不要用暂停时间当真实耗时。

## 12.9 异步调用栈怎么读

暂停在 `await` 之后时：

- 当前同步帧描述“现在正在执行谁”；
- async stack trace（若调试器保留）描述“此前谁建立了这条异步因果链”；
- 它不表示所有旧函数一直占着真实栈；
- 日志中的 error stack 可能因创建错误、重新包装或 source map 而不同。

先找到当前业务帧，再沿 async 链找调度者；不要把 Node 内部帧当根因。

## 12.10 实验

```bash
node examples/08-event-loop/app.js
```

先预测稳定关系，不预测不受保证的细节：

- 所有同步日志先于异步回调；
- CommonJS 顶层的 `process.nextTick` 先于已排队 Promise/queueMicrotask；
- `.then` 不会插入正在执行的同步函数中间；
- timer 的 delay 是“最早有资格执行”，不是精确执行时刻。

然后调试 `examples/09-async-stack/app.js`，分别在 `await` 前后暂停，比较 Call Stack。

## 停止阅读检查

1. Promise executor 与 `.then` handler 分别何时执行？
2. `await` 暂停的是整个进程吗？
3. `Promise.all` 失败后会自动取消其他任务吗？
4. 为什么不能永远背诵 `setTimeout(0)` 与 `setImmediate` 的固定顺序？

## 本章收束：异步边界没有取消因果关系

`await` 会让同步栈暂时断开，但没有让数据“神秘地自己回来”。Promise 的 settle 触发 continuation，continuation 在新的同步执行片段中恢复，并携带先前 async 函数所需状态。调试器的 async stack 只是帮助还原这条因果链。

到这里，第三阶段所需零件已经齐全：CommonJS 解释模块实例，Redis 章节解释连接与缓存事实，本章解释异步边界。下一章把它们组装成完整 HTTP → Service → Redis/Repository → Mongo 项目。不要逐文件背代码，要追踪同一个 `requestId`、`userId` 和用户对象。


参考：[Node.js Process 文档](https://nodejs.org/api/process.html)、[Node.js Timers 文档](https://nodejs.org/api/timers.html)、[不要阻塞 Event Loop](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop)。
