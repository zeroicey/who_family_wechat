<template>
  <view class="recruit-card" @click="handleClick">
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
</template>

<script setup>
// Props
const props = defineProps({
  recruit: {
    type: Object,
    required: true
  }
});

// Emits
const emit = defineEmits(['click']);

// 方法
const handleClick = () => {
  emit('click', props.recruit.id);
};

const formatTime = (timeString) => {
  const date = new Date(timeString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
</script>

<style scoped>
.recruit-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.recruit-card:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.12);
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
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
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
  background-color: #ff6b6b;
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
</style>