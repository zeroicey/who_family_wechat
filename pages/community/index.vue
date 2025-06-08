<template>
  <view class="community-container">
    <!-- 分类导航 -->
    <scroll-view class="type-scroll" scroll-x show-scrollbar="false">
      <view class="type-list">
        <view v-for="(type, index) in types" :key="type.id" class="type-item" :class="{ active: currentType === type.name }"
          @click="changeCategory(type.name)">
          <text>{{ type.name }}</text>
        </view>
        <!-- 添加占位元素，确保右侧有足够空间 -->
        <view class="type-spacer"></view>
      </view>
    </scroll-view>

    <!-- 下拉刷新区域 -->
    <scroll-view class="posts-scroll" scroll-y refresher-enabled :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh" @scrolltolower="loadMore" lower-threshold="0">
      <!-- 帖子列表 -->
      <view v-if="posts && posts.length > 0" class="posts-container">
        <post-card v-for="post in posts" :key="post.id" :post="post" :isInMe="false" @click="viewPostDetail(post.id)" />
      </view>

      <!-- 空状态 -->
      <view v-else class="empty-state">
        <image class="empty-icon" src="/static/images/logo.png" mode="aspectFit"></image>
        <text class="empty-text">还没有发布任何动态哦~</text>
      </view>

      <!-- 加载更多 -->
      <view v-if="posts && posts.length > 0" class="load-more">
        <!-- 加载中状态 -->
        <view v-if="loading" class="loading-state">
          <view class="loading-spinner"></view>
          <text class="loading-text">正在加载更多...</text>
        </view>
        
        <!-- 加载错误状态 -->
        <view v-else-if="loadError" class="error-state" @click="retryLoadMore">
          <text class="error-text">加载失败，点击重试</text>
        </view>
        
        <!-- 没有更多数据 -->
        <view v-else-if="noMoreData" class="no-more-state">
          <text class="no-more-text">— 没有更多内容了 —</text>
        </view>
        
        <!-- 默认状态 -->
        <view v-else class="default-state">
          <text class="default-text">下拉查看更多</text>
        </view>
      </view>
    </scroll-view>

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

const store = useStore();

// 获取帖子数据
const posts = computed(() => store.getters["community/get_posts"]);
const types = computed(() => store.getters["community/get_post_classes"]);

// 当前选中的分类
const currentType = ref(""); // 初始化为空字符串，或者根据实际情况设置为types[0].name

// 下拉刷新与加载更多状态
const refreshing = ref(false);
const loading = ref(false);
const noMoreData = ref(false);
const loadError = ref(false); // 加载错误状态
const isLongPress = ref(false); // 用于区分长按和单击
let longPressTimer = null; // 用于长按后的延迟重置isLongPress
let loadMoreTimer = null; // 防抖定时器

// 组件挂载后检查帖子是否为空
onMounted(async () => {
  noMoreData.value = false;
  if (!posts.value || posts.value.length === 0) {
    await store.dispatch("community/fetch_first_posts");
  }
  await store.dispatch("community/fetch_post_types");
  if (types.value && types.value.length > 0) {
    currentType.value = types.value[0].name; // 默认选中第一个分类的名称
  }
});

// 组件卸载时清理定时器
onUnmounted(() => {
  if (loadMoreTimer) {
    clearTimeout(loadMoreTimer);
    loadMoreTimer = null;
  }
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }
});

// 切换分类
const changeCategory = (typeName) => {
  currentType.value = typeName;
  // 可以在这里根据分类筛选数据
  handleCategoryClick();
};

const handleCategoryClick = async () => {
  console.log("handleCategoryClick");
};

// 下拉刷新
const onRefresh = async () => {
  noMoreData.value = false;
  refreshing.value = true;
  await store.dispatch("community/fetch_first_posts");
  setTimeout(() => {
    refreshing.value = false;
  }, 1000);
};

// 加载更多（带防抖）
const loadMore = () => {
  // 防抖处理，避免频繁触发
  if (loadMoreTimer) {
    clearTimeout(loadMoreTimer);
  }
  
  loadMoreTimer = setTimeout(async () => {
    await executeLoadMore();
  }, 300); // 300ms 防抖延迟
};

// 执行加载更多的核心逻辑
const executeLoadMore = async () => {
  // 如果没有帖子，或者正在加载，或者已经没有更多数据，则不执行
  if (!posts.value || posts.value.length === 0 || loading.value || noMoreData.value) return;

  loading.value = true;
  loadError.value = false;
  const previousPostsCount = posts.value ? posts.value.length : 0;

  try {
    await store.dispatch("community/fetch_more_posts");
    const currentPostsCount = posts.value ? posts.value.length : 0;
    
    if (currentPostsCount === previousPostsCount) {
      noMoreData.value = true;
    }
  } catch (error) {
    console.error("Failed to load more posts:", error);
    loadError.value = true;
    
    // 显示错误提示
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none',
      duration: 2000
    });
  } finally {
    loading.value = false;
  }
};

// 重试加载更多
const retryLoadMore = () => {
  loadError.value = false;
  executeLoadMore();
};

// 回到顶部
const scrollToTop = () => {
  // 实现回到顶部的逻辑
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300,
  });
};

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
    sizeType: ["original", "compressed"],
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

/* 顶部导航 */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.header-actions {
  display: flex;
  align-items: center;
}

.search-icon {
  width: 24px;
  height: 24px;
  background-color: #e0e0e0;
  border-radius: 50%;
  margin-right: 16px;
}

.publish-btn {
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 16px;
}

/* 分类导航 */
.type-scroll {
  background-color: #ffffff;
  white-space: nowrap;
  padding: 0 8px;
  margin-top: 10px;
}

.type-list {
  display: flex;
  padding: 12px 8px;
  width: 100%;
}

.type-item {
  padding: 6px 16px;
  margin: 0 6px;
  font-size: 14px;
  color: #666;
  border-radius: 16px;
  background-color: #f5f5f5;
  transition: all 0.3s;
  flex-shrink: 0;
}

.type-spacer {
  width: 20px;
  flex-shrink: 0;
}

.type-item.active {
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  font-weight: 500;
}

/* 帖子列表 */
.posts-scroll {
  height: calc(100vh - 60px);
  /* 视口高度减去分类导航的高度 */
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
  padding-top: 80px;
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
}

/* 加载中状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #6e8efb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #666;
  font-size: 13px;
}

/* 错误状态 */
.error-state {
  padding: 8px 16px;
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 6px;
  margin: 0 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.error-state:active {
  background-color: #ffe7e6;
}

.error-text {
  color: #ff4d4f;
  font-size: 13px;
}

/* 没有更多数据状态 */
.no-more-state {
  padding: 8px 0;
}

.no-more-text {
  color: #999;
  font-size: 12px;
  font-style: italic;
}

/* 默认状态 */
.default-state {
  padding: 8px 0;
}

.default-text {
  color: #999;
  font-size: 13px;
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
