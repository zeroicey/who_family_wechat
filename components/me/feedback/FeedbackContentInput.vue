<template>
  <view class="feedback-content-input">
    <text class="section-title">反馈内容</text>
    <view class="textarea-container">
      <textarea class="content-textarea" :value="modelValue" @input="updateContent" placeholder="请详细描述您遇到的问题或建议..."
        :maxlength="maxLength" auto-height></textarea>
      <view class="word-counter" :class="{ 'near-limit': isNearLimit }">
        <text class="counter-text">{{ modelValue.length }}/{{ maxLength }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  maxLength: {
    type: Number,
    default: 500
  }
});

const emit = defineEmits(['update:modelValue']);

const updateContent = (e) => {
  emit('update:modelValue', e.detail.value);
};

// 检查是否接近字数限制
const isNearLimit = computed(() => {
  return props.modelValue.length > props.maxLength * 0.8;
});
</script>

<style lang="scss" scoped>
.feedback-content-input {
  margin-bottom: 5vw;

  .section-title {
    font-size: 4vw;
    color: #333;
    font-weight: 600;
    margin-bottom: 3vw;
    position: relative;
    padding-left: 3vw;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 1vw;
      height: 4vw;
      background-color: #07c160;
      border-radius: 0.5vw;
    }
  }

  .textarea-container {
    position: relative;
    background-color: #f8f8f8;
    border-radius: 3vw;
    padding: 4vw;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);

    .content-textarea {
      width: 100%;
      min-height: 30vw;
      font-size: 3.7vw;
      color: #333;
      line-height: 1.6;
      background-color: transparent;
      padding-bottom: 8vw;
    }

    .word-counter {
      position: absolute;
      right: 4vw;
      bottom: 4vw;

      .counter-text {
        font-size: 3.2vw;
        color: #999;
      }

      &.near-limit {
        .counter-text {
          color: #ff6b00;
        }
      }
    }
  }
}
</style>
