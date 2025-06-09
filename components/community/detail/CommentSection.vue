<template>
  <view class="comment-section-container">
    <view class="section-header">
      <view class="section-title">全部评论</view>
      <view class="refresh-btn" @click="refreshComments">
        <text class="refresh-icon">↻</text>
      </view>
    </view>

    <!-- 评论输入框 -->
    <view class="comment-input-container">
      <!-- 回复提示 -->
      <view v-if="replyTarget" class="reply-target">
        <text class="reply-text">回复 {{ replyTarget.username }}: {{ truncateText(replyTarget.content, 20) }}</text>
        <text class="cancel-reply" @click="cancelReply">×</text>
      </view>

      <view class="input-wrapper">
        <input v-model="commentText" type="text" :placeholder="replyTarget ? '回复评论...' : '写下你的评论...'"
          class="comment-input" @confirm="submitComment" />
        <button class="submit-btn" :disabled="!commentText.trim()" @click="submitComment">
          发送
        </button>
      </view>
    </view>

    <!-- 评论列表 -->
    <view v-if="comments && comments.length > 0" class="comment-list">
      <comment-item v-for="comment in comments" :key="comment.id" :comment="comment" @reply="handleReply"
        @delete="handleDeleteComment" @delete-reply="handleDeleteReplyComment" @load-replies="handleLoadReplies"
        @load-more-replies="handleLoadMoreReplies" />
    </view>
    <view v-else class="empty-comments">
      <text>暂无评论，快来抢沙发吧！</text>
    </view>

    <!-- 加载更多一级评论按钮 -->
    <view v-if="showLoadMoreComments" class="load-more-btn" @click="loadMoreComments">
      <text>加载更多评论</text>
    </view>
  </view>
</template>

<script setup>
import CommentItem from './CommentItem.vue';
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
  postId: {
    type: String,
    required: true
  },
  totalComments: {
    type: Number,
    default: 0
  }
});

const comments = ref([]);
const commentText = ref('');
const replyTarget = ref(null); // 当前回复的目标评论
const store = useStore();

// 是否显示加载更多评论按钮
const showLoadMoreComments = computed(() => {
  return comments.value.length >= 10 && comments.value.length < props.totalComments;
});

// 截断文本
const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// 加载初始评论
const loadInitialComments = async () => {
  try {
    const commentsData = await store.dispatch('community/fetch_first_comments', {
      postId: props.postId,
      comments: []
    });
    comments.value = commentsData;
  } catch (error) {
    console.error('加载评论失败:', error);
    uni.showToast({ title: '加载评论失败', icon: 'none' });
  }
};

// 刷新评论
const refreshComments = async () => {
  try {
    uni.showLoading({ title: '刷新中...' });
    const commentsData = await store.dispatch('community/fetch_first_comments', {
      postId: props.postId,
      comments: []
    });
    comments.value = commentsData;
    uni.hideLoading();
    uni.showToast({ title: '刷新成功', icon: 'success' });
  } catch (error) {
    uni.hideLoading();
    console.error('刷新评论失败:', error);
    uni.showToast({ title: '刷新失败', icon: 'none' });
  }
};

// 加载更多一级评论
const loadMoreComments = async () => {
  try {
    const lastCommentId = comments.value[comments.value.length - 1]?.id;
    if (!lastCommentId) return;

    const moreComments = await store.dispatch('community/fetch_first_more_comments', {
      postId: props.postId,
      lastCommentId
    });
    comments.value = [...comments.value, ...moreComments];
  } catch (error) {
    console.error('加载更多评论失败:', error);
    uni.showToast({ title: '加载失败', icon: 'none' });
  }
};

// 处理回复
const handleReply = (comment) => {
  replyTarget.value = comment;
};

// 取消回复
const cancelReply = () => {
  replyTarget.value = null;
};

// 提交评论
const submitComment = async () => {
  if (!commentText.value.trim()) return;

  try {
    // 获取当前用户信息
    const userInfo = await store.getters['user/get_user_info'];
    const currentTime = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-');

    const userData = {
      uid: userInfo.id,
      username: userInfo.name,
      avatarId: userInfo.avaterId,
      createTime: currentTime
    };
    console.log(userData)

    if (replyTarget.value) {
      // 添加二级评论
      const updatedComments = await store.dispatch('community/add_second_comment', {
        commentId: replyTarget.value.id,
        content: commentText.value.trim(),
        comments: comments.value,
        userData: userData
      });
      comments.value = updatedComments;
    } else {
      // 添加一级评论
      const updatedComments = await store.dispatch('community/add_first_comment', {
        postId: props.postId,
        content: commentText.value.trim(),
        comments: comments.value,
        userData: userData
      });
      comments.value = updatedComments;
    }

    commentText.value = '';
    replyTarget.value = null;
    uni.showToast({ title: '评论成功', icon: 'success' });
  } catch (error) {
    console.error('评论失败:', error);
    uni.showToast({ title: '评论失败', icon: 'none' });
  }
};

// 处理删除评论
const handleDeleteComment = async (delete_comment) => {
  try {
    // 删除一级评论
    const updatedComments = await store.dispatch('community/delete_first_comment', {
      comments: comments.value,
      commentId: delete_comment.id
    });
    comments.value = updatedComments;

    uni.showToast({ title: '删除成功', icon: 'success' });
  } catch (error) {
    console.error('删除失败:', error);
    uni.showToast({ title: '删除失败', icon: 'none' });
  }
};

const handleDeleteReplyComment = async ({ parentComment, reply }) => {
  try {
    // 删除二级评论
    const updatedComments = await store.dispatch('community/delete_second_comment', {
      comments: comments.value,
      commentId: parentComment.id,
      replyId: reply.id
    });
    comments.value = updatedComments;
    uni.showToast({ title: '删除成功', icon: 'success' });
  } catch (error) {
    console.error('删除失败:', error);
    uni.showToast({ title: '删除失败', icon: 'none' });
  }
}

// 处理加载回复
const handleLoadReplies = async (comment) => {
  try {
    const updatedComments = await store.dispatch('community/fetch_second_comments', {
      commentId: comment.id,
      comments: comments.value
    });
    comments.value = updatedComments;
  } catch (error) {
    console.error('加载回复失败:', error);
    uni.showToast({ title: '加载回复失败', icon: 'none' });
  }
};

// 处理加载更多回复
const handleLoadMoreReplies = async (comment) => {
  try {
    const lastReplyId = comment.replyList && comment.replyList.length > 0
      ? comment.replyList[comment.replyList.length - 1].id
      : null;
    console.log(comment.id)

    const updatedComments = await store.dispatch('community/fetch_second_more_comments', {
      commentId: comment.id,
      lastCommentId: lastReplyId,
      comments: comments.value
    });
    comments.value = updatedComments;
  } catch (error) {
    console.error('加载更多回复失败:', error);
    uni.showToast({ title: '加载失败', icon: 'none' });
  }
};

onMounted(() => {
  loadInitialComments();
});
</script>

<style lang="scss" scoped>
.comment-section-container {
  padding: 24rpx;
  background-color: #ffffff;
  margin: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  padding-bottom: 16rpx;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60rpx;
  height: 60rpx;
  background-color: #f8f9fa;
  border-radius: 50%;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;

  .refresh-icon {
    font-size: 32rpx;
    color: #6c757d;
    font-weight: bold;
  }

  &:active {
    background-color: #e9ecef;
    transform: rotate(180deg);
  }
}

.comment-list {
  margin-bottom: 24rpx;
}

.empty-comments {
  text-align: center;
  padding: 40rpx 0;
  color: #999;
  font-size: 28rpx;
}

.load-more-btn {
  text-align: center;
  padding: 20rpx;
  margin: 16rpx 0;
  background-color: #f8f9fa;
  border-radius: 8rpx;
  border: 1px solid #e9ecef;

  text {
    color: #6c757d;
    font-size: 28rpx;
  }

  &:active {
    background-color: #e9ecef;
  }
}

.comment-input-container {
  margin-bottom: 24rpx;
  padding-bottom: 24rpx;
  border-bottom: 1px solid #f0f0f0;
}

.reply-target {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 16rpx;
  background-color: #f8f9fa;
  border-radius: 8rpx;
  margin-bottom: 16rpx;

  .reply-text {
    flex: 1;
    font-size: 26rpx;
    color: #6c757d;
  }

  .cancel-reply {
    width: 40rpx;
    height: 40rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #dee2e6;
    border-radius: 50%;
    font-size: 32rpx;
    color: #6c757d;
    font-weight: bold;

    &:active {
      background-color: #ced4da;
    }
  }
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.comment-input {
  flex: 1;
  height: 80rpx;
  padding: 0 20rpx;
  border: 1px solid #e9ecef;
  border-radius: 40rpx;
  background-color: #f8f9fa;
  font-size: 28rpx;
  color: #333;

  &:focus {
    border-color: #6e8efb;
    background-color: #ffffff;
  }
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80rpx;
  padding: 0 24rpx;
  background: linear-gradient(135deg, #a8e6cf, #88d8c0);
  color: white;
  border: none;
  border-radius: 40rpx;
  font-size: 26rpx;
  font-weight: 500;
  box-shadow: 0 4rpx 12rpx rgba(168, 230, 207, 0.3);
  transition: all 0.2s ease;
  text-align: center;

  &:disabled {
    background: #f1f3f4;
    color: #9aa0a6;
    box-shadow: none;
  }

  &:not(:disabled):active {
    transform: translateY(2rpx);
    box-shadow: 0 2rpx 8rpx rgba(168, 230, 207, 0.4);
  }
}
</style>