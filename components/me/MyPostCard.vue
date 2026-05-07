<template>
  <view class="post-card" @click="$emit('click')">
    <view class="post-header">
      <text class="post-title">{{ post.title }}</text>
      <view class="stats-bar">
        <view class="stat-item">
          <uni-icons type="eye" size="16" color="#8A93A5" class="stat-icon"></uni-icons>
          <text class="stat-text">{{ displayViewCount }}</text>
        </view>
        <view class="stat-item" @click.stop="handleLikeClick">
          <uni-icons :type="post.isLike === 1 ? 'heart-filled' : 'heart'" size="16"
            :color="post.isLike === 1 ? '#FF6B6B' : '#8A93A5'" class="stat-icon"></uni-icons>
          <text class="stat-text">{{ post.likeCount || 0 }}</text>
        </view>
        <view class="stat-item">
          <uni-icons type="chat" size="16" color="#8A93A5" class="stat-icon"></uni-icons>
          <text class="stat-text">{{ post.commentCount || 0 }}</text>
        </view>
      </view>
    </view>

    <view>
      <view class="post-content">
        <text class="content-text">{{ post.content }}</text>
        <text v-if="isContentTruncated" class="view-more-text">... 点击查看全部</text>
      </view>

      <view v-if="images.length > 0" class="image-container" :class="imageLayoutClass" @click.stop>
        <view v-for="(img, index) in images" :key="index" class="image-item"
          :class="{ 'image-item-single': images.length === 1 }">
          <view v-if="!imageLoadedStates[index]" class="image-placeholder">
            <image src="/static/images/placeholder.svg" mode="aspectFit" class="placeholder-image" />
          </view>
          <image :src="post.imgList[index]" mode="aspectFill" class="post-image" lazy-load="true"
            :style="{ opacity: imageLoadedStates[index] ? 1 : 0 }" @load="onImageLoad(index)"
            @error="onImageError(index)" @tap="previewImage(index)" />
        </view>
      </view>
    </view>

    <view class="post-footer">
      <text class="post-time">{{ formatRelativeTime(post.createTime) }}</text>
      <view class="action-group" @click.stop="handleDeleteClick">
        <uni-icons type="trash" size="18" color="#FF6B6B" class="action-icon"></uni-icons>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { formatRelativeTime } from "@/utils/timeFormat.js";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

const displayViewCount = computed(() => {
  const viewCount = props.post.viewCount || 0;
  if (viewCount === 0) {
    return Math.floor(Math.random() * 191) + 10;
  }
  return viewCount;
});

const imageLoadedStates = ref({});

const handleDeleteClick = async () => {
  uni.showModal({
    title: "确认删除",
    content: "确定要删除这条动态吗？删除后无法恢复。",
    confirmText: "删除",
    cancelText: "取消",
    confirmColor: "#ff4757",
    success: async (res) => {
      if (res.confirm) {
        try {
          await userStore.delete_post(props.post.id);
          uni.showToast({
            title: "删除成功",
            icon: "success",
            mask: true
          });
        } catch (error) {
          console.error("删除失败:", error);
          uni.showToast({
            title: "删除失败",
            icon: "none",
            mask: true
          });
        }
      }
    }
  });
};

const handleLikeClick = () => {
  const actionPrefix = props.post.isLike === 1 ? "unlike" : "like";
  userStore[`${actionPrefix}_post`](props.post.id);
};

const images = computed(() => {
  if (!props.post.imgIdList) return [];
  try {
    return props.post.imgIdList;
  } catch (e) {
    return [];
  }
});

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
    current: currentIndex
  });
};

const isContentTruncated = computed(() => {
  return props.post.content && props.post.content.length > 150;
});

const onImageLoad = (index) => {
  imageLoadedStates.value[index] = true;
};

const onImageError = (index) => {
  console.warn(`Image at index ${index} failed to load`);
  imageLoadedStates.value[index] = true;
};

const initImageLoadStates = () => {
  const states = {};
  if (props.post.imgList && props.post.imgList.length > 0) {
    props.post.imgList.forEach((_, index) => {
      states[index] = false;
    });
  }
  imageLoadedStates.value = states;
};

onMounted(() => {
  initImageLoadStates();
});

watch(() => props.post.imgList, () => {
  initImageLoadStates();
}, { deep: true });
</script>

<style scoped>
.post-card {
  background-color: #ffffff;
  padding: 24rpx;
  border-radius: 28rpx;
  box-shadow: var(--shadow-soft);
  position: relative;
  overflow: hidden;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16rpx;
  gap: 16rpx;
}

.post-title {
  font-size: 30rpx;
  line-height: 1.4;
  font-weight: 700;
  color: var(--text-primary);
}

.stats-bar {
  display: flex;
  gap: 10rpx;
  align-items: center;
  background-color: #f5f7fb;
  padding: 10rpx 14rpx;
  border-radius: 999rpx;
  flex-shrink: 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.stat-text,
.post-time,
.view-more-text {
  font-size: 22rpx;
  color: var(--text-tertiary);
  line-height: 1;
  font-weight: 500;
}

.post-content {
  margin-bottom: 16rpx;
}

.content-text {
  font-size: 26rpx;
  line-height: 1.65;
  color: var(--text-primary);
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.view-more-text {
  margin-top: 8rpx;
  display: inline-block;
  color: var(--brand-primary);
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16rpx;
}

.action-group {
  width: 56rpx;
  height: 56rpx;
  border-radius: 18rpx;
  background: #fff1f2;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
