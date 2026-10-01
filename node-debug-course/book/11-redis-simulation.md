# 第十一章：调试一个“已经连接 Redis”的程序

本章的 `FakeRedis` 只模拟调试所需的连接状态、异步延迟、字符串存储、过期时间和错误。它不是 Redis 协议实现，也不能用来推断真实客户端的全部行为。优点是你不需要安装服务，就能先掌握跨模块连接与缓存调试方法。

## 承接第十章：共享的不是“Redis”三个字，而是具体 client 对象

第十章已经证明，同一进程中解析到同一连接模块的调用者可以得到同一导出对象。本章就在这份对象上增加 `idle → connecting → ready → closed` 状态，并让它保存一份模拟的外部 key/value 数据。

这一步很重要：调试缓存问题时，至少有三类状态不能混在一起——CommonJS 模块缓存里保存哪个 client 引用、client 当前能否接受命令、Redis key 中实际保存什么内容。它们都叫“缓存/连接问题”时，定位会非常混乱。

学完后，你要能为一次读取保存四项证据：client 状态、精确 key、GET 原始返回、是否继续访问主存储。

## 11.0 本章所需的最低异步前置

示例会使用 `async` 和 `await`。本章先只采用操作契约，不解释调度内部：

```js
const raw = await redis.get(key);
```

暂时读作：“`get` 给出一个代表未来结果的 Promise；这次 async 函数要等结果可用后，才用它初始化 `raw` 并继续。”你仍然可以在 `await` 前后观察输入和输出。

为什么等待期间 Node 还能处理其他工作、为什么恢复后普通调用栈变了、Promise handler 在什么时机执行，统一留到第十二章。这样本章只专注连接和数据边界，不一次引入两套新机制。

## 11.1 “已经连接”到底应有哪些证据

不要只看一个布尔值 `connected = true`。至少区分：

```text
未创建 → 正在连接 → 可用 → 关闭中 → 已关闭
                    ↘ 连接失败
```

真实客户端还可能有重连、退避、离线队列、认证完成、只读/集群状态。调试时要知道项目所谓“ready”指 TCP 已连接、认证成功，还是已经可以安全接受命令。

本课程模拟器提供：

- `status`：`idle | connecting | ready | closed`；
- `connect()`：异步完成，重复连接会受控；
- `get/set/del()`：只在 ready 时工作；
- 可选 TTL；
- `quit()`：关闭并清理定时器；
- 命令日志：证明是否真的访问过缓存。

## 11.2 连接 Promise 要共享

错误写法可能在两个请求同时启动时创建两个连接：

```js
if (!client) {
  client = await createAndConnect();
}
```

两个调用都可能在 `await` 前看到 `client` 为空。更稳定的模型是缓存 in-flight Promise：

```js
let client;
let connecting;

function connect() {
  if (client) return Promise.resolve(client);
  if (connecting) return connecting;

  connecting = createAndConnect()
    .then((connected) => {
      client = connected;
      return connected;
    })
    .finally(() => {
      connecting = undefined;
    });

  return connecting;
}
```

断点应设在三个分支上，并发调用后比较返回 Promise/最终 client 是否相同。

## 11.3 缓存命中与缓存事实

常见 cache-aside 流程：

```text
生成 key → GET
          ├─ 命中 → 解析 → 返回
          └─ 未命中 → 查数据库 → 序列化 → SET → 返回
```

每个箭头都可能错：

- key 拼接不一致；
- `GET` 返回字符串，却按对象使用；
- 空字符串、`0`、`false` 被 `if (cached)` 当成未命中；
- JSON 已损坏或 schema 过期；
- TTL 单位写错；
- 写数据库后没有删除/更新缓存；
- 缓存客户端并非 ready；
- 命令发到了另一个环境或 Redis database。

调试时不要只问“Redis 有没有值”，要保存四个证据：准确 key、命令、原始返回值、解析后值。

## 11.4 `null`、字符串与 JSON

真实 Redis 的核心值模型常表现为字节/字符串。对象通常由应用序列化：

```js
const raw = await redis.get(key);
if (raw === null) return null;
return JSON.parse(raw);
```

用 `raw === null` 比 `if (!raw)` 更精确。调试时分别观察：

- `typeof raw`；
- `raw === null`；
- `raw.length`（仅确认是字符串后）；
- JSON.parse 前的安全截断样本；
- 解析后的 schema/version。

不要在日志中完整打印可能包含 token 或个人数据的缓存内容。

## 11.5 TTL 是过期承诺，不是精确调度闹钟

缓存的 TTL 表示在某个时间点之后不应再被当作有效数据。过期清理可能是访问时发现，也可能有后台策略。调试“过早/永不过期”时检查：

- 传入单位是秒还是毫秒；
- 过期时间从写入前还是写入后计算；
- 测试是否依赖真实时钟；
- key 是否被后续 SET 覆盖并重置 TTL；
- 进程时区通常与时间差计算无关，但字符串解析可能有关。

本书模拟器用毫秒并在访问时检查过期，名称明确为 `ttlMs`，避免单位隐含。

## 11.6 缓存故障应该怎样降级

缓存通常是性能优化，是否允许 Redis 故障时查询数据库由业务要求决定：

```js
let raw = null;
try {
  raw = await redis.get(key);
} catch (error) {
  logger.warn({ error, key }, 'cache read failed');
}

if (raw !== null) return JSON.parse(raw);
return database.findById(id);
```

这不是通用答案。限流、分布式锁、会话或幂等键中的 Redis 可能承担正确性职责，失败时继续执行反而危险。先定义 Redis 在当前用例中是“可丢失的优化”还是“必要协调状态”。

## 11.7 实验

```bash
node examples/07-fake-redis/app.js
```

在以下位置暂停：

1. 两次并发 `connect()` 进入时；
2. 第一次 `get` 返回后；
3. `set` 序列化之前；
4. 第二次 `get` 返回后；
5. TTL 到期后的 `get`。

每次记录 `status`、key、原始返回和命令日志。再运行 `labs/02-cache-key-bug/app.js`，找出为什么第二次请求仍未命中。

## 停止阅读检查

1. “connected”和“ready”可能有什么差别？
2. 为什么并发连接时要缓存 Promise，而不只缓存最终 client？
3. 为什么判断缓存未命中应优先用 `raw === null`？
4. Redis 故障时是否总应降级到数据库？

## 本章收束：先证明缓存事实，再解释异步时序

你现在应该能把“缓存有问题”改写成精确陈述，例如：“ready client 对 `user:u1` 执行 GET，原始结果是旧 JSON 字符串，因此 Service 命中分支没有访问数据库。”这比猜 TTL 或重启 Redis强得多。

实验中还有一个刻意保留的黑箱：在 `await redis.get(key)` 等待时，当前函数去了哪里？为什么调试器恢复后仍知道把结果赋给 `raw`，但同步 Call Stack 又未必保留原来的所有函数？第十二章将拆开 Promise、continuation、微任务和 Event Loop。

