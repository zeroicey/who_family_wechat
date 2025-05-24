<template>
  <view class="loading-container">
    <view class="loading-spinner">
      <view 
        class="loading-circle" 
        v-for="(item, index) in 12" 
        :key="index" 
        :style="{animationDelay: (index * 0.1) + 's'}"
      ></view>
    </view>
    <view class="loading-text">{{ loadingText }}</view>
  </view>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  loadingText: {
    type: String,
    default: '正在加载中...'
  }
});
</script>

<style lang="scss" scoped>
.loading-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90vw;
  background-color: #fff;
  border-radius: 4vw;
  padding: 10vw 0;
  margin-top: 5vw;
  box-shadow: 0 1vw 3vw rgba(0, 0, 0, 0.05);
  z-index: 2;
  
  .loading-spinner {
    position: relative;
    width: 15vw;
    height: 15vw;
  }
  
  .loading-circle {
    position: absolute;
    top: 0;
    left: 50%;
    width: 1.5vw;
    height: 4vw;
    background-color: #3498db;
    border-radius: 1vw;
    transform-origin: 0 7.5vw;
    animation: loading 1.2s infinite linear;
    
    @for $i from 1 through 12 {
      &:nth-child(#{$i}) {
        transform: rotate(#{$i * 30}deg);
        opacity: #{1 - ($i - 1) * 0.08};
      }
    }
  }
  
  .loading-text {
    font-size: 4vw;
    color: #666;
    margin-top: 5vw;
  }
}

@keyframes loading {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}
</style>
