<template>
  <view class="community-container">
    <!-- 分类导航 -->
    <scroll-view class="type-scroll" scroll-x show-scrollbar="false">
      <view class="type-list">
        <view v-for="(type, index) in types" :key="index" class="type-item" :class="{ active: currentType === type }"
          @click="changeCategory(type.value)">
          <text>{{ type }}</text>
        </view>
        <!-- 添加占位元素，确保右侧有足够空间 -->
        <view class="type-spacer"></view>
      </view>
    </scroll-view>

    <!-- 下拉刷新区域 -->
    <scroll-view class="posts-scroll" scroll-y refresher-enabled :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh" @scrolltolower="loadMore">
      <!-- 帖子列表 -->
      <view v-if="posts && posts.length > 0" class="posts-container">
        <post-card v-for="post in posts" :key="post.id" :post="post" :isInMe="false" @click="viewPostDetail(post.id)" />
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

    <!-- 悬浮发布按钮 -->
    <view class="float-btn" @click="onPublish">
      <view class="publish-icon">+</view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref, onMounted } from "vue"; // 引入 onMounted
import { useStore } from "vuex";
import PostCard from "@/components/community/PostCard.vue";

const store = useStore();

// 获取帖子数据
const posts = computed(() => store.getters["community/get_posts"]);
const types = computed(() => store.getters["community/get_post_types"]);

// 当前选中的分类
const currentType = ref("");

// 下拉刷新与加载更多状态
const refreshing = ref(false);
const loading = ref(false);
const noMoreData = ref(false);

// 组件挂载后检查帖子是否为空
onMounted(async () => {
  noMoreData.value = false;
  if (!posts.value || posts.value.length === 0) {
    await store.dispatch("community/fetch_first_posts");
    currentType.value = types.value[0];
  }
  await store.dispatch("community/fetch_post_types");
});

// 切换分类
const changeCategory = (type) => {
  currentType.value = type;
  // 可以在这里根据分类筛选数据
  handleClick();
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

// 加载更多
const loadMore = async () => {
  if (loading.value || noMoreData.value) return;

  loading.value = true;
  // 这里可以调用加载更多的接口
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

// 发布新帖子
const onPublish = () => {
  uni.navigateTo({
    url: "/pages/community/publish",
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
