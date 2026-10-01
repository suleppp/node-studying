# 故障实验

这些目录故意保留错误。正常运行时若成功复现，会打印 `BUG REPRODUCED` 并以 0 退出；这只说明故障实验按设计工作，不说明业务逻辑正确。

## 使用纪律

1. 先读该实验 `README.md` 的需求，不读源码答案；
2. 运行并保存输出；
3. 写下实际与期望的最小差异；
4. 最多使用题目规定数量的断点；
5. 找出错误数据第一次形成的位置；
6. 写出自己的修复和回归案例；
7. 最后再看 `answers/`。

## 实验列表

- [实验 01：同步订单金额错误](01-sync-order-bug/README.md)
- [实验 02：缓存 key 不一致](02-cache-key-bug/README.md)
- [实验 03：Service 更新后的旧缓存](03-service-stale-cache/README.md)
- [结业实验：多租户缓存数据泄漏](04-multitenant-cache-leak/README.md)
