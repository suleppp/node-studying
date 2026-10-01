# 第四章：函数调用、Stack Frame 与返回位置

## 承接第三章：表达式进入函数以后，谁保存未完成的工作

第三章把 `const total = add(10, 20)` 拆成“先求右侧、再初始化左侧”。一旦进入 `add`，调用者 `main` 并没有消失，它只是无法继续完成那条赋值。运行时必须保存这次调用的参数、局部状态和返回后要继续的位置。

调用栈就是理解这种嵌套控制流的核心模型。后面 VS Code 的 Call Stack、异常堆栈、递归、Step Out 乃至 async stack 都是在这个模型上增加信息。

学完本章，你不只要会从上到下读函数名，还要能点击任意活动帧后解释：这一次调用的输入是什么、为什么还没返回、上层正在等它完成哪一段表达式。

### 纸上推演

对 `factorial(3)` 先画三个空框。每进入一次函数就在顶部加一框，并写入当前 `n`；每 return 一次就删除顶部框，把结果送到下一框。不要运行代码，先手算完整变化。

## 4.1 调用者为什么能在返回后继续

```js
function add(a, b) {
  const result = a + b;
  return result;
}

function main() {
  const total = add(10, 20);
  console.log(total);
}

main();
```

执行 `add(10, 20)` 时，`main` 不能继续完成赋值，因为它还没有右侧结果。运行时需要保存“`main` 正在等待 `add` 的返回值，返回后还要完成赋值并执行日志”等状态，然后进入 `add`。

调试器把每次活动函数调用显示为一个 Stack Frame（栈帧）。有用的概念模型是：

```text
顶部（当前执行）  add(a=10, b=20)
                  返回后 → main 中完成 total 初始化
下方              main()
                  返回后 → 入口模块继续/结束
底部              入口模块
```

实际 V8 会优化和采用复杂的内部表示，不能把栈帧简单等同为一段固定内存。但对观察调用关系、局部变量和返回路径，这个模型足够可靠。

## 4.2 每次调用都有自己的局部状态

递归最能展示这一点：

```js
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
```

调用 `factorial(3)` 时，栈中会同时存在多个 `factorial` 帧，但每一帧的 `n` 不同：

```text
factorial(n=1)
factorial(n=2)
factorial(n=3)
入口模块
```

在 Call Stack 面板点击不同帧，Variables 会切换到那个调用当时的局部上下文。你没有让程序倒退，只是在查看不同活动帧保存的状态。黄色箭头也可能显示所选帧的源位置；真正最顶部的暂停点仍是最上方活动帧。

## 4.3 `return` 做了什么

执行 `return expression` 时，概念上发生：

1. 求值 `expression`；
2. 结束当前函数的正常执行；
3. 当前调用帧退出活动栈；
4. 把结果交回调用位置；
5. 调用者恢复并继续未完成的表达式。

没有显式 `return` 的普通函数会返回 `undefined`。`return` 后的同一控制路径代码不可达。

`try/finally` 是重要例外：

```js
function work() {
  try {
    return 1;
  } finally {
    console.log('cleanup');
  }
}
```

返回前仍会执行 `finally`。如果 `finally` 自己 `return` 或抛错，它甚至能替换原返回结果或错误。这是排查“明明 return 了却结果不对”的高级检查点。

## 4.4 抛错会展开调用栈

```js
function parseConfig(text) {
  return JSON.parse(text);
}

function loadConfig() {
  return parseConfig('{broken');
}

loadConfig();
```

错误从 `JSON.parse` 发生处沿调用链向上寻找 `catch`。没有匹配处理器的帧会退出，这叫栈展开。错误对象上的 `stack` 通常记录错误创建/抛出附近的调用路径，因此堆栈跟踪应该从最上方第一条属于自己项目的代码开始读，再沿调用者向下理解输入从哪里来。

## 4.5 同步调用栈不是完整历史

当异步回调稍后执行时，启动异步操作的同步函数通常早已返回：

```js
function schedule() {
  setTimeout(runLater, 10);
}

function runLater() {
  debugger;
}

schedule();
```

暂停在 `runLater` 时，普通同步调用栈里通常没有活动的 `schedule` 帧。调试器可能额外显示 async stack trace，帮助关联“是谁安排了这个异步任务”，但它是调试器追踪的异步因果信息，不等于那些函数帧一直留在真实同步栈上。

## 4.6 栈溢出

没有终止条件的递归会不断增加调用帧，最终出现类似 `RangeError: Maximum call stack size exceeded`：

```js
function forever() {
  return forever();
}
```

这和“JavaScript 堆内存不足”不同。前者首先是调用深度问题，后者通常是对象等堆数据持续增长。两者可能互相影响，但调试入口不同。

## 4.7 实验

在 `examples/04-stack/app.js` 的 `return 1` 行暂停：

1. 画出 Call Stack，从顶部到入口；
2. 依次点击三个递归帧，记录每个 `n`；
3. 使用 Step Out，预测下一次会停在哪一帧；
4. 观察每层返回结果如何组成最终答案。

## 停止阅读检查

1. 为什么同一个函数能同时在调用栈出现多次？
2. 点击旧栈帧是否会让程序回到过去？
3. `return` 后一定立刻离开函数吗？说出一个例外结构。
4. 为什么异步回调的普通调用栈里可能找不到调度它的函数？

## 本章收束：调用栈是一条“正在等待”的链

Call Stack 不只是“来过哪些函数”的历史列表。列表中的每一层都仍是活动调用，正在等待上层被调用者返回；已经正常返回的调用不会继续留在同步栈中。错误栈和调试器保存的 async 因果链可以记录更多历史，但必须和当前活动栈区分。

现在我们已经能在纸上描述当前执行位置和栈帧。下一步才轮到调试器：它如何与 Node 进程通信、怎样让执行在某个可暂停位置停下，又为什么有些红点会变灰或移动？

