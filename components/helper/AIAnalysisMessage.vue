<template>
  <view class="ai-analysis-message">
    <zero-markdown-view class="markdown-content" :markdown="content" :aiMode="true" :themeColor="'#007AFF'"
      :codeBgColor="'#2d2d2d'" />
    <text v-if="isTyping && content" class="cursor">▋</text>
  </view>
</template>

<script setup>
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
</script>

<style lang="scss" scoped>
.ai-analysis-message {
  width: 100%;
  box-sizing: border-box;
  line-height: 1.8;
  font-size: 28rpx;
  color: #333;
  position: relative;
}

.markdown-content {
  width: 100%;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow-wrap: break-word;

  // 标题样式
  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    margin: 20rpx 0 10rpx;
    font-weight: bold;
    line-height: 1.4;
  }

  :deep(h1) {
    font-size: 36rpx;
  }

  :deep(h2) {
    font-size: 32rpx;
  }

  :deep(h3) {
    font-size: 30rpx;
  }

  :deep(h4) {
    font-size: 28rpx;
  }

  // 段落样式
  :deep(p) {
    margin: 15rpx 0;
    line-height: 1.8;
    word-wrap: break-word;
  }

  // 列表样式
  :deep(ul),
  :deep(ol) {
    margin: 15rpx 0;
    padding-left: 40rpx;
  }

  :deep(li) {
    margin: 8rpx 0;
    line-height: 1.6;
  }

  // 代码块样式 - 强制换行
  :deep(pre) {
    background-color: #f5f5f5;
    border-radius: 8rpx;
    padding: 20rpx;
    margin: 15rpx 0;
    overflow-x: hidden;
    white-space: pre-wrap !important;
    word-wrap: break-word !important;
    word-break: break-word !important;
    max-width: 100% !important;
  }

  :deep(code) {
    background-color: #f5f5f5;
    padding: 4rpx 8rpx;
    border-radius: 4rpx;
    font-family: 'Courier New', monospace;
    font-size: 26rpx;
    word-wrap: break-word;
    word-break: break-word;
  }

  :deep(pre code) {
    background-color: transparent;
    padding: 0;
  }

  // 表格样式
  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 15rpx 0;
    display: table;
    table-layout: fixed;
  }

  :deep(th),
  :deep(td) {
    border: 1rpx solid #ddd;
    padding: 10rpx;
    text-align: left;
    word-wrap: break-word;
    word-break: break-word;
  }

  :deep(th) {
    background-color: #f5f5f5;
    font-weight: bold;
  }

  // 引用样式
  :deep(blockquote) {
    border-left: 4rpx solid #ddd;
    padding-left: 20rpx;
    margin: 15rpx 0;
    color: #666;
  }

  // 粗体和斜体
  :deep(strong) {
    font-weight: bold;
  }

  :deep(em) {
    font-style: italic;
  }

  // 链接样式
  :deep(a) {
    color: #007aff;
    text-decoration: underline;
    word-break: break-word;
  }

  // 分隔线
  :deep(hr) {
    border: none;
    border-top: 1rpx solid #eee;
    margin: 20rpx 0;
  }

  // 图片
  :deep(img) {
    max-width: 100%;
    height: auto;
  }
}

.cursor {
  display: inline-block;
  color: #007AFF;
  font-size: 28rpx;
  line-height: 1.8;
  margin-left: 4rpx;
  animation: pulse 1s infinite;
  font-weight: 300;
  vertical-align: text-bottom;
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
