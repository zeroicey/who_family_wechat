<template>
  <view class="quick-nav-card">
    <view class="quick-nav-grid">
      <view class="nav-item" @tap="navigateTo('/pages/me/order/index')">
        <view class="icon-wrapper" style="background-color: #ff913c;">
          <image src="/static/images/me/order.png" mode="aspectFit" class="icon-image"></image>
        </view>
        <text class="nav-text">订单</text>
      </view>
      <view class="nav-item" @tap="navigateTo('/pages/me/address/index')">
        <view class="icon-wrapper" style="background-color: #06c15f;">
          <image src="/static/images/me/address.png" mode="aspectFit" class="icon-image"></image>
        </view>
        <text class="nav-text">地址</text>
      </view>
      <view class="nav-item" @tap="navigateTo('/pages/me/about')">
        <view class="icon-wrapper" style="background-color: #3c9dff;">
          <image src="/static/images/me/about.png" mode="aspectFit" class="icon-image"></image>
        </view>
        <text class="nav-text">关于</text>
      </view>
      <view class="nav-item" @tap="navigateTo('/pages/me/feedback')">
        <view class="icon-wrapper" style="background-color: #8a56e8;">
          <image src="/static/images/me/feedback.png" mode="aspectFit" class="icon-image"></image>
        </view>
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
      width: 25%;

      .icon-wrapper {
        width: 12vw;
        height: 12vw;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 2vw;

        .icon-image {
          width: 6vw;
          height: 6vw;
        }
      }

      .nav-text {
        font-size: 3.2vw;
        color: #333;
      }
    }
  }
}
</style>
