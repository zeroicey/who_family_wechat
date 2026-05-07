<template>
  <view class="ai-message-wrapper">
    <view class="ai-header">
      <image class="ai-avatar" src="/static/images/ai.jpg" mode="aspectFill" />
      <view class="ai-meta">
        <text class="ai-name">答答 Novus</text>
        <text class="ai-role">智能校园助手</text>
      </view>
    </view>
    <view class="ai-content">
      <zero-markdown-view class="markdown-renderer" :markdown="processedContent" :aiMode="true" :themeColor="'#6D4AFF'"
        :codeBgColor="'#2d2d2d'" />
      <text v-if="isTyping && content" class="cursor">▋</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  content: {
    type: String,
    default: ""
  },
  isTyping: {
    type: Boolean,
    default: false
  }
});

const processedContent = computed(() => {
  if (!props.content) return "";

  let content = String(props.content);
  if (props.isTyping) {
    const codeBlocks = content.match(/```[\s\S]*?```|```[\s\S]*?$/g) || [];
    const lastBlock = codeBlocks[codeBlocks.length - 1];
    if (lastBlock && !lastBlock.endsWith("```")) {
      content = content + "\n";
    }
  }
  return content;
});
</script>

<style lang="scss" scoped>
.ai-message-wrapper {
  margin: 20rpx 24rpx;
  max-width: 100%;
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 14rpx;
  margin-bottom: 10rpx;
}

.ai-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 18rpx;
  flex-shrink: 0;
}

.ai-meta {
  display: flex;
  flex-direction: column;
}

.ai-name,
.ai-role {
  display: block;
}

.ai-name {
  font-size: 24rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.ai-role {
  font-size: 20rpx;
  color: var(--text-tertiary);
}

.ai-content {
  max-width: 100%;
  padding: 24rpx;
  border-radius: 24rpx 24rpx 24rpx 10rpx;
  background: #ffffff;
  box-shadow: var(--shadow-soft);
  overflow-x: hidden;
  word-break: break-word;
}

.markdown-renderer {
  width: 100%;
  overflow-wrap: break-word;
}

.cursor {
  color: var(--brand-primary);
  font-size: 24rpx;
  line-height: 1.6;
  margin-left: 4rpx;
  animation: pulse 1s infinite;
  font-weight: 300;
  flex-shrink: 0;
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
