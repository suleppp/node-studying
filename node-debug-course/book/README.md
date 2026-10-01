# 全书目录

## 第一阶段：程序是怎么跑的

1. [源代码、可执行文件与进程](01-source-program-process.md)
2. [从 `node app.js` 到第一行 JavaScript](02-node-startup.md)
3. [一行代码内部的执行顺序](03-execution-position.md)
4. [函数调用、Stack Frame 与返回位置](04-call-stack.md)
5. [调试器怎样暂停程序](05-how-debugger-works.md)

阶段目标：不依赖 VS Code 界面，也能在脑中画出当前执行位置、当前栈帧、可见变量和返回路径。

进入条件：只需会运行简单 JavaScript。阶段产物是一张不依赖界面的“进程—源位置—栈帧—返回路径”状态图。第五章口述考试未通过前，不进入第二阶段。

## 第二阶段：VS Code Debugger

6. [第一次完整调试会话](06-vscode-debug-session.md)
7. [作用域、生命周期与 Variables 面板](07-scope-and-variables.md)
8. [Debug Console、Node REPL 与 Terminal](08-console-repl-terminal.md)
9. [断点、单步与 Watch 的使用策略](09-breakpoints-and-stepping.md)

阶段目标：知道每个按钮改变了什么，不把界面展示误当成程序事实。

进入条件：能口述 `const result = add(10, 20)` 从调用到赋值的完整过程。阶段产物是一份最多三个观察点的同步故障定位计划。

## 第三阶段：Node.js 项目实际场景

10. [CommonJS、`require()` 与模块缓存](10-commonjs.md)
11. [调试一个“已连接 Redis”的程序](11-redis-simulation.md)
12. [Promise、`async/await` 与 Event Loop](12-async-event-loop.md)
13. [Mongo + Redis + Service 完整分层项目](13-service-project.md)

阶段目标：能追踪跨模块、跨异步边界的数据，能区分数据库事实、缓存事实和业务层判断。

进入条件：能在正确栈帧读取变量，能解释 Step Over 不等于不执行。阶段产物是一条带 requestId、key、raw 值和数据库命令的跨层证据链。

## 第四阶段：真实项目工作流

14. [`launch.json` 从入门到多进程](14-launch-json.md)
15. [`npm run dev`、子进程与 nodemon](15-npm-child-process.md)
16. [Debug Console 实战与安全边界](16-debug-console-safety.md)
17. [可复用的故障定位方法](17-debugging-method.md)
18. [从故障工单到可合并修复](18-workplace-ticket.md)
19. [结业项目：独立接手陌生 Node 服务](19-capstone.md)

阶段目标：面对陌生项目时，能先确认入口和进程，再用最小证据链定位问题，并交付可审查、可回归的修复。

进入条件：能独立画出完整 Service 项目的冷读和热读路径。阶段产物是一份包含复现、被否定假设、根因证据、最小修复、回归矩阵和剩余风险的工作交付。

## 附录

- [术语表](appendix-glossary.md)
- [全书学习路线](learning-path.md)
- [学习工作簿与记录模板](workbook.md)
- [VS Code 操作表与跨平台差异](appendix-vscode-reference.md)
- [章末“停止阅读检查”参考答案](appendix-check-answers.md)
- [结业检查清单](final-checklist.md)
- [故障实验说明](../labs/README.md)
- [故障实验答案](../answers/README.md)
