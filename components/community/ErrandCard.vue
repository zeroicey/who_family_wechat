<template>
  <view class="errand-card" @click="$emit('click')">
    <!-- 第一行：类型标签 + 内容 -->
    <view class="card-header">
      <view :class="['type-tag', typeClass]">
        <text class="type-text">{{ task.type }}</text>
      </view>
      <text class="content-text">{{ task.content }}</text>
    </view>

    <!-- 第二行：位置信息 -->
    <view class="location-row">
      <image src="/static/images/community/position.svg" class="icon position-icon" mode="aspectFit" />
      <text class="location-text">{{ task.from }} → {{ task.to }}</text>
    </view>

    <!-- 第三行：价格 + 状态 -->
    <view class="card-footer">
      <view class="price-section">
        <image src="/static/images/community/yuan.svg" class="icon yuan-icon" mode="aspectFit" />
        <text class="price-text">{{ task.price }}</text>
      </view>
      <view class="status-section">
        <text :class="['status-text', statusClass]">{{ statusText }}</text>
        <image src="/static/images/community/more.svg" class="icon more-icon" mode="aspectFit" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';

// 定义 props
const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});

// 定义 emits
defineEmits(['click']);

// 跑腿类型对应的颜色类
const typeClass = computed(() => {
  const typeColorMap = {
    '校园跑腿': 'type-green',
    '快递代取': 'type-orange',
    '快递到寝': 'type-blue',
    '东南门代拿': 'type-red',
    '东北门代拿': 'type-purple',
    '西门代拿': 'type-yellow',
    '其他跑腿': 'type-gray'
  };
  return typeColorMap[props.task.type] || 'type-gray';
});

// 订单状态对应的文字
const statusText = computed(() => {
  const statusTextMap = {
    'pending': '待接单',
    'completed': '订单完成',
    'cancelled': '已取消'
  };
  return statusTextMap[props.task.status] || '未知状态';
});

// 订单状态对应的颜色类
const statusClass = computed(() => {
  const statusColorMap = {
    'pending': 'status-pending',
    'completed': 'status-completed',
    'cancelled': 'status-cancelled'
  };
  return statusColorMap[props.task.status] || '';
});
</script>

<style scoped>
.errand-card {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 24rpx;
  box-shadow: var(--shadow-soft);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 14rpx;
}

.type-tag {
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  flex-shrink: 0;
  border: 1rpx solid;
  display: flex;
  align-items: center;
  justify-content: center;
}

.type-text {
  font-size: 20rpx;
  font-weight: 600;
  text-align: center;
}

.type-green { border-color: #22c55e; }
.type-green .type-text { color: #22c55e; }
.type-orange { border-color: #f59e0b; }
.type-orange .type-text { color: #f59e0b; }
.type-blue { border-color: #3b82f6; }
.type-blue .type-text { color: #3b82f6; }
.type-red { border-color: #ef4444; }
.type-red .type-text { color: #ef4444; }
.type-purple { border-color: #8b5cf6; }
.type-purple .type-text { color: #8b5cf6; }
.type-yellow { border-color: #eab308; }
.type-yellow .type-text { color: #eab308; }
.type-gray { border-color: #94a3b8; }
.type-gray .type-text { color: #94a3b8; }

.content-text {
  font-size: 26rpx;
  color: var(--text-primary);
  line-height: 1.5;
  flex: 1;
}

.location-row {
  display: flex;
  align-items: center;
  margin-bottom: 14rpx;
  background-color: #f8faff;
  padding: 12rpx 14rpx;
  border-radius: 16rpx;
}

.icon {
  width: 32rpx;
  height: 32rpx;
}

.position-icon {
  margin-right: 8rpx;
}

.location-text {
  font-size: 24rpx;
  color: var(--text-secondary);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-section,
.status-section {
  display: flex;
  align-items: center;
}

.price-section { gap: 6rpx; }
.status-section { gap: 10rpx; }

.price-text {
  font-size: 30rpx;
  font-weight: 700;
  color: #f59e0b;
}

.status-text {
  font-size: 20rpx;
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  font-weight: 600;
}

.status-pending {
  color: #f59e0b;
  background-color: rgba(245, 158, 11, 0.1);
}

.status-completed {
  color: #22c55e;
  background-color: rgba(34, 197, 94, 0.1);
}

.status-cancelled {
  color: #94a3b8;
  background-color: rgba(148, 163, 184, 0.12);
}

.more-icon {
  width: 28rpx;
  height: 28rpx;
  opacity: 0.6;
}
</style>
