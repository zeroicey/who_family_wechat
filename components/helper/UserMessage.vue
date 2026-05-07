<template>
  <view class="user-message-container">
    <view class="message-bubble">
      <text class="message-text">{{ content }}</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  content: {
    type: String,
    required: true,
    default: ""
  }
});
</script>

<style lang="scss" scoped>
.user-message-container {
  display: flex;
  justify-content: flex-end;
  margin: 20rpx 24rpx;
}

.message-bubble {
  max-width: 72%;
  padding: 20rpx 24rpx;
  border-radius: 24rpx 24rpx 10rpx 24rpx;
  background: linear-gradient(135deg, #6d4aff, #8d6bff);
  box-shadow: 0 14rpx 30rpx rgba(109, 74, 255, 0.18);
}

.message-text {
  color: #ffffff;
  font-size: 26rpx;
  line-height: 1.55;
  word-wrap: break-word;
  word-break: break-all;
}
</style>
