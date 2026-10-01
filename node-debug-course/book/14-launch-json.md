# 第十四章：`launch.json` 从入门到多进程

## 承接完整项目：先证明实验对象正确

第十三章的断点之所以可靠，是因为入口、工作目录和进程都由课程控制。工作中常见的第一层失败不是业务算法，而是调试配置与实际启动方式不一致：读取了另一份 `.env`、参数交给了 Node 而不是应用、断点对应 TypeScript 源码但进程执行旧 `dist`。

所以 `launch.json` 不是可有可无的编辑器配置，它是一份“如何重复这次运行实验”的声明。学完本章，你应能从配置还原最终命令，并在入口用七项运行时事实逐一验证，而不是相信配置名称。

### 纸上推演

先把 `runtimeExecutable`、`runtimeArgs`、`program`、`args` 四张卡片按最终命令顺序排列。再判断 `--inspect` 与业务 `--port 3000` 分别属于哪张卡片。后文会用这个顺序检查配置。

## 14.1 配置是在描述一次可重复实验

`.vscode/launch.json` 不只是“让 F5 能运行”的文件。它固定：

- 启动还是附加；
- 调试哪个程序/进程；
- Node 版本或运行程序；
- 工作目录；
- 参数、环境变量和控制台；
- source map 与跳过文件；
- 重启、子进程等行为。

配置正确性优先于断点技巧。入口或工作目录错了，后续观察再细也在研究另一个实验。

## 14.2 最小 launch 配置

```jsonc
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch app.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/app.js",
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

字段解释：

- `version`：launch 配置文件格式版本，不是 Node 版本；
- `name`：界面显示名称，应能区分入口/模式；
- `type: node`：使用 Node 调试器；
- `request: launch`：由 VS Code 创建目标进程；
- `program`：要调试的入口文件，最好是绝对变量展开路径；
- `cwd`：目标进程当前工作目录；
- `console`：标准输入输出承载位置；
- `skipFiles`：单步时跳过不关心代码。

## 14.3 参数的三条通道

```jsonc
{
  "runtimeExecutable": "node",
  "runtimeArgs": ["--enable-source-maps"],
  "program": "${workspaceFolder}/app.js",
  "args": ["--port", "3000"]
}
```

概念命令：

```text
node --enable-source-maps app.js --port 3000
│    │                   │      └─ args：给应用
│    │                   └─ program
│    └─ runtimeArgs：给 Node
└─ runtimeExecutable
```

把 `--inspect` 放进应用 `args`，应用可能把它当业务参数；把业务 `--port` 放进 `runtimeArgs`，Node 可能报未知选项。始终先还原最终命令。

## 14.4 环境变量

```jsonc
{
  "env": {
    "NODE_ENV": "development",
    "PORT": "3000"
  },
  "envFile": "${workspaceFolder}/.env.debug"
}
```

环境变量是字符串（或删除/未设置语义由配置工具处理），所以：

```js
Boolean(process.env.DEBUG) // 字符串 "false" 仍是真值
process.env.DEBUG === 'true'
```

不要把密码、生产连接串提交到 `launch.json`。`.env.debug` 也应只保存非敏感本地值或通过安全方式注入。调试配置会影响真实目标进程，不是 UI 注释。

## 14.5 attach 配置

先启动：

```bash
node --inspect-brk=127.0.0.1:9229 app.js
```

再附加：

```jsonc
{
  "name": "Attach 9229",
  "type": "node",
  "request": "attach",
  "address": "127.0.0.1",
  "port": 9229,
  "continueOnAttach": true,
  "restart": false
}
```

端口、地址必须匹配。`continueOnAttach` 用于连接到已经因 `--inspect-brk` 暂停的进程后继续。也可使用 `processId: "${command:PickProcess}"` 选择本地 Node 进程。

Attach 到远端/容器还涉及 `localRoot` 与 `remoteRoot` 的路径映射。调试端口应通过可信隧道或本地映射访问，不应公开到不受信网络。

## 14.6 npm 配置

```jsonc
{
  "name": "npm: service",
  "type": "node",
  "request": "launch",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "service"],
  "cwd": "${workspaceFolder}",
  "console": "integratedTerminal",
  "autoAttachChildProcesses": true
}
```

这里首先启动的是 npm；npm 经 shell 执行 script，script 再启动 Node。现代 VS Code JavaScript 调试器可以自动跟踪 Node 子进程，但多进程时 Call Stack 会出现多个调试目标。真正处理业务的常是后代 Node 进程，不是 npm 父进程。

若只需要调试已知 `server.js`，直接 `program` 启动通常更简单；若必须复现 npm script 设置的构建、环境或 runner，再通过 npm 启动。

## 14.7 source map

TypeScript/Babel 项目运行生成的 JavaScript，调试器依靠 source map 映射回源码。常见字段：

```jsonc
{
  "sourceMaps": true,
  "outFiles": ["${workspaceFolder}/dist/**/*.js"],
  "resolveSourceMapLocations": [
    "${workspaceFolder}/**",
    "!**/node_modules/**"
  ]
}
```

断点变灰时检查：

1. `dist` 是否是本次源码构建出来的；
2. `.map` 是否存在且其中 sources 路径正确；
3. `outFiles` 是否覆盖实际生成文件；
4. 运行入口是否真的来自 `dist`；
5. monorepo/容器路径是否需要映射；
6. 是否下断点在没有对应生成代码的类型/声明行。

`--enable-source-maps` 改善 Node 自己打印的 stack trace 映射，VS Code 调试器的 source map 支持是相关但不同的一层。

## 14.8 配置排错清单

在入口第一条可执行语句暂停并求值：

```js
process.pid
process.execPath
process.argv
process.execArgv
process.cwd()
__filename
process.env.NODE_ENV
```

这七项能证明“谁、以什么方式、从哪里、带什么参数启动了哪个文件”。把输出与 launch 配置逐项对照。

## 14.9 实验

课程 `.vscode/launch.json` 提供直接启动根示例、完整 service、npm service 和 attach 等配置。先用直接 launch，再用 npm launch，对比：

- Call Stack 中的调试目标数量；
- `process.ppid`；
- 标准输出所在面板；
- Stop 后哪些进程结束；
- 业务断点命中的实际 PID。

## 停止阅读检查

1. `runtimeArgs` 与 `args` 分别交给谁？
2. 为什么 `cwd` 正确与否会改变相对文件 I/O，但不改变 `__dirname`？
3. attach 会话按 Stop 与 launch 会话按 Stop 的目标生命周期有何不同？
4. TypeScript 断点变灰时，为什么必须检查运行的生成文件与 source map，而不只是重设红点？

## 本章收束：配置的名字不是证据，运行时事实才是

一个叫“Debug Current Server”的配置仍可能启动旧入口。真正的证据是 `process.execPath`、`argv`、`execArgv`、`cwd`、`__filename`、环境变量和 PID 与预期逐项一致。

下一章再加一层现实：`runtimeExecutable` 如果是 npm，它自己通常不执行 Service，而是通过 shell 和监控工具创建后代进程。此时一份 launch 配置会对应一棵进程树，你必须找到真正加载业务模块的那一层。

参考：[VS Code Node.js 调试配置](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)、[js-debug 配置选项](https://github.com/microsoft/vscode-js-debug/blob/main/OPTIONS.md)。
