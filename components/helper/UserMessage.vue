<template>
  <view class="user-message-container">
    <view class="message-bubble">
      <text class="message-text">{{ content }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'UserMessage',
  props: {
    content: {
      type: String,
      required: true,
      default: ''
    }
  }
}
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
    
    /* 消息气泡尾巴 */
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: -8rpx;
      width: 0;
      height: 0;
      border-left: 16rpx solid #4A8BFF;
      border-bottom: 16rpx solid transparent;
    }
  }
}
</style>