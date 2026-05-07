<template>
  <view class="service-hero">
    <view class="hero-top">
      <view>
        <text class="eyebrow">互成一家</text>
        <view class="greeting-row">
          <text class="greeting">{{ greeting }}，</text>
          <text class="username">{{ username }}</text>
        </view>
        <text class="hero-title">今天先处理哪件校园小事？</text>
      </view>
      <view class="date-pill">
        <text>{{ dateText }}</text>
      </view>
    </view>

    <view class="hero-panel">
      <view class="panel-copy">
        <text class="panel-title">校园服务入口</text>
        <text class="panel-desc">把课表、成绩、打印、任务与常用信息放回第一视线，少一点装饰，多一点直达。</text>
      </view>
      <view class="panel-stats">
        <view class="stat-item" v-for="item in summaryStats" :key="item.label">
          <text class="stat-value">{{ item.value }}</text>
          <text class="stat-label">{{ item.label }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

const username = computed(() => {
  const userInfo = userStore.get_user_info;
  return userInfo?.name || "同学";
});

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 6) return "凌晨好";
  if (hour < 9) return "早上好";
  if (hour < 12) return "上午好";
  if (hour < 14) return "中午好";
  if (hour < 18) return "下午好";
  if (hour < 22) return "晚上好";
  return "夜深了";
});

const dateText = computed(() => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDay = ["日", "一", "二", "三", "四", "五", "六"][date.getDay()];
  return `${month}.${day} · 星期${weekDay}`;
});

const summaryStats = [
  { label: "高频服务", value: "6+" },
  { label: "社区频道", value: "4" },
  { label: "常用入口", value: "1 步直达" }
];
</script>

<style lang="scss" scoped>
.service-hero {
  padding: 36rpx var(--content-gutter) 24rpx;

  .hero-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24rpx;
    margin-bottom: 28rpx;
  }

  .eyebrow {
    display: inline-flex;
    margin-bottom: 12rpx;
    padding: 8rpx 18rpx;
    border-radius: var(--radius-pill);
    background: rgba(109, 74, 255, 0.1);
    color: var(--brand-primary);
    font-size: 22rpx;
    font-weight: 600;
    letter-spacing: 1rpx;
  }

  .greeting-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8rpx;
    margin-bottom: 10rpx;
  }

  .greeting,
  .username {
    font-size: 46rpx;
    line-height: 1.15;
    color: var(--text-primary);
    font-weight: 700;
  }

  .username {
    color: var(--brand-primary);
  }

  .hero-title {
    display: block;
    max-width: 520rpx;
    color: var(--text-secondary);
    font-size: 28rpx;
    line-height: 1.5;
  }

  .date-pill {
    flex-shrink: 0;
    padding: 14rpx 20rpx;
    border: 1rpx solid rgba(109, 74, 255, 0.12);
    border-radius: var(--radius-pill);
    background: rgba(255, 255, 255, 0.75);
    box-shadow: var(--shadow-soft);

    text {
      color: var(--text-secondary);
      font-size: 24rpx;
      font-weight: 500;
    }
  }

  .hero-panel {
    padding: 30rpx;
    border-radius: 32rpx;
    background: linear-gradient(135deg, #6d4aff 0%, #8d6bff 58%, #a78bfa 100%);
    box-shadow: var(--shadow-strong);
    color: #fff;
  }

  .panel-copy {
    margin-bottom: 28rpx;
  }

  .panel-title {
    display: block;
    margin-bottom: 12rpx;
    font-size: 36rpx;
    font-weight: 700;
  }

  .panel-desc {
    display: block;
    font-size: 26rpx;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.88);
  }

  .panel-stats {
    display: flex;
    gap: 20rpx;
  }

  .stat-item {
    flex: 1;
    min-width: 0;
    padding: 22rpx 20rpx;
    border-radius: 24rpx;
    background: rgba(255, 255, 255, 0.14);
    border: 1rpx solid rgba(255, 255, 255, 0.18);
  }

  .stat-value {
    display: block;
    margin-bottom: 8rpx;
    font-size: 34rpx;
    font-weight: 700;
  }

  .stat-label {
    display: block;
    font-size: 22rpx;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.82);
  }
}
</style>
