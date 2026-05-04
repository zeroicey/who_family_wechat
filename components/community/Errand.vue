<template>
  <view class="errand-container">
    <!-- 跑腿任务列表 -->
    <view v-if="errandTasks.length > 0" class="tasks-container">
      <errand-card
        v-for="task in errandTasks"
        :key="task.id"
        :task="task"
        @click="handleTaskClick(task)"
      />
    </view>

    <!-- 空状态 -->
    <view v-else class="empty-state">
      <text>暂无跑腿任务</text>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import ErrandCard from './ErrandCard.vue';
import { useErrandStore } from "@/stores/errand";
const errandStore = useErrandStore();

// 获取跑腿任务列表，添加防御性代码
const errandTasks = computed(() => {
  const tasks = errandStore.get_tasks;
  console.log('[Errand.vue] getter返回值:', tasks);
  return tasks || [];
});

// 处理任务卡片点击
const handleTaskClick = (task) => {
  console.log('点击跑腿任务:', task);
};

// 组件挂载时加载任务数据
onMounted(async () => {
  console.log('[Errand.vue] 组件挂载，开始加载任务');
  try {
    await errandStore.fetch_tasks();
    console.log('[Errand.vue] 任务加载完成');
  } catch (error) {
    console.error('[Errand.vue] 任务加载失败:', error);
  }
});
</script>

<style scoped>
.errand-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  /* padding: 16px; */
}

.tasks-container {
  display: flex;
  flex-direction: column;
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
