<template>
  <view class="post-detail-container">
    <scroll-view scroll-y class="scroll-view-content">
      <!-- 帖子作者信息 -->
      <post-author-info v-if="post" :post="post" />

      <!-- 帖子内容 -->
      <post-content-display v-if="post" :post="post" />

      <!-- 帖子图片 -->
      <post-images-grid v-if="post" :image-id-list-json="post.imgIdList" />

      <!-- 帖子统计信息 -->
      <post-stats-bar v-if="post" :post="post" />

      <!-- 分割线 -->
      <view class="divider"></view>

      <!-- 评论区 -->
      <comment-section :comments="comments" />
    </scroll-view>

    <!-- 底部评论输入栏 (可选，根据后续需求添加) -->
    <!-- <view class="comment-input-bar">
      <input type="text" placeholder="说点什么..." />
      <button size="mini">发送</button>
    </view> -->
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import PostAuthorInfo from "@/components/community/detail/PostAuthorInfo.vue";
import PostContentDisplay from "@/components/community/detail/PostContentDisplay.vue";
import PostImagesGrid from "@/components/community/detail/PostImagesGrid.vue";
import PostStatsBar from "@/components/community/detail/PostStatsBar.vue";
import CommentSection from "@/components/community/detail/CommentSection.vue";

import { useStore } from "vuex";

const store = useStore();

const post = ref(null);
const comments = ref([]);
const postId = ref(null);

onLoad(async (options) => {
  postId.value = options.id; // 从页面参数获取帖子ID
  if (postId.value) {
    // fetchPostDetail(postId.value);

    post.value = await store.dispatch(
      "community/fetch_post_by_id",
      postId.value
    );
    comments.value = await store.dispatch(
      "community/fetch_first_comments_by_post_id",
      postId.value
    );
  } else {
    uni.showToast({ title: "帖子ID无效", icon: "none" });
  }
});
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
  padding-bottom: 120rpx; /* 为底部评论输入栏预留空间 (如果添加的话) */
}

.divider {
  height: 1px; /* 改为1px细线 */
  background-color: #e0e0e0; /* 更柔和的分割线颜色 */
  margin: 30rpx 24rpx; /* 上下间距调整，左右与卡片内容对齐 */
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
