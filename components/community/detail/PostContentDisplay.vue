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
  padding: 0;
  margin-bottom: 24rpx;
}

.post-title {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  line-height: 1.4;
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
}

.post-main-content {
  display: block;
  font-size: 30rpx;
  color: #555;
  line-height: 1.7;
  word-break: break-word;
}
</style>