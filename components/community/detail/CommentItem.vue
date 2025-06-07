<template>
  <view class="comment-item-card">
    <view class="comment-author-avatar">
      <image :src="avatarUrl" class="avatar-image" />
    </view>
    <view class="comment-content-wrapper">
      <view class="comment-header">
        <text class="comment-author-name">{{ comment.username }}</text>
        <text class="comment-time">{{ formattedTime }}</text>
      </view>
      <text class="comment-text">{{ comment.content }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { formatRelativeTime } from '@/utils/timeFormat.js';
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
});

const formattedTime = computed(() => {
  return formatRelativeTime(props.comment.createTime);
});

const avatarUrl = ref("")

const fetchAvatar = async () => {
  if (props.comment.avatarId && props.comment.username) {
    try {
      const url = await store.dispatch("community/fetch_post_user_avatar", {
        avatarId: props.comment.avatarId, // Corrected typo here
        name: props.comment.username,
      });
      avatarUrl.value = url; // 更新 ref
    } catch (error) {
      console.error("Failed to fetch avatar:", error);
    }
  }
};

onMounted(async () => {
  await fetchAvatar()
})
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
  margin-bottom: 12rpx;
  /* 确保与之前样式一致，如果不需要底部额外间距可以移除或调整 */
  word-break: break-word;
}

/* .reply-info 样式块可以整个移除 */
</style>