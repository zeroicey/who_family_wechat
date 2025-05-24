<template>
  <view class="crop-container">
    <view class="crop-content">
      <!-- 使用图片裁剪组件 -->
      <view class="image-crop">
        <image class="source-image" :src="imageSrc" mode="aspectFit" @load="onImageLoad"></image>
        <view class="crop-frame" :style="cropFrameStyle" @touchstart="onTouchStart" @touchmove="onTouchMove"
          @touchend="onTouchEnd">
          <view class="crop-border"></view>
          <view class="corner top-left"></view>
          <view class="corner top-right"></view>
          <view class="corner bottom-left"></view>
          <view class="corner bottom-right"></view>
        </view>
      </view>

      <view class="tip-text">拖动、缩放来调整裁剪区域</view>
      
      <!-- 将确认按钮放在提示文字下方 -->
      <view class="confirm-btn" @click="confirmCrop">
        <text class="confirm-text">确定裁剪</text>
      </view>

      <!-- 隐藏的画布用于裁剪操作 -->
      <canvas canvas-id="cropCanvas"
        style="width: 300px; height: 300px; position: fixed; left: -1000px; top: -1000px;"></canvas>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';

// 获取页面参数（图片路径）
const imageSrc = ref('');
const imageInfo = reactive({
  width: 0,
  height: 0,
  ratio: 1 // 宽高比
});

// 裁剪框状态
const cropFrame = reactive({
  x: 0,
  y: 0,
  size: 250, // 初始大小
  minSize: 100 // 最小尺寸
});

// 触摸状态
const touch = reactive({
  startX: 0,
  startY: 0,
  lastX: 0,
  lastY: 0,
  startSize: 0,
  isMoving: false,
  isResizing: false,
  corner: '' // 当前拖拽的角
});

// 计算裁剪框样式
const cropFrameStyle = computed(() => {
  return {
    width: `${cropFrame.size}px`,
    height: `${cropFrame.size}px`,
    left: `${cropFrame.x}px`,
    top: `${cropFrame.y}px`
  };
});

// 图片加载完成时初始化裁剪框
const onImageLoad = (e) => {
  // 获取图片信息
  uni.getImageInfo({
    src: imageSrc.value,
    success: (res) => {
      imageInfo.width = res.width;
      imageInfo.height = res.height;
      imageInfo.ratio = res.width / res.height;

      // 初始化裁剪框位置（居中）
      const imageElement = e.target;
      // 使用新的API获取窗口信息
      const windowInfo = uni.getWindowInfo ? uni.getWindowInfo() : { windowWidth: 375 };
      const windowWidth = windowInfo.windowWidth;

      // 计算图片在屏幕上的实际显示尺寸
      let displayWidth, displayHeight;
      if (imageInfo.ratio > 1) {
        // 宽图
        displayWidth = windowWidth * 0.9;
        displayHeight = displayWidth / imageInfo.ratio;
      } else {
        // 高图
        displayHeight = windowWidth * 0.9;
        displayWidth = displayHeight * imageInfo.ratio;
      }

      // 调整裁剪框大小和位置
      cropFrame.size = Math.min(displayWidth, displayHeight) * 0.8;
      cropFrame.x = (windowWidth - cropFrame.size) / 2;
      cropFrame.y = (displayHeight - cropFrame.size) / 2 + 50; // 加上header高度
    }
  });
};

// 触摸开始
const onTouchStart = (e) => {
  const touch1 = e.touches[0];
  touch.startX = touch1.clientX;
  touch.startY = touch1.clientY;
  touch.lastX = cropFrame.x;
  touch.lastY = cropFrame.y;
  touch.startSize = cropFrame.size;

  // 检测是否点击了角落（用于缩放）
  const cornerSize = 30; // 角落的可点击区域大小
  const x = touch1.clientX - cropFrame.x;
  const y = touch1.clientY - cropFrame.y;

  if (x < cornerSize && y < cornerSize) {
    touch.corner = 'topLeft';
    touch.isResizing = true;
  } else if (x > cropFrame.size - cornerSize && y < cornerSize) {
    touch.corner = 'topRight';
    touch.isResizing = true;
  } else if (x < cornerSize && y > cropFrame.size - cornerSize) {
    touch.corner = 'bottomLeft';
    touch.isResizing = true;
  } else if (x > cropFrame.size - cornerSize && y > cropFrame.size - cornerSize) {
    touch.corner = 'bottomRight';
    touch.isResizing = true;
  } else {
    touch.isMoving = true;
  }
};

// 触摸移动
const onTouchMove = (e) => {
  const touch1 = e.touches[0];
  const moveX = touch1.clientX - touch.startX;
  const moveY = touch1.clientY - touch.startY;

  if (touch.isMoving) {
    // 移动裁剪框
    cropFrame.x = touch.lastX + moveX;
    cropFrame.y = touch.lastY + moveY;

    // 限制裁剪框不超出图片边界
    // 使用新的API获取窗口信息
    const windowInfo = uni.getWindowInfo ? uni.getWindowInfo() : { windowWidth: 375 };
    const windowWidth = windowInfo.windowWidth;
    cropFrame.x = Math.max(0, Math.min(cropFrame.x, windowWidth - cropFrame.size));
    cropFrame.y = Math.max(50, Math.min(cropFrame.y, windowWidth - cropFrame.size + 50));
  } else if (touch.isResizing) {
    // 调整裁剪框大小
    let newSize = touch.startSize;

    if (touch.corner === 'bottomRight') {
      newSize = touch.startSize + Math.max(moveX, moveY);
    } else if (touch.corner === 'topLeft') {
      newSize = touch.startSize - Math.min(moveX, moveY);
      if (newSize > cropFrame.minSize) {
        cropFrame.x = touch.lastX + moveX;
        cropFrame.y = touch.lastY + moveY;
      }
    } else if (touch.corner === 'topRight') {
      newSize = touch.startSize + moveX - moveY;
      if (newSize > cropFrame.minSize) {
        cropFrame.y = touch.lastY + moveY;
      }
    } else if (touch.corner === 'bottomLeft') {
      newSize = touch.startSize - moveX + moveY;
      if (newSize > cropFrame.minSize) {
        cropFrame.x = touch.lastX + moveX;
      }
    }

    // 限制最小尺寸
    cropFrame.size = Math.max(cropFrame.minSize, newSize);
  }
};

// 触摸结束
const onTouchEnd = () => {
  touch.isMoving = false;
  touch.isResizing = false;
};

// 确认裁剪
const confirmCrop = () => {
  uni.showLoading({
    title: '处理中...'
  });

  // 计算裁剪参数
  const canvas = uni.createCanvasContext('cropCanvas');
  // 使用新的API获取窗口信息
  const windowInfo = uni.getWindowInfo ? uni.getWindowInfo() : { windowWidth: 375 };
  const windowWidth = windowInfo.windowWidth;

  // 计算裁剪参数（坐标和大小转换为原图上的值）
  const scale = imageInfo.width / windowWidth;
  const cropX = cropFrame.x * scale;
  const cropY = (cropFrame.y - 50) * scale; // 减去header高度
  const cropSize = cropFrame.size * scale;

  // 绘制裁剪后的图像到Canvas
  canvas.drawImage(imageSrc.value, cropX, cropY, cropSize, cropSize, 0, 0, cropSize, cropSize);
  canvas.draw(false, () => {
    // 从Canvas导出图片
    uni.canvasToTempFilePath({
      canvasId: 'cropCanvas',
      x: 0,
      y: 0,
      width: cropSize,
      height: cropSize,
      destWidth: 300, // 输出图像的宽度
      destHeight: 300, // 输出图像的高度
      quality: 0.8,
      success: (res) => {
        // 将裁剪结果传回上一页 - 使用正确的方式获取事件通道
        try {
          const pages = getCurrentPages();
          const currentPage = pages[pages.length - 1];
          const eventChannel = currentPage.$getOpenerEventChannel && currentPage.$getOpenerEventChannel();
          
          if (eventChannel && eventChannel.emit) {
            eventChannel.emit('cropSuccess', res.tempFilePath);
            uni.hideLoading();
            uni.navigateBack();
          } else {
            // 如果无法获取事件通道，使用存储方式传递数据
            uni.setStorageSync('croppedAvatar', res.tempFilePath);
            uni.hideLoading();
            uni.navigateBack();
          }
        } catch (error) {
          console.error('事件通道获取失败', error);
          // 使用存储方式传递数据作为备选方案
          uni.setStorageSync('croppedAvatar', res.tempFilePath);
          uni.hideLoading();
          uni.navigateBack();
        }
      },
      fail: (err) => {
        console.error('导出图片失败', err);
        uni.hideLoading();
        uni.showToast({
          title: '处理失败，请重试',
          icon: 'none'
        });
      }
    });
  });
};

// 返回上一页
const navigateBack = () => {
  uni.navigateBack();
};

// 初始化
onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = currentPage.$page.options;
  if (options.src) {
    imageSrc.value = decodeURIComponent(options.src);
  }
});
</script>

<style lang="scss" scoped>
.crop-container {
  min-height: 100vh;
  background-color: #000;
  position: relative;

  .crop-content {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 10vw;

    .image-crop {
      position: relative;
      width: 90vw;
      height: 70vh;
      display: flex;
      justify-content: center;
      align-items: center;

      .source-image {
        max-width: 100%;
        max-height: 100%;
      }

      .crop-frame {
        position: absolute;
        box-sizing: border-box;
        border: 1px solid rgba(255, 255, 255, 0.8);
        box-shadow: 0 0 0 100vw rgba(0, 0, 0, 0.7);

        .crop-border {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border: 1px dashed rgba(255, 255, 255, 0.8);
          pointer-events: none;
        }

        .corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border-color: #07c160;
          border-style: solid;
          background-color: transparent;

          &.top-left {
            top: -2px;
            left: -2px;
            border-width: 3px 0 0 3px;
          }

          &.top-right {
            top: -2px;
            right: -2px;
            border-width: 3px 3px 0 0;
          }

          &.bottom-left {
            bottom: -2px;
            left: -2px;
            border-width: 0 0 3px 3px;
          }

          &.bottom-right {
            bottom: -2px;
            right: -2px;
            border-width: 0 3px 3px 0;
          }
        }
      }
    }

    .tip-text {
      margin-top: 5vw;
      font-size: 3.5vw;
      color: #aaa;
      margin-bottom: 5vw;
    }
    
    .confirm-btn {
      width: 80vw;
      height: 12vw;
      background-color: #07c160;
      border-radius: 6vw;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      margin-bottom: 10vw;
      
      .confirm-text {
        font-size: 4vw;
        color: #fff;
        font-weight: 500;
      }
    }
  }
}

/* 隐藏的画布用于裁剪 */
canvas {
  position: fixed;
  left: -1000px;
  top: -1000px;
  width: 300px;
  height: 300px;
}
</style>
