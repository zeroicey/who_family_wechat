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
        <!-- 如果没有内容且正在思考，显示思考动画 -->
        <view v-if="!content && isTyping" class="thinking-animation">
          <view class="thinking-text">正在思考</view>
          <view class="thinking-dots">
            <view class="dot"></view>
            <view class="dot"></view>
            <view class="dot"></view>
          </view>
        </view>
        <!-- 有内容时显示文字和光标 -->
        <view v-else class="message-content-wrapper">
          <!-- 将光标直接嵌入到文本中 -->
          <text class="message-text">{{ content }}<text v-if="isTyping && content" class="typing-cursor">|</text></text>
        </view>
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
      
      /* 思考动画 */
      .thinking-animation {
        display: flex;
        align-items: center;
        color: #999999;
        font-size: 24rpx;
        
        .thinking-text {
          margin-right: 12rpx;
        }
        
        .thinking-dots {
          display: flex;
          align-items: center;
          
          .dot {
            width: 6rpx;
            height: 6rpx;
            border-radius: 50%;
            background-color: #999999;
            margin: 0 2rpx;
            animation: thinking 1.4s infinite ease-in-out;
            
            &:nth-child(1) {
              animation-delay: 0s;
            }
            
            &:nth-child(2) {
              animation-delay: 0.2s;
            }
            
            &:nth-child(3) {
              animation-delay: 0.4s;
            }
          }
        }
      }
      
      /* 消息内容包装器 */
      .message-content-wrapper {
        display: flex;
        align-items: flex-end;
      }
      
      /* 打字光标 */
      .typing-cursor {
        color: #333333;
        font-size: 26rpx;
        line-height: 1.4;
        animation: blink 1s infinite;
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

/* 思考动画关键帧 */
@keyframes thinking {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-8rpx);
    opacity: 1;
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