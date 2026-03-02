<template>
  <view class="publish-container">

    <view class="form-item image-item">
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

    <view class="form-item title-item">
      <input class="form-input" type="text" v-model="title" placeholder="✨ 给你的动态起个有趣的标题吧~" maxlength="99" />
      <button class="publish-button" @click="submitPost">发布</button>
    </view>

    <view class="divider-line"></view>

    <view class="form-item content-item">
      <textarea class="form-textarea" v-model="content" placeholder="💭 今天有什么想分享的呢？可以是生活趣事、学习心得、美食推荐...让大家看到不一样的你！✨"
        maxlength="10000" />
    </view>

    <!-- AI优化按钮 -->
    <view class="ai-optimize-buttons">
      <view v-if="showUndoButton" class="undo-btn" @click="undoOptimize">
        <text class="undo-icon">↩</text>
        <text class="undo-text">撤回优化</text>
      </view>
      <view class="ai-optimize-btn" @click="aiOptimize">
        <text class="ai-icon" v-if="!isOptimizing">✨</text>
        <text class="ai-text" v-if="!isOptimizing">AI润色</text>
        <text class="ai-text" v-else>润色中...</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app"; // 引入 onLoad
import { optimizePost } from "@/api/helper.js";

const store = useStore();

const title = ref("");
const content = ref("");
const imageList = ref([]); // 存储本地图片路径或上传后的URL

// AI优化相关状态
const isOptimizing = ref(false);
const showUndoButton = ref(false);
const originalTitle = ref("");
const originalContent = ref("");

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

// AI优化内容
const aiOptimize = async () => {
  // 如果没有标题和内容，提示用户
  if (!title.value.trim() && !content.value.trim()) {
    uni.showToast({
      title: "请先输入标题或内容",
      icon: "none",
    });
    return;
  }

  // 保存原始内容以便撤回
  originalTitle.value = title.value;
  originalContent.value = content.value;

  isOptimizing.value = true;

  try {
    const result = await optimizePost(title.value, content.value);

    if (result.success) {
      // 应用优化后的内容
      title.value = result.title;
      content.value = result.content;
      showUndoButton.value = true;

      uni.showToast({
        title: "润色完成！",
        icon: "success",
        duration: 1500,
      });
    } else {
      uni.showToast({
        title: "润色失败，请重试",
        icon: "none",
      });
    }
  } catch (error) {
    console.error("AI优化失败:", error);
    uni.showToast({
      title: "润色失败，请重试",
      icon: "none",
    });
  } finally {
    isOptimizing.value = false;
  }
};

// 撤回优化
const undoOptimize = () => {
  title.value = originalTitle.value;
  content.value = originalContent.value;
  showUndoButton.value = false;
  uni.showToast({
    title: "已撤回",
    icon: "none",
    duration: 1000,
  });
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
    type: '好物推荐', // 固定传递"好物推荐"类型
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
  background-color: #f9f9f9;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 30rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-item.title-item {
  height: 80rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.form-item.content-item {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-item.image-item {
  height: 200rpx;
  flex-shrink: 0;
}



.form-input,
.form-textarea {
  width: 100%;
  font-size: 30rpx;
  color: #333;
  box-sizing: border-box;
}

.form-input {
  height: 80rpx;
  flex: 1;
  /* 给输入框一个固定的高度，并让它占据剩余空间 */
}

.form-textarea {
  flex: 1;
  line-height: 1.6;
  padding: 20rpx 0;
  resize: none;
}

// 分割线
.divider-line {
  height: 1rpx;
  background: linear-gradient(to right, transparent, #e0e0e0, transparent);
  margin: 10rpx 0;
  flex-shrink: 0;
}

// AI优化按钮容器
.ai-optimize-buttons {
  position: fixed;
  bottom: 40rpx;
  right: 30rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: flex-end;
  z-index: 100;
}

.ai-optimize-btn {
  background: #5a6b7a;
  border-radius: 50rpx;
  padding: 20rpx 32rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.95);
    background: #4a5b6a;
  }

  .ai-icon {
    font-size: 32rpx;
  }

  .ai-text {
    font-size: 28rpx;
    color: white;
    font-weight: 500;
  }
}

.undo-btn {
  background: rgba(255, 255, 255, 0.95);
  border: 2rpx solid #e0e0e0;
  border-radius: 50rpx;
  padding: 16rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 6rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.92);
    background: rgba(245, 245, 245, 0.95);
  }

  .undo-icon {
    font-size: 28rpx;
    color: #666;
  }

  .undo-text {
    font-size: 24rpx;
    color: #666;
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
  background: #007aff;
  color: white;
  border: none;
  border-radius: 8rpx;
  font-size: 28rpx;
  font-weight: 500;
  height: 60rpx;
  padding: 0 24rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:active {
    background: #0056cc;
    transform: scale(0.95);
  }
}
</style>
