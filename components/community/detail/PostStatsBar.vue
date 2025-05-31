<template>
  <view class="post-stats-bar">
    <view class="stat-item">
      <!-- 使用 uni-icons 或图片 -->
      <uni-icons type="eye" size="18" color="#999"></uni-icons>
      <text class="stat-text">{{ post.viewCount || 0 }}</text>
    </view>
    <view class="stat-item" @tap="handleLike">
      <uni-icons :type="isLiked ? 'heart-filled' : 'heart'" size="18" :color="isLiked ? '#ff6b81' : '#999'"></uni-icons>
      <text class="stat-text">{{ likeCountDisplay }}</text>
    </view>
    <view class="stat-item">
      <uni-icons type="chatbubble" size="18" color="#999"></uni-icons>
      <text class="stat-text">{{ post.commentCount || 0 }}</text>
    </view>
    <!-- 分享按钮已移除 -->
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

const isLiked = ref(false); // 实际应从用户状态或API获取
const localLikeCount = ref(props.post.likeCount || 0);

const likeCountDisplay = computed(() => localLikeCount.value);

const handleLike = () => {
  // 实际应调用API更新点赞状态
  if (isLiked.value) {
    localLikeCount.value--;
  } else {
    localLikeCount.value++;
  }
  isLiked.value = !isLiked.value;
  // uni.showToast({ title: isLiked.value ? '已点赞' : '取消点赞', icon: 'none' });
};

</script>

<style lang="scss" scoped>
.post-stats-bar {
  display: flex;
  justify-content: space-around; /* 改为 space-around 使剩余项目均匀分布 */
  align-items: center;
  padding: 20rpx;
  background-color: #ffffff;
  margin: 20rpx; // 调整外边距
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}

.stat-item {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 26rpx;

  .uni-icons {
    margin-right: 8rpx;
  }
  .stat-text {
    color: #666;
  }
}
</style>