<template>
  <view class="post-stats-bar">
    <!-- 查看数 -->
    <view class="stats-group">
      <image class="stats-icon" src="/static/images/community/view.png" />
      <text class="stats-text">{{ post.viewCount || 0 }}</text>
    </view>

    <!-- 点赞数 -->
    <view class="stats-group" @click="handleLikeClick">
      <image class="stats-icon"
        :src="post.isLike === 1 ? '/static/images/community/liked.png' : '/static/images/community/like.png'" />
      <text class="stats-text">{{ post.likeCount || 0 }}</text>
    </view>

    <!-- 评论数 -->
    <view class="stats-group">
      <image class="stats-icon" src="/static/images/community/comment.png" />
      <text class="stats-text">{{ post.commentCount || 0 }}</text>
    </view>
  </view>
</template>

<script setup>

import { useStore } from "vuex";
const store = useStore();

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const handleLikeClick = () => {
  // 处理点赞逻辑
  if (props.post.isLike === 1) {
    // 已经点赞，取消点赞
    store.dispatch("community/unlike_post", props.post.id);
    props.post.isLike = 0; // 更新本地状态
    props.post.likeCount--; // 更新本地状态
    return;
  }
  // 未点赞，执行点赞操作
  store.dispatch("community/like_post", props.post.id);
  props.post.isLike = 1; // 更新本地状态
  props.post.likeCount++; // 更新本地状态
}
</script>

<style lang="scss" scoped>
/* 帖子统计栏样式 */
.post-stats-bar {
  display: flex;
  justify-content: space-around;
  /* 使项目均匀分布 */
  align-items: center;
  padding: 20rpx;
  background-color: #ffffff;
  margin: 20rpx; // 外边距
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}

.stats-group {
  display: flex;
  align-items: center;
}

.stats-icon {
  width: 16px;
  /* 图标大小 */
  height: 16px;
  /* 图标大小 */
  margin-right: 10px;
  /* 图标和其右侧数字的间距 */
}

.stats-text {
  font-size: 16px;
  color: #888;
}

/* 确保最后一个 stats-text 没有右边距，避免不必要的空白 */
.post-stats-bar .stats-text:last-of-type {
  margin-right: 0;
}
</style>
