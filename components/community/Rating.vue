<template>
  <view class="rating-container">
    <view class="empty-state">
      <text class="empty-title">评分频道开发中</text>
      <text class="empty-desc">当前先保留频道层级，后续适合承接体验评分、推荐与参考内容。</text>
    </view>
  </view>
</template>

<script setup>
</script>

<style scoped>
.rating-container {
  min-height: 100vh;
  padding: 0 24rpx 140rpx;
}

.empty-state {
  margin: 0 8rpx;
  padding: 72rpx 32rpx;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: 0 10rpx 30rpx rgba(24, 33, 49, 0.06);
  text-align: center;
}

.empty-title,
.empty-desc {
  display: block;
}

.empty-title {
  margin-bottom: 12rpx;
  font-size: 30rpx;
  font-weight: 700;
  color: #182131;
}

.empty-desc {
  font-size: 24rpx;
  line-height: 1.6;
  color: #7b8496;
}
</style>
