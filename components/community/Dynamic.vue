<template>
  <view class="dynamic-container">
    <view v-if="posts && posts.length > 0" class="posts-container">
      <post-card v-for="post in posts" :key="post.id" :post="post" @click="viewPostDetail(post.id)" />
    </view>
    <view v-else class="empty-state">
      <text>暂无动态</text>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import PostCard from "@/components/community/PostCard.vue";

const store = useStore();

// 获取帖子数据
const posts = computed(() => store.getters["community/get_posts"]);

// 组件挂载后检查帖子是否为空
onMounted(async () => {
  if (!posts.value || posts.value.length === 0) {
    await store.dispatch("community/fetch_first_posts");
  }
});

// 查看帖子详情
const viewPostDetail = (id) => {
  console.log("Viewing post detail:", id);
  uni.navigateTo({
    url: `/pages/community/detail?id=${id}`,
  });
};
</script>

<style scoped>
.dynamic-container {
  min-height: 100vh;
}

.posts-container {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
