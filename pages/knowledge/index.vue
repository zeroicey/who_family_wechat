<template>
  <view class="knowledge-page">
    <view class="tabs-container">
      <v-tabs
        v-model="activeTab"
        :tabs="knowledgeTabs"
        :pills="true"
        line-height="0"
        active-color="#fff"
        pills-color="#2979ff"
        pills-border-radius="20rpx"
        color="#2979ff"
        font-size="28rpx"
        height="80rpx"
        padding-item="0 20rpx"
        bg-color="#f5f5f5"
        @change="changeTab"
      ></v-tabs>
    </view>

    <scroll-view class="knowledge-list" scroll-y="true">
      <view class="list-container">
        <view
          v-for="item in currentKnowledgeList"
          :key="item.id"
          class="knowledge-card"
          @click="viewDetail(item)"
        >
          <!-- 卡片头部 -->
          <view class="card-header">
            <view class="header-left">
              <!-- 推荐标识 -->
              <view v-if="item.isRecommended" class="recommended-badge">
                <text class="badge-text">推荐</text>
              </view>
              <text class="card-title">{{ item.title }}</text>
            </view>
            <!-- 难度标签 -->
            <view class="level-badge" :class="getLevelClass(item.level)">
              <text class="level-text">{{ item.level }}</text>
            </view>
          </view>

          <!-- 描述 -->
          <text class="card-desc">{{ item.description }}</text>

          <!-- 标签 -->
          <view class="card-tags">
            <text
              v-for="(tag, index) in item.tags"
              :key="index"
              class="mini-tag"
            >{{ tag }}</text>
          </view>

          <!-- 作者信息 -->
          <view class="author-info">
            <image
              class="author-avatar"
              :src="getAvatarUrl(item.author)"
            ></image>
            <text class="author-name">{{ item.author }}</text>
            <text class="publish-date">{{ item.publishDate }}</text>
          </view>

          <!-- 底部信息 -->
          <view class="card-footer">
            <view class="read-info">
              <text class="read-item">⏱ {{ item.readTime }}</text>
              <text class="read-item">📄 {{ item.wordCount }}字</text>
            </view>
            <view class="stats-info">
              <view class="stat-item">
                <text class="stat-icon">👁</text>
                <text class="stat-text">{{ formatNumber(item.views) }}</text>
              </view>
              <view class="stat-item">
                <text class="stat-icon">👍</text>
                <text class="stat-text">{{ formatNumber(item.likes) }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { knowledgeData, knowledgeTabs } from '@/static/mock/knowledge/index.js';
import { getRandomAvatarUrl } from '@/utils/randomData.js';

onShareAppMessage(() => {
  return {
    title: '互成一家小程序',
    path: '/pages/home/index',
    imageUrl: '/static/images/logo.png'
  }
})

onShareTimeline(() => ({
  title: '互成一家小程序',
  imageUrl: '/static/images/logo.png'
}))

const activeTab = ref(0);

const currentKnowledgeList = computed(() => {
  return knowledgeData[activeTab.value] || [];
});

const getLevelClass = (level) => {
  const levelMap = {
    '初级': 'tag-beginner',
    '中级': 'tag-intermediate',
    '高级': 'tag-advanced'
  };
  return levelMap[level] || 'tag-beginner';
};

const changeTab = (index) => {
  console.log('切换到分类:', knowledgeTabs[index]);
  activeTab.value = index;
};

const viewDetail = (item) => {
  uni.navigateTo({
    url: `/pages/knowledge/article?id=${item.id}`
  });
};

const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

const getAvatarUrl = (author) => {
  return getRandomAvatarUrl(author);
};
</script>

<style scoped>
.knowledge-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.tabs-container {
  background-color: #fff;
  border-bottom: 1rpx solid #e5e5e5;
  padding: 0 10rpx;
}

.knowledge-list {
  flex: 1;
  height: 0;
}

.list-container {
  padding: 24rpx;
}

.knowledge-card {
  background-color: #fff;
  border-radius: 20rpx;
  margin-bottom: 24rpx;
  padding: 28rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.knowledge-card:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.08);
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.header-left {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-wrap: wrap;
}

.recommended-badge {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  padding: 6rpx 14rpx;
  border-radius: 8rpx;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36rpx;
}

.badge-text {
  color: #fff;
  font-size: 20rpx;
  font-weight: bold;
  line-height: 1;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1a1a1a;
  line-height: 1.4;
  flex: 1;
}

.level-badge {
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: bold;
  flex-shrink: 0;
}

.tag-beginner {
  background-color: #e8f5e3;
  color: #4caf50;
}

.tag-intermediate {
  background-color: #fff3e0;
  color: #ff9800;
}

.tag-advanced {
  background-color: #ffebee;
  color: #f44336;
}

/* 描述 */
.card-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 标签 */
.card-tags {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
}

.mini-tag {
  background-color: #f0f2f5;
  color: #5a6c7d;
  font-size: 22rpx;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-weight: 500;
}

/* 作者信息 */
.author-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.author-avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background-color: #e0e0e0;
}

.author-name {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
}

.publish-date {
  font-size: 22rpx;
  color: #999;
  margin-left: auto;
}

/* 底部信息 */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.read-info {
  display: flex;
  gap: 20rpx;
}

.read-item {
  font-size: 22rpx;
  color: #999;
}

.stats-info {
  display: flex;
  gap: 20rpx;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.stat-icon {
  font-size: 26rpx;
}

.stat-text {
  font-size: 22rpx;
  color: #999;
}
</style>
