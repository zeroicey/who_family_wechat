<template>
  <view class="comment-item-card">
    <view class="comment-author-avatar">
      <image v-if="comment.avatarId === 1 && avatarUrl" :src="avatarUrl" class="avatar-image" />
      <text v-else class="avatar-text">{{ comment.username.charAt(0) }}</text>
    </view>
    <view class="comment-content-wrapper">
      <view class="comment-header">
        <text class="comment-author-name">{{ comment.username }}</text>
        <text class="comment-time">{{ formattedTime }}</text>
      </view>
      <text class="comment-text">{{ comment.content }}</text>
      <!-- 已移除 reply-info 部分 -->
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { formatRelativeTime } from '@/utils/timeFormat.js';
import { getRandomAvatarUrl } from '@/utils/randomData.js';

const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
});

const formattedTime = computed(() => {
  return formatRelativeTime(props.comment.createTime);
});

const avatarUrl = computed(() => {
  if (props.comment.avatarId === 1) {
    const seed = props.comment.username || 'defaultUser';
    return getRandomAvatarUrl(seed);
  }
  return null;
});

// viewReplies 函数已不再需要，可以移除
// const viewReplies = () => {
//   uni.showToast({ title: '查看回复功能待实现', icon: 'none' });
// };
</script>

<style lang="scss" scoped>
.comment-item-card {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

.comment-author-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #88d3ce, #6e8efb);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20rpx;
  flex-shrink: 0;
  overflow: hidden;

  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-text {
    color: white;
    font-size: 30rpx;
    font-weight: bold;
  }
}

.comment-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;

  .comment-author-name {
    font-size: 28rpx;
    font-weight: 500;
    color: #555;
  }

  .comment-time {
    font-size: 22rpx;
    color: #aaa;
  }
}

.comment-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  margin-bottom: 12rpx; /* 确保与之前样式一致，如果不需要底部额外间距可以移除或调整 */
  word-break: break-word;
}

/* .reply-info 样式块可以整个移除 */
</style>