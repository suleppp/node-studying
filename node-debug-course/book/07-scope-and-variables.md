# 第七章：作用域、生命周期与 Variables 面板

## 承接第六章：会暂停之后，必须知道自己在看谁

第六章建立了调试会话，但 Variables 面板并不是“整个程序所有变量”的仓库。它展示当前所选栈帧能够访问的作用域；切换帧，相当于换了一个源代码位置和名字解析环境。

本章把第二章的声明初始化、第四章的每次调用独立帧、第五章的运行时观察合在一起。学完后，你要能把一个值说成“哪个进程、哪次调用、哪个作用域中的哪个绑定”，并区分绑定的生命周期与对象的可达性。

### 纸上推演

在 `examples/05-scope/app.js` 运行前，列出两个 `label` 分别属于哪里；再预测 `createSequence` 返回以后，`current` 是否还存在、会在 Variables 的哪类作用域出现。不要先让面板替你回答。

## 7.1 三个经常混淆的问题

看到一个变量时分别问：

1. **作用域（scope）**：源代码的当前位置能否通过名字访问它？
2. **生命周期（lifetime）**：它对应的值/绑定何时创建，何时不再需要？
3. **可达性（reachability）**：是否仍存在从活跃根对象到它的引用，使垃圾回收器不能回收？

作用域是语言可见性，生命周期是时间范围，可达性关系到内存。它们相关但不相同。一个闭包可以让外层函数已经返回后，其中的某些值仍可达。

## 7.2 常见作用域

```js
const moduleRate = 0.1;

function calculate(price) {
  const fee = price * moduleRate;

  if (fee > 5) {
    const label = 'high';
    return { fee, label };
  }

  return { fee, label: 'low' };
}
```

- `moduleRate` 位于当前 CommonJS 模块作用域；
- `price` 和 `fee` 位于此次 `calculate` 调用的函数/局部作用域；
- `label` 只在 `if` 块内可见；
- Node 和调试器还可能显示闭包、脚本、全局等分类。

Variables 面板的分类名称属于调试器展示，不应死记。更重要的是通过词法嵌套判断名字解析路径。

## 7.3 遮蔽（shadowing）

```js
const status = 'module';

function run() {
  const status = 'local';
  console.log(status);
}
```

`run` 内访问到的是更近的局部 `status`。外层变量没有消失，只是被同名绑定遮蔽。调试时展开不同 Scope，避免看见一个 `status` 就以为它是唯一的那个。

真实项目中同名的 `config`、`result`、`user` 很常见。判断变量时始终带上帧和作用域：不是“`user` 是什么”，而是“`UserService.get` 这次调用的 Local `user` 是什么”。

## 7.4 `let`/`const` 的未初始化状态

```js
function example() {
  // 此区域已经受下方 local 绑定影响，但 local 尚未初始化
  const local = load();
  return local;
}
```

声明所在作用域开始后，`local` 的绑定存在，但在声明初始化完成前访问会抛 `ReferenceError`。这叫暂时性死区。它不同于：

```js
let local; // 这一行完成后，local 已初始化为 undefined
```

调试面板可能使用 `<unavailable>`、`undefined`、不展示等不同方式呈现。不要只凭 UI 字样覆盖语言规则；用断点位置和声明是否完成推断。

## 7.5 引用值与“展开对象”陷阱

```js
const user = { name: 'Ada' };
const alias = user;
alias.name = 'Grace';
```

`user` 和 `alias` 保存的是指向同一个对象的引用，不是两个独立副本。调试器展开对象时展示对象当前属性；某些控制台环境对对象采用延迟查看，展开时看到的可能是之后状态，而不是日志调用那一瞬间的深拷贝快照。

需要保存证据时，显式打印关心的原始字段或受控快照：

```js
console.log({ name: user.name, id: user.id });
```

不要为了日志盲目 `JSON.stringify` 任意业务对象：循环引用会报错，BigInt 可能报错，自定义序列化也可能隐藏数据或触发逻辑。

## 7.6 闭包

```js
function createCounter() {
  let count = 0;
  return function increment() {
    count += 1;
    return count;
  };
}

const next = createCounter();
```

`createCounter` 返回后，它的活动调用帧已经不在调用栈中，但 `increment` 仍引用 `count`，所以相关词法环境继续存活。暂停在 `increment` 内时，Variables 可能在 Closure 作用域中显示 `count`。

“外层函数帧已返回”和“外层环境所有数据都已消失”不是一回事。

## 7.7 修改变量：实验与风险

Variables 的 Set Value 或 Debug Console 赋值可以测试假设：

```js
discount = 0;
```

但这是对目标进程的真实修改，会改变后续控制流。规范做法：

1. 先记录原值；
2. 明确假设，例如“若 discount 为 0，错误应消失”；
3. 修改后只把结果当作假设证据；
4. 重启并通过改代码/测试完成真正修复；
5. 不把手工改值后的成功当成回归通过。

`const` 绑定不能正常重新赋值，但它指向的对象仍可能被修改。

## 7.8 练习

运行 `examples/05-scope/app.js`，在标有 `BREAKPOINT A/B/C` 的位置暂停：

- 找到同名变量分别属于哪个作用域；
- 证明两个引用指向同一对象；
- 在闭包中找到已经返回的外层函数所保留的值；
- 点击调用者帧，解释 Variables 为什么改变。

## 停止阅读检查

1. 作用域和对象可达性有什么区别？
2. 外层函数返回后，闭包变量为什么还能存在？
3. `let x;` 执行后和执行前的 `x` 状态是否相同？
4. 调试器中手改变量为什么不能算修复？

## 本章收束：变量值必须带着上下文阅读

一个孤立的 `user = undefined` 几乎没有诊断价值。现在你应补齐：当前选择哪个栈帧、声明是否已初始化、是否存在同名遮蔽、这个值是原始值还是某个共享对象引用。

下一章会处理一个自然需求：Variables 能展开对象，但有时我们想计算 `items[index]?.id`、比较两个值或验证类型。应该在哪里输入表达式？为什么 Terminal 和 Node REPL 都看不到当前 Local？答案仍然取决于进程与栈帧上下文。

