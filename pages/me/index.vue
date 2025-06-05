<template>
  <view class="me-container">
    <!-- 用户信息头部 -->
    <UserProfile />

    <!-- 帖子列表 -->
    <scroll-view class="posts-scroll" scroll-y refresher-enabled :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh" @scrolltolower="loadMore">
      <!-- 帖子列表 -->
      <view v-if="posts && posts.length > 0" class="posts-container">
        <post-card v-for="post in posts" :key="post.id" :post="post" :isInMe="true" @click="viewPostDetail(post.id)" />
      </view>

      <!-- 空状态 -->
      <view v-else class="empty-state">
        <image class="empty-icon" src="/static/images/logo.png" mode="aspectFit"></image>
        <text class="empty-text">还没有发布任何动态哦~</text>
        <view class="publish-btn" @click="navigateToPublish">
          <image src="/static/images/profile/publish.png" class="publish-icon"></image>
          <text>发布第一条动态</text>
        </view>
      </view>

      <!-- 加载更多 -->
      <view v-if="posts && posts.length >= 5" class="load-more">
        <view class="loading-container" v-if="loading">
          <view class="loading-spinner"></view>
          <text>加载中...</text>
        </view>
        <view v-else-if="noMoreData" class="divider">
          <view class="divider-line"></view>
          <text>没有更多内容了</text>
          <view class="divider-line"></view>
        </view>
        <view v-else class="pull-tip">
          <text>上拉加载更多</text>
          <view class="arrow-down"></view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import UserProfile from '@/components/me/UserProfile.vue';
import PostCard from '@/components/community/PostCard.vue';

const store = useStore();

// 获取帖子数据
const posts = computed(() => store.getters["user/get_posts"]);

// 下拉刷新与加载更多状态
const refreshing = ref(false);
const loading = ref(false);
const noMoreData = ref(false);

// 组件挂载后检查帖子是否为空
onMounted(async () => {
  noMoreData.value = false;
  if (!posts.value || posts.value.length === 0) {
    await store.dispatch("user/fetch_first_posts");
  }
  await store.dispatch("community/fetch_post_types");
});

// 下拉刷新
const onRefresh = async () => {
  noMoreData.value = false;
  refreshing.value = true;
  await store.dispatch("user/fetch_first_posts");
  setTimeout(() => {
    refreshing.value = false;
  }, 1000);
};

// 加载更多
const loadMore = async () => {
  if (loading.value || noMoreData.value) return;

  loading.value = true;
  await store.dispatch("user/fetch_more_posts");

  // 模拟加载
  setTimeout(() => {
    loading.value = false;

    // 判断是否还有更多数据
    if (posts.value.length > 20) {
      noMoreData.value = true;
    }
  }, 1000);
};

// 查看帖子详情
const viewPostDetail = (id) => {
  uni.navigateTo({
    url: `/pages/community/detail?id=${id}`,
  });
};

// 添加发布跳转方法
const navigateToPublish = () => {
  uni.navigateTo({
    url: '/pages/community/publish'
  });
};
</script>

<style lang="scss" scoped>
.me-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
  padding-bottom: 2vh;
}

.posts-scroll {
  height: calc(100vh - 260px);
  /* 减去用户信息卡片的高度 */
}

.posts-container {
  padding: 8px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 120px;
}

.empty-icon {
  width: 100px;
  height: 100px;
  border-radius: 16px;
  margin-bottom: 24px;
}

.empty-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}

.publish-btn {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  background: linear-gradient(135deg, #07c160, #39e28c);
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(7, 193, 96, 0.2);
  transition: all 0.3s ease;
}

.publish-btn:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(7, 193, 96, 0.15);
}

.publish-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.publish-btn text {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

/* 加载更多样式优化 */
.load-more {
  padding: 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-container {
  display: flex;
  align-items: center;
  gap: 8px;

  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #e8e8e8;
    border-top: 2px solid #07c160;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  text {
    font-size: 14px;
    color: #666;
  }
}

.divider {
  display: flex;
  align-items: center;
  width: 80%;
  margin: 0 auto;
  gap: 12px;

  .divider-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, #e0e0e0, transparent);
  }

  text {
    font-size: 14px;
    color: #999;
    white-space: nowrap;
  }
}

.pull-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  text {
    font-size: 14px;
    color: #666;
  }

  .arrow-down {
    width: 12px;
    height: 12px;
    border-right: 2px solid #666;
    border-bottom: 2px solid #666;
    transform: rotate(45deg);
    margin-top: -4px;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>