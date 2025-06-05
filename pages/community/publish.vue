<template>
  <view class="publish-container">
    <view class="form-item">
      <text class="form-label">标题</text>
      <input class="form-input" type="text" v-model="title" placeholder="请输入标题" />
    </view>

    <view class="form-item">
      <text class="form-label">内容</text>
      <textarea class="form-textarea" v-model="content" placeholder="分享新鲜事..." />
    </view>

    <view class="form-item">
      <text class="form-label">类型</text>
      <picker class="form-picker" @change="bindPickerChange" :value="typeIndex" :range="typeArray">
        <view class="picker-display">{{ typeArray[typeIndex] }}</view>
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

const store = useStore();

const title = ref("");
const content = ref("");
const typeArray = computed(() => store.getters["community/get_post_types"]);
const typeIndex = ref(0);
const imageList = ref([]); // 存储本地图片路径或上传后的URL

const bindPickerChange = (e) => {
  typeIndex.value = e.detail.value;
};

const chooseImage = () => {
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
      imageList.value = [...imageList.value, ...res.tempFilePaths];
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
  if (!content.value.trim()) {
    uni.showToast({ title: "请输入内容", icon: "none" });
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
    type: typeArray.value[typeIndex.value],
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
  padding: 24rpx;
  background-color: #f7f8fa; // 更柔和的背景色
  min-height: 100vh;
  box-sizing: border-box;
}

.form-item {
  background-color: #ffffff;
  padding: 24rpx 30rpx;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03); // 调整阴影使其更柔和
}

.form-label {
  display: block;
  font-size: 30rpx; // 稍微增大标签字号
  color: #323233; // 深灰色，更易读
  margin-bottom: 16rpx;
  font-weight: 600; // 加粗标签
}

.form-input,
.form-textarea,
.form-picker .picker-display {
  font-size: 28rpx;
  color: #333;
}

.form-input {
  width: 100%;
  height: 88rpx; // 增加高度
  border: 1px solid #ebedf0; // 更浅的边框色
  border-radius: 12rpx; // 更大的圆角
  padding: 0 24rpx;
  box-sizing: border-box;

  &::placeholder {
    color: #c8c9cc;
  }
}

.form-textarea {
  width: 100%;
  height: 300rpx;
  /* 增加内容表单的高度 */
  border: 1px solid #ebedf0;
  border-radius: 12rpx;
  padding: 24rpx;
  box-sizing: border-box;
  line-height: 1.6; // 增加行高，提升可读性

  &::placeholder {
    color: #c8c9cc;
  }
}

.form-picker {
  width: 100%;
  height: 88rpx;
  border: 1px solid #ebedf0;
  border-radius: 12rpx;
  padding: 0 24rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  position: relative; // 为箭头定位

  .picker-display {
    flex: 1;
  }

  // 可以添加一个向下的箭头图标
  &::after {
    content: "";
    position: absolute;
    right: 24rpx;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    width: 12rpx;
    height: 12rpx;
    border-right: 2rpx solid #969799;
    border-bottom: 2rpx solid #969799;
  }
}

.image-uploader {
  .image-preview-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx; // 使用gap来控制间距
  }

  .image-preview-item,
  .add-image-btn {
    width: calc((100% - 60rpx) / 4); // 动态计算宽度，一行4个，考虑gap
    padding-bottom: calc((100% - 60rpx) / 4); // 保持正方形
    height: 0; // 与padding-bottom配合实现正方形
    border-radius: 12rpx;
    position: relative;
    overflow: hidden;
  }

  .image-preview-item {
    .preview-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .delete-icon {
      position: absolute;
      top: 8rpx;
      right: 8rpx;
      width: 40rpx;
      height: 40rpx;
      background-color: rgba(0, 0, 0, 0.6);
      color: white;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28rpx;
      line-height: 1;
      z-index: 10;
    }
  }

  .add-image-btn {
    border: 2rpx dashed #dcdee0;
    // display: flex; // 移除 flex 布局，改用绝对定位子元素
    // justify-content: center;
    // align-items: center;
    background-color: #f7f8fa;
    position: relative; // 父元素需要相对定位，以便子元素绝对定位
    // 确保 add-image-btn 自身是正方形并且有明确的尺寸，这在之前的代码中已经通过
    // width: calc((100% - 60rpx) / 4);
    // padding-bottom: calc((100% - 60rpx) / 4);
    // height: 0;
    // 实现

    .add-icon {
      font-size: 70rpx; // 可以适当调整加号大小
      color: #b0b0b0;
      font-weight: 200; // 可以尝试移除或调整
      position: absolute; // 使用绝对定位
      top: 50%; // 定位到父容器的垂直中心
      left: 50%; // 定位到父容器的水平中心
      transform: translate(-50%,
          -50%); // 将自身向左上角移动自身宽高的一半，实现精确居中
      // line-height: 1; // 在绝对定位下，line-height 的影响较小，可以保留或移除
    }
  }
}

.publish-button {
  background-color: #1989fa; // 鲜艳的蓝色
  color: white;
  border-radius: 44rpx; // 更圆润的按钮
  font-size: 32rpx;
  font-weight: 500;
  height: 88rpx;
  line-height: 88rpx;
  padding: 0;
  margin-top: 60rpx;
  box-shadow: 0 4rpx 8rpx rgba(25, 137, 250, 0.2);

  &:active {
    background-color: #0d6efd;
  }
}
</style>
