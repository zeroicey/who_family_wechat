<template>
  <view class="login-bg" :style="bgStyle"></view>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  startColor: {
    type: String,
    default: '#3498db'
  },
  endColor: {
    type: String,
    default: '#1abc9c'
  },
  height: {
    type: String,
    default: '50vh'
  }
});

const bgStyle = computed(() => {
  return {
    background: `linear-gradient(135deg, ${props.startColor}, ${props.endColor})`,
    height: props.height
  };
});
</script>

<style lang="scss" scoped>
.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border-bottom-left-radius: 10vw;
  border-bottom-right-radius: 10vw;
  z-index: 0;
}
</style>
