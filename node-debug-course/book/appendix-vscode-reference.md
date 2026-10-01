# 附录：VS Code 操作表与跨平台差异

## 常用动作

| 动作 | 常见快捷键 | 准确含义 |
|---|---|---|
| Start/Continue | F5 | 启动会话或运行到下个暂停点 |
| Toggle Breakpoint | F9 | 在当前行添加/移除断点 |
| Step Over | F10 | 执行当前步骤，不主动进入调用 |
| Step Into | F11 | 进入接下来可调试的调用 |
| Step Out | Shift+F11 | 运行到当前函数退出并在上层暂停 |
| Stop | Shift+F5 | 停止/断开当前调试会话 |
| Restart | Ctrl+Shift+F5 / 平台可能不同 | 重新创建调试运行 |
| Run and Debug | Ctrl+Shift+D / macOS ⇧⌘D | 打开调试视图 |
| Debug Console | Ctrl+Shift+Y / macOS ⇧⌘Y | 打开调试控制台 |

快捷键可被用户映射修改；以 VS Code 命令名称为准。

## 命令行差异

| 目的 | macOS/Linux 常见 | PowerShell 常见 | cmd 常见 |
|---|---|---|---|
| 当前目录 | `pwd` | `Get-Location` | `cd` |
| 设置一次性环境变量并运行 | `PORT=3000 node app.js` | `$env:PORT='3000'; node app.js` | `set PORT=3000&& node app.js` |
| 结束前台程序 | `Ctrl+C` | `Ctrl+C` | `Ctrl+C` |
| 查找 Node | `which node` | `Get-Command node` | `where node` |

课程的 JavaScript 示例跨平台；Shell 命令需按当前终端调整。`launch.json` 的 `env` 可避免部分设置环境变量的 shell 差异。

## 断点图标的常见含义

- 红色实心圆：已启用并通常已绑定；
- 灰色实心：禁用；
- 灰色/空心：当前未验证或无法绑定；
- 菱形：Logpoint；
- 带条件/次数装饰：条件或 Hit Count 断点。

具体图标会随主题和版本变化；悬停和 Breakpoints 面板状态比颜色记忆更可靠。

## 官方参考

- [VS Code Debugging](https://code.visualstudio.com/docs/debugtest/debugging)
- [VS Code Node.js Debugging](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)
- [Node.js Debugger](https://nodejs.org/api/debugger.html)

