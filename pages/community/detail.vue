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
import { ref, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import PostAuthorInfo from "@/components/community/detail/PostAuthorInfo.vue";
import PostContentDisplay from "@/components/community/detail/PostContentDisplay.vue";
import PostImagesGrid from "@/components/community/detail/PostImagesGrid.vue";
import PostStatsBar from "@/components/community/detail/PostStatsBar.vue";
import CommentSection from "@/components/community/detail/CommentSection.vue";

const post = ref(null);
const comments = ref([]);
const postId = ref(null);

// 模拟帖子数据 (实际应从API获取)
const mockPostData = {
  id: 3,
  uid: 9,
  username: "root",
  avatarId: 28, // 注意：您提供的是 avaterId，通常是 avatarId
  title: "校园达人",
  content:
    "今天在图书馆学习了一天，感觉效率超高！分享一下我的学习方法：番茄工作法 + 思维导图，真的很有效！大家有什么好的学习方法也可以分享一下~",
  imgIdList: "[5,6,7,8]",
  type: "life",
  createTime: "2025-05-26 06:30:57",
  likeCount: 1,
  commentCount: 4,
  viewCount: 0,
};

// 模拟评论数据 (实际应从API获取)
const mockCommentsData = [
  {
    id: 2,
    uid: 9,
    username: "评论用户A",
    avatarId: 27,
    content: "这个方法听起来不错，我试试！",
    createTime: "2025-05-26 09:25:58",
    replyCount: 0,
  },
  {
    id: 1,
    uid: 9,
    username: "评论用户B",
    avatarId: 1, // 使用随机头像
    content: "感谢分享，已收藏。",
    createTime: "2025-05-26 08:25:12",
    replyCount: 2,
  },
];

onLoad(async (options) => {
  postId.value = options.id; // 从页面参数获取帖子ID
  if (postId.value) {
    // fetchPostDetail(postId.value);
    // fetchComments(postId.value);
    // 模拟加载
    post.value = mockPostData;
    comments.value = mockCommentsData;
  } else {
    uni.showToast({ title: "帖子ID无效", icon: "none" });
    // uni.navigateBack();
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
