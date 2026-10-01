# 实验 01 答案：百分比单位没有归一化

## 证据链

1. 在 `buildReport` 的 map 回调或 `calculateTotal` 入口使用条件 `order.id === 'order-37'`。
2. 输入是 `subtotal=100`、`discountPercent=20`，符合需求“20 表示 20%”。
3. 执行 `const discount = ...` 后首次得到错误值 `2000`。
4. `total=-1900` 只是由错误 discount 推导出的下游症状。

根因：计算函数把整数百分比 `20` 当作比例 `20`，缺少除以 100 的归一化。

## 最小修复

```diff
- const discount = order.subtotal * order.discountPercent;
+ const discount = order.subtotal * (order.discountPercent / 100);
```

更长期的设计可以把字段命名为 `discountRate` 并规定范围 `[0, 1]`，或在系统输入边界统一把 percent 转为 rate；不要让两种单位在核心业务中混用。

## 回归

```js
assert.equal(calculateTotal({ subtotal: 100, discountPercent: 0 }).total, 100);
assert.equal(calculateTotal({ subtotal: 100, discountPercent: 20 }).total, 80);
assert.equal(calculateTotal({ subtotal: 100, discountPercent: 100 }).total, 0);
```

还应拒绝负数、超过 100、非数字和非有限值。仅修公式而不约束输入，仍可能产生不合理金额。

