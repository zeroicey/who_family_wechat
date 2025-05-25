<template>
  <view class="avatar-uploader">
    <view class="section-title">头像</view>
    <view class="avatar-wrapper" @click="chooseAvatar">
      <image class="avatar" :src="avatarUrl" mode="aspectFill"></image>
      <view class="upload-icon">
        <text class="icon-text">更换</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  avatar: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:avatar']);

// 计算属性：处理默认头像
const avatarUrl = computed(() => {
  // 如果没有头像，使用默认头像
  if (!props.avatar) {
    return '/static/images/avatar.png';
  }
  // 检测是否为完整URL或相对路径
  if (props.avatar.startsWith('http') || props.avatar.startsWith('/static')) {
    return props.avatar;
  }
  // 处理临时文件路径
  return props.avatar;
});

// 监听头像变化
watch(() => props.avatar, (newVal) => {
  console.log('头像已更新:', newVal);
});

// 选择头像
const chooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      // 模拟上传头像，实际开发中需要调用上传API
      const tempFilePath = res.tempFilePaths[0];

      // 裁剪头像前清除可能存在的上一次结果
      uni.removeStorageSync('croppedAvatar');

      // 裁剪头像
      uni.navigateTo({
        url: `/pages/me/profile/crop?src=${encodeURIComponent(tempFilePath)}`,
        events: {
          // 接收裁剪后的头像（事件通道方式）
          cropSuccess: (avatar) => {
            emit('update:avatar', avatar);
          }
        }
      });
    }
  });
};

// 监听页面显示，检查是否有通过存储传递的头像数据
uni.onShow(() => {
  try {
    const croppedAvatar = uni.getStorageSync('croppedAvatar');
    if (croppedAvatar) {
      // 获取到裁剪后的头像，更新数据
      emit('update:avatar', croppedAvatar);
      // 使用后立即清除，避免重复使用
      uni.removeStorageSync('croppedAvatar');
    }
  } catch (error) {
    console.error('读取裁剪头像数据失败', error);
  }
});
</script>

<style lang="scss" scoped>
/* 使用扁平化的CSS结构，避免深层嵌套，提高微信小程序兼容性 */
.avatar-uploader {
  padding: 4vw;
  background-color: #fff;
  margin-bottom: 3vw;
}

.section-title {
  font-size: 3.8vw;
  color: #333;
  font-weight: 500;
  margin-bottom: 4vw;
}

.avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.avatar {
  width: 25vw;
  height: 25vw;
  border-radius: 50%;
  background-color: #f0f0f0;
}

.upload-icon {
  position: absolute;
  bottom: 0;
  right: 32.5vw;
  width: 10vw;
  height: 6vw;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 3vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-text {
  color: #fff;
  font-size: 3vw;
}
</style>
