<template>
  <view class="article-page">
    <!-- 文章头部 -->
    <view class="article-header">
      <view class="article-meta">
        <view class="category-badge" :class="getLevelClass(article.level)">
          <text class="category-text">{{ article.level }}</text>
        </view>
        <text class="article-date">{{ article.publishDate }}</text>
      </view>

      <text class="article-title">{{ article.title }}</text>

      <view class="author-section">
        <image class="author-avatar" :src="getAvatarUrl(article.author)" mode="aspectFill"></image>
        <view class="author-info">
          <text class="author-name">{{ article.author }}</text>
          <text class="article-stats">{{ article.readTime }} · {{ article.wordCount }}字</text>
        </view>
      </view>

      <!-- 统计信息 -->
      <view class="stats-bar">
        <view class="stat-item">
          <text class="stat-icon">👁</text>
          <text class="stat-text">{{ formatNumber(article.views) }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-icon">👍</text>
          <text class="stat-text">{{ formatNumber(article.likes) }}</text>
        </view>
      </view>
    </view>

    <!-- 标签 -->
    <view class="tags-section" v-if="article.tags && article.tags.length">
      <text v-for="(tag, index) in article.tags" :key="index" class="tag-item">#{{ tag }}</text>
    </view>

    <!-- 分隔线 -->
    <view class="divider"></view>

    <!-- Markdown 内容 -->
    <view class="article-content">
      <zero-markdown-view :markdown="markdownContent" :themeColor="'#2979ff'"
        :codeBgColor="'#2d2d2d'"></zero-markdown-view>
    </view>

    <!-- 浮动按钮组 -->
    <view class="floating-buttons">
      <!-- 收藏按钮 -->
      <view class="floating-btn" @click="toggleLike">
        <image class="btn-icon"
          :src="isLiked ? '/static/images/community/liked.png' : '/static/images/community/like.png'" mode="aspectFit">
        </image>
      </view>

      <!-- AI解读按钮 -->
      <view class="floating-btn ai-btn" @click="showAIInterpretation">
        <image class="btn-icon" src="/static/images/tabbar/helper.png" mode="aspectFit"></image>
      </view>
    </view>

    <!-- AI解读浮窗 -->
    <FloatWindow v-model="showAIFloat" title="AI 智能解读" width="90vw" height="80vh" :showHeader="true">
      <!-- Loading 状态 -->
      <view v-if="aiLoading" class="ai-loading">
        <view class="loading-spinner"></view>
        <text class="loading-text">AI 正在解读文章...</text>
      </view>

      <!-- AI 解读内容 -->
      <view v-else class="ai-content">
        <zero-markdown-view :markdown="aiInterpretation" :themeColor="'#2979ff'"
          :codeBgColor="'#2d2d2d'"></zero-markdown-view>
      </view>
    </FloatWindow>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { getDynamicProgrammingArticle } from '@/static/mock/knowledge/dynamic-programming.js';
import { getRandomAvatarUrl } from '@/utils/randomData.js';
import FloatWindow from '@/components/FloatWindow.vue';

const article = ref({
  id: 11,
  title: '动态规划经典题',
  description: '掌握动态规划思想，刷透 LeetCode 经典 DP 问题',
  level: '高级',
  tags: ['动态规划', 'LeetCode', '算法'],
  readTime: '30分钟',
  wordCount: 9200,
  author: 'LeetCode高手',
  views: 18450,
  likes: 567,
  publishDate: '2025-02-28',
  isRecommended: true
});

const markdownContent = ref('');
const isLiked = ref(false);
const showAIFloat = ref(false);
const aiLoading = ref(false);
const aiInterpretation = ref('');

onLoad((options) => {
  if (options && options.id) {
    loadArticle(options.id);
  } else {
    markdownContent.value = getDynamicProgrammingArticle();
  }
});

const loadArticle = (id) => {
  markdownContent.value = getDynamicProgrammingArticle();
};

const goBack = () => {
  uni.navigateBack();
};

const getLevelClass = (level) => {
  const levelMap = {
    '初级': 'tag-beginner',
    '中级': 'tag-intermediate',
    '高级': 'tag-advanced'
  };
  return levelMap[level] || 'tag-beginner';
};

const getAvatarUrl = (author) => {
  return getRandomAvatarUrl(author);
};

const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

const toggleLike = () => {
  isLiked.value = !isLiked.value;
  uni.showToast({
    title: isLiked.value ? '收藏成功' : '取消收藏',
    icon: 'none',
    duration: 1500
  });
};

const showAIInterpretation = () => {
  showAIFloat.value = true;
  aiLoading.value = true;

  // 模拟 AI 解读过程
  setTimeout(() => {
    aiInterpretation.value = generateAIInterpretation();
    aiLoading.value = false;
  }, 1500);
};

const generateAIInterpretation = () => {
  return `
# 🤖 AI 智能解读

## 📊 文章概览

这篇文章深入讲解了**动态规划**这一重要算法思想，适合**高级**水平的开发者学习。

### 核心要点
- 🎯 **难度等级**: 高级
- ⏱ **预计学习时间**: 30分钟
- 📝 **文章字数**: 9200字
- 💡 **涵盖题型**: 5大经典 DP 题型

---

## 🧠 知识图谱

\`\`\`
动态规划 (DP)
├── 基础概念
│   ├── 重叠子问题
│   ├── 最优子结构
│   └── 无后效性
├── 解题步骤
│   ├── 1️⃣ 定义状态
│   ├── 2️⃣ 状态转移方程
│   ├── 3️⃣ 初始化
│   └── 4️⃣ 计算顺序
└── 经典题型
    ├── 爬楼梯 (入门)
    ├── 斐波那契数列 (基础)
    ├── 最长递增子序列 (进阶)
    ├── 最长公共子序列 (进阶)
    └── 0-1 背包问题 (高级)
\`\`\`

---

## 🔑 关键概念解析

### 1. 状态定义的精髓

> 💡 **核心洞察**: DP 的关键在于定义合适的状态。状态定义好了，问题就解决了一半！

**示例 - 爬楼梯问题:**
\`\`\`javascript
// ❌ 错误的状态定义
dp[n] = 爬到第n阶的方法

// ✅ 正确的状态定义
dp[i] = 爬到第i阶楼梯的不同方法数
\`\`\`

### 2. 状态转移的艺术

状态转移方程是 DP 的核心，需要找到**子问题**与**原问题**的关系：

\`\`\`
F(n) = F(n-1) + F(n-2)  // 斐波那契
LIS[i] = max(LIS[j] + 1)  // if nums[j] < nums[i]
LCS[i][j] = LCS[i-1][j-1] + 1  // if text1[i-1] === text2[j-1]
\`\`\`

---

## 📈 学习路径建议

### 阶段一：基础入门 (1-2周)
\`\`\`
✅ 爬楼梯问题
✅ 斐波那契数列
✅ 使用最小花费爬楼梯
✅ 打家劫舍
\`\`\`

### 阶段二：进阶提升 (2-3周)
\`\`\`
✅ 最长递增子序列
✅ 最长公共子序列
✅ 零钱兑换
✅ 完全平方数
\`\`\`

### 阶段三：高级挑战 (3-4周)
\`\`\`
✅ 最长回文子序列
✅ 目标和
✅ 编辑距离
✅ 0-1 背包问题
\`\`\`

---

## 🎯 解题模板总结

### 线性 DP 模板
\`\`\`javascript
function linearDP(n) {
    // 1. 定义 dp 数组
    const dp = new Array(n + 1);

    // 2. 初始化边界
    dp[0] = 0;
    dp[1] = 1;

    // 3. 状态转移
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
}
\`\`\`

### 二维 DP 模板
\`\`\`javascript
function twoDimensionalDP(m, n) {
    // 1. 定义二维 dp 数组
    const dp = Array.from({ length: m + 1 }, () =>
        new Array(n + 1).fill(0)
    );

    // 2. 初始化边界
    for (let i = 0; i <= m; i++) dp[i][0] = 0;
    for (let j = 0; j <= n; j++) dp[0][j] = 0;

    // 3. 状态转移
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (condition) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    return dp[m][n];
}
\`\`\`

---

## ⚡ 性能优化技巧

### 空间优化
\`\`\`javascript
// ❌ O(n) 空间复杂度
dp = new Array(n + 1);
dp[i] = dp[i - 1] + dp[i - 2];

// ✅ O(1) 空间复杂度
let prev2 = 0, prev1 = 1;
let curr = prev2 + prev1;
prev2 = prev1;
prev1 = curr;
\`\`\`

### 滚动数组
\`\`\`javascript
// 适用于只需要保留前几行的情况
const dp = [[...], [...]]; // 只保留2行
for (let i = 1; i <= n; i++) {
    const row = i % 2; // 交替使用
    for (let j = 1; j <= m; j++) {
        dp[row][j] = ...;
    }
}
\`\`\`

---

## 🏆 常见陷阱与注意事项

### ⚠️ 陷阱1：数组越界
\`\`\`javascript
// ❌ 错误
for (let i = 1; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]; // i=1 时访问 dp[-1]
}

// ✅ 正确
if (i === 1) {
    dp[1] = 1;
} else {
    dp[i] = dp[i - 1] + dp[i - 2];
}
\`\`\`

### ⚠️ 陷阱2：初始化错误
\`\`\`javascript
// ❌ 错误 - 忘记初始化
const dp = new Array(n + 1);

// ✅ 正确 - 明确初始化
const dp = new Array(n + 1).fill(0);
dp[0] = 0;
dp[1] = 1;
\`\`\`

---

## 📚 推荐练习顺序

| 阶段 | 题目 | LeetCode ID | 难度 |
|------|------|-------------|------|
| 🟢 入门 | 爬楼梯 | 70 | 简单 |
| 🟢 入门 | 斐波那契数 | 509 | 简单 |
| 🟡 进阶 | 打家劫舍 | 198 | 中等 |
| 🟡 进阶 | 最长递增子序列 | 300 | 中等 |
| 🟡 进阶 | 最长公共子序列 | 1143 | 中等 |
| 🔴 高级 | 零钱兑换 | 322 | 中等 |
| 🔴 高级 | 目标和 | 494 | 中等 |
| 🔴 高级 | 编辑距离 | 72 | 困难 |

---

## 💪 学习建议

1. **📖 理论先行**: 先理解 DP 的核心思想，不要急于刷题
2. **✏️ 手写推导**: 拿纸笔画出 DP 表格，理解状态转移
3. **🔄 多种解法**: 同一道题尝试不同的 DP 实现
4. **📝 总结归纳**: 建立自己的 DP 题型知识库
5. **🎯 持续练习**: 每天保持 2-3 道 DP 题的练习量

---

## 🔗 相关资源

- 📚 [LeetCode 动态规划标签](https://leetcode.cn/tag/dynamic-programming/)
- 🎥 [动态规划可视化](https://visualgo.net/zh/dp)
- 📖 《算法导论》第15章：动态规划
- 🎓 [MIT 6.006: 动态规划](https://www.youtube.com/watch?v=OQ5jsbhAv_M)

---

> ⭐ **总结**: 动态规划是算法面试中的重难点，掌握好 DP 可以让你在面试中脱颖而出。记住：**多练、多想、多总结**！

**加油！你一定能成为 DP 高手！** 💪🚀
`;
};

// 分享配置
onShareAppMessage(() => {
  return {
    title: article.value.title,
    path: '/pages/knowledge/article?id=' + article.value.id,
    imageUrl: '/static/images/logo.png'
  };
});

onShareTimeline(() => ({
  title: article.value.title,
  imageUrl: '/static/images/logo.png'
}));
</script>

<style scoped>
.article-page {
  min-height: 100vh;
  background-color: #fafafa;
  padding-bottom: 40rpx;
}

/* 导航栏 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 20rpx 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  z-index: 1000;
}

.nav-back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 40rpx;
  color: #333;
}

.nav-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1a1a1a;
  flex: 1;
  text-align: center;
}

.nav-placeholder {
  width: 64rpx;
}

/* 文章头部 */
.article-header {
  background-color: #fff;
  padding: 120rpx 32rpx 32rpx;
  margin-bottom: 16rpx;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.category-badge {
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: bold;
}

.tag-beginner {
  background-color: #e8f5e3;
  color: #4caf50;
}

.tag-intermediate {
  background-color: #fff3e0;
  color: #ff9800;
}

.tag-advanced {
  background-color: #ffebee;
  color: #f44336;
}

.article-date {
  font-size: 24rpx;
  color: #999;
}

.article-title {
  display: block;
  font-size: 44rpx;
  font-weight: bold;
  color: #1a1a1a;
  line-height: 1.4;
  margin-bottom: 28rpx;
}

.author-section {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 0;
}

.author-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: #f0f0f0;
}

.author-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.author-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.article-stats {
  font-size: 24rpx;
  color: #999;
}

.stats-bar {
  display: flex;
  gap: 32rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #f0f0f0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.stat-icon {
  font-size: 28rpx;
}

.stat-text {
  font-size: 24rpx;
  color: #666;
}

/* 标签 */
.tags-section {
  background-color: #fff;
  padding: 24rpx 32rpx;
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
}

.tag-item {
  font-size: 24rpx;
  color: #2979ff;
  background-color: #e8f2ff;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
}

/* 分隔线 */
.divider {
  height: 16rpx;
  background-color: #fafafa;
}

/* 文章内容 */
.article-content {
  background-color: #fff;
  padding: 32rpx;
  min-height: 60vh;
}

/* 浮动按钮组 */
.floating-buttons {
  position: fixed;
  right: 32rpx;
  bottom: 100rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  z-index: 999;
}

.floating-btn {
  width: 96rpx;
  height: 96rpx;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.floating-btn:active {
  transform: scale(0.9);
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.ai-btn {
  background-color: #39ff14;
}

.btn-icon {
  width: 48rpx;
  height: 48rpx;
}

/* AI Loading 效果 */
.ai-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
  gap: 32rpx;
}

.loading-spinner {
  width: 80rpx;
  height: 80rpx;
  border: 6rpx solid #f0f0f0;
  border-top-color: #2979ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 28rpx;
  color: #666;
}

/* AI 内容 */
.ai-content {
  min-height: 60vh;
}
</style>
