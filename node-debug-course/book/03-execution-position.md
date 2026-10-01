# 第三章：一行代码内部的执行顺序

## 承接第二章：到达第一行不等于理解这一行

第二章解释了进程如何来到入口模块。现在把视角缩小：当调试器指向某一行，程序究竟准备做什么？

这一章是之后所有单步操作的语言基础。没有表达式求值顺序，Step Into 看起来像随机跳转；不区分声明已建立与初始化已完成，Variables 面板中的 `undefined`、不可用状态就会被错误解释；不识别短路，函数断点未命中就会被误认为调试器失效。

本章结束时，你应能对一行代码写出“执行前状态—内部步骤—执行后状态”，并明确指出哪些步骤会产生副作用。

### 纸上推演

在阅读 3.1 前，给下面四个动作编号：调用 `getLeft`、调用 `getRight`、调用 `add`、调用 `console.log`。

```js
console.log(add(getLeft(), getRight()));
```

再写下：如果 `getLeft()` 抛错，后面三个动作中哪些不会发生？这份预测会贯穿本章。

## 3.1 源代码行不是最小执行单位

```js
console.log(add(getLeft(), getRight()));
```

这是一行源代码，却至少涉及：

1. 求值 `console`；
2. 取得 `log` 属性和调用信息；
3. 调用 `getLeft()` 并等待返回；
4. 调用 `getRight()` 并等待返回；
5. 调用 `add(left, right)` 并等待返回；
6. 用结果调用 `console.log`。

确切细节受语言规范和实现影响，但调试上最重要的结论是：一行可能包含多个调用、求值和副作用。Step Into 也可能在同一行进入多个不同函数。

## 3.2 表达式、语句与副作用

表达式产生值，例如：

```js
a + b
user.name
createUser('Ada')
```

语句控制执行或声明结构，例如 `if`、`return`、`const` 声明。函数调用、赋值、属性修改、I/O 都可能产生副作用。调试前要先标出一行中的副作用点：

```js
users[index++].balance += charge(card());
```

这类紧凑代码很难安全观察，因为 Watch 或 Debug Console 中重复执行部分表达式也可能再次改变状态。学习阶段优先把它拆开：

```js
const currentIndex = index;
index += 1;
const payment = card();
const amount = charge(payment);
users[currentIndex].balance += amount;
```

拆开不是为了让程序“更低级”，而是让每一步的输入、输出和副作用都可以被断点验证。

## 3.3 赋值右侧通常要先完成

```js
const result = add(10, 20);
```

概念顺序是：

1. 当前作用域已经为 `result` 建立词法绑定，但尚未完成初始化；
2. 求值右侧 `add(10, 20)`；
3. 进入 `add`，调用者暂停在等待返回的位置；
4. `add` 返回 `30`；
5. 用 `30` 初始化 `result`；
6. 继续下一条语句。

所以刚进入 `add` 时，调用者的 `result` 还不是“已经得到 30”。对 `const` 来说，也不应简单说它“当前等于 undefined”；它仍处于初始化尚未完成的阶段。

## 3.4 黄色箭头表示什么

在普通 JavaScript 调试中，VS Code 黄色箭头通常表示当前暂停的源位置，也就是恢复后将从哪里继续。把它读作“准备执行这里”比“这一行执行完了”更安全。

例如暂停在：

```js
const total = subtotal + tax;
```

通常此时上一行已完成，而 `total` 的初始化还没有完成。按一次 Step Over 后箭头移动到下一行，此时才检查 `total`。

但需要保留边界意识：调试器实际暂停在生成代码/字节码的位置，再通过 source map 映射回源代码。压缩代码、TypeScript、异步恢复、引擎优化或一行多个表达式都可能让箭头没有“课本式一行一步”那么直观。

## 3.5 条件判断何时发生

```js
if (isAllowed(user) && charge(user.card)) {
  sendReceipt();
}
```

`&&` 会短路：如果 `isAllowed(user)` 为假，`charge` 不执行。若在 `charge` 的断点没有命中，不一定是断点坏了，可能是控制流根本没到那里。

同理：

- `a || b`：`a` 为真值时不求值 `b`；
- `a ?? b`：`a` 不是 `null`/`undefined` 时不求值 `b`；
- `condition ? left : right`：只执行其中一个分支；
- `obj?.method()`：`obj` 为空值时不会调用方法。

调试“不执行”的代码，先在分支入口或条件表达式处验证路径，而不是只在目标函数内部下断点。

## 3.6 异常会改变正常顺序

```js
const parsed = JSON.parse(input);
save(parsed);
```

如果 `JSON.parse` 抛错，`parsed` 不会完成初始化，`save` 也不会执行。控制流会寻找最近匹配的 `catch`；找不到时沿调用栈向上展开。打开“Caught Exceptions”或“Uncaught Exceptions”暂停，可以在错误刚抛出的地方观察，而不是只看最后打印错误的统一错误处理器。

## 3.7 实验

在 `examples/03-order/app.js` 的 `const result = combine(...)` 处下断点：

1. 先写下你预测的日志顺序；
2. 使用 Step Into，记录每次进入的函数；
3. 重启后用 Step Over，比较它和 Step Into 的差异；
4. 把 `allow` 改为 `false`，验证短路行为。

## 停止阅读检查

1. 为什么“断点在一行上”不代表这一行只有一个动作？
2. 刚进入赋值右侧调用的函数时，左侧 `const` 是什么状态？
3. 目标函数断点没命中，至少有哪些可能？
4. 为什么不应该在 Debug Console 随便执行带副作用的表达式？

## 本章收束：黄色箭头两侧是两份状态

以后每逢暂停，把纸分成两栏：左边写当前源位置之前已经成立的事实，右边写执行该位置后才会成立的事实。调试不是盯着箭头猜，而是通过一次单步把右栏预测变成可观察事实。

还有一个缺口：当右侧表达式调用 `add()` 时，调用者为什么能停下，`add()` 返回后又为什么知道回到赋值中间？只看单行求值无法保存这种嵌套关系。第四章将引入调用栈和 Stack Frame。

