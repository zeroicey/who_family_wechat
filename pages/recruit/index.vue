<template>
  <view class="recruit-page">
    <!-- 顶部分类栏 -->
    <!-- <CategoryTabs :selected-type-index="selectedTypeIndex" @select-type="selectType" /> -->

    <!-- 招聘列表 -->
    <scroll-view class="recruit-list" scroll-y="true" @scrolltolower="loadMore" :lower-threshold="50"
      refresher-enabled="true" :refresher-triggered="isRefreshing" @refresherrefresh="onRefresh"
      refresher-background="#f5f5f5">
      <view class="list-container">
        <RecruitCard v-for="recruit in filteredRecruits" :key="recruit.id" :recruit="recruit" @click="goToDetail" />

        <!-- 加载更多状态 -->
        <view v-if="isLoadingMore" class="loading-more">
          <text class="loading-text">加载中...</text>
        </view>

        <!-- 没有更多数据提示 -->
        <view v-if="noMoreData && filteredRecruits.length > 0" class="no-more-data">
          <text class="no-more-text">没有更多数据了</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';

import { useStore } from 'vuex';
import CategoryTabs from '@/components/recruit/CategoryTabs.vue';
import RecruitCard from '@/components/recruit/RecruitCard.vue';

const store = useStore();

// 响应式数据
const selectedTypeIndex = ref(0);
const isLoadingMore = ref(false);
const noMoreData = ref(false);
const isRefreshing = ref(false);

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
  // 切换分类时重置加载状态
  noMoreData.value = false;
};

// scroll-view下拉刷新
const onRefresh = async () => {
  console.log('scroll-view下拉刷新触发');

  try {
    isRefreshing.value = true;

    // 重新获取第一页数据
    await store.dispatch('recruit/fetch_first_recruits');

    // 重置加载状态
    noMoreData.value = false;

    console.log('scroll-view刷新成功');

    uni.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1500
    });
  } catch (error) {
    console.error('scroll-view刷新失败:', error);
    uni.showToast({
      title: '刷新失败',
      icon: 'none',
      duration: 1500
    });
  } finally {
    isRefreshing.value = false;
  }
};

// 加载更多数据
const loadMore = async () => {
  console.log('触发loadMore事件');

  // 如果正在加载或没有更多数据，则不执行
  if (isLoadingMore.value || noMoreData.value) {
    console.log('跳过加载：', { isLoadingMore: isLoadingMore.value, noMoreData: noMoreData.value });
    return;
  }

  // 如果当前是筛选状态（非"所有"），不加载更多
  if (selectedTypeIndex.value !== 0) {
    console.log('跳过加载：当前不是"所有"分类，selectedTypeIndex:', selectedTypeIndex.value);
    return;
  }

  try {
    console.log('开始加载更多数据');
    isLoadingMore.value = true;

    const currentLength = recruits.value.length;
    console.log('当前数据长度:', currentLength);

    await store.dispatch('recruit/fetch_more_recruits');

    console.log('加载后数据长度:', recruits.value.length);

    // 如果数据长度没有变化，说明没有更多数据了
    if (recruits.value.length === currentLength) {
      noMoreData.value = true;
      console.log('没有更多数据了');
    }
  } catch (error) {
    console.error('加载更多失败:', error);
    uni.showToast({
      title: '加载失败',
      icon: 'none',
      duration: 1500
    });
  } finally {
    isLoadingMore.value = false;
    console.log('加载更多完成');
  }
};

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
  /* 为固定的分类栏留出空间 */
}

/* 招聘列表样式 */
.recruit-list {
  flex: 1;
  height: 0;
  /* 关键：让flex子元素能够正确计算高度 */
}

.list-container {
  padding: 20rpx;
}

/* 加载更多样式 */
.loading-more {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx;
}

.loading-text {
  color: #999;
  font-size: 28rpx;
}

/* 没有更多数据样式 */
.no-more-data {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx;
}

.no-more-text {
  color: #ccc;
  font-size: 26rpx;
}
</style>