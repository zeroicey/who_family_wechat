<template>
  <view class="preset-questions" v-if="showQuestions">
    <view class="questions-header">
      <text class="header-text">💡 常见问题</text>
      <text class="header-subtitle">点击下方问题快速咨询</text>
    </view>
    
    <view class="questions-grid">
      <view 
        v-for="question in questions" 
        :key="question.id"
        class="question-card"
        @tap="onQuestionClick(question)"
      >
        <view class="question-title">{{ question.title }}</view>
        <view class="question-preview">{{ getPreviewText(question.content) }}</view>
        <view class="click-hint">
          <uni-icons type="right" size="12" color="#999"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// 定义props
const props = defineProps({
  questions: {
    type: Array,
    default: () => []
  },
  showQuestions: {
    type: Boolean,
    default: true
  }
})

// 定义事件
const emit = defineEmits(['questionClick'])

// 方法
const onQuestionClick = (question) => {
  emit('questionClick', question)
}

const getPreviewText = (content) => {
  return content.length > 30 ? content.substring(0, 30) + '...' : content
}
</script>

<style lang="scss" scoped>
.preset-questions {
  margin: 20rpx 0;
  padding: 0 20rpx;
  
  .questions-header {
    margin-bottom: 24rpx;
    text-align: center;
    
    .header-text {
      display: block;
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 8rpx;
    }
    
    .header-subtitle {
      display: block;
      font-size: 24rpx;
      color: #666;
    }
  }
  
  .questions-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16rpx;
    
    .question-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16rpx;
      padding: 24rpx 20rpx;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.15);
      
      &:active {
        transform: scale(0.98);
        box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.2);
      }
      
      &:nth-child(odd) {
        background: linear-gradient(135deg, #e8d5ff 0%, #d4b8ff 100%);
      }

      &:nth-child(even) {
        background: linear-gradient(135deg, #ffd6e8 0%, #ffc2e2 100%);
      }

      &:nth-child(3n) {
        background: linear-gradient(135deg, #d4ecff 0%, #b8ddff 100%);
      }

      &:nth-child(4n) {
        background: linear-gradient(135deg, #d4ffe8 0%, #b8ffd4 100%);
      }

      &:nth-child(5n) {
        background: linear-gradient(135deg, #ffe8d4 0%, #ffd4b8 100%);
      }

      &:nth-child(6n) {
        background: linear-gradient(135deg, #fff5d4 0%, #ffeab8 100%);
      }
      
      .question-title {
        font-size: 26rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 12rpx;
        line-height: 1.3;
      }

      .question-preview {
        font-size: 22rpx;
        color: #666;
        line-height: 1.4;
        margin-bottom: 16rpx;
      }
      
      .click-hint {
        position: absolute;
        bottom: 16rpx;
        right: 16rpx;
        width: 32rpx;
        height: 32rpx;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10rpx);
      }
      
      // 添加装饰性元素
      &::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
      }
    }
  }
}

// 响应式设计
@media (max-width: 750rpx) {
  .preset-questions {
    .questions-grid {
      grid-template-columns: 1fr;
      gap: 12rpx;
      
      .question-card {
        padding: 20rpx 16rpx;
        
        .question-title {
          font-size: 24rpx;
        }
        
        .question-preview {
          font-size: 20rpx;
        }
      }
    }
  }
}
</style>