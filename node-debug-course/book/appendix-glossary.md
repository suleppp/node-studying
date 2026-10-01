# 附录：术语表

**源代码（source code）**：供人和工具读取、描述程序结构的文本；磁盘上的文本本身不是运行实例。

**可执行文件（executable）**：操作系统可以加载启动的程序文件，例如 Windows 的 `node.exe`。

**进程（process）**：程序的一次运行实例，拥有 PID、地址空间、资源和生命周期。

**线程（thread）**：进程内的执行单元。Node 用户 JavaScript 通常围绕事件循环主线程执行，但运行时不只存在一个线程。

**PID / PPID**：当前进程标识符 / 直接父进程标识符。

**V8**：Node.js 嵌入的 JavaScript 引擎。

**Node.js runtime**：包含 V8、模块系统、内置 API、libuv 和原生绑定等的运行环境。

**调用栈（call stack）**：当前同步活动调用的层次；顶部是当前执行帧。

**栈帧（stack frame）**：一次活动函数调用的运行上下文抽象，关联参数、局部状态和返回位置。

**堆（heap）**：V8 管理对象等动态数据的主要内存区域；不要与调用栈混淆。

**作用域（scope）**：某个源代码位置可通过名字访问哪些绑定的规则。

**闭包（closure）**：函数与其可访问词法环境的组合，使外层调用返回后相关数据仍可达。

**暂时性死区（TDZ）**：`let`/`const` 绑定在作用域开始到声明初始化完成前不可访问的区域。

**断点（breakpoint）**：请求调试引擎在某个可执行位置或条件下暂停。

**Inspector**：V8/Node 提供的调试和性能检查接口。

**Launch / Attach**：由调试器启动目标进程 / 连接到已运行目标进程。

**REPL**：读取—求值—打印—循环的交互环境；`node` 可启动独立 REPL 进程。

**CommonJS**：Node 的模块系统之一，使用 `require` 和 `module.exports`。

**模块缓存（module cache）**：同一进程的模块加载器保存已加载模块，后续相同解析通常复用导出。

**Promise**：表示异步操作未来 fulfilled/rejected 结果的对象。

**微任务（microtask）**：Promise handler、`queueMicrotask` 等 continuation 使用的调度队列概念。

**Event Loop**：Node 协调计时器、I/O 事件和 JavaScript 回调执行的运行机制。

**I/O**：与文件、网络、数据库等外部资源交换数据的操作。

**cache-aside**：应用先读缓存，未命中再读主存储并回填的缓存模式。

**TTL**：缓存条目的有效时长或过期时间语义。

**source map**：把生成 JavaScript 位置映射回 TypeScript 等原始源码位置的元数据。

**热重载（hot reload/restart）**：检测文件变化后更新或重启运行程序；nodemon 的常见行为更准确叫自动重启。

**结构化日志**：用固定字段记录事件，便于按 requestId、PID、错误码等筛选关联。

**回归测试**：证明修复后的行为正确，并防止同一机制再次出错的自动检查。

