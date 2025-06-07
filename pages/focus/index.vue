<template>
  <view class="focus-page">
    <view class="header">
      <text class="header-title">专注时刻</text>
      <text class="today-focus-time">今日已专注：{{ formatTime(todayFocusTime) }}</text>
    </view>

    <view class="timer-container">
      <view class="timer-circle">
        <text class="timer-text">{{ formatTimer(currentTime) }}</text>
      </view>
    </view>

    <view class="controls">
      <button v-if="!isFocusing" class="control-button start-button" @tap="startFocus">开始专注</button>
      <button v-if="isFocusing" class="control-button end-button" @tap="endFocus">结束专注</button>
      <button v-if="isFocusing" class="control-button cancel-button" @tap="cancelFocus">放弃专注</button>
    </view>

    <view class="tips">
      <text>保持专注，远离打扰</text>
      <text v-if="isFocusing">专注期间请勿退出或锁屏，否则计时将中断</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const todayFocusTime = computed(() => store.getters['focus/get_today_focus_time']);
const isFocusing = computed(() => store.getters['focus/get_is_focusing']);
const focusStartTime = computed(() => store.getters['focus/get_focus_start_time']);

const currentTime = ref(0);
let timerInterval = null;

// 格式化总专注时间 (分钟 -> X小时Y分钟)
const formatTime = (minutes) => {
  if (minutes === null || minutes === undefined || minutes < 0) {
    return '0分钟';
  }
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) {
    return `${h}小时${m}分钟`;
  }
  return `${m}分钟`;
};

// 格式化计时器 (秒 -> HH:MM:SS)
const formatTimer = (seconds) => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const startFocus = async () => {
  try {
    await store.dispatch('focus/begin_focus');
    currentTime.value = 0; // 重置计时器
    startTimer();
  } catch (error) {
    uni.showToast({
      title: error.message || '开始专注失败',
      icon: 'none'
    });
  }
};

const endFocus = async () => {
  try {
    await store.dispatch('focus/end_focus');
    stopTimer();
    uni.showToast({
      title: '专注完成！',
      icon: 'success'
    });
    // 结束后可以考虑刷新今日专注总时长，如果store没有自动更新的话
    await store.dispatch('focus/fetch_today_focus_time');
  } catch (error) {
    uni.showToast({
      title: error.message || '结束专注失败',
      icon: 'none'
    });
  }
};

const cancelFocus = async () => {
  uni.showModal({
    title: '提示',
    content: '确定要放弃本次专注吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await store.dispatch('focus/cancel_focus');
          stopTimer();
          currentTime.value = 0;
          uni.showToast({
            title: '已取消专注',
            icon: 'none'
          });
        } catch (error) {
          uni.showToast({
            title: error.message || '取消专注失败',
            icon: 'none'
          });
        }
      }
    }
  });
};

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (isFocusing.value) {
      // currentTime.value = Math.floor((Date.now() - focusStartTime.value) / 1000);
      currentTime.value++;
    } else {
      stopTimer();
    }
  }, 1000);
};

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

watch(isFocusing, (newVal, oldVal) => {
  if (newVal) {
    // 如果是从非专注状态变为专注状态，且 focusStartTime 有值（说明可能是从后台切回，或者页面重新加载但仍在专注中）
    if (focusStartTime.value > 0) {
      currentTime.value = Math.floor((Date.now() - focusStartTime.value) / 1000);
      startTimer();
    } else {
      // 正常开始专注流程，currentTime 会在 startFocus 中重置
    }
  } else {
    // 如果从专注状态变为非专注状态 (结束或取消)
    stopTimer();
    // currentTime.value = 0; // 结束或取消时，计时器清零，已在各自函数处理
  }
});

onMounted(async () => {
  await store.dispatch('focus/fetch_today_focus_time');
  // 页面加载时，检查是否已处于专注状态 (例如，用户中途退出App再回来)
  if (isFocusing.value && focusStartTime.value > 0) {
    currentTime.value = Math.floor((Date.now() - focusStartTime.value) / 1000);
    startTimer();
  }
});

onUnmounted(() => {
  stopTimer(); // 页面卸载时停止计时器，防止内存泄漏
});

</script>

<style lang="scss" scoped>
.focus-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx;
  background-color: #f0f2f5; // 更柔和的背景色
  min-height: 100vh;
  box-sizing: border-box;
}

.header {
  width: 100%;
  text-align: center;
  margin-bottom: 60rpx;

  .header-title {
    font-size: 48rpx;
    color: #333;
    font-weight: bold;
    margin-bottom: 10rpx;
    display: block;
  }

  .today-focus-time {
    font-size: 32rpx;
    color: #666;
  }
}

.timer-container {
  margin-bottom: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.timer-circle {
  width: 400rpx;
  height: 400rpx;
  border-radius: 50%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
  border: 10rpx solid #409EFF; // 主题色边框

  .timer-text {
    font-size: 72rpx;
    color: #409EFF; // 主题色
    font-weight: bold;
    font-family: 'Courier New', Courier, monospace; // 等宽字体，数字跳动更好看
  }
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 60rpx;

  .control-button {
    width: 80%;
    max-width: 500rpx;
    height: 90rpx;
    line-height: 90rpx;
    border-radius: 45rpx;
    font-size: 34rpx;
    margin-bottom: 30rpx;
    color: #fff;
    transition: background-color 0.3s, transform 0.1s;
    box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.1);

    &:active {
      transform: scale(0.98);
    }
  }

  .start-button {
    background-color: #409EFF; // 主题色
    &:hover {
      background-color: #66b1ff;
    }
  }

  .end-button {
    background-color: #F56C6C; // 危险色
     &:hover {
      background-color: #f78989;
    }
  }

  .cancel-button {
    background-color: #909399; // 次要信息色
    color: #fff;
     &:hover {
      background-color: #a6a9ad;
    }
  }
}

.tips {
  text-align: center;
  font-size: 28rpx;
  color: #999;
  line-height: 1.6;
  text {
    display: block;
  }
}
</style>