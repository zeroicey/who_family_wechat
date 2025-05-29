<template>
  <view class="post-card">
    <!-- 用户信息区域 -->
    <view class="post-header">
      <view class="user-info">
        <view class="avatar">
          <text class="avatar-text">{{ post.username.charAt(0) }}</text>
        </view>
        <view class="user-details">
          <text class="username">{{ post.username }}</text>
          <text class="post-title">{{ post.title }}</text>
        </view>
      </view>
      <text class="post-time">{{ formatRelativeTime(post.createTime) }}</text>
    </view>
    
    <!-- 内容区域 -->
    <view class="post-content">
      <text class="content-text">{{ post.content }}</text>
    </view>
    
    <!-- 图片区域 -->
    <view v-if="images.length > 0" class="image-container" :class="imageLayoutClass">
      <view 
        v-for="(img, index) in images" 
        :key="index" 
        class="image-item"
        :class="{'image-item-single': images.length === 1}"
      >
        <!-- 使用空白div占位 -->
        <view class="image-placeholder"></view>
      </view>
    </view>
    
    <!-- 底部操作区域 -->
    <view class="post-footer">
      <view class="action-item">
        <view class="icon-view">
          <view class="icon-placeholder view-icon"></view>
        </view>
        <text class="action-text">{{ post.viewCount || 0 }}</text>
      </view>
      <view class="action-item">
        <view class="icon-like">
          <view class="icon-placeholder like-icon"></view>
        </view>
        <text class="action-text">{{ post.likeCount || 0 }}</text>
      </view>
      <view class="action-item">
        <view class="icon-comment">
          <view class="icon-placeholder comment-icon"></view>
        </view>
        <text class="action-text">{{ post.commentCount || 0 }}</text>
      </view>
      <view class="action-item share">
        <view class="icon-share">
          <view class="icon-placeholder share-icon"></view>
        </view>
        <text class="action-text">分享</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { formatRelativeTime } from '@/utils/timeFormat.js';

// 定义props
const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

// 处理图片列表
const images = computed(() => {
  if (!props.post.imgIdList) return [];
  try {
    const imgIds = JSON.parse(props.post.imgIdList);
    return Array.isArray(imgIds) ? imgIds : [];
  } catch (e) {
    return [];
  }
});

// 根据图片数量确定布局样式
const imageLayoutClass = computed(() => {
  const count = images.value.length;
  if (count === 0) return '';
  if (count === 1) return 'image-single';
  if (count === 2) return 'image-double';
  if (count === 3) return 'image-triple';
  return 'image-grid';
});

// 使用工具函数格式化时间
const formatTime = formatRelativeTime;
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
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
}

.action-item {
  display: flex;
  align-items: center;
  padding: 0 8px;
}

.icon-placeholder {
  width: 20px;
  height: 20px;
  margin-right: 4px;
  border-radius: 50%;
}

.view-icon {
  background-color: #e0e0e0;
}

.like-icon {
  background-color: #ffcdd2;
}

.comment-icon {
  background-color: #c8e6c9;
}

.share-icon {
  background-color: #bbdefb;
}

.action-text {
  font-size: 14px;
  color: #666;
}
</style>
