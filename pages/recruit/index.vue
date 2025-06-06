<template>
  <view class="recruit-page">
    <!-- 顶部分类栏 -->
    <view class="category-tabs">
      <scroll-view scroll-x="true" class="tabs-scroll">
        <view class="tabs-container">
          <view 
            v-for="(type, index) in recruitClasses" 
            :key="index"
            class="tab-item"
            :class="{ active: selectedTypeIndex === index }"
            @click="selectType(index)"
          >
            {{ type.name }}
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 招聘列表 -->
    <scroll-view 
      class="recruit-list"
      scroll-y="true"
      @scrolltolower="onLoadMore"
      :lower-threshold="100"
    >
      <view class="list-container">
        <view 
          v-for="recruit in filteredRecruits" 
          :key="recruit.id"
          class="recruit-card"
          @click="goToDetail(recruit.id)"
        >
          <!-- 卡片头部 -->
          <view class="card-header">
            <view class="organization-info">
              <view class="org-logo">
                <text class="logo-text">{{ recruit.organizationName.charAt(0) }}</text>
              </view>
              <view class="org-details">
                <text class="org-name">{{ recruit.organizationName }}</text>
                <text class="publish-time">{{ formatTime(recruit.createTime) }}</text>
              </view>
            </view>
            <view class="tags">
              <text v-if="recruit.isHot === 'true'" class="tag hot-tag">热门</text>
              <text v-if="recruit.isRecommended === 'true'" class="tag recommend-tag">推荐</text>
            </view>
          </view>

          <!-- 招聘标题 -->
          <view class="card-title">
            <text class="title-text">{{ recruit.name }}</text>
          </view>

          <!-- 招聘信息 -->
          <view class="card-info">
            <view class="info-item">
              <text class="info-label">类型：</text>
              <text class="info-value">{{ recruit.type }}</text>
            </view>
            <view class="info-item" v-if="recruit.location && recruit.location !== '无'">
              <text class="info-label">地点：</text>
              <text class="info-value">{{ recruit.location }}</text>
            </view>
            <view class="info-item" v-if="recruit.salary && recruit.salary !== '无'">
              <text class="info-label">薪资：</text>
              <text class="info-value">{{ recruit.salary }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">招聘人数：</text>
              <text class="info-value">{{ recruit.positions }}人</text>
            </view>
          </view>

          <!-- 截止时间 -->
          <view class="card-footer">
            <text class="deadline">截止时间：{{ formatTime(recruit.endTime) }}</text>
          </view>
        </view>

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
import { useStore } from 'vuex';

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
    return recruits.value.filter(recruit => recruit.isCollected);
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

const goToDetail = (recruitId) => {
  uni.navigateTo({
    url: `/pages/recruit/detail?id=${recruitId}`
  });
};

const formatTime = (timeString) => {
  const date = new Date(timeString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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
}

/* 分类栏样式 */
.category-tabs {
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;
  position: sticky;
  top: 0;
  z-index: 100;
}

.tabs-scroll {
  white-space: nowrap;
}

.tabs-container {
  display: flex;
  padding: 0 20rpx;
}

.tab-item {
  flex-shrink: 0;
  padding: 24rpx 32rpx;
  font-size: 28rpx;
  color: #666;
  position: relative;
  transition: all 0.3s;
}

.tab-item.active {
  color: #007aff;
  font-weight: 600;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background-color: #007aff;
  border-radius: 2rpx;
}

/* 招聘列表样式 */
.recruit-list {
  flex: 1;
}

.list-container {
  padding: 20rpx;
}

.recruit-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.recruit-card:active {
  transform: scale(0.98);
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24rpx;
}

.organization-info {
  display: flex;
  align-items: center;
}

.org-logo {
  width: 80rpx;
  height: 80rpx;
  border-radius: 12rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.logo-text {
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
}

.org-details {
  display: flex;
  flex-direction: column;
}

.org-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.publish-time {
  font-size: 24rpx;
  color: #999;
}

.tags {
  display: flex;
  gap: 12rpx;
}

.tag {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  font-weight: 500;
}

.hot-tag {
  background-color: #ff4757;
  color: #fff;
}

.recommend-tag {
  background-color: #ffa502;
  color: #fff;
}

/* 标题 */
.card-title {
  margin-bottom: 24rpx;
}

.title-text {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

/* 信息区域 */
.card-info {
  margin-bottom: 24rpx;
}

.info-item {
  display: flex;
  margin-bottom: 12rpx;
  align-items: center;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-size: 28rpx;
  color: #666;
  min-width: 120rpx;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

/* 底部 */
.card-footer {
  padding-top: 24rpx;
  border-top: 1px solid #f0f0f0;
}

.deadline {
  font-size: 24rpx;
  color: #999;
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