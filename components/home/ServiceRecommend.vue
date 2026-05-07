<template>
  <view class="service-recommend-section">
    <view class="section-head">
      <view>
        <text class="section-kicker">高频服务</text>
        <text class="section-title">先把最常用的事情放到前面</text>
      </view>
      <text class="section-desc">服务优先，不靠轮播找入口</text>
    </view>

    <view class="service-grid">
      <view
        v-for="item in services"
        :key="item.id"
        class="service-card"
        @tap="navigateToService(item)"
      >
        <view class="icon-wrap" :style="{ background: item.iconBg }">
          <text class="icon-text">{{ item.short }}</text>
        </view>
        <text class="service-title">{{ item.title }}</text>
        <text class="service-desc">{{ item.description }}</text>
        <view class="service-meta">
          <text>{{ item.meta }}</text>
          <text class="service-link">进入</text>
        </view>
      </view>
    </view>

    <view class="quick-strip">
      <view class="quick-item" v-for="item in quickLinks" :key="item.label" @tap="navigate(item.url)">
        <text class="quick-label">{{ item.label }}</text>
        <text class="quick-value">{{ item.value }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
const services = [
  {
    id: 1,
    short: "课",
    title: "课表查询",
    description: "查看本周课程安排与节次信息",
    meta: "教务高频",
    iconBg: "linear-gradient(135deg, #6d4aff, #8d6bff)",
    url: "/pages/service/schedule"
  },
  {
    id: 2,
    short: "绩",
    title: "成绩查询",
    description: "快速查看成绩、绩点与学期表现",
    meta: "结果直达",
    iconBg: "linear-gradient(135deg, #4f8cff, #76a8ff)",
    url: "/pages/service/grade"
  },
  {
    id: 3,
    short: "印",
    title: "文件打印",
    description: "上传文件后下单，打印状态更清楚",
    meta: "生活服务",
    iconBg: "linear-gradient(135deg, #22c55e, #4ade80)",
    url: "/pages/service/print/index"
  },
  {
    id: 4,
    short: "流",
    title: "校园人流",
    description: "看人流与环境信息，避开拥挤时段",
    meta: "实时查看",
    iconBg: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    url: "/pages/service/personinfo/personinfo"
  },
  {
    id: 5,
    short: "任",
    title: "任务管理",
    description: "整理待办，把碎片事务收回来",
    meta: "个人效率",
    iconBg: "linear-gradient(135deg, #fb7185, #f472b6)",
    url: "/pages/task/index"
  },
  {
    id: 6,
    short: "专",
    title: "专注模式",
    description: "开始一次专注时段，减少分心",
    meta: "状态管理",
    iconBg: "linear-gradient(135deg, #14b8a6, #2dd4bf)",
    url: "/pages/focus/index"
  }
];

const quickLinks = [
  { label: "去社区看看", value: "最新动态", url: "/pages/community/index" },
  { label: "问 AI 助手", value: "校园问答", url: "/pages/helper/index" },
  { label: "发现内容", value: "知识 / 招聘", url: "/pages/knowledge/index" }
];

const navigateToService = (item) => {
  if (!item.url) return;
  uni.navigateTo({
    url: item.url
  });
};

const navigate = (url) => {
  if (!url) return;
  uni.switchTab({
    url
  });
};
</script>

<style lang="scss" scoped>
.service-recommend-section {
  padding: 8rpx var(--content-gutter) 0;

  .section-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24rpx;
    margin-bottom: 24rpx;
  }

  .section-kicker {
    display: block;
    margin-bottom: 10rpx;
    font-size: 22rpx;
    font-weight: 600;
    color: var(--brand-primary);
  }

  .section-title {
    display: block;
    font-size: 34rpx;
    line-height: 1.35;
    font-weight: 700;
    color: var(--text-primary);
  }

  .section-desc {
    max-width: 200rpx;
    text-align: right;
    font-size: 22rpx;
    line-height: 1.4;
    color: var(--text-tertiary);
  }

  .service-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20rpx;
  }

  .service-card {
    padding: 24rpx;
    border-radius: 28rpx;
    background: var(--surface-card);
    box-shadow: var(--shadow-soft);
  }

  .icon-wrap {
    width: 72rpx;
    height: 72rpx;
    margin-bottom: 18rpx;
    border-radius: 22rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.2);
  }

  .icon-text {
    color: #fff;
    font-size: 28rpx;
    font-weight: 700;
  }

  .service-title {
    display: block;
    margin-bottom: 10rpx;
    font-size: 30rpx;
    font-weight: 700;
    color: var(--text-primary);
  }

  .service-desc {
    display: block;
    min-height: 74rpx;
    margin-bottom: 16rpx;
    font-size: 24rpx;
    line-height: 1.5;
    color: var(--text-secondary);
  }

  .service-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;

    text {
      font-size: 22rpx;
      color: var(--text-tertiary);
    }

    .service-link {
      color: var(--brand-primary);
      font-weight: 600;
    }
  }

  .quick-strip {
    display: flex;
    gap: 18rpx;
    margin-top: 22rpx;
    overflow-x: auto;
    white-space: nowrap;
  }

  .quick-item {
    min-width: 220rpx;
    padding: 20rpx 22rpx;
    border-radius: 24rpx;
    background: rgba(255, 255, 255, 0.72);
    border: 1rpx solid var(--border-soft);
  }

  .quick-label,
  .quick-value {
    display: block;
  }

  .quick-label {
    margin-bottom: 8rpx;
    font-size: 22rpx;
    color: var(--text-tertiary);
  }

  .quick-value {
    font-size: 26rpx;
    font-weight: 600;
    color: var(--text-primary);
  }
}
</style>
