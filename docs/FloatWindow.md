# FloatWindow 浮窗组件

一个功能强大的浮窗组件，支持自定义位置、大小、动画效果，基于 Vue 3 Composition API 开发。

## 功能特性

- ✅ 自定义位置（9个预设位置 + 自定义坐标）
- ✅ 自定义大小
- ✅ 遮罩层控制
- ✅ 拖拽支持
- ✅ 平滑动画
- ✅ 插槽支持（标题、内容、底部、关闭按钮）
- ✅ 完全响应式

## 基础用法

```vue
<template>
  <view>
    <button @click="show = true">打开浮窗</button>

    <FloatWindow v-model="show" title="基础浮窗">
      <text>这是一个基础的浮窗内容</text>
    </FloatWindow>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import FloatWindow from '@/components/FloatWindow.vue';

const show = ref(false);
</script>
```

## Props 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | Boolean | false | 控制浮窗显示/隐藏，支持 v-model |
| title | String | '' | 浮窗标题 |
| position | String | 'center' | 浮窗位置，见下方位置说明 |
| customPosition | Object | {x: '', y: ''} | 自定义坐标 {x: '100px', y: '100px'} |
| width | String\|Number | '600rpx' | 浮窗宽度 |
| height | String\|Number | 'auto' | 浮窗高度 |
| maxHeight | String\|Number | '70vh' | 内容区域最大高度 |
| mask | Boolean | true | 是否显示遮罩层 |
| maskClosable | Boolean | true | 点击遮罩是否关闭 |
| showHeader | Boolean | true | 是否显示头部 |
| closable | Boolean | true | 是否显示关闭按钮 |
| draggable | Boolean | false | 是否可拖拽 |
| zIndex | String\|Number | 999 | 层级 |
| borderRadius | String | '16rpx' | 圆角大小 |
| animation | Boolean | true | 是否显示动画 |
| animationDuration | String | '300ms' | 动画持续时间 |

## 位置说明

position 可选值：

- `top-left` - 左上角
- `top-center` - 顶部居中
- `top-right` - 右上角
- `center` - 居中（默认）
- `center-left` - 中间左侧
- `center-right` - 中间右侧
- `bottom-left` - 左下角
- `bottom-center` - 底部居中
- `bottom-right` - 右下角

## Events 事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 显示状态变化时触发 | (value: boolean) |
| open | 浮窗打开时触发 | - |
| close | 浮窗关闭时触发 | - |
| opened | 浮窗打开动画结束时触发 | - |
| closed | 浮窗关闭动画结束时触发 | - |
| drag-end | 拖拽结束时触发 | {deltaX, deltaY, x, y} |

## Slots 插槽

| 插槽名 | 说明 |
|--------|------|
| default | 内容区域 |
| title | 自定义标题 |
| close | 自定义关闭按钮 |
| footer | 底部区域 |

## 使用示例

### 1. 自定义位置

```vue
<template>
  <view>
    <button @click="showTopLeft = true">左上角</button>
    <button @click="showTopCenter = true">顶部居中</button>
    <button @click="showTopRight = true">右上角</button>
    <button @click="showBottomRight = true">右下角</button>

    <!-- 左上角 -->
    <FloatWindow v-model="showTopLeft" title="左上角" position="top-left" :width="500">
      <text>左上角浮窗内容</text>
    </FloatWindow>

    <!-- 顶部居中 -->
    <FloatWindow v-model="showTopCenter" title="顶部居中" position="top-center" :width="500">
      <text>顶部居中浮窗内容</text>
    </FloatWindow>

    <!-- 右上角 -->
    <FloatWindow v-model="showTopRight" title="右上角" position="top-right" :width="500">
      <text>右上角浮窗内容</text>
    </FloatWindow>

    <!-- 右下角 -->
    <FloatWindow v-model="showBottomRight" title="右下角" position="bottom-right" :width="500">
      <text>右下角浮窗内容</text>
    </FloatWindow>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import FloatWindow from '@/components/FloatWindow.vue';

const showTopLeft = ref(false);
const showTopCenter = ref(false);
const showTopRight = ref(false);
const showBottomRight = ref(false);
</script>
```

### 2. 自定义大小

```vue
<template>
  <FloatWindow
    v-model="show"
    title="自定义大小"
    width="80vw"
    height="60vh"
    :border-radius="24"
  >
    <text>这是一个宽 80vw、高 60vh 的浮窗</text>
  </FloatWindow>
</template>
```

### 3. 自定义坐标

```vue
<template>
  <FloatWindow
    v-model="show"
    title="自定义坐标"
    position="center"
    :custom-position="{ x: '100rpx', y: '200rpx' }"
    width="400rpx"
  >
    <text>距离左边 100rpx，距离顶部 200rpx</text>
  </FloatWindow>
</template>
```

### 4. 无遮罩层

```vue
<template>
  <FloatWindow
    v-model="show"
    title="无遮罩层"
    :mask="false"
    position="top-right"
  >
    <text>点击外部不会关闭，需要点击关闭按钮</text>
  </FloatWindow>
</template>
```

### 5. 自定义插槽

```vue
<template>
  <FloatWindow v-model="show" :show-header="false">
    <!-- 自定义标题 -->
    <template #title>
      <view class="custom-header">
        <uni-icons type="heart-filled" color="#ff4757"></uni-icons>
        <text>自定义标题</text>
      </view>
    </template>

    <!-- 内容 -->
    <view>
      <text>这是自定义的内容区域</text>
    </view>

    <!-- 底部按钮 -->
    <template #footer>
      <button class="cancel-btn" @click="show = false">取消</button>
      <button class="confirm-btn" @click="handleConfirm">确定</button>
    </template>
  </FloatWindow>
</template>

<script setup>
import { ref } from 'vue';

const show = ref(false);

const handleConfirm = () => {
  console.log('点击了确定');
  show.value = false;
};
</script>

<style lang="scss" scoped>
.custom-header {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 30rpx;
}

.cancel-btn {
  flex: 1;
  background-color: #f5f5f5;
  border-radius: 12rpx;
}

.confirm-btn {
  flex: 1;
  background-color: #007aff;
  color: #fff;
  border-radius: 12rpx;
}
</style>
```

### 6. 表单浮窗示例

```vue
<template>
  <view>
    <button @click="showForm = true">填写表单</button>

    <FloatWindow
      v-model="showForm"
      title="用户信息"
      width="600rpx"
      @open="onFormOpen"
      @close="onFormClose"
    >
      <view class="form-content">
        <view class="form-item">
          <text class="label">姓名</text>
          <input v-model="formData.name" placeholder="请输入姓名" />
        </view>
        <view class="form-item">
          <text class="label">手机号</text>
          <input v-model="formData.phone" type="number" placeholder="请输入手机号" />
        </view>
        <view class="form-item">
          <text class="label">备注</text>
          <textarea v-model="formData.remark" placeholder="请输入备注"></textarea>
        </view>
      </view>

      <template #footer>
        <button class="cancel-btn" @click="showForm = false">取消</button>
        <button class="submit-btn" @click="handleSubmit">提交</button>
      </template>
    </FloatWindow>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import FloatWindow from '@/components/FloatWindow.vue';

const showForm = ref(false);

const formData = reactive({
  name: '',
  phone: '',
  remark: ''
});

const onFormOpen = () => {
  console.log('表单浮窗打开');
};

const onFormClose = () => {
  console.log('表单浮窗关闭');
};

const handleSubmit = () => {
  if (!formData.name) {
    uni.showToast({ title: '请输入姓名', icon: 'none' });
    return;
  }
  console.log('提交表单：', formData);
  uni.showToast({ title: '提交成功', icon: 'success' });
  showForm.value = false;
};
</script>

<style lang="scss" scoped>
.form-content {
  .form-item {
    margin-bottom: 30rpx;

    .label {
      display: block;
      font-size: 28rpx;
      color: #666;
      margin-bottom: 15rpx;
    }

    input, textarea {
      width: 100%;
      padding: 20rpx;
      background-color: #f8f8f8;
      border-radius: 12rpx;
      box-sizing: border-box;
    }

    textarea {
      height: 120rpx;
    }
  }
}

.cancel-btn, .submit-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #666;
}

.submit-btn {
  background-color: #007aff;
  color: #fff;
}
</style>
```

### 7. 确认对话框

```vue
<template>
  <view>
    <button @click="handleDelete">删除</button>

    <FloatWindow
      v-model="showConfirm"
      title="确认删除"
      width="500rpx"
      :show-header="true"
    >
      <view class="confirm-content">
        <uni-icons type="info-filled" size="60" color="#ff9800"></uni-icons>
        <text class="message">确定要删除这条数据吗？</text>
        <text class="hint">删除后无法恢复</text>
      </view>

      <template #footer>
        <button class="btn-cancel" @click="showConfirm = false">取消</button>
        <button class="btn-confirm" @click="confirmDelete">删除</button>
      </template>
    </FloatWindow>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import FloatWindow from '@/components/FloatWindow.vue';

const showConfirm = ref(false);

const handleDelete = () => {
  showConfirm.value = true;
};

const confirmDelete = () => {
  // 执行删除操作
  console.log('执行删除');
  showConfirm.value = false;
  uni.showToast({ title: '删除成功', icon: 'success' });
};
</script>

<style lang="scss" scoped>
.confirm-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;

  .message {
    font-size: 32rpx;
    color: #333;
    margin: 30rpx 0 15rpx;
  }

  .hint {
    font-size: 24rpx;
    color: #999;
  }
}

.btn-cancel, .btn-confirm {
  flex: 1;
  height: 80rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #666;
}

.btn-confirm {
  background-color: #ff4757;
  color: #fff;
}
</style>
```

### 8. 图片预览浮窗

```vue
<template>
  <view>
    <image @click="showPreview = true" :src="imageSrc" mode="aspectFill"></image>

    <FloatWindow
      v-model="showPreview"
      :mask="true"
      :show-header="false"
      :closable="true"
      width="90vw"
      position="center"
    >
      <image class="preview-image" :src="imageSrc" mode="widthFix"></image>
    </FloatWindow>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import FloatWindow from '@/components/FloatWindow.vue';

const showPreview = ref(false);
const imageSrc = ref('https://example.com/image.jpg');
</script>

<style lang="scss" scoped>
.preview-image {
  width: 100%;
  display: block;
}
</style>
```

### 9. 侧边栏风格

```vue
<template>
  <FloatWindow
    v-model="showSidebar"
    :mask="true"
    :show-header="false"
    :closable="true"
    width="70vw"
    height="100vh"
    position="center-left"
    :border-radius="0"
  >
    <view class="sidebar-content">
      <view class="sidebar-header">
        <text class="title">菜单</text>
      </view>
      <view class="menu-list">
        <view class="menu-item" v-for="item in menuItems" :key="item.id" @click="handleMenuClick(item)">
          <uni-icons :type="item.icon" size="20"></uni-icons>
          <text>{{ item.name }}</text>
        </view>
      </view>
    </view>
  </FloatWindow>
</template>

<script setup>
import { ref } from 'vue';

const showSidebar = ref(false);

const menuItems = ref([
  { id: 1, name: '首页', icon: 'home' },
  { id: 2, name: '消息', icon: 'chatbubble' },
  { id: 3, name: '设置', icon: 'gear' },
  { id: 4, name: '关于', icon: 'info' }
]);

const handleMenuClick = (item) => {
  console.log('点击菜单：', item);
  showSidebar.value = false;
};
</script>

<style lang="scss" scoped>
.sidebar-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 40rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
}

.menu-list {
  flex: 1;
  padding: 20rpx 0;

  .menu-item {
    display: flex;
    align-items: center;
    gap: 20rpx;
    padding: 30rpx;
    font-size: 28rpx;
    color: #333;

    &:active {
      background-color: #f5f5f5;
    }
  }
}
</style>
```

### 10. 方法调用

```vue
<template>
  <view>
    <FloatWindow ref="floatWindowRef" v-model="show" title="方法调用示例">
      <text>可以通过 ref 调用 open/close 方法</text>
    </FloatWindow>

    <button @click="openWindow">打开浮窗</button>
    <button @click="closeWindow">关闭浮窗</button>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import FloatWindow from '@/components/FloatWindow.vue';

const show = ref(false);
const floatWindowRef = ref();

const openWindow = () => {
  // 方法1：直接修改 v-model
  show.value = true;

  // 方法2：通过 ref 调用
  // floatWindowRef.value?.open();
};

const closeWindow = () => {
  // 方法1：直接修改 v-model
  show.value = false;

  // 方法2：通过 ref 调用
  // floatWindowRef.value?.close();
};
</script>
```

## 注意事项

1. 组件使用了 `uni-icons`，请确保项目中已安装 `uni-icons` 组件
2. 浮窗使用 `position: fixed`，在某些小程序平台可能需要注意层级问题
3. 拖拽功能仅在 `draggable: true` 时生效
4. 自定义坐标 `customPosition` 会覆盖 `position` 的部分设置
5. 内容区域过长时会自动出现滚动条
