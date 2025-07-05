<template>
  <view class="address-form-page">
    <form @submit.prevent="saveAddress">
      <view class="form-group">
        <label class="form-label">地址别名</label>
        <input v-model="form.alias" class="form-input" placeholder="如：家、学校" />
      </view>

      <view class="form-group">
        <label class="form-label">收货人姓名</label>
        <input v-model="form.name" class="form-input" placeholder="请填写收货人姓名" />
      </view>

      <view class="form-group">
        <label class="form-label">手机号码</label>
        <input v-model="form.phone" type="number" class="form-input" placeholder="请填写收货人手机号" />
      </view>

      <view class="form-group">
        <label class="form-label">详细地址</label>
        <textarea v-model="form.fullAddress" class="form-textarea" placeholder="请输入详细地址，如街道、楼牌号等" />
      </view>

      <view class="form-group switch-group">
        <label class="form-label">设为默认地址</label>
        <switch :checked="form.isDefault" @change="onDefaultChange" color="#007AFF" />
      </view>

      <button type="primary" class="save-btn" @click="saveAddress">保存</button>
    </form>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';

const store = useStore();
const form = ref({
  id: null,
  alias: '',
  name: '',
  phone: '',
  fullAddress: '',
  isDefault: false,
});

onLoad((options) => {
  if (options.id) {
    const addresses = store.getters['address/get_addresses'];
    const address = addresses.find(a => a.id == options.id);
    if (address) {
      form.value = { ...address };
    }
  }
});

const onDefaultChange = (e) => {
  form.value.isDefault = e.detail.value;
};

const saveAddress = () => {
  if (!form.value.name || !form.value.phone || !form.value.fullAddress) {
    uni.showToast({
      title: '请填写完整的地址信息',
      icon: 'none',
    });
    return;
  }
  store.dispatch('address/update_address', form.value).then(() => {
    uni.navigateBack();
  });
};
</script>

<style lang="scss" scoped>
.address-form-page {
  padding: 30rpx;
  background-color: #f7f7f7;
  min-height: 100vh;
}

.form-group {
  background-color: #fff;
  padding: 20rpx 30rpx;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .form-label {
    font-size: 30rpx;
    color: #333;
    width: 200rpx;
  }

  .form-input,
  .form-textarea {
    flex: 1;
    font-size: 30rpx;
    color: #555;
    text-align: right;
  }

  .form-textarea {
    min-height: 150rpx;
    padding-top: 10rpx;
    text-align: left;
  }

  &.switch-group {
    padding: 25rpx 30rpx;
  }
}

.save-btn {
  margin-top: 40rpx;
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