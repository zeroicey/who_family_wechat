<template>
  <view class="core-functions">
    <view class="function-cards">
      <!-- 任务待办卡片 -->
      <view class="function-card community-card" @tap="navigateTo('/pages/task/index')">
        <view class="card-header">
          <view class="card-content">
            <image src="/static/images/me/task.svg" class="card-icon" mode="aspectFit"></image>
            <view class="card-info">
              <text class="card-title">任务待办</text>
              <text class="card-count">{{ todoData.count }} 项未完成</text>
            </view>
          </view>

        </view>
        <view class="card-progress">
          <view class="progress-bar">
            <view class="progress-inner" :style="{ width: todoData.progress + '%' }"></view>
          </view>
          <text class="progress-text">完成进度</text>
        </view>
      </view>

      <!-- 专注时刻卡片 -->
      <view class="function-card focus-card" @tap="navigateTo('/pages/focus/index')">
        <view class="card-header">
          <view class="card-content">
            <image src="/static/images/me/focus.svg" class="card-icon" mode="aspectFit"></image>
            <view class="card-info">
              <text class="card-title">专注时刻</text>
              <text class="card-time">今日专注 {{ formatTime(todayFocusTime) }}</text>
              <text class="card-motivational">{{ motivationalText }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useFocusStore } from "@/stores/focus";
import { useTaskStore } from "@/stores/task";
const focusStore = useFocusStore();
const taskStore = useTaskStore();

// 初始化 store

const todayFocusTime = computed(() => focusStore.get_today_focus_time); // 修正getter名称
const todoTaskNum = computed(() => taskStore.get_todo_task_num);
const doneTaskNum = computed(() => taskStore.get_done_task_num);

onMounted(async () => {
  try {
    await taskStore.fetch_all_tasks();
    await focusStore.fetch_today_focus_time();
  } catch (error) {
    uni.showToast({
      title: '数据获取失败',
      icon: 'none'
    });
  }
});

// 待办数据计算
const todoData = computed(() => {
  const total = todoTaskNum.value + doneTaskNum.value;
  const progress = total > 0 ? Math.round((doneTaskNum.value / total) * 100) : 0;
  return {
    count: todoTaskNum.value,
    progress: progress
  };
});

// 格式化时间 (接收分钟数)
const formatTime = (minutes) => {
  if (minutes === null || minutes === undefined || minutes < 0) {
    return '0分钟'; // 或者其他默认值
  }
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) {
    return `${h}小时${m}分钟`;
  }
  return `${m}分钟`;
};

// 激励语列表
const motivationalQuotes = [
  '专注成就未来',
  '心无旁骛行',
  '深思促成长',
  '不负好时光',
  '专注最珍贵',
  '每分钟都值',
  '专注超自我',
  '静心厚积发',
  '专注是修行',
  '坚持专注力'
];

// 根据当前时间选择激励语（每小时变化一次）
const motivationalText = computed(() => {
  const hour = new Date().getHours();
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const index = (hour + dayOfYear) % motivationalQuotes.length;
  return motivationalQuotes[index];
});

// 页面跳转
const navigateTo = (url) => {
  uni.navigateTo({ url });
};
</script>

<style lang="scss" scoped>
.core-functions {
  padding: 2vw 2vw;
  margin: 1vw 0;

  .function-cards {
    display: flex;
    justify-content: space-between;
    gap: 10px;

    .function-card {
      width: 48%;
      background-color: #fff;
      border-radius: 4vw;
      padding: 4vw;
      // margin-bottom: 1vw;
      box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
      position: relative;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;

      &:active {
        transform: translateY(1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      .card-header {
        margin-bottom: 3vw;
      }

      .card-content {
        display: flex;
        align-items: center;

        .card-icon {
          width: 10vw;
          height: 10vw;
          margin-right: 4vw;
        }

        .card-info {
          flex: 1;

          .card-title {
            font-size: 4.2vw;
            font-weight: 600;
            color: #333;
            margin-bottom: 1.5vw;
            display: block;
            letter-spacing: 0.02em;
          }

          .card-count {
            font-size: 3.2vw;
            color: #666;
            display: flex;
            align-items: center;
          }

          .card-time {
            font-size: 3.2vw;
            color: #666;
          }

          .card-motivational {
            font-size: 3.2vw;
            color: #1890ff;
            margin-top: 1.5vw;
            font-weight: 500;
            display: block;
          }
        }
      }

      .card-progress {
        display: flex;
        align-items: center;

        .progress-bar {
          flex: 1;
          height: 2vw;
          background-color: #f5f5f5;
          border-radius: 1vw;
          overflow: hidden;
          margin-right: 3vw;

          .progress-inner {
            height: 100%;
            background: linear-gradient(90deg, #1890ff, #36cfc9);
            border-radius: 1vw;
            position: relative;
            overflow: hidden;

            &:after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(90deg,
                  rgba(255, 255, 255, 0) 0%,
                  rgba(255, 255, 255, 0.3) 50%,
                  rgba(255, 255, 255, 0) 100%);
              animation: shimmer 2s infinite;
            }
          }
        }

        .progress-text {
          font-size: 3vw;
          color: #999;
          min-width: 8vw;
          text-align: right;
        }
      }

      .card-status {
        background-color: #f5f5f5;
        padding: 2vw 4vw;
        border-radius: 5vw;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

        text {
          font-size: 3.2vw;
          color: #666;
          font-weight: 500;
        }

        &.checked-in {
          background: linear-gradient(135deg, #52c41a, #73d13d);
          box-shadow: 0 2px 8px rgba(82, 196, 26, 0.3);

          text {
            color: white;
          }
        }
      }

      .card-action {
        display: flex;
      }
    }
  }
}
</style>
