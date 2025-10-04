<template>
  <view class="post-detail-container">
    <view class="scroll-view-content">
      <!-- 合并的帖子卡片 -->
      <view class="post-card" v-if="post">
        <!-- 帖子作者信息 -->
        <post-author-info :post="post" />
        
        <!-- 帖子内容 -->
        <post-content-display :post="post" />
        
        <!-- 帖子图片 -->
        <post-images-grid :image-list="post.imgList" />
        
        <!-- 帖子统计信息 -->
        <post-stats-bar :post="post" />
      </view>

      <!-- 评论区 -->
      <comment-section v-if="postId" :postId="postId" />
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad, onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
import PostAuthorInfo from "@/components/community/detail/PostAuthorInfo.vue";
import PostContentDisplay from "@/components/community/detail/PostContentDisplay.vue";
import PostImagesGrid from "@/components/community/detail/PostImagesGrid.vue";
import PostStatsBar from "@/components/community/detail/PostStatsBar.vue";
import CommentSection from "@/components/community/detail/CommentSection.vue";

import { useStore } from "vuex";

const store = useStore();

const post = ref(null);
const postId = ref(null);

onLoad(async (options) => {
  postId.value = options.id; // 从页面参数获取帖子ID
  if (postId.value) {
    // fetchPostDetail(postId.value);

    post.value = await store.dispatch(
      "community/fetch_post_by_id",
      postId.value
    );
  } else {
    uni.showToast({ title: "帖子ID无效", icon: "none" });
  }
});

onShareAppMessage(() => {
  return {
    title: `互成一家 | ${post.value?.title}` || '互成一家 | 社区',
    path: `/pages/community/detail?id=${postId.value}`,
    imageUrl: (post.value?.imgList && post.value.imgList.length > 0)
      ? post.value.imgList[0]
      : '/static/images/logo.png'
  }
})

onShareTimeline(() => ({
  title: `互成一家 | post.value?.title` || '互成一家小程序',
  imageUrl: (post.value?.imgList && post.value.imgList.length > 0)
    ? post.value.imgList[0]
    : '/static/images/logo.png'
}))
</script>

<style lang="scss" scoped>
.post-detail-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8f8f8;
}

.scroll-view-content {
  flex: 1;
  padding: 24rpx;
  padding-bottom: 120rpx;
  /* 为底部评论输入栏预留空间 (如果添加的话) */
}

/* 合并的帖子卡片样式 */
.post-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

/* 底部评论输入栏样式 (可选) */
.comment-input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.05);

  input {
    flex: 1;
    height: 70rpx;
    padding: 0 20rpx;
    border-radius: 35rpx;
    background-color: #f5f5f5;
    margin-right: 20rpx;
    font-size: 28rpx;
  }

  button {
    background: linear-gradient(135deg, #6e8efb, #a777e3);
    color: white;
    border-radius: 35rpx;
    font-size: 28rpx;
    padding: 0 30rpx;
    height: 70rpx;
    line-height: 70rpx;
  }
}
</style>
