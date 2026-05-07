<template>
  <view class="campus-notifications-section">
    <view class="section-head">
      <view>
        <text class="section-kicker">校园通知</text>
        <text class="section-title">重要信息放在服务之后</text>
      </view>
      <text class="section-count">{{ notifications.length }} 条</text>
    </view>

    <view class="notification-list">
      <view class="notification-item" v-for="item in notifications" :key="item.id">
        <view class="notification-badge" :style="{ color: getTagColor(item.type), backgroundColor: `${getTagColor(item.type)}14` }">
          <text>{{ item.typeText }}</text>
        </view>
        <view class="notification-body">
          <text class="notification-title">{{ item.title }}</text>
          <text class="notification-desc">{{ item.description }}</text>
          <view class="notification-meta">
            <text>{{ item.sender }}</text>
            <text>{{ item.time }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";

const notifications = ref([
  {
    id: 1,
    type: "important",
    typeText: "重要",
    title: "期末考试安排已更新",
    description: "请及时查看考试时间与教室安排，避免与个人计划冲突。",
    time: "2 小时前",
    sender: "教务处"
  },
  {
    id: 2,
    type: "activity",
    typeText: "活动",
    title: "校园才艺大赛开放报名",
    description: "本周内完成报名即可进入初选环节，活动详情已同步发布。",
    time: "今天",
    sender: "学生会"
  },
  {
    id: 3,
    type: "notice",
    typeText: "通知",
    title: "图书馆开放时间调整",
    description: "由于设备维护，图书馆本周工作日与周末开放时间有临时变化。",
    time: "昨天",
    sender: "图书馆"
  }
]);

const getTagColor = (type) => {
  const colors = {
    important: "#ef4444",
    activity: "#3b82f6",
    notice: "#f59e0b"
  };
  return colors[type] || "#6d4aff";
};
</script>

<style lang="scss" scoped>
.campus-notifications-section {
  margin: 28rpx var(--content-gutter) 0;
  padding: 28rpx;
  border-radius: 28rpx;
  background: var(--surface-card);
  box-shadow: var(--shadow-soft);

  .section-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 20rpx;
    margin-bottom: 22rpx;
  }

  .section-kicker,
  .section-title,
  .section-count,
  .notification-title,
  .notification-desc,
  .notification-meta text {
    display: block;
  }

  .section-kicker {
    margin-bottom: 10rpx;
    font-size: 22rpx;
    font-weight: 600;
    color: var(--brand-primary);
  }

  .section-title {
    font-size: 32rpx;
    line-height: 1.4;
    font-weight: 700;
    color: var(--text-primary);
  }

  .section-count {
    font-size: 22rpx;
    color: var(--text-tertiary);
  }

  .notification-item {
    display: flex;
    gap: 18rpx;
    padding: 22rpx 0;
    border-bottom: 1rpx solid var(--border-soft);

    &:last-child {
      padding-bottom: 0;
      border-bottom: none;
    }

    &:first-child {
      padding-top: 0;
    }
  }

  .notification-badge {
    flex-shrink: 0;
    height: fit-content;
    padding: 8rpx 16rpx;
    border-radius: 999rpx;

    text {
      font-size: 22rpx;
      font-weight: 600;
    }
  }

  .notification-body {
    min-width: 0;
    flex: 1;
  }

  .notification-title {
    margin-bottom: 10rpx;
    font-size: 28rpx;
    line-height: 1.45;
    font-weight: 600;
    color: var(--text-primary);
  }

  .notification-desc {
    margin-bottom: 12rpx;
    font-size: 24rpx;
    line-height: 1.55;
    color: var(--text-secondary);
  }

  .notification-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20rpx;

    text {
      font-size: 22rpx;
      color: var(--text-tertiary);
    }
  }
}
</style>
