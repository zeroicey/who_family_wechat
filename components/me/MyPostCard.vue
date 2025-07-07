<template>
  <view class="post-card">
    <!-- 标题区域 -->
    <view class="post-header">
      <text @click="$emit('click')" class="post-title">{{ post.title }}</text>
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
          <image :src="post.imgList[index]" mode="aspectFill" class="post-image" lazy-load="true"
            @tap="previewImage(index)" />
        </view>
      </view>

    </view>
    <!-- 底部操作区域 -->
    <view class="post-footer">
      <text class="post-time">{{ formatRelativeTime(post.createTime) }}</text>
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
      <view class="action-group" @click="$emit('click')">
        <image class="action-icon" src="/static/images/community/comment.png" />
        <text class="action-text">{{ post.commentCount || 0 }}</text>
      </view>

      <!-- 删除 -->
      <view class="action-group" @click="handleDeleteClick">
        <image class="action-icon" src="/static/images/community/trash.png" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";
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

const handleDeleteClick = async () => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条动态吗？删除后无法恢复。',
    confirmText: '删除',
    cancelText: '取消',
    confirmColor: '#ff4757',
    success: async (res) => {
      if (res.confirm) {
        try {
          await store.dispatch("user/delete_post", props.post.id);
          uni.showToast({
            title: '删除成功',
            icon: 'success',
            mask: true
          });
        } catch (error) {
          console.error('删除失败:', error);
          uni.showToast({
            title: '删除失败',
            icon: 'none',
            mask: true
          });
        }
      }
    }
  });
}

const handleLikeClick = () => {
  // 处理点赞逻辑
  const actionPrefix = props.post.isLike === 1 ? 'unlike' : 'like';
  store.dispatch(`user/${actionPrefix}_post`, props.post.id);
};

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
  border-radius: 12px;
}

/* 用户信息样式 */
.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.post-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
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
}

.image-item {
  position: relative;
  width: calc(33.33% - 4px);
  height: 0;
  padding-bottom: calc(33.33% - 4px);
  margin: 2px;
  overflow: hidden;
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
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 单图样式 */
.image-single .image-item {
  width: 100%;
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
