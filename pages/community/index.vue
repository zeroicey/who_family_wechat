<template>
  <view class="community-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        class="nav-item"
        :class="{ active: currentTab === tab.value }"
        @click="switchTab(tab.value)"
      >
        <image
          class="nav-icon"
          :class="{ 'icon-large': tab.value === 'errand' || tab.value === 'secondhand' }"
          :src="tab.icon"
          mode="aspectFit"
        />
        <text class="nav-text">{{ tab.label }}</text>
        <view v-if="currentTab === tab.value" class="nav-indicator"></view>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content-wrapper">
      <dynamic v-if="currentTab === 'dynamic'" />
      <errand v-else-if="currentTab === 'errand'" />
      <second-hand v-else-if="currentTab === 'secondhand'" />
      <rating v-else-if="currentTab === 'rating'" />
    </view>

    <!-- 悬浮发布按钮 -->
    <view class="float-btn" @click="onPublish" @longpress="onPublishLongPress">
      <view class="publish-icon">+</view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Dynamic from "@/components/community/Dynamic.vue";
import Errand from "@/components/community/Errand.vue";
import SecondHand from "@/components/community/SecondHand.vue";
import Rating from "@/components/community/Rating.vue";
import { onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'

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

// 当前选中的标签
const currentTab = ref('dynamic');
import { useCommunityStore } from "@/stores/community";
const communityStore = useCommunityStore();

// 标签列表
const tabs = [
  { label: '动态', value: 'dynamic', icon: '/static/images/community/dynamic.svg' },
  { label: '跑腿', value: 'errand', icon: '/static/images/community/errand.svg' },
  { label: '二手', value: 'secondhand', icon: '/static/images/community/secondhand.svg' },
  { label: '评分', value: 'rating', icon: '/static/images/community/rating.svg' }
];

// 下拉刷新与加载更多状态
const isLongPress = ref(false); // 用于区分长按和单击
let longPressTimer = null; // 用于长按后的延迟重置isLongPress

// 切换标签
const switchTab = (tab) => {
  currentTab.value = tab;
};

// 组件卸载时清理定时器
onUnmounted(() => {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }
});

// 组件挂载后初始化数据
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

// 发布新帖子 - 长按事件
const onPublishLongPress = () => {
  isLongPress.value = true;
  uni.navigateTo({
    url: "/pages/community/publish",
  });
  // 延迟重置长按标志，以避免立即触发单击事件
  if (longPressTimer) {
    clearTimeout(longPressTimer);
  }
  longPressTimer = setTimeout(() => {
    isLongPress.value = false;
    longPressTimer = null;
  }, 200); // 200ms 延迟，可以根据实际情况调整
};

// 发布新帖子 - 单击事件
const onPublish = () => {
  if (isLongPress.value) {
    // 如果是长按触发的，则单击事件不执行
    // isLongPress.value = false; // 在 longPress 事件中重置
    return;
  }
  // 清除可能存在的长按延迟重置，以防单击过快
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }
  uni.chooseImage({
    count: 4, // 最多可以选择4张图片，与 publish.vue 保持一致
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
        url: url,
      });
    },
    fail: (err) => {
      // 即使用户取消选择图片，也跳转到发布页面
      console.log('用户取消选择图片');
    }
  });
};
</script>

<style scoped>
/* 整体容器 */
.community-container {
  background-color: #f8f8f8;
  min-height: 100vh;
  position: relative;
}

/* 顶部导航栏 */
.nav-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20rpx 0;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 10rpx 0;
  cursor: pointer;
  gap: 8rpx;
}

.nav-icon {
  width: 44rpx;
  height: 44rpx;
  transition: transform 0.3s;
}

.nav-icon.icon-large {
  width: 54rpx;
  height: 54rpx;
}

.nav-item.active .nav-icon {
  transform: scale(1.1);
}

.nav-text {
  font-size: 24rpx;
  color: #666;
  transition: color 0.3s;
}

.nav-item.active .nav-text {
  color: #00cc6a;
  font-weight: 600;
}

.nav-indicator {
  position: absolute;
  bottom: 0;
  width: 40rpx;
  height: 6rpx;
  background: linear-gradient(135deg, #00ff88, #00cc6a);
  border-radius: 3rpx;
}

/* 内容区域 */
.content-wrapper {
  min-height: calc(100vh - 100rpx);
}

/* 悬浮发布按钮 */
.float-btn {
  position: fixed;
  right: 20px;
  bottom: 80px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #00ff88, #00cc6a);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  z-index: 99;
}

.publish-icon {
  color: white;
  font-size: 28px;
  font-weight: bold;
  line-height: 28px;
  height: 28px;
  text-align: center;
  margin-top: -2px;
  /* 微调位置使其完美居中 */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
