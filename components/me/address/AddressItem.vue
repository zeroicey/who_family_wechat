<template>
  <view class="address-item" @tap="selectAddress">
    <view class="content">
      <view class="info-wrapper">
        <view class="user-info">
          <text class="name">{{ address.name }}</text>
          <text class="phone">{{ address.phone }}</text>
          <view v-if="address.isDefault" class="default-tag">默认</view>
        </view>
        <view class="address-info">
          <text class="address-text">{{ fullAddress }}</text>
        </view>
      </view>
      <view class="action-wrapper">
        <view class="edit-btn" @tap.stop="editAddress">
          <text class="edit-icon">&#xe60d;</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  address: {
    type: Object,
    required: true
  },
  selectable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['select', 'edit']);

// 计算完整地址
const fullAddress = computed(() => {
  const { province, city, district, address } = props.address;
  return `${province}${city}${district}${address}`;
});

// 选择地址
const selectAddress = () => {
  if (props.selectable) {
    emit('select', props.address);
  }
};

// 编辑地址
const editAddress = () => {
  emit('edit', props.address);
};
</script>

<style lang="scss" scoped>
.address-item {
  background-color: #fff;
  padding: 4vw;
  margin-bottom: 2vw;
  
  .content {
    display: flex;
    justify-content: space-between;
    
    .info-wrapper {
      flex: 1;
      padding-right: 3vw;
      
      .user-info {
        display: flex;
        align-items: center;
        margin-bottom: 2vw;
        
        .name {
          font-size: 4vw;
          font-weight: 500;
          color: #333;
          margin-right: 3vw;
        }
        
        .phone {
          font-size: 3.5vw;
          color: #666;
          margin-right: 3vw;
        }
        
        .default-tag {
          padding: 0.5vw 1.5vw;
          background-color: #f0f9eb;
          border: 1px solid #07c160;
          border-radius: 2vw;
          font-size: 2.8vw;
          color: #07c160;
        }
      }
      
      .address-info {
        .address-text {
          font-size: 3.5vw;
          color: #333;
          line-height: 1.5;
        }
      }
    }
    
    .action-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      
      .edit-btn {
        width: 8vw;
        height: 8vw;
        display: flex;
        justify-content: center;
        align-items: center;
        
        .edit-icon {
          font-size: 5vw;
          color: #999;
        }
      }
    }
  }
}
</style>
