<template>
  <view class="me-dashboard">
    <view class="page-hero">
      <view>
        <text class="hero-kicker">我的</text>
        <text class="hero-title">把资料、订单、效率工具和社区资产收进同一个中心</text>
      </view>
      <text class="hero-desc">不再只是资料卡和帖子列表，而是你的校园账户主页。</text>
    </view>

    <UserProfile />
    <QuickNav />
    <CoreFunctions />

    <view class="posts-section">
      <view class="section-head">
        <view>
          <text class="section-kicker">社区资产</text>
          <text class="section-title">我发布过的动态</text>
        </view>
        <text class="section-count">{{ posts.length }} 条</text>
      </view>

      <view v-if="posts && posts.length > 0" class="posts-container">
        <MyPostCard v-for="post in posts" :key="post.id" :post="post" @click="viewPostDetail(post.id)" />
      </view>
      <view v-else class="empty-state">
        <text class="empty-title">你还没有发布过动态</text>
        <text class="empty-desc">后续在社区发出的内容，会在这里作为你的个人资产持续展示。</text>
      </view>
    </view>

    <view v-if="showBackToTop" class="back-to-top" @click="backToTop">
      <image src="/static/images/me/back_to_top.svg" class="back-to-top-icon" />
    </view>
  </view>
</template>

<script setup>
import UserProfile from "@/components/me/UserProfile.vue";
import QuickNav from "@/components/me/QuickNav.vue";
import CoreFunctions from "@/components/me/CoreFunctions.vue";
import { computed, onMounted, ref } from "vue";
import MyPostCard from "@/components/me/MyPostCard.vue";
import { onReachBottom, onPullDownRefresh, onPageScroll, onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
import { useUserStore } from "@/stores/user";

onShareAppMessage(() => {
  return {
    title: "互成一家｜我的校园中心",
    path: "/pages/me/index",
    imageUrl: "/static/images/logo.png"
  };
});

onShareTimeline(() => ({
  title: "互成一家｜我的校园中心",
  imageUrl: "/static/images/logo.png"
}));

const showBackToTop = ref(false);
const userStore = useUserStore();
const posts = computed(() => userStore.get_posts || []);

onMounted(async () => {
  if (!posts.value || posts.value.length === 0) {
    await userStore.fetch_first_posts();
  }
});

const viewPostDetail = (id) => {
  uni.navigateTo({
    url: `/pages/community/detail?id=${id}`
  });
};

onPageScroll((e) => {
  showBackToTop.value = e.scrollTop > 400;
});

const backToTop = () => {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300
  });
};

onPullDownRefresh(async () => {
  await userStore.fetch_first_posts();
  await userStore.wechat_login();
  setTimeout(() => {
    uni.stopPullDownRefresh();
  }, 1000);
});

onReachBottom(async () => {
  await userStore.fetch_more_posts();
});
</script>

<style lang="scss" scoped>
.me-dashboard {
  min-height: 100vh;
  background: linear-gradient(180deg, #f7f4ff 0%, #f5f7fb 34%, #f5f7fb 100%);
  padding-bottom: 40rpx;
}

.page-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24rpx;
  padding: 32rpx 32rpx 20rpx;
}

.hero-kicker,
.hero-title,
.hero-desc,
.section-kicker,
.section-title,
.section-count,
.empty-title,
.empty-desc {
  display: block;
}

.hero-kicker {
  margin-bottom: 10rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: var(--brand-primary);
}

.hero-title {
  max-width: 520rpx;
  font-size: 38rpx;
  line-height: 1.35;
  font-weight: 700;
  color: var(--text-primary);
}

.hero-desc {
  max-width: 180rpx;
  font-size: 22rpx;
  line-height: 1.55;
  text-align: right;
  color: var(--text-tertiary);
}

.posts-section {
  margin-top: 20rpx;
  padding: 0 24rpx;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20rpx;
  margin-bottom: 18rpx;
  padding: 0 8rpx;
}

.section-kicker {
  margin-bottom: 8rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: var(--brand-primary);
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.section-count {
  font-size: 22rpx;
  color: var(--text-tertiary);
}

.posts-container {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.empty-state {
  padding: 72rpx 32rpx;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: var(--shadow-soft);
  text-align: center;
}

.empty-title {
  margin-bottom: 12rpx;
  font-size: 30rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.empty-desc {
  font-size: 24rpx;
  line-height: 1.6;
  color: var(--text-secondary);
}

.back-to-top {
  position: fixed;
  right: 32rpx;
  bottom: 180rpx;
  width: 88rpx;
  height: 88rpx;
  border-radius: 999rpx;
  background: rgba(109, 74, 255, 0.9);
  box-shadow: 0 18rpx 36rpx rgba(109, 74, 255, 0.24);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.back-to-top-icon {
  width: 48rpx;
  height: 48rpx;
}
</style>
