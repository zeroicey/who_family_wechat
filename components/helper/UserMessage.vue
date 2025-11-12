<template>
  <view class="user-message-container">
    <view class="message-bubble">
      <text class="message-text">{{ content }}</text>
    </view>
  </view>
</template>

<script setup>
// 定义props
defineProps({
  content: {
    type: String,
    required: true,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
.user-message-container {
  display: flex;
  justify-content: flex-end;
  margin: 20rpx 30rpx;

  .message-bubble {
    max-width: 70%;
    background: #4A8BFF;
    border-radius: 20rpx 20rpx 8rpx 20rpx;
    padding: 20rpx 24rpx;
    position: relative;

    .message-text {
      color: #ffffff;
      font-size: 26rpx;
      line-height: 1.4;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
}
</style>