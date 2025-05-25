<template>
  <view class="setting-group">
    <view v-if="title" class="group-title">{{ title }}</view>
    <view class="group-content">
      <slot></slot>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
});
</script>

<style lang="scss" scoped>
.setting-group {
  margin-bottom: 3vw;

  .group-title {
    padding: 3vw 4vw 2vw;
    font-size: 3.2vw;
    color: #999;
  }

  .group-content {
    background-color: #fff;
    border-radius: 4px;
    overflow: hidden;
  }
}
</style>
