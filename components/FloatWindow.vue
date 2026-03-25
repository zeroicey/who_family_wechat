<template>
	<view v-if="modelValue || showAnimation" class="float-window-container">
		<!-- 遮罩层 -->
		<view
			v-if="mask && modelValue"
			class="float-window-mask"
			:class="{ 'mask-show': modelValue }"
			@click="handleMaskClick"
		></view>

		<!-- 浮窗内容 -->
		<view
			class="float-window-wrapper"
			:class="[
				`float-window-${position}`,
				{ 'window-show': modelValue }
			]"
			:style="windowStyle"
		>
			<view
				class="float-window"
				:class="{ 'is-draggable': draggable }"
				@touchstart="handleTouchStart"
				@touchmove="handleTouchMove"
				@touchend="handleTouchEnd"
			>
				<!-- 头部 -->
				<view v-if="showHeader" class="float-window-header">
					<view class="header-title">
						<slot name="title">
							<text class="title-text">{{ title }}</text>
						</slot>
					</view>
					<view v-if="closable" class="header-close" @click="close">
						<slot name="close">
							<uni-icons type="closeempty" size="20" color="#666"></uni-icons>
						</slot>
					</view>
				</view>

				<!-- 内容区域 -->
				<view class="float-window-content" :style="contentStyle">
					<slot></slot>
				</view>

				<!-- 底部 -->
				<view v-if="$slots.footer" class="float-window-footer">
					<slot name="footer"></slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';

// Props 定义
const props = defineProps({
	// v-model 绑定，控制浮窗显示/隐藏
	modelValue: {
		type: Boolean,
		default: false
	},
	// 浮窗标题
	title: {
		type: String,
		default: ''
	},
	// 浮窗位置
	// top-left, top-center, top-right
	// center, center-left, center-right
	// bottom-left, bottom-center, bottom-right
	position: {
		type: String,
		default: 'center'
	},
	// 自定义位置坐标 x, y (单位 px 或 rpx)
	customPosition: {
		type: Object,
		default: () => ({ x: '', y: '' })
	},
	// 浮窗宽度
	width: {
		type: [String, Number],
		default: '600rpx'
	},
	// 浮窗高度
	height: {
		type: [String, Number],
		default: 'auto'
	},
	// 最大高度
	maxHeight: {
		type: [String, Number],
		default: '70vh'
	},
	// 是否显示遮罩层
	mask: {
		type: Boolean,
		default: true
	},
	// 点击遮罩是否关闭
	maskClosable: {
		type: Boolean,
		default: true
	},
	// 是否显示头部
	showHeader: {
		type: Boolean,
		default: true
	},
	// 是否显示关闭按钮
	closable: {
		type: Boolean,
		default: true
	},
	// 是否可拖拽 (仅在 position 为 custom 时生效)
	draggable: {
		type: Boolean,
		default: false
	},
	// z-index 层级
	zIndex: {
		type: [String, Number],
		default: 999
	},
	// 圆角大小
	borderRadius: {
		type: String,
		default: '16rpx'
	},
	// 是否显示动画
	animation: {
		type: Boolean,
		default: true
	},
	// 动画持续时间
	animationDuration: {
		type: String,
		default: '300ms'
	}
});

// Emits 定义
const emit = defineEmits(['update:modelValue', 'open', 'close', 'opened', 'closed']);

// 响应式数据
const showAnimation = ref(false);
const dragState = ref({
	startX: 0,
	startY: 0,
	currentX: 0,
	currentY: 0,
	isDragging: false
});

// 浮窗样式
const windowStyle = computed(() => {
	const style = {
		zIndex: props.zIndex,
		animationDuration: props.animation ? props.animationDuration : '0ms'
	};

	// 处理宽度
	if (typeof props.width === 'number') {
		style.width = `${props.width}px`;
	} else {
		style.width = props.width;
	}

	// 处理高度
	if (typeof props.height === 'number') {
		style.height = `${props.height}px`;
	} else if (props.height !== 'auto') {
		style.height = props.height;
	}

	// 自定义位置
	if (props.customPosition.x) {
		style.left = props.customPosition.x;
	}
	if (props.customPosition.y) {
		style.top = props.customPosition.y;
	}

	return style;
});

// 内容区域样式
const contentStyle = computed(() => {
	const style = {};

	if (typeof props.maxHeight === 'number') {
		style.maxHeight = `${props.maxHeight}px`;
	} else {
		style.maxHeight = props.maxHeight;
	}

	return style;
});

// 关闭浮窗
const close = () => {
	emit('update:modelValue', false);
	emit('close');
};

// 打开浮窗
const open = () => {
	emit('update:modelValue', true);
	emit('open');
};

// 点击遮罩
const handleMaskClick = () => {
	if (props.maskClosable) {
		close();
	}
};

// 拖拽相关方法
const handleTouchStart = (e) => {
	if (!props.draggable) return;

	const touch = e.touches[0];
	dragState.value = {
		startX: touch.clientX,
		startY: touch.clientY,
		currentX: touch.clientX,
		currentY: touch.clientY,
		isDragging: true
	};
};

const handleTouchMove = (e) => {
	if (!props.draggable || !dragState.value.isDragging) return;

	e.preventDefault();
	const touch = e.touches[0];
	dragState.value.currentX = touch.clientX;
	dragState.value.currentY = touch.clientY;
};

const handleTouchEnd = () => {
	if (!props.draggable || !dragState.value.isDragging) return;

	dragState.value.isDragging = false;

	// 计算偏移量
	const deltaX = dragState.value.currentX - dragState.value.startX;
	const deltaY = dragState.value.currentY - dragState.value.startY;

	// 如果有移动，触发拖拽事件
	if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
		emit('drag-end', {
			deltaX,
			deltaY,
			x: dragState.value.currentX,
			y: dragState.value.currentY
		});
	}
};

// 监听显示状态变化
watch(() => props.modelValue, (newVal) => {
	if (newVal) {
		showAnimation.value = true;
		emit('open');
		nextTick(() => {
			emit('opened');
		});
	} else {
		emit('close');
		// 动画结束后再隐藏 DOM
		setTimeout(() => {
			if (!props.modelValue) {
				showAnimation.value = false;
				emit('closed');
			}
		}, props.animation ? 300 : 0);
	}
});

// 暴露方法给父组件
defineExpose({
	open,
	close
});
</script>

<style lang="scss" scoped>
.float-window-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	pointer-events: none;
	z-index: 999;
}

.float-window-mask {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	opacity: 0;
	transition: opacity 300ms ease;
	pointer-events: auto;

	&.mask-show {
		opacity: 1;
	}
}

.float-window-wrapper {
	position: absolute;
	pointer-events: auto;
	opacity: 0;
	transform: scale(0.9);
	transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);

	&.window-show {
		opacity: 1;
		transform: scale(1);
	}
}

// 位置样式
.float-window-top-left {
	top: 20rpx;
	left: 20rpx;
}

.float-window-top-center {
	top: 20rpx;
	left: 50%;
	transform: translateX(-50%) scale(0.9);

	&.window-show {
		transform: translateX(-50%) scale(1);
	}
}

.float-window-top-right {
	top: 20rpx;
	right: 20rpx;
}

.float-window-center {
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%) scale(0.9);

	&.window-show {
		transform: translate(-50%, -50%) scale(1);
	}
}

.float-window-center-left {
	top: 50%;
	left: 20rpx;
	transform: translateY(-50%) scale(0.9);

	&.window-show {
		transform: translateY(-50%) scale(1);
	}
}

.float-window-center-right {
	top: 50%;
	right: 20rpx;
	transform: translateY(-50%) scale(0.9);

	&.window-show {
		transform: translateY(-50%) scale(1);
	}
}

.float-window-bottom-left {
	bottom: 20rpx;
	left: 20rpx;
}

.float-window-bottom-center {
	bottom: 20rpx;
	left: 50%;
	transform: translateX(-50%) scale(0.9);

	&.window-show {
		transform: translateX(-50%) scale(1);
	}
}

.float-window-bottom-right {
	bottom: 20rpx;
	right: 20rpx;
}

.float-window {
	background-color: #fff;
	border-radius: v-bind(borderRadius);
	box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.15);
	overflow: hidden;
	display: flex;
	flex-direction: column;
	max-height: 100vh;

	&.is-draggable {
		cursor: move;
	}
}

.float-window-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
	background-color: #fff;
	flex-shrink: 0;

	.header-title {
		flex: 1;
		overflow: hidden;

		.title-text {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
	}

	.header-close {
		width: 40rpx;
		height: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: background-color 200ms;

		&:active {
			background-color: #f5f5f5;
		}
	}
}

.float-window-content {
	flex: 1;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
	padding: 30rpx;
}

.float-window-footer {
	padding: 20rpx 30rpx;
	border-top: 1rpx solid #f0f0f0;
	background-color: #fafafa;
	flex-shrink: 0;
	display: flex;
	gap: 20rpx;

	&::v-deep button {
		flex: 1;
	}
}
</style>
