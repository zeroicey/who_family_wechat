<template>
  <view class="errand-container">
    <view v-if="errandTasks.length > 0" class="tasks-container">
      <ErrandCard
        v-for="task in errandTasks"
        :key="task.id"
        :task="task"
        @click="handleTaskClick(task)"
      />
    </view>

    <view v-else class="empty-state">
      <text class="empty-title">暂无跑腿任务</text>
      <text class="empty-desc">新的互助需求会出现在这里，先保留频道位置与入口强度。</text>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted } from "vue";
import ErrandCard from "./ErrandCard.vue";
import { useErrandStore } from "@/stores/errand";

const errandStore = useErrandStore();

const errandTasks = computed(() => {
  const tasks = errandStore.get_tasks;
  console.log("[Errand.vue] getter返回值:", tasks);
  return tasks || [];
});

const handleTaskClick = (task) => {
  console.log("点击跑腿任务:", task);
};

onMounted(async () => {
  console.log("[Errand.vue] 组件挂载，开始加载任务");
  try {
    await errandStore.fetch_tasks();
    console.log("[Errand.vue] 任务加载完成");
  } catch (error) {
    console.error("[Errand.vue] 任务加载失败:", error);
  }
});
</script>

<style scoped>
.errand-container {
  min-height: 100vh;
  padding: 0 24rpx 140rpx;
}

.tasks-container {
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
