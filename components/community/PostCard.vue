<template>
  <view class="post-card">
    <!-- 用户信息区域 -->
    <view class="post-header">
      <view class="user-info">
        <view class="avatar">
          <!-- 修改 src 绑定到 fetchedAvatarUrl -->
          <image :src="fetchedAvatarUrl" class="avatar-image" />
        </view>
        <view class="user-details">
          <text class="username">{{ post.username }}</text>
          <text class="post-title">{{ post.title }}</text>
        </view>
      </view>
      <text class="post-time">{{ formatRelativeTime(post.createTime) }}</text>
    </view>

    <view @click="$emit('click')">
      <!-- 内容区域 -->
      <view class="post-content">
        <text class="content-text">{{ post.content }}</text>
      </view>

      <!-- 图片区域 -->
      <view v-if="images.length > 0" class="image-container" :class="imageLayoutClass">
        <view v-for="(img, index) in images" :key="index" class="image-item"
          :class="{ 'image-item-single': images.length === 1 }">
          <image :src="post.imgList[index]" mode="aspectFill" class="post-image" />
        </view>
      </view>

    </view>
    <!-- 底部操作区域 -->
    <view class="post-footer">
      <!-- 查看 -->
      <view class="action-group">

        <image class="action-icon" src="/static/images/community/view.png" />
        <text class="action-text">{{ post.viewCount || 0 }}</text>
      </view>

      <!-- 点赞 -->
      <view class="action-group" @click="handleLikeClick">
        <image class="action-icon"
          :src="post.isLike === 1 ? '/static/images/community/liked.png' : '/static/images/community/like.png'" />
        <text class="action-text">{{ post.likeCount || 0 }}</text>
      </view>

      <!-- 评论 -->
      <view class="action-group">
        <image class="action-icon" src="/static/images/community/comment.png" />
        <text class="action-text">{{ post.commentCount || 0 }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue"; // 引入 ref, onMounted, watch
import { formatRelativeTime } from "@/utils/timeFormat.js";
import { useStore } from "vuex";

const store = useStore();

// 定义props
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

// 创建一个 ref 来存储头像 URL
const fetchedAvatarUrl = ref(''); // 初始可以设置一个默认头像或空字符串

// 异步获取头像的函数
const fetchAvatar = async () => {
  if (props.post && props.post.avaterId && props.post.username) {
    try {
      const url = await store.dispatch("community/fetch_post_user_avatar", {
        avatarId: props.post.avaterId,
        name: props.post.username,
      });
      fetchedAvatarUrl.value = url; // 更新 ref
    } catch (error) {
      console.error("Failed to fetch avatar:", error);
      // fetchedAvatarUrl.value = '/static/images/default-avatar.png'; // 加载失败可以设置一个默认头像
    }
  }
};

const handleLikeClick = () => {
  // 处理点赞逻辑
  if (props.post.isLike === 1) {
    // 已经点赞，取消点赞
    store.dispatch("community/unlike_post", props.post.id);
    return;
  }
  // 未点赞，执行点赞操作
  store.dispatch("community/like_post", props.post.id);
};

// 组件挂载时获取头像
onMounted(() => {
  fetchAvatar();
});

// 监听 post prop 的变化，如果 avaterId 或 username 变了，重新获取头像
watch(() => [props.post.avaterId, props.post.username], () => {
  fetchAvatar();
}, { deep: true }); // deep: true 可能不是必需的，取决于 post 对象的结构和更新方式

// 处理图片列表
const images = computed(() => {
  if (!props.post.imgIdList) return [];
  try {
    return props.post.imgIdList;
  } catch (e) {
    return [];
  }
});

// 根据图片数量确定布局样式
const imageLayoutClass = computed(() => {
  const count = images.value.length;
  if (count === 0) return "";
  if (count === 1) return "image-single";
  if (count === 2) return "image-double";
  if (count === 3) return "image-triple";
  return "image-grid";
});
</script>

<style scoped>
.post-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

/* 用户信息样式 */
.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  overflow: hidden;
  /* 新增，确保图片不超出圆形边界 */
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 确保图片覆盖整个区域 */
}

.avatar-text {
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.post-title {
  font-size: 13px;
  color: #888;
}

.post-time {
  font-size: 12px;
  color: #999;
  align-self: center;
}

/* 内容样式 */
.post-content {
  margin-bottom: 12px;
}

.content-text {
  font-size: 15px;
  line-height: 1.5;
  color: #333;
  word-break: break-word;
}

/* 图片区域样式 */
.image-container {
  margin: 10px 0;
  display: flex;
  flex-wrap: wrap;
}

.image-item {
  position: relative;
  width: calc(33.33% - 4px);
  height: 0;
  padding-bottom: calc(33.33% - 4px);
  margin: 2px;
  overflow: hidden;
  border-radius: 8px;
}

.post-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 单图样式 */
.image-single .image-item {
  width: 70%;
  padding-bottom: 50%;
  margin: 2px auto;
}

/* 双图样式 */
.image-double .image-item {
  width: calc(50% - 4px);
  padding-bottom: calc(50% - 4px);
}

/* 三图样式 */
.image-triple .image-item {
  width: calc(33.33% - 4px);
  padding-bottom: calc(33.33% - 4px);
}

/* 四图网格样式 */
.image-grid .image-item {
  width: calc(50% - 4px);
  padding-bottom: calc(50% - 4px);
}

/* 底部操作区域样式 */
.post-footer {
  display: flex;
  justify-content: space-around;
  /* 使所有项均匀分布 */
  align-items: center;
  /* 垂直居中对齐所有项 */
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.action-group {
  display: flex;
  align-items: center;
  /* 垂直居中对齐图标和文本 */
}

/* 不再需要 .action-item 的特定布局，因为元素直接在 .post-footer 中 */
/* 如果之前有 .action-item 的样式，可以移除或注释掉 */

.action-icon {
  width: 16px;
  /* 调整图标大小 */
  height: 16px;
  /* 调整图标大小 */
  margin-right: 10px;
  /* 图标和其右侧数字的间距 */
}

.action-text {
  font-size: 16px;
  color: #888;
}

/* 确保最后一个 action-text 没有右边距，避免不必要的空白 */
.post-footer .action-text:last-of-type {
  margin-right: 0;
}
</style>
