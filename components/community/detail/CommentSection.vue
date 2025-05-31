<template>
  <view class="comment-section-container">
    <view class="section-title">热门评论</view> <!-- 或者 '全部评论' -->
    <view v-if="comments && comments.length > 0" class="comment-list">
      <comment-item
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
      />
    </view>
    <view v-else class="empty-comments">
      <text>暂无评论，快来抢沙发吧！</text>
    </view>
  </view>
</template>

<script setup>
import CommentItem from './CommentItem.vue';

const props = defineProps({
  comments: {
    type: Array,
    default: () => []
  }
});
</script>

<style lang="scss" scoped>
.comment-section-container {
  padding: 24rpx;
  background-color: #ffffff;
  margin: 20rpx; // 外边距统一
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 24rpx;
  padding-bottom: 16rpx;
  border-bottom: 1px solid #f0f0f0;
}

.comment-list {
  // list-style: none;
  // padding: 0;
  // margin: 0;
}

.empty-comments {
  text-align: center;
  padding: 40rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>