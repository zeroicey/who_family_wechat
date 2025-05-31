<template>
  <view v-if="imageUrls.length > 0" class="post-images-grid-container" :class="gridClass">
    <view
      v-for="(url, index) in imageUrls"
      :key="index"
      class="image-item"
      @tap="previewImage(index)"
    >
      <image :src="url" mode="aspectFill" class="grid-image" />
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  imageIdListJson: {
    type: String,
    default: '[]'
  }
});

// 模拟图片URL基础路径，实际项目中应替换为真实图片服务器地址或完整URL
const IMAGE_BASE_URL = '/static/images/mock/'; // 假设的图片基础路径

const imageUrls = computed(() => {
  try {
    const ids = JSON.parse(props.imageIdListJson);
    if (Array.isArray(ids)) {
      // 限制最多4张图片
      return ids.slice(0, 4).map(id => `${IMAGE_BASE_URL}${id}.jpg`); // 假设图片名为 id.jpg
    }
    return [];
  } catch (e) {
    console.error('Error parsing imageIdListJson:', e);
    return [];
  }
});

const gridClass = computed(() => {
  const count = imageUrls.value.length;
  if (count === 1) return 'single-image';
  if (count === 2) return 'two-images';
  if (count === 3) return 'three-images';
  if (count === 4) return 'four-images';
  return '';
});

const previewImage = (currentIndex) => {
  uni.previewImage({
    urls: imageUrls.value,
    current: currentIndex
  });
};
</script>

<style lang="scss" scoped>
.post-images-grid-container {
  display: grid;
  gap: 8rpx;
  padding: 20rpx; // 内边距
  background-color: #ffffff;
  margin: 20rpx; // 外边距统一
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);

  .image-item {
    position: relative;
    overflow: hidden;
    border-radius: 12rpx;
    background-color: #f0f0f0; // 占位背景
    aspect-ratio: 1 / 1; // 默认1:1，可根据设计调整

    .grid-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &.single-image {
    grid-template-columns: 1fr;
    .image-item {
      aspect-ratio: 16 / 9; // 单图时可以更宽
    }
  }

  &.two-images {
    grid-template-columns: repeat(2, 1fr);
  }

  &.three-images {
    grid-template-columns: repeat(3, 1fr);
    // 对于三张图，可以考虑特殊布局，例如第一张大，后两张小
    // 这里简单处理为等分
  }

  &.four-images {
    grid-template-columns: repeat(2, 1fr);
    // 四张图，2x2布局
  }
}
</style>