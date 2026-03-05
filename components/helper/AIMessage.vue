<template>
  <view class="ai-message-wrapper">
    <view class="ai-header">
      <image class="ai-avatar" src="/static/images/ai.jpg" mode="aspectFill" />
      <text class="ai-name">答答Novus智能校园助手</text>
    </view>
    <view class="ai-content">
      <zero-markdown-view class="markdown-renderer" :markdown="processedContent" :aiMode="true" :themeColor="'#007AFF'"
        :codeBgColor="'#2d2d2d'" />
      <text v-if="isTyping && content" class="cursor">▋</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  isTyping: {
    type: Boolean,
    default: false
  }
})

const processedContent = computed(() => {
  if (!props.content) return ''
  const codeBlocks = props.content.match(/```[\s\S]*?```|```[\s\S]*?$/g) || []
  const lastBlock = codeBlocks[codeBlocks.length - 1]
  if (lastBlock && !lastBlock.endsWith('```')) {
    return props.content + '\n'
  }
  return props.content
})
</script>

<style lang="scss" scoped>
.ai-message-wrapper {
  margin: 20rpx 30rpx;
}

.ai-header {
  display: flex;
  align-items: center;

  .ai-avatar {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    margin-right: 12rpx;
    flex-shrink: 0;
  }

  .ai-name {
    font-size: 22rpx;
    color: #666;
    font-weight: 500;
  }
}

.ai-content {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;

  .markdown-renderer {
    flex: 1;
    font-size: 24rpx;
    line-height: 1.6;
    color: #333;

    :deep(.zero-markdown-view) {
      font-size: 24rpx !important;
      line-height: 1.6 !important;
    }

    :deep(h1) {
      font-size: 28rpx !important;
      margin: 16rpx 0 8rpx !important;
      font-weight: 600 !important;
    }

    :deep(h2) {
      font-size: 26rpx !important;
      margin: 16rpx 0 8rpx !important;
      font-weight: 600 !important;
    }

    :deep(h3) {
      font-size: 24rpx !important;
      margin: 16rpx 0 8rpx !important;
      font-weight: 600 !important;
    }

    :deep(ul),
    :deep(ol) {
      margin: 8rpx 0 !important;
      padding-left: 32rpx !important;
    }

    :deep(li) {
      margin: 4rpx 0 !important;
      font-size: 24rpx !important;
    }

    :deep(pre) {
      margin: 12rpx 0 !important;
      border-radius: 8rpx !important;
    }

    :deep(code) {
      font-size: 22rpx !important;
    }

    :deep(p code),
    :deep(li code) {
      background: rgba(0, 0, 0, 0.06) !important;
      padding: 2rpx 6rpx !important;
      border-radius: 4rpx !important;
      font-size: 22rpx !important;
    }

    :deep(blockquote) {
      margin: 12rpx 0 !important;
      padding-left: 16rpx !important;
      border-left: 4rpx solid #007AFF !important;
      color: #666 !important;
    }

    :deep(table) {
      font-size: 22rpx !important;
      margin: 12rpx 0 !important;
    }

    :deep(p) {
      margin: 8rpx 0 !important;
      font-size: 24rpx !important;
    }

    :deep(img) {
      max-width: 100% !important;
      border-radius: 8rpx !important;
    }

    :deep(a) {
      color: #007AFF !important;
      text-decoration: none !important;
    }

    :deep(strong) {
      font-weight: 600 !important;
      color: #000 !important;
    }

    :deep(em) {
      font-style: italic !important;
    }
  }

  .cursor {
    color: #007AFF;
    font-size: 24rpx;
    line-height: 1.6;
    margin-left: 4rpx;
    animation: pulse 1s infinite;
    font-weight: 300;
  }
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.3;
  }
}
</style>
