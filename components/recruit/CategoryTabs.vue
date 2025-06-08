<template>
  <view class="category-tabs">
    <scroll-view scroll-x="true" class="tabs-scroll">
      <view class="tabs-container">
        <view v-for="(type, index) in recruitClasses" :key="index" class="tab-item"
          :class="{ active: selectedTypeIndex === index }" @click="selectType(index)">
          {{ type.name }}
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// Props
const props = defineProps({
  selectedTypeIndex: {
    type: Number,
    default: 0
  }
});

// Emits
const emit = defineEmits(['select-type']);

// 计算属性
const recruitClasses = computed(() => store.getters['recruit/get_recruit_classes']);

// 方法
const selectType = (index) => {
  emit('select-type', index);
};
</script>

<style scoped>
/* 分类栏样式 */
.category-tabs {
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.tabs-scroll {
  white-space: nowrap;
}

.tabs-container {
  display: flex;
  padding: 0 20rpx;
}

.tab-item {
  flex-shrink: 0;
  padding: 24rpx 32rpx;
  font-size: 28rpx;
  color: #666;
  position: relative;
  transition: all 0.3s ease;
  border-radius: 8rpx;
  margin: 8rpx 4rpx;
}

.tab-item:hover {
  color: #4a90e2;
  background-color: rgba(74, 144, 226, 0.05);
}

.tab-item.active {
  color: #4a90e2;
  font-weight: 600;
  background-color: rgba(74, 144, 226, 0.08);
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background-color: #4a90e2;
  border-radius: 2rpx;
}
</style>