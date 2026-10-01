# 第十三章：Mongo + Redis + Service 完整分层项目

本章使用 `examples/10-service-project/`。FakeMongo 和 FakeRedis 都在内存中运行，但保留真实项目最重要的异步边界、连接生命周期和 cache-aside 数据流。

## 第三阶段的合流点

这一章没有突然引入一种全新原理，而是把前十二章放到同一个请求里：第一章确认处理请求的进程，第十章解释各层如何取得共享 client，第十一章确认 Redis key 和连接状态，第十二章解释每次 await 前后的调用链。

初学复杂项目最常犯的错是从入口开始不停 Step Into，最后进入 HTTP 或 JSON 内部实现。本章采用相反顺序：先画边界，再为每个边界定义输入/输出证据，最后只深入第一个发生偏离的层。

本章完成后，你应能讲清第一次冷读取与第二次热读取的完整时间线，并用命令计数证明“第二次没有访问 Mongo”，而不是凭响应更快作判断。

### 阅读代码前先画空白路径

在纸上写六个框：HTTP、Controller、Service、Redis、Repository、Mongo。先不要填函数名，只在箭头上写你认为应该传递的数据。运行后再用真实的 `requestId`、`id`、key、raw JSON 和 user 对象替换猜测。

## 13.1 分层不是为了多建文件

项目的数据路径：

```text
HTTP 请求
  ↓ 解析 URL / 校验 id
Controller（server.js）
  ↓ 调用用例
UserService
  ↓ 先读缓存
FakeRedis
  ├─ 命中：JSON.parse → 返回
  └─ 未命中：
       ↓
     UserRepository → FakeMongo
       ↓ 用户或 null
     写缓存 → 返回
```

每层应有明确职责：

- Server/Controller：HTTP 输入输出、状态码、请求 ID；
- Service：用例规则和缓存策略；
- Repository：数据访问接口和存储层映射；
- Clients：连接状态与底层命令；
- Bootstrap：按顺序创建依赖、连接、启动监听、关闭。

如果 Service 直接读取 `req.params`、拼 HTTP 响应又建立 Redis 连接，断点会跨越太多职责，很难判断错误属于哪层。

## 13.2 启动顺序

推荐显式 bootstrap：

```js
async function main() {
  await mongo.connect();
  await redis.connect();
  const server = createServer({ userService });
  await listen(server);
}
```

启动故障按顺序定位：

1. 配置是否读取正确；
2. client 对象是否只创建预期次数；
3. connect Promise 是否 fulfilled；
4. repository/service 是否拿到已连接的同一 client 引用；
5. server 是否成功监听预期地址和端口。

不要看到“server listening”就假定数据库也正确连接；日志必须位于真正 await 完成之后。

## 13.3 第一次请求：缓存未命中

请求 `GET /users/u1`：

1. server 解析 `u1` 并生成 requestId；
2. service 构造精确 key `user:u1`；
3. Redis `GET` 返回 `null`；
4. repository 调用 Mongo `findById('u1')`；
5. Mongo 返回独立用户对象或 `null`；
6. service 把对象 JSON 序列化并带 TTL 写缓存；
7. server 返回 JSON 响应。

断点验证的关键不是“每层都进去过”，而是同一个 `id` 和 requestId 是否沿路径保持一致，数据在哪一步改变。

## 13.4 第二次请求：缓存命中

第二次相同请求应该：

- Redis `GET` 返回字符串；
- JSON.parse 得到用户；
- repository/Mongo 不再被调用；
- 响应内容相同，`meta.source` 显示 cache。

证明“Mongo 没被调用”可以用 repository 断点不命中、命令计数或日志。单看返回很快不是可靠证据。

## 13.5 Not Found 与负缓存

不存在的用户每次都查数据库会形成缓存穿透。可以缓存一个带版本的 sentinel：

```js
{ "kind": "not-found", "version": 1 }
```

但负缓存 TTL 通常更短，且创建用户后必须使对应负缓存失效。本课程基础项目不默认做负缓存，目的是先清楚区分 Redis `null` 与数据库 `null`；章末扩展练习再实现。

## 13.6 写路径与缓存失效

读取容易，更新更危险。常见 cache-aside 写路径：

1. 先更新数据库；
2. 成功后删除缓存 key；
3. 后续读取重新填充。

若先删缓存再更新数据库，删除和写入之间的并发读可能把旧数据库值重新填回缓存。即使先写库再删缓存，分布式并发下也仍要按业务一致性要求设计版本、消息或重试。

调试旧数据时记录时间线，而不只看最后状态：哪个请求何时读库、何时 SET、更新何时提交、DEL 是否成功。

## 13.7 错误如何穿过各层

底层错误应保留原始 cause，并添加当前层语境：

```js
try {
  return await repository.findById(id);
} catch (error) {
  throw new Error(`failed to load user ${id}`, { cause: error });
}
```

不要在每层只 `throw new Error('failed')` 丢掉原因，也不要在每层重复打印同一个错误造成五份噪音。通常在有足够请求语境且确定最终处理策略的边界记录一次完整错误链。

HTTP 映射要区分：

- 400：输入不合法；
- 404：业务对象不存在；
- 500：未预期内部错误；
- 503：明确的临时依赖不可用（视 API 契约）。

不要把所有异常都返回 404，这会把连接故障伪装成业务不存在。

## 13.8 优雅关闭

收到终止信号时：

1. 停止接收新请求；
2. 等待或限时处理在途请求；
3. 关闭 Redis/Mongo 客户端；
4. 设置合适退出码并让进程退出。

调试器 Stop、终端 `Ctrl+C`、容器终止信号行为不完全相同。练习中用 `Ctrl+C` 观察 `SIGINT` 处理日志；若 VS Code 直接强制结束进程，清理断点可能来不及命中。

## 13.9 运行完整项目

终端一：

```bash
npm run service
```

终端二：

```bash
node examples/10-service-project/request.js
```

也可以选择调试配置 `10 - Service Project`。推荐断点：

- `server.js` 解析 ID 后；
- `user-service.js` 的 GET 返回后；
- `user-repository.js` 的数据库返回后；
- `fake-mongo.js` 查找前；
- `fake-redis.js` 的命令入口。

先跑两次请求，再查看 `/debug/stats`。统计接口只为本地实验设计，真实生产服务不应公开内部 key、命令或连接信息。

## 13.10 扩展练习

1. 为 not-found 增加 500ms 负缓存，并在创建用户后失效。
2. 模拟 Redis `get` 抛错，让读路径降级到 Mongo；写缓存失败只告警。
3. 模拟 Mongo 断开，确认 HTTP 返回 503 而不是 404。
4. 并发发送五个相同冷缓存请求，观察是否发生 cache stampede；实现同进程内按 key 合并 in-flight Promise。
5. 给每条日志加 requestId，证明异步交错时仍能还原单个请求路径。

## 第三阶段过关标准

你能在不逐行跟踪所有依赖代码的前提下，画出一次请求的同步/异步路径，证明缓存是否命中、数据库是否访问，并定位错误值第一次出现的层与异步边界。

### 阶段口述检查

1. 为什么第二次响应更快不能证明 Mongo 没有被调用？
2. “模块中保存的 client 引用”“client 的 ready 状态”“某个 key 的值”为什么是三类不同事实？
3. Mongo 连接失败为什么不能伪装成用户不存在并返回 404？
4. 更新数据库后的缓存失效为什么必须使用与读取相同的 key schema？

## 第三阶段交接：代码机制之外还有启动现实

课程示例目前由你直接运行已知入口，只有一个业务进程，源码与运行文件一致。真实工作中，服务可能由 `npm run dev`、nodemon、测试 runner、容器或进程管理器启动；TypeScript 入口还可能对应 `dist` 中的生成文件。

如果连错进程或跑错构建，第三阶段所有精准观察都会作用在错误目标上。第四阶段先从 `launch.json` 开始，把“这次实验到底启动了谁、带了什么参数、从哪个目录运行”固定下来。
