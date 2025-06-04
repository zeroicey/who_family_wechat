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
        <view class="empty-icon"></view>
        <text class="empty-text">暂无内容</text>
        <view class="refresh-btn" @click="handleClick">刷新试试</view>
      </view>

      <!-- 加载更多 -->
      <view v-if="posts && posts.length > 0" class="load-more">
        <text v-if="loading">加载中...</text>
        <text v-else-if="noMoreData">没有更多了</text>
        <text v-else>上拉加载更多</text>
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
const posts = computed(() => store.getters["community/get_posts"]);

// 下拉刷新与加载更多状态
const refreshing = ref(false);
const loading = ref(false);
const noMoreData = ref(false);

// 组件挂载后检查帖子是否为空
onMounted(async () => {
  noMoreData.value = false;
  if (!posts.value || posts.value.length === 0) {
    await store.dispatch("community/fetch_first_posts");
  }
});

// 下拉刷新
const onRefresh = async () => {
  noMoreData.value = false;
  refreshing.value = true;
  await store.dispatch("community/fetch_first_posts");
  setTimeout(() => {
    refreshing.value = false;
  }, 1000);
};

// 加载更多
const loadMore = async () => {
  if (loading.value || noMoreData.value) return;

  loading.value = true;
  await store.dispatch("community/fetch_more_posts");

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
  padding-top: 100px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  background-color: #e0e0e0;
  border-radius: 50%;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  color: #999;
  margin-bottom: 16px;
}

.refresh-btn {
  padding: 8px 20px;
  background-color: #f5f5f5;
  color: #666;
  border-radius: 20px;
  font-size: 14px;
}

/* 加载更多 */
.load-more {
  text-align: center;
  padding: 16px 0;
  color: #999;
  font-size: 13px;
}
</style>