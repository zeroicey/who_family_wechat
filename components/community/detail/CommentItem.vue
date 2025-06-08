<template>
  <view class="comment-item">
    <view class="comment-main">
      <image class="avatar" :src="fetchedAvatarUrl" mode="aspectFill"></image>
      <view class="comment-right">
        <view class="comment-header">
          <text class="author">{{ comment.username }}</text>
          <text class="time">{{ formatTime(comment.createTime) }}</text>
        </view>
        <view class="comment-content">
          <text>{{ comment.content }}</text>
        </view>
        <!-- 一级评论操作按钮 -->
        <view class="comment-actions">
          <view class="action-btn" @click="handleReply">
            <text>回复</text>
          </view>
          <view class="action-btn delete-btn" @click="handleDelete">
            <text>删除</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 查看回复按钮 -->
    <view v-if="comment.replyCount > 0 && !showReplies" class="view-replies-btn" @click="handleViewReplies">
      <text>查看 {{ comment.replyCount }} 条回复</text>
    </view>
    
    <!-- 二级评论列表 -->
    <view v-if="showReplies && comment.replyList && comment.replyList.length > 0" class="reply-list">
      <view v-for="reply in comment.replyList" :key="reply.id" class="reply-item">
        <view class="reply-main">
          <image class="reply-avatar" :src="replyAvatars[reply.id]" mode="aspectFill"></image>
          <view class="reply-right">
            <view class="reply-header">
              <text class="reply-author">{{ reply.username }}</text>
              <text class="reply-time">{{ formatTime(reply.createTime) }}</text>
            </view>
            <view class="reply-content">
              <text>{{ reply.content }}</text>
            </view>
            <view class="reply-actions">
              <view class="action-btn delete-btn" @click="handleDeleteReply(reply)">
                <text>删除</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 加载更多二级评论 -->
      <view v-if="comment.replyList.length >= 10" class="load-more-replies-btn" @click="handleLoadMoreReplies">
        <text>加载更多回复</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useStore } from 'vuex'

// 定义props
const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
})

// 定义emits
const emit = defineEmits(['reply', 'delete', 'load-replies', 'delete-reply', 'load-more-replies'])

// 获取store实例
const store = useStore()

// 响应式数据
const showReplies = ref(false)
const fetchedAvatarUrl = ref('')
const replyAvatars = reactive({})

// 格式化时间
const formatTime = (timeString) => {
  if (!timeString) return ''
  
  // iOS兼容性处理
  const formattedTimeString = timeString.replace(/-/g, '/')
  const date = new Date(formattedTimeString)
  const now = new Date()
  const diff = now - date
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  return date.toLocaleDateString()
}

// 获取一级评论作者头像
const fetchAvatar = async () => {
  if (props.comment && props.comment.avatarId && props.comment.username) {
    try {
      const url = await store.dispatch('community/fetch_post_user_avatar', {
        avatarId: props.comment.avatarId,
        name: props.comment.username
      })
      fetchedAvatarUrl.value = url
    } catch (error) {
      console.error('获取用户头像失败:', error)
    }
  }
}

// 获取二级评论头像
const getUserAvatar = async (avatarId, username) => {
  if (!avatarId || !username) return ''
  
  try {
    const avatarUrl = await store.dispatch('community/fetch_post_user_avatar', {
      avatarId: avatarId,
      name: username
    })
    return avatarUrl
  } catch (error) {
    console.error('获取用户头像失败:', error)
    return ''
  }
}

// 处理回复
const handleReply = () => {
  emit('reply', props.comment)
}

// 处理删除
const handleDelete = () => {
  emit('delete', props.comment)
}

// 处理查看回复
const handleViewReplies = () => {
  showReplies.value = true
  emit('load-replies', props.comment)
}

// 处理删除回复
const handleDeleteReply = (reply) => {
  emit('delete-reply', {
    parentComment: props.comment,
    reply: reply
  })
}

// 处理加载更多回复
const handleLoadMoreReplies = () => {
  emit('load-more-replies', props.comment)
}

// 组件挂载时加载头像
onMounted(async () => {
  // 加载一级评论作者头像
  await fetchAvatar()
  
  // 加载二级评论头像
  if (props.comment.replyList && props.comment.replyList.length > 0) {
    for (const reply of props.comment.replyList) {
      replyAvatars[reply.id] = await getUserAvatar(reply.avatarId, reply.username)
    }
  }
})

// 监听一级评论作者信息变化
watch(
  () => [props.comment.avatarId, props.comment.username],
  () => {
    fetchAvatar()
  },
  { deep: true }
)

// 监听回复列表变化
watch(
  () => props.comment.replyList,
  async (newReplyList) => {
    if (newReplyList && newReplyList.length > 0) {
      for (const reply of newReplyList) {
        if (!replyAvatars[reply.id]) {
          replyAvatars[reply.id] = await getUserAvatar(reply.avatarId, reply.username)
        }
      }
    }
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.comment-item {
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.comment-main {
  display: flex;
  align-items: flex-start;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: #f0f0f0;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.comment-right {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.author {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-right: 16rpx;
}

.time {
  font-size: 24rpx;
  color: #999;
}

.comment-content {
  margin-bottom: 12rpx;
  
  text {
    font-size: 28rpx;
    line-height: 1.6;
    color: #333;
    word-wrap: break-word;
  }
}

.comment-actions {
  display: flex;
  gap: 24rpx;
  margin-bottom: 16rpx;
}

.action-btn {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  
  text {
    font-size: 24rpx;
    color: #6c757d;
  }
  
  &:active {
    background-color: #e9ecef;
  }
  
  &.delete-btn {
    text {
      color: #dc3545;
    }
  }
}

.view-replies-btn {
  padding: 12rpx 0;
  margin-bottom: 16rpx;
  
  text {
    font-size: 26rpx;
    color: #6e8efb;
  }
  
  &:active {
    opacity: 0.7;
  }
}

.reply-list {
  margin-left: 40rpx;
  padding-left: 20rpx;
  border-left: 2px solid #f0f0f0;
}

.reply-item {
  padding: 16rpx 0;
  border-bottom: 1px solid #f8f9fa;
  
  &:last-child {
    border-bottom: none;
  }
}

.reply-main {
  display: flex;
  align-items: flex-start;
}

.reply-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background-color: #f0f0f0;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.reply-right {
  flex: 1;
  min-width: 0;
}

.reply-header {
  display: flex;
  align-items: center;
  margin-bottom: 6rpx;
}

.reply-author {
  font-size: 26rpx;
  font-weight: 500;
  color: #333;
  margin-right: 12rpx;
}

.reply-time {
  font-size: 22rpx;
  color: #999;
}

.reply-content {
  margin-bottom: 10rpx;
  
  text {
    font-size: 26rpx;
    line-height: 1.5;
    color: #333;
    word-wrap: break-word;
  }
}

.reply-actions {
  display: flex;
  gap: 20rpx;
}

.load-more-replies-btn {
  text-align: center;
  padding: 16rpx;
  margin-top: 16rpx;
  background-color: #f8f9fa;
  border-radius: 8rpx;
  border: 1px solid #e9ecef;
  
  text {
    color: #6c757d;
    font-size: 26rpx;
  }
  
  &:active {
    background-color: #e9ecef;
  }
}
</style>