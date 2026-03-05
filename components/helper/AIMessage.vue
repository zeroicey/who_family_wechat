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
  max-width: 100%;
  overflow: hidden;
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
  max-width: 100%;
  overflow-x: hidden;

  .cursor {
    color: #007AFF;
    font-size: 24rpx;
    line-height: 1.6;
    margin-left: 4rpx;
    animation: pulse 1s infinite;
    font-weight: 300;
    flex-shrink: 0;
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
