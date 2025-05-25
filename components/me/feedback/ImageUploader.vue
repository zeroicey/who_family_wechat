<template>
  <view class="image-uploader">
    <text class="section-title">上传图片 <text class="optional">(选填，最多{{ maxCount }}张，大小不超过{{ formatFileSize(maxSize)
        }})</text></text>
    <view class="image-list">
      <view v-for="(image, index) in modelValue" :key="index" class="image-item">
        <image class="preview" :src="image" mode="aspectFill"></image>
        <view class="delete-btn" @tap.stop="deleteImage(index)">
          <text class="delete-icon">×</text>
        </view>
      </view>

      <view v-if="modelValue.length < maxCount" class="upload-btn" :class="{ 'uploading': uploading }"
        @tap="chooseImage">
        <view class="icon-container">
          <text v-if="!uploading" class="add-icon">+</text>
          <view v-else class="loading-icon"></view>
        </view>
        <text class="hint">{{ uploading ? '上传中...' : '添加图片' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';

// 使用store调用上传API
const store = useStore();

// 上传状态
const uploading = ref(false);

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  maxCount: {
    type: Number,
    default: 3
  },
  maxSize: {
    type: Number,
    default: 5 * 1024 * 1024 // 5MB
  },
  allowTypes: {
    type: Array,
    default: () => ['jpg', 'jpeg', 'png', 'gif']
  }
});

const emit = defineEmits(['update:modelValue']);

// 格式化文件大小
const formatFileSize = (size) => {
  if (size < 1024) {
    return size + 'B';
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + 'KB';
  } else {
    return (size / (1024 * 1024)).toFixed(2) + 'MB';
  }
};

// 获取文件扩展名
const getFileExtension = (path) => {
  return path.split('.').pop().toLowerCase();
};

// 验证文件
const validateFile = (filePath, fileSize) => {
  // 检查文件大小
  if (fileSize > props.maxSize) {
    uni.showToast({
      title: `文件超过${formatFileSize(props.maxSize)}限制`,
      icon: 'none'
    });
    return false;
  }

  // 检查文件类型
  const extension = getFileExtension(filePath);
  if (!props.allowTypes.includes(extension)) {
    uni.showToast({
      title: `仅支持${props.allowTypes.join(', ')}格式`,
      icon: 'none'
    });
    return false;
  }

  return true;
};

// 选择图片
const chooseImage = () => {
  if (uploading.value) {
    uni.showToast({
      title: '正在上传中，请稍后',
      icon: 'none'
    });
    return;
  }

  if (props.modelValue.length >= props.maxCount) {
    uni.showToast({
      title: `最多只能上传${props.maxCount}张图片`,
      icon: 'none'
    });
    return;
  }

  uni.chooseImage({
    count: props.maxCount - props.modelValue.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      try {
        uploading.value = true;
        const tempFilePaths = res.tempFilePaths;
        const tempFiles = res.tempFiles;

        // 验证并上传文件
        for (let i = 0; i < tempFilePaths.length; i++) {
          const filePath = tempFilePaths[i];
          const fileSize = tempFiles[i].size;

          // 验证文件
          if (!validateFile(filePath, fileSize)) {
            continue;
          }

          // 当前使用本地文件路径，实际项目中可以使用store上传到服务器
          // const result = await store.dispatch('feedback/uploadFeedbackImage', filePath);
          // 获取返回的图片URL并更新
          // emit('update:modelValue', [...props.modelValue, result.imageUrl]);

          // 模拟上传成功，使用本地路径
          emit('update:modelValue', [...props.modelValue, filePath]);
        }
      } catch (error) {
        uni.showToast({
          title: '上传图片失败',
          icon: 'none'
        });
        console.error('上传图片失败', error);
      } finally {
        uploading.value = false;
      }
    }
  });
};

// 删除图片
const deleteImage = (index) => {
  const newImages = [...props.modelValue];
  newImages.splice(index, 1);
  emit('update:modelValue', newImages);
};
</script>

<style lang="scss" scoped>
.image-uploader {
  margin-bottom: 5vw;

  .section-title {
    font-size: 4vw;
    color: #333;
    font-weight: 600;
    margin-bottom: 3vw;
    position: relative;
    padding-left: 3vw;

    .optional {
      font-size: 3.2vw;
      color: #999;
      font-weight: 400;
    }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 1vw;
      height: 4vw;
      background-color: #07c160;
      border-radius: 0.5vw;
    }
  }

  .image-list {
    display: flex;
    flex-wrap: wrap;

    .image-item {
      width: 22vw;
      height: 22vw;
      position: relative;
      margin-right: 3vw;
      margin-bottom: 3vw;
      border-radius: 2vw;
      overflow: hidden;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

      .preview {
        width: 100%;
        height: 100%;
        background-color: #f0f0f0;
      }

      .delete-btn {
        position: absolute;
        top: -1vw;
        right: -1vw;
        width: 5vw;
        height: 5vw;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        .delete-icon {
          color: #fff;
          font-size: 3.5vw;
          font-weight: bold;
        }
      }
    }

    .upload-btn {
      width: 22vw;
      height: 22vw;
      background-color: #f8f8f8;
      border-radius: 2vw;
      margin-bottom: 3vw;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: background-color 0.3s ease;

      &.uploading {
        background-color: #f0f9ff;
      }

      .icon-container {
        width: 10vw;
        height: 10vw;
        border-radius: 50%;
        border: 1px dashed #ccc;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 2vw;

        .add-icon {
          font-size: 6vw;
          color: #999;
          font-weight: 300;
        }

        .loading-icon {
          width: 5vw;
          height: 5vw;
          border: 0.5vw solid rgba(7, 193, 96, 0.1);
          border-top: 0.5vw solid #07c160;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }

          100% {
            transform: rotate(360deg);
          }
        }
      }

      .hint {
        font-size: 3vw;
        color: #999;
      }
    }
  }
}
</style>
