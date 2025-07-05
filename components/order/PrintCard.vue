<template>
  <div class="order-card print-card">
    <div class="card-header">
      <div class="order-type">
        <uni-icons type="printer-filled" size="20" color="#2979ff"></uni-icons>
        <span class="type-text">文件打印</span>
      </div>
      <div :class="['order-status', statusClass]">{{ order.status }}</div>
    </div>
    <div class="card-body">
      <div class="info-row">
        <span class="label">订单号:</span>
        <span class="value">{{ order.id }}</span>
      </div>
      <div class="info-row">
        <span class="label">收货地址:</span>
        <span class="value">{{ order.data.addressDetails }}</span>
      </div>
      <div class="info-row">
        <span class="label">打印份数:</span>
        <span class="value">{{ order.data.copies }} 份</span>
      </div>
      <div class="info-row">
        <span class="label">创建时间:</span>
        <span class="value">{{ formattedCreatedAt }}</span>
      </div>
    </div>
    <div class="card-footer">
      <button v-if="canCancel" class="action-btn cancel-btn">取消订单</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
});

const statusClass = computed(() => {
  switch (props.order.status) {
    case '待支付':
      return 'status-pending';
    case '待完成':
      return 'status-processing';
    case '已完成':
      return 'status-completed';
    case '已取消':
      return 'status-cancelled';
    default:
      return '';
  }
});

const formattedCreatedAt = computed(() => {
  return new Date(props.order.createdAt).toLocaleString();
});

const canCancel = computed(() => {
  return ['待支付', '待完成'].includes(props.order.status);
});
</script>

<style lang="scss" scoped>
.order-card {
  background-color: #ffffff;
  border-radius: 12px;
  margin: 16px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.order-type {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: #333;

  .type-text {
    margin-left: 8px;
  }
}

.order-status {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;

  &.status-pending {
    background-color: #fffbe6;
    color: #faad14;
  }
  &.status-processing {
    background-color: #e6f7ff;
    color: #1890ff;
  }
  &.status-completed {
    background-color: #f6ffed;
    color: #52c41a;
  }
  &.status-cancelled {
    background-color: #f5f5f5;
    color: #bfbfbf;
  }
}

.card-body {
  padding: 16px 0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 12px;

  .label {
    color: #888;
  }

  .value {
    color: #333;
    font-weight: 500;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  gap: 10px;
}

.action-btn {
  padding: 6px 16px;
  border: none;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &.detail-btn {
    background-color: #2979ff;
    color: white;

    &:hover {
      background-color: #1c6ee5;
    }
  }

  &.cancel-btn {
    background-color: #f5f5f5;
    color: #888;

    &:hover {
      background-color: #e0e0e0;
    }
  }
}
</style>