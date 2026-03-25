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
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 10px;
}

/* 第一行：类型标签 + 内容 */
.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.type-tag {
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 8px;
  flex-shrink: 0;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
}

.type-text {
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.type-green {
  border-color: #00cc6a;
}

.type-green .type-text {
  color: #00cc6a;
}

.type-orange {
  border-color: #ff9500;
}

.type-orange .type-text {
  color: #ff9500;
}

.type-blue {
  border-color: #007AFF;
}

.type-blue .type-text {
  color: #007AFF;
}

.type-red {
  border-color: #ff6b6b;
}

.type-red .type-text {
  color: #ff6b6b;
}

.type-purple {
  border-color: #5856d6;
}

.type-purple .type-text {
  color: #5856d6;
}

.type-yellow {
  border-color: #ffcc00;
}

.type-yellow .type-text {
  color: #ffcc00;
}

.type-gray {
  border-color: #999999;
}

.type-gray .type-text {
  color: #999999;
}

.content-text {
  font-size: 15px;
  color: #333333;
  line-height: 1.4;
  flex: 1;
}

/* 第二行：位置信息 */
.location-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  background-color: #f5f5f5;
  padding: 8px 12px;
  border-radius: 4px;
}

.icon {
  width: 16px;
  height: 16px;
}

.position-icon {
  margin-right: 6px;
}

.location-text {
  font-size: 14px;
  color: #666666;
}

/* 第三行：价格 + 状态 */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-section {
  display: flex;
  align-items: center;
}

.yuan-icon {
  margin-right: 4px;
}

.price-text {
  font-size: 18px;
  font-weight: bold;
  color: #ff9500;
}

.status-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-text {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 500;
}

.status-pending {
  color: #ff9500;
  background-color: rgba(255, 149, 0, 0.1);
}

.status-completed {
  color: #00cc6a;
  background-color: rgba(0, 204, 106, 0.1);
}

.status-cancelled {
  color: #999999;
  background-color: rgba(153, 153, 153, 0.1);
}

.more-icon {
  width: 20px;
  height: 20px;
  opacity: 0.6;
}
</style>
