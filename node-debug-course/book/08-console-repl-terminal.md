# 第八章：Debug Console、Node REPL 与 Terminal 彻底区分

这三个界面都能看到字符和输入光标，但输入会交给完全不同的执行者。

第七章已经证明：局部变量属于某个目标进程的某个活动栈帧。因此，只有通过调试协议在该帧求值的 Debug Console 才可能直接访问它。Node REPL 会创建另一个进程，Terminal 首先把输入交给 shell——这一章其实是在应用第一章的进程边界和第五章的调试器连接模型。

本章目标不是背对照表，而是形成一个固定反问：**我输入的字符最终由谁解释，它属于哪个进程和上下文？**

### 先做一个故意的错误实验

暂停在 `calculateInvoice` 内，记录当前 PID 和局部 `price`。再开普通 Terminal 输入 `price`，然后启动 Node REPL 再输入 `price`。保留两次失败信息。最后在 Debug Console 输入 `price`，用三个结果证明上下文差异。

## 8.1 一张先记住的对照表

| 工具 | 谁接收输入 | 默认上下文 | 能否看到暂停帧局部变量 | 典型用途 |
|---|---|---|---|---|
| Debug Console | VS Code 调试器 | 当前调试会话、当前所选栈帧 | 能 | 求值、验证假设、看调试输出 |
| Node REPL | 一个独立 Node 进程 | REPL 自己的全局/模块上下文 | 不能 | 试验 JavaScript/Node API |
| Terminal | shell | 当前终端的目录、环境和进程 | 不能直接看到 | 启动命令、管理文件、查看 stdout/stderr |

## 8.2 Debug Console

只有在活动调试会话中，Debug Console 才能对暂停上下文求值：

```js
price * quantity
Object.keys(user)
request.headers.authorization
```

求值基于当前选择的 Stack Frame。切换帧后，同一个名字可能得到不同值或报未定义。

适合做：

- 读取无副作用的表达式；
- 验证类型、长度、关键字段；
- 调用纯函数比较预期结果；
- 临时修改值以验证一个明确假设（随后重启）；
- 查看调试会话的 console 输出。

谨慎或禁止做：

```js
await redis.flushAll()
await user.save()
queue.splice(0)
process.exit()
```

这些会真实修改数据、发送网络请求、清空集合或终止进程。Debug Console 不是沙盒。

## 8.3 Node REPL

在终端运行：

```bash
node
```

会启动一个新的 Node 进程，出现 `>` 提示符。这是 Read–Eval–Print Loop：读取输入、求值、打印结果、继续循环。

```js
> const path = require('node:path')
> path.join('a', 'b')
'a/b'
```

这个 REPL 与正在调试的应用通常 PID 不同、堆不同、模块缓存不同、连接不同。你在 REPL 中 `require('./service')` 会在 REPL 进程加载一份模块，不会凭空读取应用进程里的局部变量或复用其内存连接。

REPL 适合回答“这段 API 一般怎样工作”，不适合回答“那个暂停请求里的 `user` 当前是什么”。

## 8.4 Terminal

终端承载 shell。输入：

```bash
node app.js
```

是让 shell 启动一个新 Node 进程；输入：

```bash
pwd       # PowerShell 可用 Get-Location
```

是让 shell 打印它的当前工作目录。Terminal 还能承载应用的标准输入、标准输出和标准错误。

终端里看见 `>` 并不必然是 Node REPL；不同 shell、数据库客户端和程序都可以有自己的提示符。通过刚才启动的命令和 PID 判断“我在跟谁说话”。

## 8.5 最容易犯的四种错误

### 错误一：在 Terminal 输入局部变量名

shell 会把它当命令，而不是 JavaScript。`user` 可能得到“command not found”。

### 错误二：在 Node REPL 认为已复用应用连接

REPL 是新进程。即使连接到同一个 Redis，它也是另一个客户端连接，拥有独立内存和模块状态。

### 错误三：调试结束后继续在 Debug Console 求值

栈帧已经不存在，求值上下文也结束。重新启动会话并再次暂停。

### 错误四：把日志区域当成只读窗口

Debug Console 输入能执行真实表达式。读取 getter、调用函数、展开 Proxy 都可能有副作用。

## 8.6 安全求值的分级

由低到高：

1. 原始值读取：`userId`、`typeof value`；
2. 普通对象字段：`user.profile?.name`；
3. 无副作用标准函数：`Array.isArray(items)`；
4. 项目“声称纯”的函数：仍需确认实现；
5. getter、Proxy、迭代器：可能执行代码；
6. 业务方法、数据库/缓存客户端：可能修改外部状态；
7. 删除、支付、发送、退出等命令：高风险。

## 8.7 实验

1. 调试 `examples/05-scope/app.js`，暂停后在 Debug Console 求值局部 `invoice`。
2. 另开普通终端进入 Node REPL，输入同一个名字，解释为什么看不到。
3. 在 REPL 执行 `process.pid`，再在 Debug Console 执行 `process.pid`，证明是不同进程。
4. 退出 REPL（输入 `.exit` 或按两次 `Ctrl+C`），不要误停正在调试的程序。

## 停止阅读检查

1. 哪个工具能看到当前暂停函数的参数？为什么？
2. Node REPL 中 `require()` 的模块缓存属于谁？
3. Debug Console 读取一个 getter 是否必然无副作用？
4. 需要向程序输入一行文本时，为什么通常选 `integratedTerminal`？

## 本章收束：先确认解释者，再输入表达式

以后看到任何输入框，先确认它背后的解释者：shell、独立 REPL，还是调试器连接的暂停帧。这个习惯也会保护真实数据，因为你会意识到 Debug Console 不是草稿纸，而是目标进程的执行入口。

现在你会启动、观察和求值了，但仍可能在几十行代码上随意放断点。下一章会从“如何操作工具”升级到“如何为一个问题设计最少的观察点”。这是从学习者走向工作调试的第一次方法转变。

