<template>
  <view class="me-container">
    <!-- 用户信息头部 -->
    <UserProfile />

    <!-- 版本信息 -->
    <view class="version-info">
      <text>版本 {{ appVersion }}</text>
    </view>
  </view>
</template>

<script setup>

import { computed } from 'vue';
import { useStore } from 'vuex';
import UserProfile from '@/components/me/UserProfile.vue';

const store = useStore();

const appVersion = computed(() => store.getters['appVersion']);
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