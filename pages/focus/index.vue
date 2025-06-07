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
      <text class="motivational-quote">{{ currentMotivationalQuote }}</text>
      <text v-if="isFocusing && !showCompletionAnimation" class="sub-tip">专注期间请勿退出或锁屏，否则计时将中断</text>
    </view>

    <!-- 专注完成动画 -->
    <view v-if="showCompletionAnimation" class="completion-animation">
      <view class="checkmark-circle">
        <view class="checkmark-stem"></view>
        <view class="checkmark-kick"></view>
      </view>
      <text class="completion-text">太棒了！专注完成！</text>
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
const currentMotivationalQuote = ref('每一次专注，都是向目标迈进的一大步。');
const showCompletionAnimation = ref(false); // 控制完成动画的显示

const motivationalQuotes = [
  '时间是海绵里的水，只要愿挤，总还是有的。',
  '坚持一下，胜利就在眼前。',
  '专注力是成功的关键。',
  '今天你专注了吗？为自己点赞！',
  '一分耕耘，一分收获。',
  '保持专注，未来可期。',
  '别让琐事打断你的节奏。',
  '高效的时间利用，源于专注。',
  '每一次专注，都是对未来的投资。',
  '相信自己，你能做到！'
];

const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  currentMotivationalQuote.value = motivationalQuotes[randomIndex];
};

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
    showCompletionAnimation.value = true;
    setTimeout(() => {
      showCompletionAnimation.value = false;
      getRandomQuote(); // 动画结束后更新鼓励语
    }, 2500); // 动画持续2.5秒
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
          getRandomQuote(); // 取消后也更新鼓励语
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
      currentTime.value++;
      // 每隔一段时间更新鼓励语
      if (currentTime.value % 60 === 0 && currentTime.value > 0) { // 例如每分钟更新一次
        getRandomQuote();
      }
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
  getRandomQuote(); // 页面加载时获取初始鼓励语
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
  margin-top: 20rpx; // 与按钮拉开一点距离
  padding: 0 20rpx;

  .motivational-quote {
    font-size: 32rpx;
    color: #555;
    line-height: 1.5;
    margin-bottom: 15rpx;
    display: block;
    font-style: italic;
  }
  .sub-tip {
    font-size: 26rpx;
    color: #aaa;
    display: block;
  }
}

.completion-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;

  .checkmark-circle {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background-color: #409EFF;
    position: relative;
    animation: scaleUp 0.5s ease-out forwards;
  }

  .checkmark-stem {
    position: absolute;
    background-color: white;
    left: 58rpx;
    top: 28rpx;
    width: 10rpx;
    height: 50rpx;
    transform: rotate(45deg);
    animation: drawStem 0.3s 0.5s ease-out forwards;
    transform-origin: bottom;
  }

  .checkmark-kick {
    position: absolute;
    background-color: white;
    left: 38rpx;
    top: 60rpx;
    width: 10rpx;
    height: 25rpx;
    transform: rotate(-45deg);
    animation: drawKick 0.3s 0.7s ease-out forwards;
    transform-origin: bottom;
  }
  
  .completion-text {
    margin-top: 40rpx;
    font-size: 40rpx;
    color: #409EFF;
    font-weight: bold;
    animation: fadeInText 0.5s 1s ease-out forwards;
    opacity: 0;
  }
}

@keyframes scaleUp {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

@keyframes drawStem {
  from {
    height: 0;
  }
  to {
    height: 50rpx;
  }
}

@keyframes drawKick {
  from {
    height: 0;
  }
  to {
    height: 25rpx;
  }
}

@keyframes fadeInText {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>