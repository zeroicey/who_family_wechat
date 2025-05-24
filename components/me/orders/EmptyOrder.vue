<template>
  <view class="empty-order">
    <image class="empty-icon" src="/static/images/orders/empty.png" mode="aspectFit"></image>
    <text class="empty-text">{{ emptyText }}</text>
    <button class="action-btn" @tap="navigateToHome">去逛逛</button>
  </view>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'all'
  }
});

// 根据不同类型展示不同的空状态文本
const emptyText = computed(() => {
  const textMap = {
    'all': '暂无任何订单',
    'unpaid': '暂无待付款订单',
    'undelivered': '暂无待发货订单',
    'delivered': '暂无待收货订单',
    'completed': '暂无已完成订单'
  };
  return textMap[props.type] || '暂无订单';
});

// 跳转到首页
const navigateToHome = () => {
  uni.switchTab({
    url: '/pages/home/index'
  });
};
</script>

<style lang="scss" scoped>
.empty-order {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15vw 0;
  
  .empty-icon {
    width: 25vw;
    height: 25vw;
    margin-bottom: 3vw;
  }
  
  .empty-text {
    font-size: 3.5vw;
    color: #999;
    margin-bottom: 5vw;
  }
  
  .action-btn {
    width: 30vw;
    height: 8vw;
    line-height: 8vw;
    background-color: #07c160;
    color: #fff;
    font-size: 3.5vw;
    border-radius: 8vw;
    border: none;
  }
}
</style>
