# 实验 02 答案：读写使用不同 key

## 证据链

命令时间线会显示：

```text
GET tenant:acme:user:u1  → null
SET tenant:acme:users:u1
GET tenant:acme:user:u1  → null
SET tenant:acme:users:u1
```

写入 key 的 `users` 多了 `s`。第二次 GET 查的地址从未被写入，因此 JSON、TTL 和数据库内容都不是当前根因。

## 最小且不易复发的修复

不要仅把某处字符串改对，删除读写两份构造器，只保留一个：

```js
function userKey(tenantId, userId) {
  return `tenant:${tenantId}:user:${userId}`;
}
```

GET、SET、DEL 全部调用 `userKey`。这把 key schema 变成可单测的单一事实来源。

## 回归

- 相同 tenant/user 第二次命中，数据库只读一次；
- `acme/u1` 与 `other/u1` 不能互相命中；
- 不同 user 不能冲突；
- 更新后的 DEL 与读取使用完全相同 key；
- 特殊字符是被禁止还是编码，要有明确契约。

