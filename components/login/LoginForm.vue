<template>
  <view class="login-form">
    <button class="wechat-login-btn" @tap="handleWechatLogin" :disabled="loading" :class="{ 'loading': loading }">
      <view class="wechat-icon">
        <!-- 微信图标 SVG -->
        <image src="/static/images/chat.png" class="wechat-png"></image>
      </view>
      <text>{{ loading ? '登录中...' : '微信一键登录' }}</text>
    </button>

    <view class="divider">
      <view class="line"></view>
      <text>登录说明</text>
      <view class="line"></view>
    </view>

    <view class="login-tips">
      <text>登录即代表同意</text>
      <text class="link-text" @tap="handleUserAgreement">《用户协议》</text>
      <text>和</text>
      <text class="link-text" @tap="handlePrivacyPolicy">《隐私政策》</text>
    </view>
  </view>
</template>

<script setup>
import { defineEmits, computed } from 'vue';
import { useStore } from 'vuex';

// 移除了showAppDownload属性

const emit = defineEmits(['wechatLogin', 'agreement', 'privacy']);
const store = useStore();

// 获取登录加载状态
const loading = computed(() => store.getters['user/loginLoading']);

// 处理微信登录
const handleWechatLogin = () => {
  if (loading.value) return;

  // 显示登录中的提示
  uni.showToast({
    title: '登录中...',
    icon: 'loading',
    mask: true,
    duration: 10000 // 设置较长时间，登录成功后会被关闭
  });

  emit('wechatLogin');
};

// 处理用户协议点击
const handleUserAgreement = () => {
  emit('agreement');
};

// 处理隐私政策点击
const handlePrivacyPolicy = () => {
  emit('privacy');
};
</script>

<style lang="scss" scoped>
.login-form {
  position: relative;
  width: 100%;

  .wechat-login-btn {
    width: 100%;
    height: 12vw;
    background-color: #07c160;
    color: #fff;
    font-size: 4.5vw;
    border-radius: 6vw;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5vw;
    transition: all 0.3s ease;
    box-shadow: 0 0.5vw 2vw rgba(7, 193, 96, 0.3);

    &:active {
      transform: scale(0.98);
      box-shadow: 0 0.3vw 1vw rgba(7, 193, 96, 0.2);
    }

    &.loading {
      background-color: #06a050;
    }

    &:disabled {
      opacity: 0.8;
    }

    .wechat-icon {
      width: 6vw;
      height: 6vw;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 2vw;

      .wechat-png {
        width: 5vw;
        height: 5vw;
        position: relative;

        &::before,
        &::after {
          content: '';
          position: absolute;
          background-color: #07c160;
        }
      }

    }
  }

  .divider {
    display: flex;
    align-items: center;
    margin: 6vw 0;

    .line {
      flex: 1;
      height: 1px;
      background-color: #eee;
    }

    text {
      padding: 0 3vw;
      font-size: 3.2vw;
      color: #999;
    }
  }

  .login-tips {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 3vw;
    flex-wrap: wrap;

    text {
      font-size: 3vw;
      color: #999;
    }

    .link-text {
      color: #07c160;
      margin: 0 1vw;
    }
  }

  /* 下载APP相关样式已移除 */
}
</style>
