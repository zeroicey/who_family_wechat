<template>
  <view class="footer">
    <text>{{ copyright }}</text>
  </view>
</template>

<script setup>

const props = defineProps({
  copyright: {
    type: String,
    default: '© 2025 互成一家 - 校园互助与成长平台'
  }
});
</script>

<style lang="scss" scoped>
.footer {
  position: relative;
  margin-top: auto;
  padding: 5vw 0;
  z-index: 1;

  text {
    font-size: 3vw;
    color: #999;
  }
}
</style>
