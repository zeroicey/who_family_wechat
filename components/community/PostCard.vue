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
          <text @click="$emit('click')" class="post-title">{{ post.title }}</text>
        </view>
      </view>
    </view>

    <view>
      <!-- 内容区域 -->
      <view class="post-content" @click="$emit('click')">
        <text class="content-text">{{ post.content }}</text>
        <text v-if="isContentTruncated" class="view-more-text">... 点击查看全部</text>
      </view>

      <!-- 图片区域 -->
      <view v-if="images.length > 0" class="image-container" :class="imageLayoutClass">
        <view v-for="(img, index) in images" :key="index" class="image-item"
          :class="{ 'image-item-single': images.length === 1 }">
          <!-- 占位图片，在实际图片加载完成前显示 -->
          <view v-if="!imageLoadedStates[index]" class="image-placeholder">
            <image src="/static/images/placeholder.svg" mode="aspectFit" class="placeholder-image" />
          </view>
          <!-- 实际图片 -->
          <image :src="post.imgList[index]" mode="aspectFill" class="post-image" lazy-load="true"
            :style="{ opacity: imageLoadedStates[index] ? 1 : 0 }" @load="onImageLoad(index)"
            @error="onImageError(index)" @tap="previewImage(index)" />
        </view>
      </view>

    </view>
    <!-- 底部操作区域 -->
    <view class="post-footer">
      <text class="post-time">{{ formatRelativeTime(post.createTime) }}</text>
      <!-- 查看 -->
      <view class="action-group">
        <uni-icons type="eye" size="20" color="#888" class="action-icon"></uni-icons>
        <text class="action-text">{{ post.viewCount || 0 }}</text>
      </view>

      <!-- 点赞 -->
      <view class="action-group" @click="handleLikeClick">
        <uni-icons :type="post.isLike === 1 ? 'heart-filled' : 'heart'" size="20"
          :color="post.isLike === 1 ? '#ff6b6b' : '#888'" class="action-icon"></uni-icons>
        <text class="action-text">{{ post.likeCount || 0 }}</text>
      </view>

      <!-- 评论 -->
      <view class="action-group" @click="$emit('click')">
        <uni-icons type="chat" size="20" color="#888" class="action-icon"></uni-icons>
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

// 图片加载状态管理
const imageLoadedStates = ref({});

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
  const actionPrefix = props.post.isLike === 1 ? 'unlike' : 'like';
  store.dispatch(`community/${actionPrefix}_post`, props.post.id);
};

// 组件挂载时获取头像和初始化图片状态
onMounted(async () => {
  await fetchAvatar();
  initImageLoadStates();
});

// 监听 post prop 的变化，如果 avaterId 或 username 变了，重新获取头像
watch(() => [props.post.avaterId, props.post.username], () => {
  fetchAvatar();
}, { deep: true }); // deep: true 可能不是必需的，取决于 post 对象的结构和更新方式

// 监听图片列表变化，重新初始化加载状态
watch(() => props.post.imgList, () => {
  initImageLoadStates();
}, { deep: true });

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

const previewImage = (currentIndex) => {
  uni.previewImage({
    urls: props.post.imgList,
    current: currentIndex,
  });
};

// 图片加载成功处理
const onImageLoad = (index) => {
  imageLoadedStates.value[index] = true;
};

// 图片加载失败处理
const onImageError = (index) => {
  console.warn(`Image at index ${index} failed to load`);
  imageLoadedStates.value[index] = true; // 即使失败也隐藏占位图
};

// 初始化图片加载状态
const initImageLoadStates = () => {
  const states = {};
  if (props.post.imgList && props.post.imgList.length > 0) {
    props.post.imgList.forEach((_, index) => {
      states[index] = false;
    });
  }
  imageLoadedStates.value = states;
};

// 判断内容是否被截断（简单估算：超过约150个字符认为可能被截断）
const isContentTruncated = computed(() => {
  return props.post.content && props.post.content.length > 150;
});
</script>

<style scoped>
.post-card {
  background-color: #ffffff;
  padding: 16px;
  margin: 0;
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
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.view-more-text {
  font-size: 13px;
  color: #007AFF;
  margin-top: 4px;
}

/* 图片区域样式 */
.image-container {
  margin: 10px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  /* 使用gap替代margin，更精确控制间距 */
}

.image-item {
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  /* 添加圆角，更符合微信设计 */
}

.post-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.placeholder-image {
  width: 30px;
  height: 30px;
  opacity: 0.5;
}

/* 单图样式 - 参考微信朋友圈，最大宽度约为屏幕的60%，高度自适应但有最大限制 */
.image-single .image-item {
  width: 200px;
  /* 固定宽度，约为手机屏幕的60% */
  height: 200px;
  /* 正方形显示，更紧凑 */
  max-width: 60vw;
  /* 响应式最大宽度 */
  max-height: 300px;
  /* 最大高度限制 */
}

/* 双图样式 - 每张图片稍小一些 */
.image-double .image-item {
  width: calc(50% - 1.5px);
  /* 减去gap的一半 */
  height: 120px;
  /* 固定高度，更紧凑 */
}

/* 三图样式 - 第一张图片占一行，下面两张并排 */
.image-triple .image-item:first-child {
  width: 100%;
  height: 120px;
  margin-bottom: 3px;
}

.image-triple .image-item:not(:first-child) {
  width: calc(50% - 1.5px);
  height: 120px;
}

/* 四图及以上网格样式 - 2x2网格 */
.image-grid .image-item {
  width: calc(50% - 1.5px);
  height: 100px;
  /* 减小高度，更紧凑 */
}

/* 底部操作区域样式 */
.post-footer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.action-group {
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon {
  margin-right: 6px;
  display: flex;
  align-items: center;
}

.action-text {
  font-size: 16px;
  color: #888;
  line-height: 1;
}
</style>
