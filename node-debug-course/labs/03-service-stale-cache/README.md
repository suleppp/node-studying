# 实验 03：Service 更新后的旧缓存

运行：

```bash
npm run lab:03
```

流程：第一次读取从数据库得到 Ada 并回填缓存；更新把数据库名字改为 Grace；第二次读取仍得到 Ada。

任务：

1. 证明数据库更新已成功；
2. 找出旧值从哪个边界重新进入 Service；
3. 根据命令时间线说明为何不是 JSON.parse 的问题；
4. 实现最小失效修复；
5. 回归 cache miss、hit、update、not-found 和缓存删除失败策略。

