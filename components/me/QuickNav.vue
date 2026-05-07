<template>
  <view class="quick-nav-shell">
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
        <view class="nav-item" @tap="navigateTo('/pages/helper/index')">
          <image src="/static/images/me/message.svg" mode="aspectFit" class="nav-icon"></image>
          <text class="nav-text">助手</text>
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
  </view>
</template>

<script setup>
const navigateTo = (url) => {
  uni.navigateTo({ url });
};
</script>

<style lang="scss" scoped>
.quick-nav-shell {
  padding: 16rpx 24rpx 0;
}

.quick-nav-card {
  padding: 24rpx 14rpx;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: var(--shadow-soft);
}

.quick-nav-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8rpx;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12rpx 8rpx;
}

.nav-icon {
  width: 54rpx;
  height: 54rpx;
  margin-bottom: 12rpx;
}

.nav-text {
  font-size: 22rpx;
  font-weight: 600;
  color: var(--text-primary);
}
</style>
