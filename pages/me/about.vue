<template>
  <view class="about-page">
    <view class="header-bg">
      <view class="header-content">
        <image class="logo" src="/static/images/logo.png"></image>
        <view class="text-wrapper">
          <text class="title">互成一家</text>
          <text class="slogan">全方位校园互助与成长平台</text>
        </view>
      </view>
    </view>

    <view class="content-card">
      <view class="card-title">平台定位</view>
      <view class="card-body">
        <text class="paragraph">“互成一家”小程序旨在打造一个全方位的校园互助与成长平台，紧密围绕大学生的学习、生活和职业发展需求，整合多种实用功能，为校园用户提供更便捷、高效、丰富的线上互动体验，促进同学们之间的交流与互助，助力个人成长与校园生活的优化。</text>
      </view>
    </view>

    <view class="content-card">
      <view class="card-title">核心模块</view>
      <view class="card-body">
        <view class="module-grid">
          <view class="module-item" v-for="(item, index) in coreModules" :key="index">
            <uni-icons :type="item.icon" size="32" color="#007aff"></uni-icons>
            <text class="module-name">{{ item.name }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="content-card">
      <view class="card-title">我们的优势</view>
      <view class="card-body">
        <view class="feature-list">
          <view class="feature-item" v-for="(item, index) in features" :key="index">
            <uni-icons :type="item.icon" size="24" color="#28a745"></uni-icons>
            <text class="feature-text">{{ item.text }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="footer">
      <text>互成一家，让校园生活更精彩</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const coreModules = ref([
  { name: '社区动态', icon: 'chat' },
  { name: '计划打卡', icon: 'calendar' },
  { name: '专注模式', icon: 'paperplane' },
  { name: '社团招聘', icon: 'flag' },
  { name: '校园服务', icon: 'cart' },
  { name: '用户认证', icon: 'person' },
]);

const features = ref([
  { text: '一站式满足多元化需求', icon: 'star' },
  { text: '操作便捷，功能丰富', icon: 'gear' },
  { text: '营造互助共进的校园生态', icon: 'staff' },
  { text: '助力成长、友谊与机遇', icon: 'hand-up' },
]);
</script>

<style lang="scss" scoped>
.about-page {
  background-color: #f4f6f8;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.header-bg {
  background: linear-gradient(135deg, #a1c4fd, #c2e9fb);
  height: 400rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--status-bar-height) 30rpx 0;
  box-sizing: border-box;

  .header-content {
    display: flex;
    align-items: center;
    width: 100%;

    .logo {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      border: 4rpx solid rgba(255, 255, 255, 0.8);
      margin-right: 30rpx;
      flex-shrink: 0;
    }

    .text-wrapper {
      color: #fff;
      .title {
        font-size: 48rpx;
        font-weight: bold;
        text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
      }

      .slogan {
        font-size: 28rpx;
        opacity: 0.9;
        margin-top: 10rpx;
      }
    }
  }
}

.content-card {
  background-color: #ffffff;
  border-radius: 24rpx;
  margin: -80rpx 30rpx 30rpx;
  padding: 40rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.06);
  position: relative;

  .card-title {
    font-size: 34rpx;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 30rpx;
    padding-left: 20rpx;
    border-left: 8rpx solid #4facfe;
  }

  .card-body {
    .paragraph {
      font-size: 28rpx;
      color: #555;
      line-height: 1.8;
      word-wrap: break-word;
      word-break: break-all;
    }

    .module-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40rpx;
      text-align: center;

      .module-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10rpx 0;

        .module-name {
          margin-top: 15rpx;
          font-size: 26rpx;
          color: #34495e;
        }
      }
    }

    .feature-list {
      .feature-item {
        display: flex;
        align-items: center;
        margin-bottom: 25rpx;

        &:last-child {
          margin-bottom: 0;
        }

        .feature-text {
          margin-left: 20rpx;
          font-size: 28rpx;
          color: #555;
        }
      }
    }
  }
}

.footer {
  text-align: center;
  color: #aaa;
  font-size: 24rpx;
  margin-top: 40rpx;
}
</style>