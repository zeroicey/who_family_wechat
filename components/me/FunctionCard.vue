<template>
  <view class="function-card">
    <view class="function-list">
      <view 
        class="function-item" 
        v-for="(item, index) in functionList" 
        :key="index" 
        @tap="navigateTo(item.url)"
      >
        <view class="item-left">
          <image :src="item.icon" class="function-icon" mode="aspectFit"></image>
          <text class="function-text">{{ item.text }}</text>
        </view>
        <text class="arrow">></text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

// 功能列表
const functionList = ref([
  {
    icon: '/static/images/me/address.png',
    text: '地址管理',
    url: '/pages/me/address/index'
  },
  {
    icon: '/static/images/me/help.png',
    text: '帮助中心',
    url: '/pages/me/help/index'
  },
  {
    icon: '/static/images/me/feedback.png',
    text: '意见反馈',
    url: '/pages/me/feedback/index'
  },
  {
    icon: '/static/images/me/settings.png',
    text: '设置',
    url: '/pages/me/settings/index'
  }
]);

// 导航到对应页面
const navigateTo = (url) => {
  uni.navigateTo({ url });
};
</script>

<style lang="scss" scoped>
.function-card {
  width: 95%;
  background-color: #fff;
  margin: 3vw auto;
  border-radius: 12px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  
  .function-list {
    .function-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4vw 5vw;
      border-bottom: 1px solid #f5f5f5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .item-left {
        display: flex;
        align-items: center;
      }
      
      .function-icon {
        width: 5vw;
        height: 5vw;
        margin-right: 3vw;
      }
      
      .function-text {
        font-size: 3.5vw;
        font-weight: 500;
        color: #333;
      }
      
      .arrow {
        color: #999;
        font-size: 3vw;
      }
    }
  }
}
</style>
