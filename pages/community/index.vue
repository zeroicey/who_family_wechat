<template>
  <view class="community-shell">
    <view class="community-hero">
      <view class="hero-copy">
        <text class="hero-kicker">社区</text>
        <text class="hero-title">服务优先，但交流与互助仍然保留强入口</text>
        <text class="hero-desc">动态、跑腿、二手和评分继续独立存在，只把表达方式变得更清楚、更成熟。</text>
      </view>
      <view class="hero-side">
        <view class="hero-badge">
          <text class="badge-value">4</text>
          <text class="badge-label">个频道</text>
        </view>
      </view>
    </view>

    <view class="channel-bar">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        class="channel-pill"
        :class="{ active: currentTab === tab.value }"
        @click="switchTab(tab.value)"
      >
        <text class="channel-label">{{ tab.label }}</text>
        <text class="channel-subtitle">{{ tab.subtitle }}</text>
      </view>
    </view>

    <view class="content-shell">
      <Dynamic v-if="currentTab === 'dynamic'" />
      <Errand v-else-if="currentTab === 'errand'" />
      <SecondHand v-else-if="currentTab === 'secondhand'" />
      <Rating v-else-if="currentTab === 'rating'" />
    </view>

    <view class="publish-fab" @click="onPublish" @longpress="onPublishLongPress">
      <text class="fab-plus">＋</text>
      <text class="fab-text">发布</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Dynamic from "@/components/community/Dynamic.vue";
import Errand from "@/components/community/Errand.vue";
import SecondHand from "@/components/community/SecondHand.vue";
import Rating from "@/components/community/Rating.vue";
import { onReachBottom, onPullDownRefresh, onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
import { useCommunityStore } from "@/stores/community";

const currentTab = ref("dynamic");
const communityStore = useCommunityStore();

const tabs = [
  { label: "动态", value: "dynamic", subtitle: "最新校园分享" },
  { label: "跑腿", value: "errand", subtitle: "即时互助需求" },
  { label: "二手", value: "secondhand", subtitle: "闲置交换" },
  { label: "评分", value: "rating", subtitle: "体验参考" }
];

const isLongPress = ref(false);
let longPressTimer = null;

onShareAppMessage(() => {
  return {
    title: "互成一家｜校园社区",
    path: "/pages/community/index",
    imageUrl: "/static/images/logo.png"
  };
});

onShareTimeline(() => ({
  title: "互成一家｜校园社区",
  imageUrl: "/static/images/logo.png"
}));

const switchTab = (tab) => {
  currentTab.value = tab;
};

onUnmounted(() => {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }
});

onMounted(async () => {
  await communityStore.fetch_post_types();
});

onPullDownRefresh(async () => {
  await communityStore.fetch_first_posts();
  setTimeout(() => {
    uni.stopPullDownRefresh();
  }, 1000);
});

onReachBottom(async () => {
  await communityStore.fetch_more_posts();
});

const onPublishLongPress = () => {
  isLongPress.value = true;
  uni.navigateTo({
    url: "/pages/community/publish"
  });
  if (longPressTimer) {
    clearTimeout(longPressTimer);
  }
  longPressTimer = setTimeout(() => {
    isLongPress.value = false;
    longPressTimer = null;
  }, 200);
};

const onPublish = () => {
  if (isLongPress.value) {
    return;
  }
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }
  uni.chooseImage({
    count: 4,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      const tempFilePaths = res.tempFilePaths;
      let url = "/pages/community/publish";
      if (tempFilePaths && tempFilePaths.length > 0) {
        const imageQuery = encodeURIComponent(JSON.stringify(tempFilePaths));
        url = `/pages/community/publish?images=${imageQuery}`;
      }
      uni.navigateTo({
        url
      });
    },
    fail: () => {
      console.log("用户取消选择图片");
    }
  });
};
</script>

<style scoped>
.community-shell {
  min-height: 100vh;
  background: linear-gradient(180deg, #f7f4ff 0%, #f5f7fb 32%, #f5f7fb 100%);
  position: relative;
}

.community-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24rpx;
  padding: 32rpx 32rpx 24rpx;
}

.hero-copy,
.hero-side {
  min-width: 0;
}

.hero-kicker,
.hero-title,
.hero-desc,
.badge-value,
.badge-label,
.channel-label,
.channel-subtitle,
.fab-plus,
.fab-text {
  display: block;
}

.hero-kicker {
  margin-bottom: 10rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: #6d4aff;
}

.hero-title {
  margin-bottom: 12rpx;
  font-size: 38rpx;
  line-height: 1.35;
  font-weight: 700;
  color: #182131;
}

.hero-desc {
  max-width: 520rpx;
  font-size: 24rpx;
  line-height: 1.6;
  color: #5b6475;
}

.hero-badge {
  padding: 20rpx 22rpx;
  border-radius: 24rpx;
  background: rgba(109, 74, 255, 0.1);
  border: 1rpx solid rgba(109, 74, 255, 0.12);
}

.badge-value {
  margin-bottom: 6rpx;
  font-size: 34rpx;
  font-weight: 700;
  color: #6d4aff;
  text-align: center;
}

.badge-label {
  font-size: 22rpx;
  color: #6a7385;
  text-align: center;
}

.channel-bar {
  padding: 0 32rpx 22rpx;
  display: flex;
  gap: 16rpx;
  overflow-x: auto;
  white-space: nowrap;
}

.channel-pill {
  min-width: 184rpx;
  padding: 18rpx 22rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.74);
  border: 1rpx solid #e5e9f2;
}

.channel-pill.active {
  background: #6d4aff;
  border-color: #6d4aff;
  box-shadow: 0 12rpx 28rpx rgba(109, 74, 255, 0.2);
}

.channel-label {
  margin-bottom: 6rpx;
  font-size: 28rpx;
  font-weight: 700;
  color: #182131;
}

.channel-subtitle {
  font-size: 20rpx;
  line-height: 1.4;
  color: #7b8496;
}

.channel-pill.active .channel-label,
.channel-pill.active .channel-subtitle {
  color: #ffffff;
}

.content-shell {
  min-height: calc(100vh - 250rpx);
}

.publish-fab {
  position: fixed;
  right: 28rpx;
  bottom: 170rpx;
  width: 120rpx;
  height: 120rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #6d4aff, #8d6bff);
  box-shadow: 0 18rpx 36rpx rgba(109, 74, 255, 0.28);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 99;
}

.fab-plus {
  font-size: 34rpx;
  line-height: 1;
  color: #fff;
  font-weight: 700;
}

.fab-text {
  margin-top: 4rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.92);
  font-weight: 600;
}
</style>
