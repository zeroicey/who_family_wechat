<template>
  <view class="post-content-card">
    <text class="post-title">{{ post.title }}</text>
    <text class="post-main-content">{{ post.content }}</text>
  </view>
</template>

<script setup>
const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});
</script>

<style lang="scss" scoped>
.post-content-card {
  padding: 24rpx; // 调整内边距
  background-color: #ffffff;
  margin: 0 20rpx; // 左右边距与作者信息一致，上下无外边距
  border-radius: 0 0 16rpx 16rpx; // 只有下方圆角
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
  // 移除 margin-top: -16rpx; 和 padding-top: 30rpx;
}

.post-title {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  line-height: 1.4;
}

.post-main-content {
  display: block;
  font-size: 30rpx;
  color: #555;
  line-height: 1.7;
  word-break: break-word;
}
</style>