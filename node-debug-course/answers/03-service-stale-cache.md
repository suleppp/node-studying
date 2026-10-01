# 实验 03 答案：更新数据库后没有失效缓存

## 证据链

1. 首次 GET 返回 null，数据库 find 得到 Ada，随后 SET `user:u1=Ada`。
2. `updateName` 的返回对象和数据库内部记录都是 Grace，证明数据库写成功。
3. 更新后命令日志没有 DEL/SET。
4. 第二次 GET 直接返回仍存在的 Ada 字符串，Service 在缓存命中分支返回，没有访问数据库。

旧值第一次重新进入当前请求的位置是第二次 `cache.get` 返回处；根因则是更新路径缺少失效步骤。

## 最小修复

先成功写数据库，再删除相同 key：

```diff
 async updateName(id, name) {
   const updated = await this.database.updateName(id, name);
+  if (updated !== null) {
+    await this.cache.del(this.key(id));
+  }
   return updated;
 }
```

修复后第二次读取应该 cache miss，再从数据库得到 Grace 并回填。

## 必须明确的失败策略

如果数据库成功但 DEL 失败，系统处于“主存储新、缓存旧”。简单抛错也不能回滚已成功的数据库写。真实项目需要按一致性要求选择重试、消息/outbox、版本化值、短 TTL 或直接更新缓存，并监控失效失败。

## 并发边界

即使采用“写库后删缓存”，也可能有一个更早开始的读请求在删除之后把旧数据库快照 SET 回缓存。高一致性场景需要版本/事件/锁等更完整设计；这超出最小实验，但不能误以为一条 DEL 解决所有分布式竞争。

## 回归

- 冷缓存读取、热缓存读取；
- 更新已有用户后下一次读取为新值；
- 更新不存在用户不创建异常缓存；
- DEL 使用与 GET/SET 相同 key；
- DEL 失败时行为与告警符合约定；
- 两个并发读写顺序的可控测试。

