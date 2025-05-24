<template>
  <view class="service-card">
    <view class="card-header">
      <text class="title">推荐服务</text>
    </view>
    
    <view class="service-grid">
      <view class="service-item" v-for="(item, index) in serviceList" :key="index" @tap="navigateTo(item.url)">
        <view class="item-content">
          <view class="icon-area">
            <image :src="item.icon" class="service-icon" mode="aspectFit"></image>
          </view>
          <view class="info-area">
            <text class="service-name">{{ item.name }}</text>
            <text class="service-desc" v-if="item.desc">有车的人就用TA</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { userServices } from '@/mock/user';

// 服务列表
const serviceList = ref([]);

onMounted(() => {
  // 实际项目中可以通过API获取服务列表
  serviceList.value = userServices;
});

// 导航到对应页面
const navigateTo = (url) => {
  uni.navigateTo({ url });
};
</script>

<style lang="scss" scoped>
.service-card {
  width: 95%;
  background-color: #fff;
  margin: 3vw auto;
  padding-bottom: 2vw;
  border-radius: 12px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  
  .card-header {
    padding: 4vw 5vw 2vw;
    
    .title {
      font-size: 4vw;
      font-weight: 600;
      color: #333;
    }
  }
  
  .service-grid {
    display: flex;
    flex-wrap: wrap;
    padding: 0 3vw;
    
    .service-item {
      width: 50%;
      padding: 2vw 2vw;
      box-sizing: border-box;
      margin-bottom: 2vw;
      
      .item-content {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 3vw;
        display: flex;
        align-items: center;
        min-height: 22vw;
        position: relative;
        overflow: hidden;
      }
      
      .icon-area {
        margin-right: 3vw;
        
        .service-icon {
          width: 10vw;
          height: 10vw;
          background-color: #fff;
          border-radius: 50%;
          padding: 1.5vw;
        }
      }
      
      .info-area {
        flex: 1;
        display: flex;
        flex-direction: column;
        
        .service-name {
          font-size: 3.5vw;
          font-weight: 500;
          color: #333;
          margin-bottom: 1vw;
        }
        
        .service-desc {
          font-size: 2.8vw;
          color: #999;
        }
      }
    }
  }
}
</style>
