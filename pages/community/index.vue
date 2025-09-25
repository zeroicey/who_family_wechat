<template>
  <view class="community-container">
    <view v-if="posts && posts.length > 0" class="posts-container">
      <post-card v-for="post in posts" :key="post.id" :post="post" @click="viewPostDetail(post.id)" />
    </view>

    <!-- 悬浮发布按钮 -->
    <view class="float-btn" @click="onPublish" @longpress="onPublishLongPress">
      <view class="publish-icon">+</view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue"; // 引入 onMounted 和 onUnmounted
import { useStore } from "vuex";
import PostCard from "@/components/community/PostCard.vue";
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
const store = useStore();

// 获取帖子数据
const posts = computed(() => store.getters["community/get_posts"]);

// 下拉刷新与加载更多状态
const isLongPress = ref(false); // 用于区分长按和单击
let longPressTimer = null; // 用于长按后的延迟重置isLongPress

// 组件卸载时清理定时器
onUnmounted(() => {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }
});

// 组件挂载后检查帖子是否为空
onMounted(async () => {
  if (!posts.value || posts.value.length === 0) {
    await store.dispatch("community/fetch_first_posts");
  }
  await store.dispatch("community/fetch_post_types");
});

onPullDownRefresh(async () => {
  await store.dispatch("community/fetch_first_posts");
  setTimeout(() => {
    uni.stopPullDownRefresh();
  }, 1000);
});
onReachBottom(async () => {
  await store.dispatch("community/fetch_more_posts");
});

// 查看帖子详情
const viewPostDetail = (id) => {
  console.log("Viewing post detail:", id);
  uni.navigateTo({
    url: `/pages/community/detail?id=${id}`,
  });
};

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
        // 将数组转换为逗号分隔的字符串以便通过URL传递，或者考虑其他更健壮的传递方式如Vuex或event bus
        // 为了简单起见，这里用逗号分隔的字符串，但需要注意URL长度限制
        // 更推荐的方式是存到pinia/vuex或者uni.$emit, uni.$on
        // 这里我们先用 query 参数，后续可以优化
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

/* 帖子列表 */
.posts-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 悬浮发布按钮 */
.float-btn {
  position: fixed;
  right: 20px;
  bottom: 80px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
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
