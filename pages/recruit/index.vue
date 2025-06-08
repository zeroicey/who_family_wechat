<template>
  <view class="recruit-page">
    <!-- 顶部分类栏 -->
    <CategoryTabs :selected-type-index="selectedTypeIndex" @select-type="selectType" />

    <!-- 招聘列表 -->
    <scroll-view class="recruit-list" scroll-y="true" @scrolltolower="onLoadMore" :lower-threshold="100">
      <view class="list-container">
        <RecruitCard v-for="recruit in filteredRecruits" :key="recruit.id" :recruit="recruit" @click="goToDetail" />

        <!-- 加载更多提示 -->
        <view v-if="loading" class="loading-tip">
          <text>加载中...</text>
        </view>

        <view v-if="noMore" class="no-more-tip">
          <text>没有更多了</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';

import { onPullDownRefresh } from "@dcloudio/uni-app";
import { useStore } from 'vuex';
import CategoryTabs from '@/components/recruit/CategoryTabs.vue';
import RecruitCard from '@/components/recruit/RecruitCard.vue';

const store = useStore();

// 响应式数据
const selectedTypeIndex = ref(0);
const loading = ref(false);
const noMore = ref(false);

// 计算属性
const recruits = computed(() => store.getters['recruit/get_recruits']);
const recruitTypes = computed(() => store.getters['recruit/get_recruit_types']);
const recruitClasses = computed(() => store.getters['recruit/get_recruit_classes']);

// 过滤后的招聘列表
const filteredRecruits = computed(() => {
  if (selectedTypeIndex.value === 0) {
    // 所有
    return recruits.value;
  } else if (selectedTypeIndex.value === 1) {
    // 已收藏
    return recruits.value.filter(recruit => recruit.isCollect === 1);
  } else {
    // 按类型过滤
    const selectedType = recruitClasses.value[selectedTypeIndex.value];
    return recruits.value.filter(recruit => recruit.type === selectedType.name);
  }
});

// 方法
const selectType = (index) => {
  selectedTypeIndex.value = index;
};

const onLoadMore = async () => {
  if (loading.value || noMore.value) return;

  loading.value = true;
  try {
    const beforeLength = recruits.value.length;
    await store.dispatch('recruit/fetch_more_recruits');
    const afterLength = recruits.value.length;

    if (beforeLength === afterLength) {
      noMore.value = true;
    }
  } catch (error) {
    console.error('加载更多失败:', error);
  } finally {
    loading.value = false;
  }
};

onPullDownRefresh(async () => {
  // 重置状态
  noMore.value = false;
  loading.value = false;

  // 重新获取第一页数据
  await store.dispatch('recruit/fetch_first_recruits')
    .then(() => {
      uni.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 1500
      });
    })
    .catch((error) => {
      console.error('刷新失败:', error);
      uni.showToast({
        title: '刷新失败',
        icon: 'none',
        duration: 1500
      });
    })
    .finally(() => {
      // 停止下拉刷新动画
      uni.stopPullDownRefresh();
    });
})

const goToDetail = (recruitId) => {
  uni.navigateTo({
    url: `/pages/recruit/detail?id=${recruitId}`
  });
};

// 生命周期
onMounted(async () => {
  try {
    await Promise.all([
      store.dispatch('recruit/fetch_first_recruits'),
      store.dispatch('recruit/fetch_recruit_types')
    ]);
  } catch (error) {
    console.error('初始化数据失败:', error);
  }
});
</script>

<style scoped>
.recruit-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  padding-top: 120rpx;
  /* 为固定的分类栏留出空间 */
}

/* 招聘列表样式 */
.recruit-list {
  flex: 1;
}

.list-container {
  padding: 20rpx;
}

/* 加载提示 */
.loading-tip,
.no-more-tip {
  text-align: center;
  padding: 40rpx;
  color: #999;
  font-size: 28rpx;
}
</style>