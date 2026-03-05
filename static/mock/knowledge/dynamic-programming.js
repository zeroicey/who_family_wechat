export const dynamicProgrammingArticle = `
# 动态规划经典题

> 掌握动态规划思想，刷透 LeetCode 经典 DP 问题

## 什么是动态规划？

动态规划（Dynamic Programming，简称 DP）是一种通过把原问题分解为相对简单的子问题的方式求解复杂问题的方法。动态规划常常适用于有**重叠子问题**和**最优子结构性质**的问题。

### 核心思想

1. **重叠子问题**：问题可以分解为子问题，且这些子问题会重复出现
2. **最优子结构**：问题的最优解包含其子问题的最优解
3. **无后效性**：一旦某个状态确定，它之后的发展只与当前状态有关，而与达到这个状态所经历的路径无关

---

## 动态规划解题步骤

### 1. 定义状态
明确 dp 数组的含义，dp[i] 代表什么？

### 2. 状态转移方程
找出状态之间的关系，如何从已知状态推导出未知状态？

### 3. 初始化
确定初始条件，dp[0]、dp[1] 等边界值

### 4. 计算顺序
确保计算每个状态时，它所依赖的状态已经计算过

---

## 经典题型详解

### 1. 爬楼梯问题

**问题描述：**
假设你正在爬楼梯。需要 n 阶你才能到达楼顶。每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

**思路分析：**
- 要爬到第 n 阶，只能从第 n-1 阶爬 1 步，或从第 n-2 阶爬 2 步
- 因此：dp[n] = dp[n-1] + dp[n-2]

**代码实现：**
\`\`\`javascript
function climbStairs(n) {
    if (n <= 2) return n;

    let dp = new Array(n + 1);
    dp[1] = 1;
    dp[2] = 2;

    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
}
\`\`\`

**优化空间复杂度：**
\`\`\`javascript
function climbStairs(n) {
    if (n <= 2) return n;

    let prev2 = 1, prev1 = 2, curr;
    for (let i = 3; i <= n; i++) {
        curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
\`\`\`

---

### 2. 斐波那契数列

**问题描述：**
F(0) = 0, F(1) = 1，F(n) = F(n - 1) + F(n - 2)，求 F(n)

**思路分析：**
典型的 DP 问题，状态转移方程：dp[i] = dp[i-1] + dp[i-2]

**代码实现：**
\`\`\`javascript
function fib(n) {
    if (n <= 1) return n;

    let dp = [0, 1];
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}
\`\`\`

---

### 3. 最长递增子序列（LIS）

**问题描述：**
给定一个无序的整数数组，找到其中最长递增子序列的长度。

**思路分析：**
- dp[i] 表示以 nums[i] 结尾的最长递增子序列长度
- 对于每个 i，遍历 0 到 i-1，如果 nums[j] < nums[i]，则 dp[i] = max(dp[i], dp[j] + 1)

**代码实现：**
\`\`\`javascript
function lengthOfLIS(nums) {
    if (nums.length === 0) return 0;

    const n = nums.length;
    const dp = new Array(n).fill(1);
    let maxLen = 1;

    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        maxLen = Math.max(maxLen, dp[i]);
    }

    return maxLen;
}
\`\`\`

**时间复杂度：** O(n²)
**空间复杂度：** O(n)

---

### 4. 最长公共子序列（LCS）

**问题描述：**
给定两个字符串 text1 和 text2，返回这两个字符串的最长公共子序列的长度。

**思路分析：**
- dp[i][j] 表示 text1[0...i-1] 和 text2[0...j-1] 的最长公共子序列长度
- 如果 text1[i-1] === text2[j-1]：dp[i][j] = dp[i-1][j-1] + 1
- 否则：dp[i][j] = max(dp[i-1][j], dp[i][j-1])

**代码实现：**
\`\`\`javascript
function longestCommonSubsequence(text1, text2) {
    const m = text1.length, n = text2.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
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

### 5. 0-1 背包问题

**问题描述：**
给定一个可容纳重量为 W 的背包和 N 个物品，每个物品有重量和价值两个属性。问：能装入背包的最大价值是多少？

**思路分析：**
- dp[i][w] 表示前 i 个物品，背包容量为 w 时的最大价值
- 对于每个物品，可以选择装入或不装入

**代码实现：**
\`\`\`javascript
function knapsack(W, weights, values, n) {
    const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= W; w++) {
            // 不选第 i 个物品
            dp[i][w] = dp[i - 1][w];

            // 选第 i 个物品（如果装得下）
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(
                    dp[i][w],
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]
                );
            }
        }
    }

    return dp[n][W];
}
\`\`\`

---

## 动态规划优化技巧

### 1. 空间优化
- 滚动数组：只保留必要的几行数据
- 状态压缩：用位运算减少空间占用

### 2. 初始化优化
- 注意边界条件的处理
- 合理设置初始值

### 3. 遍历顺序优化
- 一维 DP 的遍历顺序要根据状态转移关系确定
- 二维 DP 注意行和列的遍历顺序

---

## 常见 DP 题型总结

| 类型 | 特点 | 典型题目 |
|------|------|----------|
| 线性 DP | 一维数组 | 爬楼梯、打家劫舍 |
| 区间 DP | 处理区间 | 最长回文子串 |
| 状态压缩 DP | 用二进制表示状态 | 汉密尔顿路径 |
| 树形 DP | 在树上进行 DP | 树的最大独立集 |
| 概率 DP | 涉及概率计算 | 股票买卖 |

---

## 刷题建议

1. **从简单题开始**：先理解基本概念和套路
2. **画图分析**：画出 DP 表格，理解状态转移
3. **总结模板**：每种题型都有固定的解题模式
4. **多刷多练**：LeetCode DP 标签题至少刷 50 道
5. **注重思路**：不要死记代码，要理解状态转移的逻辑

---

## 推荐练习顺序

1. ✅ 爬楼梯 (70)
2. ✅ 斐波那契数 (509)
3. ✅ 使用最小花费爬楼梯 (746)
4. ✅ 打家劫舍 (198)
5. ✅ 最长递增子序列 (300)
6. ✅ 最长公共子序列 (1143)
7. ✅ 零钱兑换 (322)
8. ✅ 完全平方数 (279)
9. ✅ 最长回文子序列 (516)
10. ✅ 目标和 (494)

---

> 💡 **记忆技巧**：动态规划 = 记忆化搜索 + 状态转移。先想清楚状态是什么，再想状态怎么转移，最后想怎么计算最优解。

**坚持刷题，你一定能掌握动态规划！** 🚀
`;

export const getDynamicProgrammingArticle = () => {
  return dynamicProgrammingArticle;
};
