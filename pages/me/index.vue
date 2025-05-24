<template>
  <view class="me-container">
    <!-- 用户信息头部 -->
    <UserProfile />

    <!-- 快捷导航卡片 -->
    <QuickNav />

    <!-- 服务卡片 -->
    <ServiceCard />

    <!-- 版本信息 -->
    <view class="version-info">
      <text>版本 1.0.0</text>
    </view>
  </view>
</template>

<script setup>
// 引入组件
import UserProfile from '@/components/me/UserProfile.vue';
import QuickNav from '@/components/me/QuickNav.vue';
import ServiceCard from '@/components/me/ServiceCard.vue';
</script>

<style lang="scss" scoped>
.me-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
  padding-bottom: 2vh;

  .version-info {
    text-align: center;
    padding: 4vw 0;
    color: #999;
    font-size: 3vw;
  }
}
</style>