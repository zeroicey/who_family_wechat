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

    <view class="form-item content-item">
      <textarea class="form-textarea" v-model="content" placeholder="💭 今天有什么想分享的呢？可以是生活趣事、学习心得、美食推荐...让大家看到不一样的你！✨"
        maxlength="10000" />
    </view>
  </view>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app"; // 引入 onLoad

const store = useStore();

const title = ref("");
const content = ref("");
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
