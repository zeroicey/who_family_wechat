<template>
  <view class="quick-nav-card">
    <view class="quick-nav-grid">
      <view class="nav-item" @tap="navigateTo('/pages/me/order/index')">
        <image src="/static/images/me/order.svg" mode="aspectFit" class="nav-icon"></image>
        <text class="nav-text">订单</text>
      </view>
      <view class="nav-item" @tap="navigateTo('/pages/me/address/index')">
        <image src="/static/images/me/address.svg" mode="aspectFit" class="nav-icon"></image>
        <text class="nav-text">地址</text>
      </view>
      <view class="nav-item">
        <image src="/static/images/me/message.svg" mode="aspectFit" class="nav-icon"></image>
        <text class="nav-text">消息</text>
      </view>
      <view class="nav-item" @tap="navigateTo('/pages/me/about')">
        <image src="/static/images/me/about.svg" mode="aspectFit" class="nav-icon"></image>
        <text class="nav-text">关于</text>
      </view>
      <view class="nav-item" @tap="navigateTo('/pages/me/feedback')">
        <image src="/static/images/me/feedback.svg" mode="aspectFit" class="nav-icon"></image>
        <text class="nav-text">反馈</text>
      </view>
    </view>
  </view>
</template>

<script setup>
// 导航到对应页面
const navigateTo = (url) => {
  uni.navigateTo({ url });
};
</script>

<style lang="scss" scoped>
.quick-nav-card {
  background-color: #ffffff;
  margin: 0 3vw;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
  border-top: 1px dashed rgba(91, 15, 3, 0.1);
  overflow: hidden;
  padding: 4vw 0;

  .quick-nav-grid {
    display: flex;
    justify-content: space-around;

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 20%;

      .nav-icon {
        width: 8vw;
        height: 8vw;
        margin-bottom: 1.5vw;
      }

      .nav-text {
        font-size: 3.2vw;
        font-weight: bold;
        color: #333;
      }
    }
  }
}
</style>
