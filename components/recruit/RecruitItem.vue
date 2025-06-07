<template>
  <view class="recruit-item" @click="goToDetail">
    <view class="recruit-item__header">
      <image class="recruit-item__logo" :src="item.logo || 'https://placekitten.com/200/200'" mode="aspectFill"></image>
      <view class="recruit-item__info">
        <view class="recruit-item__title">{{ item.title }}</view>
        <view class="recruit-item__org">
          <text class="recruit-item__org-name">{{ item.organization }}</text>
        </view>
        <view class="recruit-item__tags">
          <text class="recruit-item__tag recruit-item__tag--type">{{ getTypeName(item.type) }}</text>
          <text v-if="item.isHot" class="recruit-item__tag recruit-item__tag--hot">热门</text>
          <text v-if="item.isRecommended" class="recruit-item__tag recruit-item__tag--recommend">推荐</text>
        </view>
      </view>
    </view>
    <view class="recruit-item__content">
      <view class="recruit-item__desc">{{ item.description }}</view>
      <view class="recruit-item__footer">
        <view class="recruit-item__positions">
          <view class="recruit-item__positions-item">
            <text class="recruit-item__positions-label">招募</text>
            <text class="recruit-item__positions-value">{{ item.positions }}人</text>
          </view>
          <view class="recruit-item__positions-item">
            <text class="recruit-item__positions-label">已申请</text>
            <text class="recruit-item__positions-value">{{ item.applied }}人</text>
          </view>
        </view>
        <view class="recruit-item__deadline">
          <text class="recruit-item__deadline-label">截止日期</text>
          <text class="recruit-item__deadline-value">{{ formatDate(item.deadline) }}</text>
        </view>
      </view>
    </view>
    <view class="recruit-item__actions">
      <button class="recruit-item__btn recruit-item__btn--apply" @click.stop="handleApply">立即申请</button>
      <button class="recruit-item__btn recruit-item__btn--favorite" @click.stop="handleFavorite">
        <text class="iconfont" :class="isFavorite ? 'icon-star-filled' : 'icon-star'"></text>
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  favorites: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['apply', 'favorite', 'detail']);

// 计算是否已收藏
const isFavorite = computed(() => {
  return props.favorites.some(fav => fav.recruitId === props.item.id);
});

// 获取岗位类型名称
const getTypeName = (type) => {
  const typeMap = {
    1: '社团招新',
    2: '活动招募',
    3: '志愿者岗位'
  };
  return typeMap[type] || '其他';
};

// 格式化日期
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 跳转到详情页
const goToDetail = () => {
  emit('detail', props.item.id);
};

// 申请岗位
const handleApply = () => {
  emit('apply', props.item.id);
};

// 收藏/取消收藏
const handleFavorite = () => {
  emit('favorite', props.item.id);
};
</script>

<style lang="scss" scoped>
.recruit-item {
  width: 100%;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
  padding: 18px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  

  
  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }
  
  &__logo {
    width: 64px;
    height: 64px;
    border-radius: 12px;
    margin-right: 14px;
    background-color: #f5f5f5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  &__info {
    flex: 1;
  }
  
  &__title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 6px;
    line-height: 1.4;
  }
  
  &__org {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    
    &-name {
      font-size: 14px;
      color: #666;
      background-color: #f5f7fa;
      padding: 2px 8px;
      border-radius: 10px;
    }
  }
  
  &__tags {
    display: flex;
    flex-wrap: wrap;
  }
  
  &__tag {
    font-size: 12px;
    padding: 3px 10px;
    border-radius: 10px;
    margin-right: 8px;
    margin-bottom: 4px;
    font-weight: 500;
    
    &--type {
      background-color: #e6f7ff;
      color: #1890ff;
    }
    
    &--hot {
      background-color: #fff2e8;
      color: #fa541c;
    }
    
    &--recommend {
      background-color: #f6ffed;
      color: #52c41a;
    }
  }
  
  &__content {
    margin-bottom: 18px;
    border-top: 1px dashed #f0f0f0;
    padding-top: 16px;
  }
  
  &__desc {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin-bottom: 16px;
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
    border-radius: 12px;
    padding: 12px;
  }
  
  &__positions {
    display: flex;
    
    &-item {
      display: flex;
      flex-direction: column;
      margin-right: 20px;
    }
    
    &-label {
      font-size: 12px;
      color: #999;
      margin-bottom: 4px;
    }
    
    &-value {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }
  }
  
  &__deadline {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    
    &-label {
      font-size: 12px;
      color: #999;
      margin-bottom: 4px;
    }
    
    &-value {
      font-size: 14px;
      color: #fa8c16;
      font-weight: 500;
    }
  }
  
  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  &__btn {
    height: 40px;
    border-radius: 20px;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    
    &--apply {
      flex: 1;
      background: linear-gradient(90deg, #1890ff, #36a6ff);
      color: #fff;
      margin-right: 12px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
      
      &:active {
        background: linear-gradient(90deg, #0c80f0, #1890ff);
        transform: translateY(2px);
        box-shadow: 0 2px 6px rgba(24, 144, 255, 0.3);
      }
    }
    
    &--favorite {
      width: 40px;
      padding: 0;
      background-color: #f5f5f5;
      color: #666;
      
      .icon-star-filled {
        color: #faad14;
      }
      
      &:active {
        background-color: #f0f0f0;
      }
    }
  }
}
</style>
