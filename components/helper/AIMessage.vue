<template>
  <view class="ai-message-container">
    <view class="avatar-container">
      <view class="ai-avatar">
        <text class="avatar-text">助</text>
      </view>
    </view>
    <view class="message-content">
      <view class="ai-name">校助手</view>
      <view class="message-bubble">
        <text class="message-text">{{ content }}</text>
        <!-- 打字时显示光标 -->
        <view v-if="isTyping" class="typing-cursor">|</view>
      </view>
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
  },
  isTyping: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.ai-message-container {
  display: flex;
  align-items: flex-start;
  margin: 20rpx 30rpx;
  
  .avatar-container {
    margin-right: 20rpx;
    
    .ai-avatar {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      
      .avatar-text {
        color: #ffffff;
        font-size: 24rpx;
        font-weight: bold;
      }
    }
  }
  
  .message-content {
    flex: 1;
    max-width: calc(100% - 100rpx);
    
    .ai-name {
      font-size: 22rpx;
      color: #666;
      margin-bottom: 8rpx;
      margin-left: 4rpx;
    }
    
    .message-bubble {
      background: #F0F2F5;
      border-radius: 8rpx 20rpx 20rpx 20rpx;
      padding: 20rpx 24rpx;
      position: relative;
      
      .message-text {
        color: #333333;
        font-size: 26rpx;
        line-height: 1.4;
        word-wrap: break-word;
        word-break: break-all;
      }
      
      /* 打字光标 */
      .typing-cursor {
        display: inline-block;
        color: #333333;
        font-size: 26rpx;
        line-height: 1.4;
        animation: blink 1s infinite;
        margin-left: 2rpx;
      }
      
      /* 消息气泡尾巴 */
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -8rpx;
        width: 0;
        height: 0;
        border-right: 16rpx solid #F0F2F5;
        border-top: 16rpx solid transparent;
      }
    }
  }
}

/* 光标闪烁动画 */
@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}
</style>