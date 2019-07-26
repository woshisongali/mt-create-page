# mt-create-page
to create  template pages
运营后台页面构建
### 启动命令 npm run start

### 解析问题

1.esprima 解析'...'有问题， 不能正确识别 该扩展符

2. esprima 无法识别 class static

3. gulp采用3.0版本  插件不支持情况需考虑

4. `Buffer() is deprecated due to security and usability issues. Please use the Buffer.alloc(), Buffer.allocUnsafe(), or Buffer.from() methods instead.`
Node.js 5.x 发行自 2016 年就不再支持，而 4.x 版本 发行线支持到 2018 年 4 月就寿终正寝了（→ 计划表）。这意味着这些版本 不会 接受任何更新，即便有安全问题也不会被修复，所以如果可能，我们不应使用这些版本。

在这种情况下，你应该把全部的 new Buffer() 或 Buffer() 更改为 Buffer.alloc() 或 Buffer.from()，规则如下：

对于 new Buffer(number), 请用 Buffer.alloc(number) 替换。
对于 new Buffer(string) （或 new Buffer(string, encoding)），请用对应的 Buffer.from(string) （或 Buffer.from(string, encoding)）进行替换。
对于其它情况（一般极为罕见）中使用了 new Buffer(...arguments) 的，请用 Buffer.from(...arguments) 进行替换。
注意：Buffer.alloc() 在当前的 Node.js 版本上 快于 new Buffer(size).fill(0)，后者是当你确认需要用 0 对整个缓存进行初始化。
文档地址： https://nodejs.org/zh-cn/docs/guides/buffer-constructor-deprecation/


