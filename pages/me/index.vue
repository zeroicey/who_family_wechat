<template>
  <view class="me-container">
    <!-- 用户信息头部 -->
    <UserProfile />

    <!-- 快捷导航卡片 -->
    <QuickNav />

    <!-- 核心功能区：任务待办、习惯打卡、专注时刻 -->
    <CoreFunctions />
  </view>
</template>

<script setup>
import UserProfile from '@/components/me/UserProfile.vue';
import QuickNav from '@/components/me/QuickNav.vue';
import CoreFunctions from '@/components/me/CoreFunctions.vue';
</script>

<style lang="scss" scoped>
.me-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
  padding-bottom: 2vh;
}
</style>