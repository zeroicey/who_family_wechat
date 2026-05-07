<template>
  <view class="core-functions-shell">
    <view class="section-head">
      <view>
        <text class="section-kicker">效率工具</text>
        <text class="section-title">把常用的个人效率能力收在一层</text>
      </view>
    </view>

    <view class="function-cards">
      <view class="function-card task-card" @tap="navigateTo('/pages/task/index')">
        <view class="card-top">
          <image src="/static/images/me/task.svg" class="card-icon" mode="aspectFit"></image>
          <text class="card-title">任务待办</text>
        </view>
        <text class="card-main">{{ todoData.count }} 项未完成</text>
        <view class="card-progress">
          <view class="progress-bar">
            <view class="progress-inner" :style="{ width: todoData.progress + '%' }"></view>
          </view>
          <text class="progress-text">完成 {{ todoData.progress }}%</text>
        </view>
      </view>

      <view class="function-card focus-card" @tap="navigateTo('/pages/focus/index')">
        <view class="card-top">
          <image src="/static/images/me/focus.svg" class="card-icon" mode="aspectFit"></image>
          <text class="card-title">专注时刻</text>
        </view>
        <text class="card-main">今日专注 {{ formatTime(todayFocusTime) }}</text>
        <text class="card-desc">{{ motivationalText }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useFocusStore } from "@/stores/focus";
import { useTaskStore } from "@/stores/task";

const focusStore = useFocusStore();
const taskStore = useTaskStore();

const todayFocusTime = computed(() => focusStore.get_today_focus_time);
const todoTaskNum = computed(() => taskStore.get_todo_task_num);
const doneTaskNum = computed(() => taskStore.get_done_task_num);

onMounted(async () => {
  try {
    await taskStore.fetch_all_tasks();
    await focusStore.fetch_today_focus_time();
  } catch (error) {
    uni.showToast({
      title: "数据获取失败",
      icon: "none"
    });
  }
});

const todoData = computed(() => {
  const total = todoTaskNum.value + doneTaskNum.value;
  const progress = total > 0 ? Math.round((doneTaskNum.value / total) * 100) : 0;
  return {
    count: todoTaskNum.value,
    progress
  };
});

const formatTime = (minutes) => {
  if (minutes === null || minutes === undefined || minutes < 0) {
    return "0分钟";
  }
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) {
    return `${h}小时${m}分钟`;
  }
  return `${m}分钟`;
};

const motivationalQuotes = [
  "专注成就未来", "心无旁骛行", "深思促成长", "不负好时光", "专注最珍贵", "每分钟都值",
  "专注超自我", "静心厚积发", "专注是修行", "坚持专注力"
];

const motivationalText = computed(() => {
  const hour = new Date().getHours();
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const index = (hour + dayOfYear) % motivationalQuotes.length;
  return motivationalQuotes[index];
});

const navigateTo = (url) => {
  uni.navigateTo({ url });
};
</script>

<style lang="scss" scoped>
.core-functions-shell {
  padding: 20rpx 24rpx 0;
}

.section-head {
  margin-bottom: 18rpx;
}

.section-kicker,
.section-title,
.card-title,
.card-main,
.card-desc,
.progress-text {
  display: block;
}

.section-kicker {
  margin-bottom: 8rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: var(--brand-primary);
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.function-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.function-card {
  padding: 24rpx;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: var(--shadow-soft);
}

.card-top {
  display: flex;
  align-items: center;
  gap: 14rpx;
  margin-bottom: 18rpx;
}

.card-icon {
  width: 52rpx;
  height: 52rpx;
}

.card-title {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.card-main {
  margin-bottom: 14rpx;
  font-size: 26rpx;
  line-height: 1.5;
  color: var(--text-primary);
}

.card-desc {
  font-size: 22rpx;
  line-height: 1.5;
  color: var(--text-secondary);
}

.progress-bar {
  width: 100%;
  height: 12rpx;
  margin-bottom: 10rpx;
  border-radius: 999rpx;
  background: #eef2f7;
  overflow: hidden;
}

.progress-inner {
  height: 100%;
  border-radius: 999rpx;
  background: linear-gradient(90deg, #6d4aff, #8d6bff);
}

.progress-text {
  font-size: 22rpx;
  color: var(--text-tertiary);
}
</style>
