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

  // 确保内容是字符串类型，避免编码问题
  let content = String(props.content)

  // 处理未闭合的代码块（仅在流式输出时需要）
  if (props.isTyping) {
    const codeBlocks = content.match(/```[\s\S]*?```|```[\s\S]*?$/g) || []
    const lastBlock = codeBlocks[codeBlocks.length - 1]
    if (lastBlock && !lastBlock.endsWith('```')) {
      // 为未闭合的代码块添加换行，帮助 markdown 渲染器正确处理
      content = content + '\n'
    }
  }

  return content
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
  word-break: break-word; // 确保长文本正确换行
  line-height: 1.6; // 统一行高

  // 确保markdown渲染器正确显示
  .markdown-renderer {
    width: 100%;
    overflow-wrap: break-word;
  }

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
