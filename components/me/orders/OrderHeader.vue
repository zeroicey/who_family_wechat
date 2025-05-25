<template>
  <view class="order-header">
    <view class="order-info">
      <text class="order-label">订单号: </text>
      <text class="order-number">{{ orderNumber }}</text>
      <text class="order-time">{{ formatTime(createTime) }}</text>
    </view>
    <view class="order-status">
      <text :class="['status-text', `status-${status}`]">
        {{ statusText }}
      </text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({
  orderNumber: {
    type: String,
    required: true
  },
  createTime: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  }
});

// 计算属性：状态文本
const statusText = computed(() => {
  return store.getters['order/getStatusText'](props.status);
});

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
</script>

<style lang="scss" scoped>
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3vw 3vw 3vw 4vw;
  border-bottom: 1px solid #f5f5f5;

  .order-info {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .order-label {
      font-size: 3.2vw;
      color: #999;
    }

    .order-number {
      font-size: 3.2vw;
      color: #333;
      margin-right: 2vw;
    }

    .order-time {
      font-size: 3vw;
      color: #999;
    }
  }

  .order-status {
    .status-text {
      font-size: 3.2vw;
      font-weight: 500;
      padding: 1vw 2vw;
      border-radius: 3vw;

      &.status-unpaid {
        color: #ff6b00;
        background-color: rgba(255, 107, 0, 0.1);
      }

      &.status-undelivered {
        color: #07c160;
        background-color: rgba(7, 193, 96, 0.1);
      }

      &.status-delivered {
        color: #1890ff;
        background-color: rgba(24, 144, 255, 0.1);
      }

      &.status-completed {
        color: #999;
        background-color: rgba(153, 153, 153, 0.1);
      }

      &.status-cancelled {
        color: #999;
        background-color: rgba(153, 153, 153, 0.1);
      }
    }
  }
}
</style>
