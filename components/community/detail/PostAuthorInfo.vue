<template>
  <view class="post-author-info-card">
    <view class="author-avatar">
      <image v-if="post.avatarId === 1 && avatarUrl" :src="avatarUrl" class="avatar-image" />
      <text v-else class="avatar-text">{{ post.username.charAt(0) }}</text>
    </view>
    <view class="author-details">
      <text class="username">{{ post.username }}</text>
      <text class="post-time">{{ formattedTime }}</text>
    </view>
    <!-- 可以添加关注按钮等 -->
    <!-- <button class="follow-btn" size="mini">关注</button> -->
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { formatRelativeTime } from '@/utils/timeFormat.js';
import { getRandomAvatarUrl } from '@/utils/randomData.js'; // 假设您有此工具函数

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

const formattedTime = computed(() => {
  return formatRelativeTime(props.post.createTime);
});

const avatarUrl = computed(() => {
  if (props.post.avatarId === 1) {
    const seed = props.post.username || 'defaultUser';
    return getRandomAvatarUrl(seed);
  }
  return null;
});
</script>

<style lang="scss" scoped>
.post-author-info-card {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background-color: #ffffff;
  margin: 20rpx 20rpx 0 20rpx; /* 调整外边距，底部为0，与内容卡片连接 */
  border-radius: 16rpx 16rpx 0 0; /* 只有上方圆角 */
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}

.author-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20rpx;
  overflow: hidden;

  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-text {
    color: white;
    font-size: 36rpx;
    font-weight: bold;
  }
}

.author-details {
  flex: 1;
  display: flex;
  flex-direction: column;

  .username {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 4rpx;
  }

  .post-time {
    font-size: 24rpx;
    color: #999;
  }
}

.follow-btn {
  background-color: #f0f0f0;
  color: #666;
  border-radius: 30rpx;
  padding: 0 24rpx;
  font-size: 24rpx;
  height: 50rpx;
  line-height: 50rpx;
  margin-left: auto; // 按钮靠右
  border: 1px solid #e0e0e0;
}
</style>