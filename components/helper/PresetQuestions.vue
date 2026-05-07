<template>
  <view class="preset-questions" v-if="showQuestions">
    <view class="questions-header">
      <text class="header-text">常见问题</text>
      <text class="header-subtitle">先从高频场景开始，减少第一次输入成本</text>
    </view>

    <view class="questions-grid">
      <view
        v-for="question in questions"
        :key="question.id"
        class="question-card"
        @tap="onQuestionClick(question)"
      >
        <text class="question-title">{{ question.title }}</text>
        <text class="question-preview">{{ getPreviewText(question.content) }}</text>
        <view class="click-hint">
          <uni-icons type="right" size="12" color="#6D4AFF"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  questions: {
    type: Array,
    default: () => []
  },
  showQuestions: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(["questionClick"]);

const onQuestionClick = (question) => {
  emit("questionClick", question);
};

const getPreviewText = (content) => {
  return content.length > 30 ? content.substring(0, 30) + "..." : content;
};
</script>

<style lang="scss" scoped>
.preset-questions {
  margin: 20rpx 24rpx;
}

.questions-header {
  margin-bottom: 18rpx;
}

.header-text,
.header-subtitle,
.question-title,
.question-preview {
  display: block;
}

.header-text {
  margin-bottom: 8rpx;
  font-size: 28rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.header-subtitle {
  font-size: 22rpx;
  color: var(--text-tertiary);
}

.questions-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14rpx;
}

.question-card {
  position: relative;
  padding: 22rpx 20rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, rgba(109, 74, 255, 0.08), rgba(255, 255, 255, 0.98));
  border: 1rpx solid rgba(109, 74, 255, 0.08);
}

.question-title {
  margin-bottom: 10rpx;
  font-size: 26rpx;
  line-height: 1.4;
  font-weight: 700;
  color: var(--text-primary);
}

.question-preview {
  padding-right: 30rpx;
  font-size: 22rpx;
  line-height: 1.5;
  color: var(--text-secondary);
}

.click-hint {
  position: absolute;
  right: 18rpx;
  bottom: 18rpx;
  width: 32rpx;
  height: 32rpx;
  border-radius: 999rpx;
  background: rgba(109, 74, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
