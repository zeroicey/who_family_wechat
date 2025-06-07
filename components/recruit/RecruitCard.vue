<template>
  <view class="recruit-card" @click="handleClick">
    <!-- 头部区域：logo + 标题组织标签 -->
    <view class="recruit-card__header">
      <!-- 组织logo -->
      <view class="recruit-card__logo">
        <text class="recruit-card__logo-text">{{ recruit.organizationName.charAt(0) }}</text>
      </view>
      
      <!-- 右侧内容区域 -->
      <view class="recruit-card__header-content">
        <!-- 标题 -->
        <view class="recruit-card__title">{{ recruit.name }}</view>
        
        <!-- 组织信息 -->
        <view class="recruit-card__org">{{ recruit.organizationName }}</view>
        
        <!-- 标签 -->
        <view class="recruit-card__tags">
          <text class="recruit-card__tag recruit-card__tag--type">活动招募</text>
          <text v-if="recruit.isHot === 'true'" class="recruit-card__tag recruit-card__tag--hot">热门</text>
        </view>
      </view>
    </view>
    
    <!-- 描述文本 -->
    <view class="recruit-card__desc">第十届校园歌手大赛即将举行，现招募活动志愿者，负责活动现场秩序维护，选手引导，观众服务等工作。</view>
    
    <!-- 统计信息 -->
    <view class="recruit-card__footer">
      <view class="recruit-card__positions">
        <view class="recruit-card__positions-item">
          <text class="recruit-card__positions-label">招募</text>
          <text class="recruit-card__positions-value">{{ recruit.positions }}人</text>
        </view>
        <view class="recruit-card__positions-item">
          <text class="recruit-card__positions-label">已申请</text>
          <text class="recruit-card__positions-value">12人</text>
        </view>
      </view>
      <view class="recruit-card__deadline">
        <text class="recruit-card__deadline-label">截止日期</text>
        <text class="recruit-card__deadline-value">{{ formatTime(recruit.endTime) }}</text>
      </view>
    </view>
    
    <!-- 申请按钮 -->
    <view class="recruit-card__btn" @click.stop="handleClick">
      <text class="recruit-card__btn-text">立即申请</text>
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

<style lang="scss" scoped>
.recruit-card {
  width: 100%;
  background-color: #ffffff;
  border-radius: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.06);
  margin-bottom: 40rpx;
  padding: 36rpx;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
  }
  
  &__header {
    display: flex;
    align-items: flex-start;
    margin-bottom: 32rpx;
  }
  
  &__logo {
    width: 120rpx;
    height: 120rpx;
    background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24rpx;
    flex-shrink: 0;
    box-shadow: 0 8rpx 24rpx rgba(168, 237, 234, 0.3);
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%);
      border-radius: 20rpx;
    }
    
    &-text {
      color: #fff;
      font-size: 52rpx;
      font-weight: 700;
      text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.2);
      position: relative;
      z-index: 1;
    }
  }
  
  &__header-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  &__title {
    font-size: 36rpx;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 8rpx;
    line-height: 1.3;
    text-align: left;
    letter-spacing: -0.5rpx;
  }
  
  &__org {
    font-size: 26rpx;
    color: #8a8a8a;
    text-align: left;
    margin-bottom: 16rpx;
    font-weight: 500;
    display: flex;
    align-items: center;
    
    &::before {
      content: '';
      width: 6rpx;
      height: 6rpx;
      background: #a8edea;
      border-radius: 50%;
      margin-right: 12rpx;
    }
  }
  
  &__tags {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  
  &__tag {
    font-size: 24rpx;
    padding: 6rpx 20rpx;
    border-radius: 20rpx;
    margin-right: 16rpx;
    margin-bottom: 8rpx;
    font-weight: 500;
    
    &--type {
      background-color: #e6f7ff;
      color: #1890ff;
    }
    
    &--hot {
      background-color: #fff2e8;
      color: #fa541c;
    }
  }
  
  &__desc {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
    margin-bottom: 32rpx;
    text-align: justify;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f9fafc;
    border-radius: 24rpx;
    padding: 24rpx;
    margin-bottom: 36rpx;
  }
  
  &__positions {
    display: flex;
    
    &-item {
      display: flex;
      flex-direction: column;
      margin-right: 40rpx;
    }
    
    &-label {
      font-size: 24rpx;
      color: #999;
      margin-bottom: 8rpx;
    }
    
    &-value {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
    }
  }
  
  &__deadline {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    
    &-label {
      font-size: 24rpx;
      color: #999;
      margin-bottom: 8rpx;
    }
    
    &-value {
      font-size: 28rpx;
      color: #fa8c16;
      font-weight: 500;
    }
  }
  
  &__btn {
    height: 80rpx;
    border-radius: 40rpx;
    background: linear-gradient(90deg, #1890ff, #36a6ff);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    box-shadow: 0 8rpx 24rpx rgba(24, 144, 255, 0.3);
    
    &:active {
      background: linear-gradient(90deg, #0c80f0, #1890ff);
      transform: translateY(4rpx);
      box-shadow: 0 4rpx 12rpx rgba(24, 144, 255, 0.3);
    }
    
    &-text {
      color: #fff;
      font-size: 32rpx;
      font-weight: 500;
    }
  }
}
</style>