<template>
  <view class="address-management-page">
    <!-- 地址列表 -->
    <view v-if="addresses.length > 0" class="address-list">
      <view v-for="address in addresses" :key="address.id" class="address-item">
        <view class="address-info" @click="setDefault(address.id)">
          <view class="contact-info">
            <text class="name">{{ address.name }}</text>
            <text class="phone">{{ address.phone }}</text>
          </view>
          <view class="full-address">
            <text v-if="address.isDefault" class="default-tag">[默认]</text>
            <text class="alias">{{ address.alias }}</text>
            {{ address.fullAddress }}
          </view>
        </view>
        <view class="actions">
          <button class="edit-btn" @click="editAddress(address.id)">编辑</button>
          <button class="delete-btn" @click="deleteAddress(address.id)">删除</button>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="empty-state">
      <image src="/static/images/me/address_empty.svg" class="empty-icon" />
      <text class="empty-text">还没有收货地址，快去添加一个吧</text>
    </view>

    <!-- 新增按钮 -->
    <button class="add-address-btn" @click="addAddress">新增收货地址</button>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { onShow } from '@dcloudio/uni-app';

const store = useStore();

const addresses = computed(() => store.getters['address/get_addresses']);

onShow(() => {
  store.dispatch('address/load_addresses');
});

const addAddress = () => {
  uni.navigateTo({ url: '/pages/me/address/create' });
};

const editAddress = (id) => {
  uni.navigateTo({ url: `/pages/me/address/update?id=${id}` });
};

const deleteAddress = (id) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个地址吗？',
    success: (res) => {
      if (res.confirm) {
        store.dispatch('address/delete_address', id);
      }
    },
  });
};

const setDefault = (id) => {
  store.dispatch('address/set_default_address', id);
};
</script>

<style lang="scss" scoped>
.address-management-page {
  padding: 20rpx;
  background-color: #f7f7f7;
  min-height: 100vh;
}

.address-list {
  .address-item {
    background-color: #fff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    padding: 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

    .address-info {
      flex: 1;
      .contact-info {
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;
        .name {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
        }
        .phone {
          font-size: 28rpx;
          color: #888;
          margin-left: 20rpx;
        }
      }
      .full-address {
        font-size: 28rpx;
        color: #666;
        .default-tag {
          color: #ff5722;
          font-weight: bold;
          margin-right: 10rpx;
        }
        .alias {
          background-color: #f0f0f0;
          color: #888;
          font-size: 24rpx;
          padding: 4rpx 12rpx;
          border-radius: 8rpx;
          margin-right: 10rpx;
        }
      }
    }

    .actions {
      display: flex;
      align-items: center;
      .edit-btn,
      .delete-btn {
        background: none;
        border: none;
        padding: 0 20rpx;
        font-size: 28rpx;
        color: #007aff;
        &::after {
          border: none;
        }
      }
      .delete-btn {
        color: #ff3b30;
      }
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
  .empty-icon {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 30rpx;
  }
  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}

.add-address-btn {
  position: fixed;
  bottom: 40rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 90rpx;
  background-color: #007aff;
  color: #fff;
  border-radius: 45rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  box-shadow: 0 8rpx 16rpx rgba(0, 122, 255, 0.3);
}
</style>