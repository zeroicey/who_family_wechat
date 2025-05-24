<template>
  <view class="order-item" @tap="$emit('view-detail', order.id)">
    <!-- 订单头部 -->
    <OrderHeader 
      :order-number="order.orderNumber" 
      :create-time="order.createTime" 
      :status="order.status" 
    />

    <!-- 订单内容 -->
    <OrderContent 
      :product-name="order.productName"
      :product-desc="order.productDesc"
      :product-image="order.productImage"
      :price="order.price"
      :quantity="order.quantity"
    />

    <!-- 订单底部 -->
    <OrderFooter 
      :status="order.status"
      :quantity="order.quantity"
      :total-price="order.totalPrice"
      @pay="$emit('pay', order.id)"
      @confirm="$emit('confirm', order.id)"
      @view-logistics="$emit('view-logistics', order.id)"
    />
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
// 导入拆分后的子组件
import OrderHeader from './OrderHeader.vue';
import OrderContent from './OrderContent.vue';
import OrderFooter from './OrderFooter.vue';

// 定义事件
const emit = defineEmits(['view-detail', 'pay', 'confirm', 'view-logistics']);

// 定义属性
const props = defineProps({
  order: {
    type: Object,
    required: true
  }
});
</script>

<style lang="scss" scoped>
.order-item {
  width: 100%;
  background-color: #fff;
  margin-bottom: 2vw;
  padding: 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 0.5vw;
    height: 100%;
    background-color: #07c160;
    opacity: 0.5;
  }
}
</style>
