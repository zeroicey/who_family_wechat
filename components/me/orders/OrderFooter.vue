<template>
  <view class="order-footer">
    <view class="total-info">
      <text class="total-text">共{{ quantity }}件 合计:{{ " " }}</text>
      <text class="total-price">¥{{ totalPrice.toFixed(2) }}</text>
    </view>
    <view class="action-buttons">
      <button v-if="status === 'unpaid'" class="btn pay-btn" @tap.stop="$emit('pay')">去付款</button>
      <button v-if="status === 'delivered'" class="btn confirm-btn" @tap.stop="$emit('confirm')">确认收货</button>
      <button v-if="['delivered', 'undelivered'].includes(status)" class="btn normal-btn"
        @tap.stop="$emit('view-logistics')">查看物流</button>
    </view>
  </view>
</template>

<script setup>
const emit = defineEmits(['pay', 'confirm', 'view-logistics']);

const props = defineProps({
  status: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  totalPrice: {
    type: Number,
    required: true
  }
});
</script>

<style lang="scss" scoped>
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3vw 3vw 3vw 4vw;

  .total-info {
    display: flex;
    align-items: center;

    .total-text {
      font-size: 3.2vw;
      color: #666;
    }

    .total-price {
      font-size: 3.8vw;
      font-weight: bold;
      color: #ff6b00;
    }
  }

  .action-buttons {
    display: flex;

    .btn {
      height: 7vw;
      line-height: 7vw;
      padding: 0 3vw;
      margin-left: 2vw;
      border-radius: 7vw;
      font-size: 3vw;
      border: none;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;

      &:active {
        transform: scale(0.98);
        opacity: 0.9;
      }

      &.pay-btn {
        background-color: #ff6b00;
        color: #fff;
      }

      &.confirm-btn {
        background-color: #07c160;
        color: #fff;
      }

      &.normal-btn {
        background-color: #fff;
        color: #333;
        border: 1px solid #ddd;
      }
    }
  }
}
</style>
