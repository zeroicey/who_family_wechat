<template>
  <view class="feedback-type-selector">
    <text class="section-title">反馈类型</text>
    <view class="type-list">
      <view 
        v-for="(type, index) in types" 
        :key="index"
        class="type-item"
        :class="{ 'active': modelValue === type.value }"
        @tap="selectType(type.value)"
      >
        <image class="type-icon" :src="modelValue === type.value ? type.activeIcon : type.icon" mode="aspectFit"></image>
        <text class="type-label">{{ type.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  types: {
    type: Array,
    default: () => [
      { 
        label: '功能问题', 
        value: 'function',
        icon: '/static/images/feedback/function.png',
        activeIcon: '/static/images/feedback/function_active.png'
      },
      { 
        label: '体验建议', 
        value: 'experience',
        icon: '/static/images/feedback/experience.png',
        activeIcon: '/static/images/feedback/experience_active.png'
      },
      { 
        label: '内容优化', 
        value: 'content',
        icon: '/static/images/feedback/content.png',
        activeIcon: '/static/images/feedback/content_active.png'
      },
      { 
        label: '其他', 
        value: 'others',
        icon: '/static/images/feedback/others.png',
        activeIcon: '/static/images/feedback/others_active.png'
      }
    ]
  }
});

const emit = defineEmits(['update:modelValue']);

const selectType = (value) => {
  emit('update:modelValue', value);
};
</script>

<style lang="scss" scoped>
.feedback-type-selector {
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
  
  .type-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    
    .type-item {
      width: 48%;
      height: 16vw;
      background-color: #f8f8f8;
      border-radius: 3vw;
      margin-bottom: 4vw;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
      
      &.active {
        background-color: #e6fff0;
        border: 1px solid rgba(7, 193, 96, 0.3);
        transform: translateY(-1px);
        box-shadow: 0 4px 10px rgba(7, 193, 96, 0.15);
        
        .type-label {
          color: #07c160;
          font-weight: 500;
        }
      }
      
      .type-icon {
        width: 7vw;
        height: 7vw;
        margin-bottom: 1.5vw;
      }
      
      .type-label {
        font-size: 3.5vw;
        color: #666;
      }
    }
  }
}
</style>
