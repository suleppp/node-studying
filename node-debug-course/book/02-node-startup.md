# 第二章：从 `node app.js` 到第一行 JavaScript

## 承接第一章：进程已经有了，然后呢

第一章把磁盘文件和运行进程分开了。但“Node 读取并执行 `app.js`”仍然压缩了太多步骤：谁解析命令行？相对路径从哪里算？入口为什么也有模块作用域？代码还没有走到某行时，声明是否已经存在？

这些问题看起来像启动细节，却会直接变成工作中的故障：同一程序从 VS Code 能运行、从系统服务却找不到配置；断点下在入口第一行仍错过了语法错误；在另一个文件里看不到以为是“全局”的变量。

学完本章，你要把第一章的粗略箭头展开为一条可诊断的启动链，并能把启动失败归类到 Shell、操作系统、模块加载、语法解析或实际运行中的某一层。

### 先修自检

如果不能解释“`app.js` 是文件，Node 进程是运行实例”，先返回第一章。第二章中的所有路径和模块状态都属于某一个具体进程。

## 2.1 Shell 先处理命令

在终端输入命令后，首先行动的是当前 shell，例如 PowerShell、cmd、zsh 或 bash。它会进行命令查找、参数拆分，以及各 shell 特有的变量展开、引号处理和重定向。

```bash
node app.js hello
```

Node 进程中可以看到类似：

```js
console.log(process.argv);
```

其中通常包括 Node 可执行文件路径、入口文件路径和用户参数 `hello`。不要把 `process.argv[0]`、`process.argv[1]` 永久写死成业务假设；启动方式不同，入口也可能不同。

## 2.2 当前工作目录不是入口文件目录

这是 Node 项目最常见的路径误解之一：

- `process.cwd()`：启动进程时采用的当前工作目录，可被 `process.chdir()` 改变；
- CommonJS 中的 `__filename`：当前模块文件的绝对路径；
- CommonJS 中的 `__dirname`：当前模块所在目录。

假设在项目根目录运行：

```bash
node tools/read-config.js
```

`process.cwd()` 是项目根目录，`__dirname` 是 `tools` 目录。相对文件路径通常相对于当前工作目录解析，并不自动相对于写下这行代码的模块。

```js
const fs = require('node:fs');
const path = require('node:path');

// 相对于启动目录
fs.readFileSync('config.json');

// 明确相对于当前模块目录
fs.readFileSync(path.join(__dirname, 'config.json'));
```

调试“明明文件就在旁边却 ENOENT”时，第一时间检查 `process.cwd()` 和实际传入的绝对路径。

## 2.3 入口文件也是一个模块

在 CommonJS 项目中，Node 不只是把 `app.js` 当作裸脚本逐字符运行。它会解析文件、建立模块对象，并把代码放在模块作用域中执行。概念上可以近似理解成：

```js
(function (exports, require, module, __filename, __dirname) {
  // app.js 中的内容
});
```

这是解释以下现象的关键：

- 一个文件顶层的 `const` 默认不会成为全局变量；
- 每个模块都有自己的 `module` 和 `exports`；
- `__filename`、`__dirname` 看似没有声明却可以使用；
- 模块加载完成后会进入缓存。

这段包装是调试模型，不要依赖包装函数的内部实现细节或精确文本。

## 2.4 V8 不是简单地逐行翻译

对一份 JavaScript 源码，有用的高层过程是：

1. 读取字符；
2. 词法/语法分析，确认结构是否合法；
3. 生成并执行可运行表示；
4. 对热点代码可能进一步优化；
5. 假设失效时也可能取消优化。

因此，语法错误会在该模块真正执行之前被发现：

```js
console.log('before');
const = broken;
```

你通常看不到 `before`，因为整个模块没有成功解析。它不同于运行到某个分支才抛出的运行时错误。

## 2.5 声明建立与逐句执行

JavaScript 在执行一段代码前会建立这一作用域需要的绑定，但不同声明的初始化时机不同：

```js
console.log(typeof declaredFunction); // 'function'
console.log(varValue);                // undefined
// console.log(letValue);             // ReferenceError

function declaredFunction() {}
var varValue = 1;
let letValue = 2;
```

调试时要区分：

- 绑定不存在；
- 绑定已经建立但处于未初始化状态（暂时性死区）；
- 绑定已初始化为 `undefined`；
- 绑定已初始化为其他值。

这些状态不是同义词。Variables 面板有时会因为引擎和调试协议的展示方式而省略未初始化变量；源语言语义才是判断依据。

## 2.6 错误发生在哪一层

执行失败可以粗分为：

- Shell 层：找不到 `node`、引号错误、重定向权限问题；
- 操作系统层：可执行文件不可运行、权限或资源限制；
- Node 启动/加载层：入口不存在、模块解析失败；
- 解析层：`SyntaxError`；
- 运行层：`TypeError`、业务主动抛错、异步拒绝；
- 外部资源层：连接拒绝、超时、认证失败。

先判断错误属于哪一层，可以把搜索范围缩小一个数量级。

## 2.7 实验

```bash
node examples/02-startup/app.js alpha beta
node --check examples/02-startup/syntax-error.js
```

第二条只检查语法，不执行程序。观察语法错误的位置，再打开 `syntax-error.js` 确认其中第一条日志为何不会出现。

## 停止阅读检查

1. `process.cwd()` 与 `__dirname` 什么时候会不同？
2. 为什么一个文件顶层的 `const` 不会自动出现在另一个文件？
3. 未初始化和 `undefined` 的区别是什么？
4. `node --check` 能否发现“读取了不存在的文件”？为什么？

## 本章收束：程序终于来到可执行位置

现在你已经能从终端输入一路追到入口模块：Shell 形成参数，操作系统创建进程，Node 按入口和工作目录加载模块，V8 先完成语法与声明所需准备，再执行代码。

但“执行代码”仍然说得太粗。调试器把黄色箭头放在某一行时，这一行可能包含三个函数调用、两次属性访问和一个赋值；其中有些动作已发生，有些尚未发生。第三章会把“当前行”继续拆成可以预测的求值步骤。

