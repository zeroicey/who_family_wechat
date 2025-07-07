<template>
  <view class="me-container">
    <!-- 用户信息头部 -->
    <UserProfile />

    <!-- 快捷导航卡片 -->
    <QuickNav />

    <!-- 核心功能区：任务待办、习惯打卡、专注时刻 -->
    <CoreFunctions />

    <!-- 下拉刷新区域 -->
    <view class="posts-container">
      <!-- 帖子列表 -->
      <view v-if="posts && posts.length > 0" class="posts-container">
        <my-post-card v-for="post in posts" :key="post.id" :post="post" @click="viewPostDetail(post.id)" />
      </view>

    </view>
    <!-- 回到顶部按钮 -->
    <view v-if="showBackToTop" class="back-to-top" @click="backToTop">
      <image src="/static/images/me/back_to_top.svg" class="back-to-top-icon" />
    </view>
  </view>

</template>

<script setup>
import UserProfile from '@/components/me/UserProfile.vue';
import QuickNav from '@/components/me/QuickNav.vue';
import CoreFunctions from '@/components/me/CoreFunctions.vue';
import { useStore } from "vuex";
import { computed, onMounted, ref } from "vue"; // 引入 onMounted 和 onUnmounted
import MyPostCard from "@/components/me/MyPostCard.vue";
import { onReachBottom, onPullDownRefresh, onPageScroll } from '@dcloudio/uni-app';

const store = useStore();

// 回到顶部按钮
const showBackToTop = ref(false);

// 获取帖子数据
const posts = computed(() => store.getters["user/get_posts"]);

onMounted(async () => {
  if (!posts.value || posts.value.length === 0) {
    await store.dispatch("user/fetch_first_posts");
  }
  console.log("posts", posts.value);
});

// 查看帖子详情
const viewPostDetail = (id) => {
  console.log("Viewing post detail:", id);
  uni.navigateTo({
    url: `/pages/community/detail?id=${id}`,
  });
};

onPageScroll((e) => {
  showBackToTop.value = e.scrollTop > 400;
});

const backToTop = () => {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300,
  });
};

onPullDownRefresh(async () => {
  await store.dispatch("user/fetch_first_posts");
  await store.dispatch("user/wechat_login");
  setTimeout(() => {
    uni.stopPullDownRefresh();
  }, 1000);
});
onReachBottom(async () => {
  await store.dispatch("user/fetch_more_posts");
});
</script>

<style lang="scss" scoped>
.me-container {
  padding: 1vh 1vw;
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
}

.posts-container {
  padding: 0vh 1vw;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.back-to-top {
  position: fixed;
  right: 20rpx;
  bottom: 50rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: rgba(26, 173, 25, 0.8);
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.back-to-top-icon {
  width: 40rpx;
  height: 40rpx;
}
</style>