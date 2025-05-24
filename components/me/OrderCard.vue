<template>
  <view class="order-card">
    <view class="order-entry" @tap="navigateToAllOrders">
      <view class="order-left">
        <image src="/static/images/orders/all-orders.png" mode="aspectFit" class="order-icon"></image>
        <text class="order-text">我的订单</text>
      </view>
      <text class="order-arrow">></text>
    </view>
  </view>
</template>

<script setup>
import { useStore } from 'vuex';

const store = useStore();

// 导航到全部订单页面
const navigateToAllOrders = () => {
  uni.navigateTo({
    url: '/pages/me/orders/index'
  });
};
</script>

<style lang="scss" scoped>
.order-card {
  width: 95%;
  background-color: #fff;
  margin: 3vw auto;
  border-radius: 12px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  
  .order-entry {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4vw 5vw;
    
    .order-left {
      display: flex;
      align-items: center;
      
      .order-icon {
        width: 5vw;
        height: 5vw;
        margin-right: 3vw;
      }
      
      .order-text {
        font-size: 3.5vw;
        font-weight: 500;
        color: #333;
      }
    }
    
    .order-arrow {
      color: #999;
      font-size: 3vw;
    }
  }
}</style>
