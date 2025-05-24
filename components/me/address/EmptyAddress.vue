<template>
  <view class="empty-address">
    <!-- 使用已有的图片资源 -->
    <image class="empty-icon" src="/static/images/me/address.png" mode="aspectFit"></image>
    <text class="empty-text">暂无收货地址</text>
    <button class="add-btn" @tap="addNewAddress">添加收货地址</button>
  </view>
</template>

<script setup>
const emit = defineEmits(['add']);

// 添加新地址
const addNewAddress = () => {
  emit('add');
};
</script>

<style lang="scss" scoped>
.empty-address {
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
  
  .add-btn {
    width: 45vw;
    height: 10vw;
    line-height: 10vw;
    background-color: #07c160;
    color: #fff;
    font-size: 3.5vw;
    border-radius: 10vw;
    border: none;
  }
}
</style>
