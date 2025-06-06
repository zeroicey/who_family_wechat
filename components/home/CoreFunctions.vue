<template>
  <view class="core-functions">
    <view class="function-cards">
      <!-- 任务待办卡片 -->
      <view class="function-card community-card" @tap="navigateTo('/pages/todo/index')">
        <view class="card-header">
          <view class="card-content">
            <view class="card-icon-container community-icon">
              <view class="card-icon-bg"></view>
              <text class="card-icon-text">待</text>
            </view>
            <view class="card-info">
              <text class="card-title">任务待办</text>
              <text class="card-count">{{ todoData.count || 0 }} 项未完成</text>
            </view>
          </view>
          <view class="card-badge">活跃</view>
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
            <view class="card-icon-container focus-icon">
              <view class="card-icon-bg"></view>
              <text class="card-icon-text">专</text>
            </view>
            <view class="card-info">
              <text class="card-title">专注时刻</text>
              <text class="card-time">今日专注 {{ formatTime(focusData.todayDuration) }}</text>
            </view>
          </view>
        </view>
        <view class="card-rank">
          <view class="rank-tag">
            <text>成就值 #{{ focusData.rank || '--' }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

// 初始化 store
const store = useStore();

// 社区数据
const todoData = ref({
  count: 0,
  progress: 0,
});

// 专注数据
const focusData = ref({
  todayDuration: 0,
  rank: 0,
});

// 格式化时间
const formatTime = (time) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  return `${hours}小时${minutes}分钟${seconds}秒`;
};

// 页面跳转
const navigateTo = (url) => {
  uni.navigateTo({ url });
};
</script>

<style lang="scss" scoped>
.core-functions {
  padding: 4vw 5vw;

  .function-cards {
    display: flex;
    flex-direction: column;

    .function-card {
      flex: 1;
      background-color: #fff;
      border-radius: 4vw;
      padding: 5vw;
      margin-bottom: 3vw;
      box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
      position: relative;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;

      &:active {
        transform: translateY(1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      &:last-child {
        margin-bottom: 0;
      }

      .card-header {
        margin-bottom: 3vw;
      }

      .card-content {
        display: flex;
        align-items: center;

        .card-icon-container {
          width: 12vw;
          height: 12vw;
          border-radius: 50%;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 4vw;

          .card-icon-bg {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }

          .card-icon-text {
            position: relative;
            color: white;
            font-size: 5.5vw;
            font-weight: bold;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          }

          &.community-icon {
            .card-icon-bg {
              background: linear-gradient(135deg, #1890ff, #36cfc9);
              box-shadow: 0 3px 8px rgba(24, 144, 255, 0.3);
            }
          }

          &.plan-icon {
            .card-icon-bg {
              background: linear-gradient(135deg, #52c41a, #73d13d);
              box-shadow: 0 3px 8px rgba(82, 196, 26, 0.3);
            }
          }

          &.focus-icon {
            .card-icon-bg {
              background: linear-gradient(135deg, #fa8c16, #ffc53d);
              box-shadow: 0 3px 8px rgba(250, 140, 22, 0.3);
            }
          }
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

          .card-desc {
            font-size: 3.2vw;
            color: #666;
            display: block;
          }

          .card-count {
            font-size: 3.2vw;
            color: #666;
            display: flex;
            align-items: center;
          }

          .streak-container {
            display: flex;
            align-items: center;

            .card-streak {
              font-size: 3.2vw;
              color: #666;
            }

            .streak-number {
              font-size: 4.5vw;
              font-weight: 600;
              color: #52c41a;
              margin: 0 1vw;
            }
          }

          .card-time {
            font-size: 3.2vw;
            color: #666;
          }
        }
      }

      .card-badge {
        background: linear-gradient(135deg, #1890ff, #36cfc9);
        color: white;
        font-size: 2.8vw;
        font-weight: 500;
        padding: 1vw 2.5vw;
        border-radius: 3vw;
        position: absolute;
        top: 5vw;
        right: 5vw;
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
