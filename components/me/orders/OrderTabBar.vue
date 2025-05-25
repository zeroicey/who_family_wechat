<template>
  <view class="order-tab-bar">
    <view v-for="(tab, index) in tabs" :key="index" class="tab-item" :class="{ 'active': activeTab === tab.value }"
      @tap="changeTab(tab.value)">
      <text class="tab-text">{{ tab.label }}</text>
      <view class="tab-indicator" v-if="activeTab === tab.value"></view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  activeTab: {
    type: String,
    default: 'all'
  }
});

const emit = defineEmits(['update:activeTab']);

const tabs = [
  { label: '全部', value: 'all' },
  { label: '待付款', value: 'unpaid' },
  { label: '待发货', value: 'undelivered' },
  { label: '待收货', value: 'delivered' },
  { label: '已完成', value: 'completed' }
];

const changeTab = (tab) => {
  emit('update:activeTab', tab);
};
</script>

<style lang="scss" scoped>
.order-tab-bar {
  display: flex;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;

  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 12vw;
    position: relative;

    .tab-text {
      font-size: 3.5vw;
      color: #666;
      line-height: 12vw;
    }

    .tab-indicator {
      position: absolute;
      bottom: 0;
      width: 10vw;
      height: 0.6vw;
      background-color: #07c160;
      border-radius: 0.3vw;
    }

    &.active {
      .tab-text {
        color: #07c160;
        font-weight: 500;
      }
    }
  }
}
</style>
