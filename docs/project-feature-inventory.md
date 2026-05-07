# who_family_wechat 功能清单（用户视角）

> 生成时间：2026-05-05
> 分析方式：GitNexus CLI（status / context / impact / query 尝试）+ 代码直读（pages / components / api / stores）
> 说明：当前会话里 GitNexus MCP 未直接挂载为可调用 MCP 工具，因此本次对 GitNexus 的使用以 **CLI** 为主；其中 `status`、`context` 可用，`query` 受本地只读数据库限制，结果较弱，所以最终清单以代码证据为主、GitNexus 为辅。

---

## 一、产品定位

“互成一家”是一个面向大学校园场景的微信小程序，定位于 **校园互助与成长平台**，功能覆盖：
- 校园社区互动
- AI 助手 / AI 分析
- 教务能力（课表、成绩）
- 校园打印
- 招聘/社团招新
- 个人资料、任务、专注、地址、订单等个人效率与服务模块

**主要导航结构（TabBar）**：
- 首页
- 社区
- 助手
- 知识
- 我的

证据：`pages.json`

---

## 二、功能总览（按用户视角）

### A. 账户与身份类
1. 微信一键登录
2. 登录中加载态与防重复点击
3. 用户协议查看
4. 隐私政策查看
5. 登录后用户信息初始化（昵称、头像、token 等）

### B. 首页聚合类
6. 首页欢迎语与个性化问候
7. 首页轮播 Banner
8. 推荐服务入口
9. 校园动态通知卡片
10. 近期招聘/招新入口

### C. 社区互动类
11. 社区动态流浏览
12. 社区帖子详情查看
13. 发布帖子（文本）
14. 发布帖子（带图片，最多 4 张）
15. 发帖前 AI 润色
16. 已润色内容撤回
17. 帖子点赞 / 取消点赞
18. 一级评论
19. 二级评论 / 回复
20. 加载更多一级评论
21. 加载更多二级评论
22. 删除一级评论
23. 删除二级评论
24. 发布后刷新社区动态列表
25. 我的页面查看自己发过的帖子
26. 删除自己的帖子
27. 我的资料修改后联动刷新社区帖子流
28. 社区页浮动按钮：直接发帖 / 先选图再发帖

### D. AI 助手与 AI 能力类
29. 校园 AI 对话助手
30. AI 流式回复
31. AI 预设问题快捷提问
32. AI 服务状态检查
33. 清空聊天记录
34. 停止 AI 回复
35. 成绩 AI 分析
36. 课表 AI 分析
37. 知识文章 AI 解读浮窗
38. 帖子内容 AI 润色

### E. 教务 / 学业类
39. 成绩查询（学号/密码/学期）
40. 成绩统计（总课程数、总学分、平均分、平均绩点）
41. 课表查询（学号/密码/学期/周次）
42. 课表周次切换
43. 课表课程详情弹窗
44. 教务账号凭据本地缓存（成绩/课表）

### F. 校园监测 / 信息类
45. 校园实时人流监测页面
46. 教学楼实时人流 + 预测下课人流
47. 饭堂 / 校道拥挤度展示
48. 环境感知（天气、温度、PM2.5、空气质量）
49. 场景化出行/通行建议

### G. 校园服务类
50. 远程文档打印服务首页
51. 打印服务是否开放检查
52. 打印价格展示
53. 派送服务 / 上门取件 两种打印服务方式
54. 文件选择上传（支持 PDF / DOC / DOCX）
55. 打印份数选择
56. 收货地址选择
57. 电话信息处理（派送取地址电话，自取填手机号）
58. 创建打印订单
59. 打印下单成功页
60. 我的打印订单列表
61. 打印订单状态筛选

### H. 招聘 / 招新类
62. 招聘列表浏览
63. 招聘详情查看
64. 招聘分页加载更多
65. 下拉刷新招聘列表
66. 招聘类型加载
67. 招聘收藏 / 取消收藏
68. 招聘投递 / 申请
69. 首页招聘卡片推荐入口
70. 招聘分类 Tabs（组件能力存在）

### I. 个人资料与个人中心类
71. 我的页面个人信息展示
72. 个人资料编辑（昵称、性别、学校、专业、年级、简介）
73. 头像上传与更新
74. 我的帖子列表
75. 我的页面下拉刷新
76. 快捷入口：订单 / 地址 / 关于 / 反馈
77. 返回顶部按钮

### J. 地址与订单类
78. 地址列表查看
79. 新增地址
80. 编辑地址
81. 删除地址
82. 设置默认地址
83. 地址本地持久化
84. 打印订单列表查看
85. 打印订单按状态筛选
86. 空订单状态提示与去打印入口

### K. 效率工具类
87. 任务待办列表
88. 新建任务
89. 标记任务完成 / 未完成
90. 删除任务
91. 任务详情弹窗
92. 任务完成进度展示
93. 专注计时
94. 专注取消
95. 专注完成提交
96. 今日专注时长展示
97. 专注完成动画与激励文案

### L. 知识与内容类
98. 知识文章分类浏览
99. 知识文章详情阅读（Markdown）
100. 知识文章收藏按钮（前端态）
101. 知识文章 AI 解读
102. 文章标签、作者、阅读时长、字数、浏览量、点赞数展示

### M. 关于 / 反馈 / 说明类
103. 关于页面（平台定位、核心模块、优势说明）
104. 用户反馈提交页
105. 反馈类型选择
106. 反馈内容填写
107. 反馈截图上传（最多 3 张）
108. 联系方式填写
109. 常见问题展示
110. 用户协议页
111. 隐私政策页

---

## 三、功能详细拆解

## 1. 账户与登录

### 1.1 微信一键登录
- 用户在登录页通过“微信一键登录”进入系统。
- 登录时有 loading 态、防重复触发。
- 登录成功后 `reLaunch` 到首页。
- 登录后会获取 token、userInfo、头像 URL，并写入本地存储。

**证据**
- `pages/login.vue`
- `components/login/LoginForm.vue`
- `stores/user.js`
- `api/user.js`

### 1.2 协议与隐私
- 登录页可跳转《用户协议》《隐私政策》。
- 有独立页面承载协议内容。

**证据**
- `pages/agreement/user.vue`
- `pages/agreement/privacy.vue`
- `pages/login.vue`
- `components/login/LoginForm.vue`

---

## 2. 首页

### 2.1 首页信息聚合
首页是一个聚合入口，不承担复杂交互，主要做分发：
- 顶部欢迎语、日期、昵称
- Banner 轮播
- 推荐服务卡片
- 校园通知流
- 近期招聘入口

**证据**
- `pages/home/index.vue`
- `components/home/HomeHeader.vue`
- `components/home/ServiceRecommend.vue`
- `components/home/CampusNotifications.vue`
- `components/home/RecruitmentCard.vue`

### 2.2 首页推荐服务
当前首页推荐的服务入口包括：
- 校园人流天气
- 查询课表
- 查询成绩
- 远程打印服务
- 更多服务（占位）

**证据**
- `components/home/ServiceRecommend.vue`

### 2.3 校园动态通知
首页存在一套静态/前端内置的“校园动态通知”卡片流，包含：
- 重要通知
- 活动
- 讲座
- 图书馆通知
- 奖学金
- 就业宣讲
- 社团活动

**证据**
- `components/home/CampusNotifications.vue`

---

## 3. 社区互动

### 3.1 动态流浏览
用户可在社区页浏览推荐动态流，支持：
- 首屏加载
- 下拉刷新
- 上拉加载更多
- 进入详情页
- 作者头像加载与缓存

**证据**
- `pages/community/index.vue`
- `components/community/Dynamic.vue`
- `components/community/PostCard.vue`
- `stores/community.js`
- `api/community.js`

### 3.2 发帖
支持：
- 标题
- 正文
- 图片（最多 4 张）
- 文本贴发布
- 图文贴发布
- 发布成功后刷新社区流与我的动态流

**证据**
- `pages/community/publish.vue`
- `stores/community.js`
- `api/community.js`

### 3.3 AI 润色帖子
发帖页提供 AI 润色：
- 标题+正文送 AI 优化
- 可撤回优化结果
- 优化失败有兜底提示

**证据**
- `pages/community/publish.vue`
- `api/helper.js` 中 `optimizePost`

### 3.4 帖子互动
支持：
- 点赞 / 取消点赞
- 评论详情页展示
- 一级评论
- 二级评论回复
- 删除评论 / 删除回复
- 分页加载更多评论与回复

**证据**
- `pages/community/detail.vue`
- `components/community/detail/CommentSection.vue`
- `components/community/detail/CommentItem.vue`
- `components/community/detail/PostStatsBar.vue`
- `stores/community.js`
- `api/community.js`

### 3.5 我的帖子
“我的”页面展示用户自己发布的帖子：
- 拉取自己的帖子列表
- 进入帖子详情
- 删除自己的帖子
- 对自己的帖子点赞/取消点赞

**证据**
- `pages/me/index.vue`
- `components/me/MyPostCard.vue`
- `stores/user.js`
- `api/user.js`

### 3.6 社区中的未完成模块
社区顶部 Tabs 里还存在两个**前端占位功能**：
- 二手
- 评分

它们当前显示“开发中”，不是完整业务。

**证据**
- `components/community/SecondHand.vue`
- `components/community/Rating.vue`
- `pages/community/index.vue`

### 3.7 跑腿信息流
社区还包含“跑腿”标签页：
- 可展示跑腿任务卡片
- 数据目前来自前端 mock
- 点击详情尚未真正落地（代码里已清理掉旧 TODO 导航）

**证据**
- `components/community/Errand.vue`
- `components/community/ErrandCard.vue`
- `stores/errand.js`

---

## 4. AI 助手与 AI 能力

### 4.1 校园 AI 问答助手
这是一个独立的 Tab 页面，支持：
- 聊天式问答
- 流式回复
- 预设问题
- 停止生成
- 清空历史
- AI 服务状态检查

定位偏向：校园生活、学习、手续、社交、心理支持、生活建议。

**证据**
- `pages/helper/index.vue`
- `components/helper/ChatInput.vue`
- `components/helper/AIMessage.vue`
- `components/helper/UserMessage.vue`
- `components/helper/PresetQuestions.vue`
- `stores/helper.js`
- `api/helper.js`

### 4.2 成绩 AI 分析
成绩页集成 AIAnalysis 组件，可对成绩单做结构化分析。

**证据**
- `pages/service/grade.vue`
- `components/AIAnalysis.vue`
- `api/helper.js` 中 `analyzeGradesStream`

### 4.3 课表 AI 分析
课表页集成 AIAnalysis 组件，可对当前周课表做分析。

**证据**
- `pages/service/schedule.vue`
- `components/AIAnalysis.vue`
- `api/helper.js` 中 `analyzeScheduleStream`

### 4.4 知识文章 AI 解读
知识文章详情页可调起 AI 解读浮窗，对文章内容做解释/拆解。

**证据**
- `pages/knowledge/article.vue`
- `components/FloatWindow.vue`
- `components/helper/AIAnalysisMessage.vue`

---

## 5. 教务：成绩查询

### 5.1 登录查询
用户输入：
- 学号
- 密码
- 学期

系统调用远端教务查询接口拉取成绩。

### 5.2 成绩呈现
页面支持：
- 成绩单列表
- 课程名 / 课程代码 / 类别 / 类型
- 学分 / 绩点 / 分数展示
- 成绩等级视觉标识
- 平均分 / 平均绩点 / 总课程数 / 总学分统计
- 空态提示
- 重新查询

### 5.3 凭据缓存
成绩查询会把学号/密码缓存到本地，方便下次复用。

**证据**
- `pages/service/grade.vue`
- `api/school.js` 中 `fetchSchoolGrades`
- GitNexus `context Function:api/school.js:fetchSchoolGrades`

---

## 6. 教务：课表查询

### 6.1 登录查询
用户输入：
- 学号
- 密码
- 学期
- 周次

系统调用远端教务接口拉取某周课表。

### 6.2 课表展示能力
支持：
- 固定时间栅格课表
- 周次前后切换
- 今日列高亮
- 课程块跨度显示
- 点击课程查看详情弹窗
- 课程教师 / 教室 / 班级 / 学分 / 时间展示
- 无课程空态
- 重新查询

### 6.3 凭据缓存
课表查询也会缓存学号/密码。

**证据**
- `pages/service/schedule.vue`
- `api/school.js` 中 `fetchSchoolCourses`
- GitNexus `context Function:api/school.js:fetchSchoolCourses`

---

## 7. 校园实时监测

### 7.1 校园人流与环境感知
这是一个独立服务页，支持：
- 教学楼/饭堂/校道分类切换
- 具体地点切换
- 教学楼场景下：
  - 实时人流（无人机监测）
  - 预测下课人流（课表分析）
- 非教学楼场景下：
  - 拥挤度百分比
  - 状态等级
  - 可视化人流图形
- 天气、温度、PM2.5、空气质量展示
- 场景化建议文案

### 7.2 数据来源说明
从代码看，这个页面主要依赖：
- 本地 `academic-data.json`
- 内置 mock / 规则计算

它更像一个**演示型/信息展示型功能**，而不是纯后端实时推流。

**证据**
- `pages/service/personinfo/personinfo.vue`
- `static/mock/knowledge/academic-data.json`

---

## 8. 文档打印服务

### 8.1 打印服务首页
打印服务页包括：
- 服务开放状态检查
- 服务介绍
- 服务范围说明
- 价格卡片
- 表单下单
- 服务信息说明
- 服务优势说明

### 8.2 下单能力
支持：
- 服务方式：派送 / 上门取件
- 文件上传：PDF / DOC / DOCX
- 打印份数选择
- 选择默认收货地址
- 联系方式校验
- 创建打印订单

### 8.3 下单成功页
支持：
- 订单号展示
- 地址 / 份数 / 创建时间展示
- 冷启动时回退拉取订单列表再匹配订单
- 返回首页

### 8.4 我的打印订单
支持：
- 拉取自己的打印订单列表
- 订单状态筛选：全部 / 待处理 / 处理中 / 已完成
- 空态“去打印”按钮

**证据**
- `pages/service/print/index.vue`
- `components/service/print/*`
- `pages/service/print/success.vue`
- `pages/me/order/index.vue`
- `stores/print.js`
- `api/print.js`

---

## 9. 招聘 / 社团招新

### 9.1 列表页
支持：
- 招聘/招新列表展示
- 下拉刷新
- 加载更多
- 首页推荐招聘入口
- 招聘类型拉取
- 组件层存在分类 Tabs 能力

### 9.2 详情页
支持：
- 公司/组织信息
- 职位名称、薪资、地点
- 职位描述 / 要求 / 福利
- 联系方式
- 招聘人数 / 投递人数 / 发布时间 / 截止时间
- 收藏 / 取消收藏
- 投递申请

**证据**
- `pages/recruit/index.vue`
- `pages/recruit/detail.vue`
- `components/recruit/RecruitCard.vue`
- `components/recruit/CategoryTabs.vue`
- `components/home/RecruitmentCard.vue`
- `stores/recruit.js`
- `api/recruit.js`

---

## 10. 我的 / 个人中心

### 10.1 我的页面概览
包括：
- 个人资料头部
- 快捷导航
- 核心功能卡片（任务 / 专注）
- 我的帖子流
- 回到顶部
- 下拉刷新

**证据**
- `pages/me/index.vue`
- `components/me/UserProfile.vue`
- `components/me/QuickNav.vue`
- `components/me/CoreFunctions.vue`

### 10.2 个人资料编辑
支持：
- 修改头像
- 修改昵称、性别、学校、专业、年级、个人简介
- 保存后刷新自己的帖子与社区流

**证据**
- `pages/me/profile/index.vue`
- `stores/user.js`
- `stores/community.js`

### 10.3 关于页
展示：
- 平台定位
- 核心模块
- 产品优势

**证据**
- `pages/me/about.vue`

### 10.4 反馈页
支持：
- 反馈类型选择
- 文本反馈
- 图片凭证（最多 3 张）
- 联系方式
- 常见问题展示
- 模拟提交成功反馈

**证据**
- `pages/me/feedback.vue`

---

## 11. 地址管理

支持：
- 地址列表展示
- 新增地址
- 编辑地址
- 删除地址
- 设为默认地址
- 地址本地持久化

从代码看，这个地址模块主要用于**打印派送**场景。

**证据**
- `pages/me/address/index.vue`
- `pages/me/address/create.vue`
- `pages/me/address/update.vue`
- `stores/address.js`
- `utils/remoteStorage.js`

---

## 12. 任务待办

支持：
- 输入并添加任务
- 任务列表
- 标记完成 / 未完成
- 删除任务
- 任务详情弹窗
- 激励语

**证据**
- `pages/task/index.vue`
- `stores/task.js`
- `api/task.js`

---

## 13. 专注时刻

支持：
- 开始专注
- 结束专注
- 放弃专注
- 计时器实时展示
- 今日累计专注时长
- 至少专注 10 分钟才能计入
- 完成动画与激励语

**证据**
- `pages/focus/index.vue`
- `stores/focus.js`
- `api/focus.js`

---

## 14. 知识内容

### 14.1 知识列表
支持：
- 分类 tabs 切换
- 知识卡片列表
- 推荐标识
- 难度等级
- 标签 / 作者 / 阅读时长 / 字数 / 浏览点赞数展示

### 14.2 知识详情
支持：
- Markdown 文章渲染
- 收藏按钮（前端态）
- AI 解读

从当前实现看，知识内容明显偏 **静态/mock 内容驱动**。

**证据**
- `pages/knowledge/index.vue`
- `pages/knowledge/article.vue`
- `static/mock/knowledge/*`

---

## 15. 明显未完成 / 占位 / 非主路径功能

以下功能在代码里存在，但不应当与“已完整上线功能”等同：

### 15.1 社区二手模块
- 页面展示“开发中...”
- 无完整业务流

**证据**
- `components/community/SecondHand.vue`

### 15.2 社区评分模块
- 页面展示“开发中...”
- 无完整业务流

**证据**
- `components/community/Rating.vue`

### 15.3 跑腿详情跳转
- 目前只展示跑腿列表/卡片
- 详情跳转逻辑未启用

**证据**
- `components/community/Errand.vue`

### 15.4 两个隔离异常页（非活跃路径）
- `pages/service/express.vue`
- `pages/service/success.vue`

这两页带有老的 `order/*` 逻辑，但：
- 不在 `pages.json` 路由中
- 不被活跃代码引用
- 不能视为当前用户可用功能

---

## 四、面向用户的“功能地图”总结

如果从普通用户体验角度总结，这个小程序当前主要提供 6 大能力群：

### 1. 校园生活与社区互动
- 浏览动态
- 发帖、配图、AI 润色
- 点赞评论回复
- 查看自己的帖子

### 2. AI 陪伴与学习辅助
- 校园 AI 问答
- 课表 AI 分析
- 成绩 AI 分析
- 知识文章 AI 解读

### 3. 教务查询
- 成绩查询
- 课表查询
- 教务凭据缓存

### 4. 校园服务
- 远程打印
- 地址管理
- 我的订单
- 校园人流/环境监测

### 5. 招聘与发展
- 社团/岗位招新浏览
- 查看详情
- 收藏与投递

### 6. 个人成长与效率
- 任务待办
- 专注计时
- 个人资料编辑
- 反馈与关于

---

## 五、GitNexus 使用情况说明

本次分析**确实尝试使用了 GitNexus**，但效果分成两部分：

### 可用部分
- `gitnexus analyze`
- `gitnexus status`
- `gitnexus context <uid>`
- `gitnexus impact <symbol>`

### 不稳定部分
- `gitnexus query "中文关键词"`
  - 运行时出现：FTS index ensure failed / read-only database
  - 因此返回结果很弱，几乎没有提供有效功能映射

### 结论
本次最终功能清单是：
- **GitNexus CLI 结果辅助**
- **代码直读主导**

也就是说，这份文档的可信度主要来自代码本身，而不是只靠 GitNexus 检索结果。

