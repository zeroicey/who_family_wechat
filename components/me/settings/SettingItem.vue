<template>
  <view class="setting-item" @tap="handleTap">
    <view class="left">
      <image v-if="icon" class="icon" :src="icon" mode="aspectFit"></image>
      <text class="label">{{ label }}</text>
    </view>
    <view class="right">
      <text v-if="value" class="value">{{ value }}</text>
      <text v-if="showArrow" class="arrow">&#xe605;</text>
      <switch v-if="type === 'switch'" :checked="checked" @change="handleSwitchChange" color="#07c160" />
    </view>
  </view>
</template>

<script setup>

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  showArrow: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: 'default' // default, switch
  },
  checked: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['tap', 'switch-change']);

const handleTap = () => {
  emit('tap');
};

const handleSwitchChange = (e) => {
  emit('switch-change', e.detail.value);
};
</script>

<style lang="scss" scoped>
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3.5vw 4vw;
  background-color: #fff;
  border-bottom: 1px solid #f5f5f5;

  .left {
    display: flex;
    align-items: center;

    .icon {
      width: 5vw;
      height: 5vw;
      margin-right: 3vw;
    }

    .label {
      font-size: 3.8vw;
      color: #333;
    }
  }

  .right {
    display: flex;
    align-items: center;

    .value {
      font-size: 3.5vw;
      color: #999;
      margin-right: 2vw;
    }

    .arrow {
      font-size: 3vw;
      color: #ccc;
    }
  }
}
</style>
