# 结业实验参考：缓存身份缺少 tenantId

这份答案只用于核对。你的交付还必须包含第十九章规定的复现、运行对象、边界图、假设表、证据、回归矩阵和 PR 说明。

## 根因证据

数据库用 `(tenantId, userId)` 定位用户：`acme:u1` 与 `beta:u1` 是两个对象。缓存却只用 `user:u1`：

```text
acme/u1 → GET user:u1 = null → DB 返回 Ada → SET user:u1=Ada
beta/u1 → GET user:u1 = Ada  → 直接返回，不访问 DB
```

失败请求中，错误数据第一次从第二次 cache GET 返回处进入 Service。根因是缓存 key 没有表达数据库身份中的 tenant 维度。

## 修复方向

使用单一构造函数覆盖完整身份：

```js
cacheKey(tenantId, userId) {
  return `tenant:${tenantId}:user:${userId}`;
}
```

GET、SET 和未来的 DEL 都必须传入相同的 `tenantId, userId`。如果标识符允许分隔符，需要规定安全字符集或使用无歧义编码，不能只靠字符串拼接的视觉效果。

## 旧 key 与发布

修复代码不会自动删除旧的 `user:u1`。可以让旧 key 按短 TTL 自然过期、用版本前缀启用新命名空间并监控容量，或执行经过范围验证的迁移/删除。滚动发布时，新旧版本并存可能分别读写两套 key；发布计划必须明确兼容窗口。

## 必要回归

- 两个 tenant 使用相同 userId 时各自冷读数据库并写不同 key；
- 各自第二次读取命中自己的缓存；
- 相同 tenant 的不同 userId 不冲突；
- not-found 不读取另一 tenant 的值；
- 反转请求顺序仍正确；
- key 编码与旧 key 处理策略有测试或可验证计划。

