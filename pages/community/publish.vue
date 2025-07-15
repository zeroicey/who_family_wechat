<template>
  <view class="publish-container">
    <view class="form-item">
      <text class="form-label">标题</text>
      <input class="form-input" type="text" v-model="title" placeholder="请输入标题" maxlength="99" />
    </view>

    <view class="form-item">
      <text class="form-label">内容</text>
      <textarea class="form-textarea" v-model="content" placeholder="分享新鲜事..." maxlength="10000" />
    </view>

    <view class="form-item">
      <text class="form-label">类型</text>
      <picker class="form-picker" @change="bindPickerChange" :value="typeIndex" :range="typeArray" mode="selector"
        range-key="name">
        <view class="picker-display">{{ typeArray[typeIndex] ? typeArray[typeIndex].name : '请选择类型' }}</view>
      </picker>
    </view>

    <view class="form-item">
      <text class="form-label">图片上传 (最多4张)</text>
      <view class="image-uploader">
        <view class="image-preview-list">
          <view v-for="(image, index) in imageList" :key="index" class="image-preview-item">
            <image :src="image" mode="aspectFill" class="preview-image" @click="previewImage(index)"></image>
            <view class="delete-icon" @click="deleteImage(index)">×</view>
          </view>
          <view v-if="imageList.length < 4" class="add-image-btn" @click="chooseImage">
            <text class="add-icon">+</text>
          </view>
        </view>
      </view>
    </view>

    <button class="publish-button" @click="submitPost">发布动态</button>
  </view>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app"; // 引入 onLoad

const store = useStore();

const title = ref("");
const content = ref("");
const typeArray = computed(() => {
  const types = store.getters["community/get_post_types"];
  // 确保 types 是一个数组并且包含对象，如果直接是字符串数组，则需要转换
  // 假设 store 返回的已经是 [{id:1, name: '日常分享'}, ...]
  return Array.isArray(types) ? types : [];
});
const typeIndex = ref(0);
const imageList = ref([]); // 存储本地图片路径或上传后的URL

onLoad((options) => {
  if (options && options.images) {
    try {
      const passedImages = JSON.parse(decodeURIComponent(options.images));
      if (Array.isArray(passedImages)) {
        imageList.value = passedImages.slice(0, 4); // 最多只取4张
      }
    } catch (error) {
      console.error("Failed to parse images from query:", error);
    }
  }
});


const bindPickerChange = (e) => {
  typeIndex.value = e.detail.value;
};

const chooseImage = () => { // 此函数现在用于在发布页面补充图片
  if (imageList.value.length >= 4) {
    uni.showToast({
      title: "最多上传4张图片",
      icon: "none",
    });
    return;
  }
  uni.chooseImage({
    count: 4 - imageList.value.length, // 动态计算可选图片数量
    sizeType: ["original", "compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      console.log("选择的图片路径:", res.tempFilePaths);
      // 确保不超过4张
      const newImages = res.tempFilePaths;
      const remainingSlots = 4 - imageList.value.length;
      imageList.value = [...imageList.value, ...newImages.slice(0, remainingSlots)];
    },
  });
};

const previewImage = (index) => {
  uni.previewImage({
    urls: imageList.value,
    current: imageList.value[index],
  });
};

const deleteImage = (index) => {
  imageList.value.splice(index, 1);
};

const submitPost = async () => {
  if (!title.value.trim()) {
    uni.showToast({ title: "请输入标题", icon: "none" });
    return;
  }
  if (title.value.length > 99) {
    uni.showToast({ title: "标题不能超过99个字", icon: "none" });
    return;
  }
  if (!content.value.trim()) {
    uni.showToast({ title: "请输入内容", icon: "none" });
    return;
  }
  if (content.value.length > 10000) {
    uni.showToast({ title: "内容不能超过10000个字", icon: "none" });
    return;
  }

  uni.showLoading({
    title: "发布中...",
  });

  const imagePaths = [];
  for (const imagePath of imageList.value) {
    imagePaths.push(imagePath); // 暂时用本地路径替代URL
  }

  const postData = {
    title: title.value,
    content: content.value,
    type: typeArray.value[typeIndex.value] ? typeArray.value[typeIndex.value].name : '', // 获取选中类型的名称
    // images: uploadedImageUrls, // 如果你的后端需要图片URL列表
    imgCount: imagePaths.length,
  };

  console.log("提交的动态数据:", postData);
  console.log("上传的图片路径:", imagePaths);

  try {
    if (imagePaths.length === 0) {
      await store.dispatch("community/publish_post_only_text", postData);
    } else {
      await store.dispatch("community/publish_post_with_image", {
        postData,
        imagePaths,
      });
    }

    uni.hideLoading();
    uni.showToast({
      title: "发布成功!",
      icon: "success",
      duration: 1500, // 提示持续时间
    });

    // 清空表单
    title.value = "";
    content.value = "";
    imageList.value = [];
    typeIndex.value = 0;

    await store.dispatch("community/fetch_first_posts");
    await store.dispatch("user/fetch_first_posts");
    // 延时一小段时间再跳转，让用户能看到提示
    setTimeout(() => {
      uni.switchTab({
        url: "/pages/community/index",
      });
    }, 1500);
  } catch (error) {
    uni.hideLoading();
    uni.showToast({
      title: "发布失败，请重试",
      icon: "none",
    });
    console.error("发布失败:", error);
  }
};
</script>

<style lang="scss" scoped>
.publish-container {
  padding: 30rpx;
  background-color: #f9f9f9;
  min-height: 100vh;
  box-sizing: border-box;
}

.form-item {
  background-color: #ffffff;
  padding: 30rpx;
  border-radius: 20rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.05);
}

.form-label {
  display: block;
  font-size: 28rpx; /* 调整字体大小 */
  color: #666; /* 调整颜色 */
  margin-bottom: 15rpx; /* 调整下边距 */
  font-weight: normal; /* 取消加粗 */
}

.form-input,
.form-textarea {
  width: 100%;
  font-size: 30rpx;
  color: #333;
  background-color: #fff; /* 改为白色背景 */
  border: none; /* 移除边框 */
  border-bottom: 1px solid #f0f0f0; /* 添加底部边框 */
  border-radius: 0; /* 移除圆角 */
  padding: 0; /* 移除统一的内边距，下面分别设置 */
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;

  &::placeholder {
    color: #b8b8b8;
  }

  &:focus {
    border-bottom-color: #007aff; /* 聚焦时改变底部边框颜色 */
    box-shadow: none; /* 移除阴影 */
  }
}

.form-input {
  height: 80rpx; /* 给输入框一个固定的高度 */
}

.form-textarea {
  height: 280rpx;
  line-height: 1.6;
  padding: 20rpx 0; /* 单独为文本域设置内边距 */
}

.form-picker {
  background-color: #f7f8fa;
  border: 1px solid #f0f0f0;
  border-radius: 16rpx;
  padding: 24rpx;

  .picker-display {
    font-size: 30rpx;
    color: #333;
  }
}

.image-uploader {
  .image-preview-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;
  }

  .image-preview-item,
  .add-image-btn {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 16rpx;
    position: relative;
    overflow: hidden;
  }

  .image-preview-item {
    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .delete-icon {
      position: absolute;
      top: 10rpx;
      right: 10rpx;
      width: 44rpx;
      height: 44rpx;
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 30rpx;
      line-height: 1;
      z-index: 10;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  }

  .add-image-btn {
    border: 2rpx dashed #dcdfe6;
    background-color: #f7f8fa;
    display: flex;
    justify-content: center;
    align-items: center;

    .add-icon {
      font-size: 60rpx;
      color: #b8b8b8;
      font-weight: 300;
    }
  }
}

.publish-button {
  background: linear-gradient(45deg, #007aff, #00c6ff);
  color: white;
  border-radius: 50rpx;
  font-size: 34rpx;
  font-weight: bold;
  height: 100rpx;
  line-height: 100rpx;
  padding: 0;
  margin-top: 80rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 122, 255, 0.25);
  transition: transform 0.2s, box-shadow 0.2s;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 4rpx 10rpx rgba(0, 122, 255, 0.2);
  }
}
</style>
