# 第十五章：`npm run dev`、子进程与 nodemon

## 承接第十四章：一个启动配置为什么出现多个调试目标

第十四章教你还原一条命令；本章把命令展开成进程树。`npm run dev` 可能先启动 npm、再经过 shell、再运行 nodemon，最后才由某个 Node 子进程加载 `server.js`。热重载后这个业务 PID 还会改变。

本章反复使用第一章的进程隔离和第十章的模块缓存结论：新子进程有自己的堆和模块缓存，所以“重启后内存变量消失、外部 Redis 数据仍在”不是矛盾。

学完后，你要能给每条日志标注 PID/PPID，在多目标 Call Stack 中选择真正处理请求的进程，并解释 Stop/Restart 对父进程和子进程分别有什么影响。

### 纸上推演

画出 `VS Code → npm → nodemon → node server.js`。假设 nodemon 发现文件变化，只替换最后一个进程：哪些状态必定丢失，哪些可能保留？至少分别写一个内存状态和外部状态。

## 15.1 一条命令可能是一棵进程树

假设：

```json
{
  "scripts": {
    "dev": "nodemon server.js"
  }
}
```

可能形成：

```text
VS Code / Terminal
  └─ npm
      └─ shell
          └─ nodemon（监控者）
              └─ node server.js（业务进程）
```

不同平台和工具实现会让中间层变化，但核心问题不变：有父进程负责启动/监视，另一个子进程真正加载业务代码。

`process.pid` 是当前进程，`process.ppid` 是直接父 PID。日志加上二者，能快速辨别来源：

```js
console.log({ pid: process.pid, ppid: process.ppid, argv: process.argv });
```

## 15.2 npm 做了什么

`npm run name` 会找到 `package.json` 的 script，通过平台相关 shell 执行，并把本地 `node_modules/.bin` 加入 PATH，所以可以直接写 `nodemon` 而不写完整路径。现代 npm 会让 script 在包根目录运行；`INIT_CWD` 可表示用户调用 npm 时所在目录。

这解释了两类差异：

- 手工 `node subdir/app.js` 与 `npm run app` 的 `cwd` 可能不同；
- 终端能找到全局工具，不代表 npm/VS Code 使用同一 PATH 和 Node 版本，反之亦然。

## 15.3 `spawn`、`exec`、`execFile`、`fork`

Node `child_process` 常见 API：

- `spawn(command, args)`：流式 stdio，适合长运行进程和大量输出；
- `exec(commandString)`：通过 shell 执行命令字符串并缓冲输出，需特别防命令注入；
- `execFile(file, args)`：直接执行文件（Windows 上某些脚本类型有平台差异），通常比拼 shell 字符串更安全；
- `fork(modulePath, args)`：专门启动新的 Node 进程，并建立 IPC 通道；不是 POSIX `fork(2)` 的内存克隆。

每个 Node 子进程都有独立 V8 实例、堆和 CommonJS 缓存。父子可以通过 stdio、IPC、socket 或外部服务通信，但不会共享普通变量。

## 15.4 nodemon 的核心模型

nodemon 监视文件变化，业务子进程退出或被终止后，再启动一个新业务进程。因此：

- PID 会改变；
- 内存变量和模块缓存重置；
- 旧连接应关闭，新进程会重新连接；
- 断点需要附加到新目标；
- 修改到一半的语法错误会让重启暂时失败；
- 监控者自己可能仍活着。

“Restart 后变量没了”不是缓存失效 bug，而是进程级状态天然不会跨重启保留。外部 Redis/Mongo 数据则可能仍在，所以热重启后会看到“内存清空但缓存还在”。

## 15.5 调试热重载的三种路线

### 路线 A：调试时直接运行入口

最稳定。暂时不用 nodemon，由 VS Code Restart 控制。适合定位启动、业务逻辑和断点。

### 路线 B：VS Code launch nodemon

使用 `runtimeExecutable` 指向项目本地/可解析的 nodemon，配 `restart` 或自动子进程。适合需要持续热重载体验的场景，但停止会话后要确认监控者是否也结束。

### 路线 C：终端启动 + Auto Attach/Attach

在 JavaScript Debug Terminal 中执行 `npm run dev`，或开启 Auto Attach。适合必须原样复现复杂 script 的场景。多目标面板中选择当前业务 PID。

课程不安装 nodemon，因此 `examples/11-supervisor/` 用内置 `child_process.fork` 实现一个一次性监控演示，展示父子 PID、IPC 和子进程重启。

## 15.6 断点为何重启后失效

排查顺序：

1. 新业务 PID 是否已出现；
2. 调试器是否自动附加到新 PID；
3. 新进程是否启用了 inspector；
4. Inspector 端口是否冲突；
5. 断点对应文件是否已在新进程加载；
6. 新进程运行的是否是生成目录中的旧代码；
7. Breakpoints 面板中断点是实心、空心还是移动。

固定 9229 端口的旧进程未完全退出时，新进程可能无法监听。让调试工具管理端口或使用动态端口，比手工给所有 worker 同一端口可靠。

## 15.7 信号和关闭

`subprocess.kill()` 名字容易误导：它发送信号，不保证目标已立即终止。信号语义和进程树处理跨平台不同。父进程退出也不必然自动、干净地关闭所有分离子进程。

调试关闭流程时记录：

- 哪个 PID 收到哪种信号；
- server 是否停止接受请求；
- in-flight 请求是否处理完或超时；
- 数据库/缓存连接是否关闭；
- 父监控者是否启动了替代子进程；
- 最终退出码。

## 15.8 实验

```bash
node examples/11-supervisor/supervisor.js
```

观察父子 PID、IPC 消息和一次受控重启。分别在 supervisor 与 worker 下断点，确认它们属于不同调试目标、不同全局对象和不同模块缓存。

## 停止阅读检查

1. `npm run dev` 中哪个进程真正加载业务模块？
2. nodemon 重启后为什么 CommonJS 状态会重置？
3. `fork()` 的子进程是否共享父进程 JavaScript 堆？
4. 调试器 Stop 后为什么仍要确认监控者是否存活？

## 本章收束：每个状态都要标注进程边界

多进程调试中，“模块已经初始化”“连接已经建立”“变量刚刚修改”都必须补充 PID。热重载不是在原进程里清空一点状态，而往往是旧实例退出、新实例重新启动。

技术上能附加到业务进程，不代表应该随意暂停和求值。目标若连接共享测试库甚至生产库，断点会阻塞请求，Debug Console 会执行真实操作。下一章先建立安全边界，之后才把整套方法用于工作故障。

参考：[npm Scripts 官方文档](https://docs.npmjs.com/cli/using-npm/scripts/)、[Node.js Child Process 文档](https://nodejs.org/api/child_process.html)。
