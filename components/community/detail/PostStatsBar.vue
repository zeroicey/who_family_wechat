<template>
  <view class="post-stats-bar">
    <!-- 查看数 -->
    <image class="stats-icon" src="/static/images/community/view.png" />
    <text class="stats-text">{{ post.viewCount || 0 }}</text>

    <!-- 点赞数 -->
    <image class="stats-icon" src="/static/images/community/like.png" />
    <text class="stats-text">{{ post.likeCount || 0 }}</text>

    <!-- 评论数 -->
    <image class="stats-icon" src="/static/images/community/comment.png" />
    <text class="stats-text">{{ post.commentCount || 0 }}</text>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
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
/* 帖子统计栏样式 */
.post-stats-bar {
  display: flex;
  justify-content: space-around; /* 使项目均匀分布 */
  align-items: center;
  padding: 20rpx;
  background-color: #ffffff;
  margin: 20rpx; // 外边距
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}

.stats-icon {
  width: 16px; /* 图标大小 */
  height: 16px; /* 图标大小 */
  margin-right: 4px; /* 图标和其右侧数字的间距 */
}

.stats-text {
  font-size: 16px;
  color: #888;
  margin-right: 10px; /* 数字和其右侧下一个图标的间距 */
}

/* 确保最后一个 stats-text 没有右边距，避免不必要的空白 */
.post-stats-bar .stats-text:last-of-type {
  margin-right: 0;
}
</style>
