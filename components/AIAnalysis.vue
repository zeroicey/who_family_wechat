<template>
	<view class="ai-analysis-container">
		<!-- 浮动按钮 -->
		<view
			v-if="!windowVisible"
			class="ai-float-btn"
			:class="{ 'btn-pulse': showPulse }"
			@click="toggleWindow"
		>
			<uni-icons
				type="chatbubble-filled"
				:size="24"
				color="#fff"
			></uni-icons>
			<text class="btn-text">AI分析</text>
		</view>

		<!-- AI分析浮窗 -->
		<FloatWindow
			v-model="windowVisible"
			:title="windowTitle"
			position="center"
			:width="windowWidth"
			:max-height="maxWindowHeight"
			:mask="true"
			:animation="true"
			@open="handleOpen"
			@close="handleClose"
		>
			<!-- AI分析消息组件 - 专门用于浮窗显示 -->
			<view class="ai-analysis-content">
				<AIAnalysisMessage
					v-if="windowVisible"
					:content="aiResponse"
					:isTyping="isStreaming"
				/>
			</view>
		</FloatWindow>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import FloatWindow from './FloatWindow.vue';
import AIAnalysisMessage from './helper/AIAnalysisMessage.vue';
import { analyzeGradesStream, analyzeScheduleStream } from '@/api/helper.js';

// Props
const props = defineProps({
	// 分析类型: grade (成绩) | schedule (课表)
	type: {
		type: String,
		default: 'grade'
	},
	// 数据源
	data: {
		type: [Array, Object],
		default: () => []
	},
	// 当前周次 (课表分析需要)
	currentWeek: {
		type: String,
		default: '1'
	},
	// 浮窗标题
	windowTitle: {
		type: String,
		default: 'AI智能分析'
	},
	// 浮窗宽度
	windowWidth: {
		type: String,
		default: '620rpx'
	},
	// 浮窗最大高度
	maxWindowHeight: {
		type: String,
		default: '65vh'
	}
});

// Emits
const emit = defineEmits(['open', 'close', 'analyze']);

// 响应式数据
const windowVisible = ref(false);
const showPulse = ref(true);
const aiResponse = ref('');
const isStreaming = ref(false);

// 当前流式请求的取消函数
let currentCancelFn = null;

// 切换浮窗显示
const toggleWindow = () => {
	windowVisible.value = !windowVisible.value;
};

// 打开浮窗
const handleOpen = () => {
	showPulse.value = false;

	// 检查数据是否为空
	if (!props.data || (Array.isArray(props.data) && props.data.length === 0)) {
		aiResponse.value = '_暂无数据可供分析_';
		isStreaming.value = false;
		emit('open');
		emit('analyze', props.type);
		return;
	}

	// 开始流式分析
	isStreaming.value = true;
	aiResponse.value = '';

	try {
		if (props.type === 'grade') {
			// 成绩分析
			currentCancelFn = analyzeGradesStream(
				props.data,
				// onChunk - 接收每个数据块
				(chunk, fullContent) => {
					aiResponse.value = fullContent;
				},
				// onComplete - 流式输出完成
				(fullContent) => {
					isStreaming.value = false;
					currentCancelFn = null;
				},
				// onError - 发生错误
				(error) => {
					console.error('成绩分析失败:', error);
					isStreaming.value = false;
					aiResponse.value = '抱歉，AI分析失败，请稍后重试。';
					currentCancelFn = null;
				}
			);
		} else if (props.type === 'schedule') {
			// 课表分析
			currentCancelFn = analyzeScheduleStream(
				props.data,
				props.currentWeek,
				// onChunk - 接收每个数据块
				(chunk, fullContent) => {
					aiResponse.value = fullContent;
				},
				// onComplete - 流式输出完成
				(fullContent) => {
					isStreaming.value = false;
					currentCancelFn = null;
				},
				// onError - 发生错误
				(error) => {
					console.error('课表分析失败:', error);
					isStreaming.value = false;
					aiResponse.value = '抱歉，AI分析失败，请稍后重试。';
					currentCancelFn = null;
				}
			);
		}
	} catch (error) {
		console.error('启动AI分析失败:', error);
		isStreaming.value = false;
		aiResponse.value = '抱歉，AI分析服务异常，请稍后重试。';
	}

	emit('open');
	emit('analyze', props.type);
};

// 关闭浮窗
const handleClose = () => {
	// 取消正在进行的流式请求
	if (currentCancelFn) {
		currentCancelFn();
		currentCancelFn = null;
	}
	isStreaming.value = false;
	emit('close');
};

// 暴露方法
defineExpose({
	open: () => {
		windowVisible.value = true;
		handleOpen();
	},
	close: () => {
		windowVisible.value = false;
		handleClose();
	}
});
</script>

<style lang="scss" scoped>
.ai-analysis-container {
	position: fixed;
	right: 0;
	bottom: 0;
	z-index: 1000;
	pointer-events: none;
}

// 浮动按钮
.ai-float-btn {
	position: fixed;
	right: 30rpx;
	bottom: 120rpx;
	display: flex;
	align-items: center;
	gap: 10rpx;
	padding: 20rpx 24rpx;
	background: linear-gradient(135deg, #6d4aff, #8d6bff);
	border-radius: 50rpx;
	box-shadow: 0 16rpx 32rpx rgba(109, 74, 255, 0.22);
	pointer-events: auto;
	z-index: 1001;
	transition: all 300ms ease;

	&.btn-pulse {
		animation: pulse 2s infinite;
	}

	&:active {
		transform: scale(0.95);
		background-color: #0066cc;
	}

	.btn-text {
		font-size: 26rpx;
		color: #fff;
		font-weight: 500;
	}
}

@keyframes pulse {
	0%, 100% {
		box-shadow: 0 16rpx 32rpx rgba(109, 74, 255, 0.22);
	}
	50% {
		box-shadow: 0 4rpx 24rpx rgba(0, 122, 255, 0.4);
	}
}

// AI分析内容容器
.ai-analysis-content {
	width: 100%;
	box-sizing: border-box;
	// 不设置padding，因为FloatWindow已经有padding了
}
</style>
