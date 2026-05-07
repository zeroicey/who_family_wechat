<template>
  <view class="dynamic-container">
    <view v-if="posts && posts.length > 0" class="posts-container">
      <PostCard v-for="post in posts" :key="post.id" :post="post" @click="viewPostDetail(post.id)" />
    </view>
    <view v-else class="empty-state">
      <text class="empty-title">还没有社区动态</text>
      <text class="empty-desc">试试发布第一条校园分享，或者下拉刷新看看新内容。</text>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted } from "vue";
import PostCard from "@/components/community/PostCard.vue";
import { useCommunityStore } from "@/stores/community";

const communityStore = useCommunityStore();
const posts = computed(() => communityStore.get_posts);

onMounted(async () => {
  if (!posts.value || posts.value.length === 0) {
    await communityStore.fetch_first_posts();
  }
});

const viewPostDetail = (id) => {
  uni.navigateTo({
    url: `/pages/community/detail?id=${id}`
  });
};
</script>

<style scoped>
.dynamic-container {
  min-height: 100vh;
  padding: 0 24rpx 140rpx;
}

.posts-container {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.empty-state {
  margin: 0 8rpx;
  padding: 72rpx 32rpx;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: 0 10rpx 30rpx rgba(24, 33, 49, 0.06);
  text-align: center;
}

.empty-title,
.empty-desc {
  display: block;
}

.empty-title {
  margin-bottom: 12rpx;
  font-size: 30rpx;
  font-weight: 700;
  color: #182131;
}

.empty-desc {
  font-size: 24rpx;
  line-height: 1.6;
  color: #7b8496;
}
</style>
