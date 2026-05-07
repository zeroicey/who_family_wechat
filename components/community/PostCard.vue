<template>
  <view class="post-card" @click="$emit('click')">
    <!-- 用户信息区域 -->
    <view class="post-header">
      <view class="user-info">
        <view class="avatar-wrapper">
          <view class="avatar">
            <!-- 修改 src 绑定到 fetchedAvatarUrl -->
            <image :src="fetchedAvatarUrl" class="avatar-image" />
          </view>
          <!-- 用户标签 -->
          <view class="user-brand">
            <text class="brand-text">{{ userBrand }}</text>
          </view>
        </view>
        <view class="user-details">
          <text class="username">{{ post.username }}</text>
          <text class="post-time">{{ formatRelativeTime(post.createTime) }}</text>
        </view>
      </view>
      <!-- 关注按钮 -->
      <view class="follow-btn" @click.stop="handleFollowClick">
        <text class="follow-text">{{ isFollowing ? '已关注' : '关注' }}</text>
      </view>
    </view>

    <view>
      <!-- 内容区域 -->
      <view class="post-content">
        <text class="content-text">{{ post.content }}</text>
        <text v-if="isContentTruncated" class="view-more-text">... 点击查看全部</text>
      </view>

      <!-- 图片区域 -->
      <view v-if="images.length > 0" class="image-container" :class="imageLayoutClass" @click.stop>
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
      <!-- 左边：预览数 -->
      <view class="footer-left">
        <uni-icons type="eye" size="20" color="#999" class="action-icon"></uni-icons>
        <text class="action-text">{{ displayViewCount }}</text>
      </view>

      <!-- 右边：评论和点赞 -->
      <view class="footer-right">
        <!-- 评论 -->
        <view class="action-group">
          <uni-icons type="chat" size="20" color="#666" class="action-icon"></uni-icons>
          <text class="action-text">{{ post.commentCount || 0 }}</text>
        </view>

        <!-- 点赞 -->
        <view class="action-group" @click.stop="handleLikeClick">
          <uni-icons :type="post.isLike === 1 ? 'heart-filled' : 'heart'" size="20"
            :color="post.isLike === 1 ? '#ff6b6b' : '#666'" class="action-icon"></uni-icons>
          <text class="action-text">{{ post.likeCount || 0 }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue"; // 引入 ref, onMounted, watch
import { formatRelativeTime } from "@/utils/timeFormat.js";
import { useCommunityStore } from "@/stores/community";
const communityStore = useCommunityStore();

// 定义props
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

// 创建一个 ref 来存储头像 URL
const fetchedAvatarUrl = ref(''); // 初始可以设置一个默认头像或空字符串

// 关注状态管理 - 随机生成初始状态
const isFollowing = ref(false);

// 图片加载状态管理
const imageLoadedStates = ref({});

// 异步获取头像的函数
const fetchAvatar = async () => {
  if (props.post && props.post.avaterId && props.post.username) {
    try {
      const url = await communityStore.fetch_post_user_avatar( {
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
  communityStore[`${actionPrefix}_post`](props.post.id);
};

// 处理关注按钮点击
const handleFollowClick = () => {
  if (isFollowing.value) {
    // 已关注，询问是否取关
    uni.showModal({
      title: '确认取关',
      content: `确定要取消关注 ${props.post.username} 吗？`,
      success: (res) => {
        if (res.confirm) {
          isFollowing.value = false;
          uni.showToast({
            title: '已取消关注',
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  } else {
    // 未关注，直接关注
    isFollowing.value = true;
    uni.showToast({
      title: '关注成功',
      icon: 'success',
      duration: 1500
    });
  }
};

// 组件挂载时获取头像和初始化图片状态
onMounted(async () => {
  await fetchAvatar();
  initImageLoadStates();

  // 随机生成关注状态（30%概率已关注）
  if (props.post && props.post.username) {
    const seed = props.post.username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    isFollowing.value = (seed % 10) < 3; // 30%概率已关注
  }
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

// 显示预览数，如果为0则生成随机数
const displayViewCount = computed(() => {
  const viewCount = props.post.viewCount || 0;
  if (viewCount === 0) {
    // 生成10-200之间的随机数
    return Math.floor(Math.random() * 191) + 10;
  }
  return viewCount;
});

// 用户标签数组
const brandTitles = [
  '卷王', '躺平王', '摸鱼大师', '早八人', '夜猫子', '复习达人',
  '课表杀手', 'DDL战士', '食堂VIP', '图书馆常驻', '运动健将',
  '社团大佬', '宿舍躺王', '外卖达人', '校园百事通', '社交恐怖',
  '萌新', '老油条', '传说', '工具人', '水课王', '干饭人',
  '摸鱼专业户', '起床困难户', '拖延症晚期', '复习困难户'
];

// 根据用户名生成固定的随机标签
const userBrand = computed(() => {
  if (!props.post.username) return '萌新';

  // 使用用户名的字符代码之和作为种子
  let seed = 0;
  for (let i = 0; i < props.post.username.length; i++) {
    seed += props.post.username.charCodeAt(i);
  }

  // 根据种子选择标签，确保同一用户每次显示相同的标签
  const index = seed % brandTitles.length;
  return brandTitles[index];
});
</script>

<style scoped>
.post-card {
  background-color: #ffffff;
  padding: 24rpx;
  border-radius: 28rpx;
  box-shadow: var(--shadow-soft);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16rpx;
  gap: 16rpx;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
  min-width: 0;
  flex: 1;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 28rpx;
  overflow: hidden;
  background: #eef2f7;
}

.avatar-image {
  width: 100%;
  height: 100%;
}

.user-brand {
  position: absolute;
  left: 8rpx;
  bottom: -10rpx;
  padding: 6rpx 12rpx;
  border-radius: 999rpx;
  background: rgba(109, 74, 255, 0.12);
}

.brand-text,
.username,
.post-time,
.follow-text,
.view-more-text,
.action-text {
  display: block;
}

.brand-text {
  font-size: 18rpx;
  font-weight: 700;
  color: var(--brand-primary);
}

.user-details {
  min-width: 0;
  flex: 1;
}

.username {
  margin-bottom: 8rpx;
  font-size: 28rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.post-time {
  font-size: 22rpx;
  color: var(--text-tertiary);
}

.follow-btn {
  padding: 12rpx 18rpx;
  border-radius: 999rpx;
  background: rgba(109, 74, 255, 0.1);
  flex-shrink: 0;
}

.follow-text {
  font-size: 22rpx;
  font-weight: 600;
  color: var(--brand-primary);
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
  font-size: 22rpx;
  color: var(--brand-primary);
}

.image-container {
  margin-bottom: 18rpx;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-left,
.footer-right,
.action-group {
  display: flex;
  align-items: center;
}

.footer-right {
  gap: 18rpx;
}

.action-group,
.footer-left {
  gap: 8rpx;
}

.action-text {
  font-size: 22rpx;
  color: var(--text-tertiary);
}
</style>
