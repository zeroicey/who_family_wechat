<template>
  <view class="login-header">
    <image class="logo" :src="logoSrc"></image>
    <view class="app-name">{{ appName }}</view>
    <view class="app-slogan">{{ appSlogan }}</view>
  </view>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  logoSrc: {
    type: String,
    default: '/static/images/logo.png'
  },
  appName: {
    type: String,
    default: '互成一家'
  },
  appSlogan: {
    type: String,
    default: '校园互助与成长平台'
  }
});
</script>

<style lang="scss" scoped>
.login-header {
  margin-top: 3vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 10vw 0;
  z-index: 1;

  .logo {
    width: 25vw;
    height: 25vw;
    border-radius: 50%;
    background-color: #fff;
    padding: 2vw;
    box-shadow: 0 1vw 3vw rgba(0, 0, 0, 0.1);
  }

  .app-name {
    font-size: 7vw;
    font-weight: bold;
    color: #fff;
    margin-top: 3vw;
  }

  .app-slogan {
    font-size: 4vw;
    color: rgba(255, 255, 255, 0.9);
    margin-top: 2vw;
  }
}
</style>
