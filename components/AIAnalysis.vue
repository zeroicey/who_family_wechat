<template>
	<view class="ai-analysis-container">
		<!-- 浮动按钮 -->
		<view
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
			position="bottom-right"
			:width="windowWidth"
			:max-height="maxWindowHeight"
			:mask="true"
			:animation="true"
			@open="handleOpen"
			@close="handleClose"
		>
			<!-- 加载状态 -->
			<view v-if="loading" class="loading-container">
				<view class="loading-spinner">
					<uni-icons type="spinner-cycle" size="40" color="#007aff"></uni-icons>
				</view>
				<text class="loading-text">{{ loadingText }}</text>
			</view>

			<!-- 分析结果 -->
			<view v-else class="analysis-content">
				<!-- 总体评价 -->
				<view class="analysis-section">
					<view class="section-header">
						<uni-icons type="flag-filled" size="18" color="#007aff"></uni-icons>
						<text class="section-title">总体评价</text>
					</view>
					<view class="section-body">
						<text class="summary-text">{{ analysisData.summary }}</text>
					</view>
				</view>

				<!-- 数据亮点 -->
				<view v-if="analysisData.highlights && analysisData.highlights.length > 0" class="analysis-section">
					<view class="section-header">
						<uni-icons type="star-filled" size="18" color="#ff9800"></uni-icons>
						<text class="section-title">数据亮点</text>
					</view>
					<view class="highlight-list">
						<view
							v-for="(item, index) in analysisData.highlights"
							:key="index"
							class="highlight-item"
						>
							<view class="highlight-dot" :style="{ backgroundColor: item.color }"></view>
							<text class="highlight-text">{{ item.text }}</text>
						</view>
					</view>
				</view>

				<!-- 提升建议 -->
				<view v-if="analysisData.suggestions && analysisData.suggestions.length > 0" class="analysis-section">
					<view class="section-header">
						<uni-icons type="paperplane-filled" size="18" color="#4caf50"></uni-icons>
						<text class="section-title">提升建议</text>
					</view>
					<view class="suggestion-list">
						<view
							v-for="(item, index) in analysisData.suggestions"
							:key="index"
							class="suggestion-card"
						>
							<view class="suggestion-icon">
								<text>{{ index + 1 }}</text>
							</view>
							<view class="suggestion-content">
								<text class="suggestion-title">{{ item.title }}</text>
								<text class="suggestion-desc">{{ item.description }}</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 注意事项 -->
				<view v-if="analysisData.warnings && analysisData.warnings.length > 0" class="analysis-section">
					<view class="section-header">
						<uni-icons type="info-filled" size="18" color="#ff5722"></uni-icons>
						<text class="section-title">注意事项</text>
					</view>
					<view class="warning-list">
						<view
							v-for="(item, index) in analysisData.warnings"
							:key="index"
							class="warning-item"
						>
							<uni-icons type="circle-filled" size="12" color="#ff5722"></uni-icons>
							<text class="warning-text">{{ item }}</text>
						</view>
					</view>
				</view>

				<!-- 数据统计 -->
				<view v-if="analysisData.stats" class="analysis-section stats-section">
					<view class="stats-grid">
						<view
							v-for="(stat, key) in analysisData.stats"
							:key="key"
							class="stat-item"
						>
							<text class="stat-value">{{ stat.value }}</text>
							<text class="stat-label">{{ stat.label }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 底部操作栏 -->
			<template #footer>
				<button class="footer-btn secondary" @click="handleCopy">
					复制分析
				</button>
				<button class="footer-btn primary" @click="handleRefresh">
					重新分析
				</button>
			</template>
		</FloatWindow>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue';
import FloatWindow from './FloatWindow.vue';

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
const loading = ref(false);
const loadingText = ref('正在分析数据...');
const showPulse = ref(true);

// 分析结果数据
const analysisData = ref({
	summary: '',
	highlights: [],
	suggestions: [],
	warnings: [],
	stats: {}
});

// Mock 数据生成
const generateMockAnalysis = () => {
	if (props.type === 'grade') {
		return generateGradeAnalysis();
	} else {
		return generateScheduleAnalysis();
	}
};

// 成绩分析 Mock 数据
const generateGradeAnalysis = () => {
	return {
		summary: '本学期整体表现良好，平均分82.5分，在专业排名中处于中上游水平。理工科课程成绩较为稳定，但需要加强英语类课程的学习投入。',
		highlights: [
			{ text: '程序设计基础 95分 - 优秀', color: '#4caf50' },
			{ text: '平均绩点 3.65 - 良好', color: '#2196f3' },
			{ text: '总学分 32学分', color: '#ff9800' }
		],
		suggestions: [
			{
				title: '加强英语学习',
				description: '大学英语成绩相对较弱，建议每天安排1-2小时进行英语听说练习，推荐使用背单词APP和英语听力材料。'
			},
			{
				title: '保持理工科优势',
				description: '数学和编程类课程表现优异，可以继续深入，建议参加相关竞赛或项目实践。'
			},
			{
				title: '平衡各科学习时间',
				description: '根据学分分配学习时间，重点关注的课程应分配更多精力，避免偏科现象。'
			}
		],
		warnings: [
			'大学英语成绩需重点关注，建议提前准备四六级考试',
			'下学期课程难度可能增加，建议提前预习'
		],
		stats: {
			totalCourses: { label: '总课程', value: '8门' },
			avgScore: { label: '平均分', value: '82.5' },
			maxScore: { label: '最高分', value: '95' },
			minScore: { label: '最低分', value: '72' },
			totalCredits: { label: '总学分', value: '32' }
		}
	};
};

// 课表分析 Mock 数据
const generateScheduleAnalysis = () => {
	return {
		summary: '本学期课程安排较为合理，每周共24课时，主要集中在周一至周五的上午时段。周三下午无课，可用于自习或参加社团活动。建议合理利用空档时间，提高学习效率。',
		highlights: [
			{ text: '周三下午空闲 - 自习黄金时间', color: '#4caf50' },
			{ text: '早八课程 3门 - 注意作息', color: '#ff9800' },
			{ text: '周五课程最少 - 周末放松', color: '#2196f3' }
		],
		suggestions: [
			{
				title: '利用周三下午',
				description: '周三下午有连续4小时空闲时间，非常适合安排小组讨论、实验室工作或深度学习，建议提前规划。'
			},
			{
				title: '早八作息调整',
				description: '周一、周三、周五都有早八课程，建议养成早起习惯，保证充足睡眠，避免上课精神不佳。'
			},
			{
				title: '课间休息利用',
				description: '上午课程较为密集，建议在课间适当休息和走动，保持良好的学习状态。'
			},
			{
				title: '预习复习安排',
				description: '周二、周四课程较多，建议周一晚上和周三晚上提前预习第二天的课程内容。'
			}
		],
		warnings: [
			'周一上午连续4节课，注意准备早餐和水',
			'周五下午课程集中到18:30结束，注意晚餐安排'
		],
		stats: {
			weeklyHours: { label: '周课时', value: '24h' },
			dailyAvg: { label: '日均课时', value: '4.8h' },
			morningCourses: { label: '上午课程', value: '12节' },
			freeAfternoon: { label: '空闲下午', value: '1个' }
		}
	};
};

// 切换浮窗显示
const toggleWindow = () => {
	windowVisible.value = !windowVisible.value;
};

// 打开浮窗
const handleOpen = () => {
	showPulse.value = false;
	loading.value = true;
	loadingText.value = '正在分析数据...';

	// 模拟AI分析请求
	setTimeout(() => {
		analysisData.value = generateMockAnalysis();
		loading.value = false;
		emit('open');
	}, 1500);

	emit('analyze', props.type);
};

// 关闭浮窗
const handleClose = () => {
	emit('close');
};

// 复制分析结果
const handleCopy = () => {
	let copyText = `【AI${props.type === 'grade' ? '成绩' : '课表'}分析报告】\n\n`;
	copyText += `总体评价：\n${analysisData.value.summary}\n\n`;

	if (analysisData.value.highlights.length > 0) {
		copyText += `数据亮点：\n`;
		analysisData.value.highlights.forEach(item => {
			copyText += `  • ${item.text}\n`;
		});
		copyText += `\n`;
	}

	if (analysisData.value.suggestions.length > 0) {
		copyText += `提升建议：\n`;
		analysisData.value.suggestions.forEach((item, index) => {
			copyText += `${index + 1}. ${item.title}\n   ${item.description}\n`;
		});
		copyText += `\n`;
	}

	if (analysisData.value.warnings.length > 0) {
		copyText += `注意事项：\n`;
		analysisData.value.warnings.forEach(item => {
			copyText += `  • ${item}\n`;
		});
	}

	uni.setClipboardData({
		data: copyText,
		success: () => {
			uni.showToast({
				title: '复制成功',
				icon: 'success'
			});
		}
	});
};

// 重新分析
const handleRefresh = () => {
	loading.value = true;
	loadingText.value = '正在重新分析...';

	setTimeout(() => {
		analysisData.value = generateMockAnalysis();
		loading.value = false;
		uni.showToast({
			title: '分析完成',
			icon: 'success'
		});
	}, 1000);
};

// 暴露方法
defineExpose({
	open: () => {
		windowVisible.value = true;
		handleOpen();
	},
	close: () => {
		windowVisible.value = false;
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
	bottom: 100rpx;
	display: flex;
	align-items: center;
	gap: 10rpx;
	padding: 20rpx 24rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 50rpx;
	box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);
	pointer-events: auto;
	z-index: 1001;
	transition: all 300ms ease;

	&.btn-pulse {
		animation: pulse 2s infinite;
	}

	&:active {
		transform: scale(0.95);
	}

	.btn-text {
		font-size: 26rpx;
		color: #fff;
		font-weight: 500;
	}
}

@keyframes pulse {
	0%, 100% {
		box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);
	}
	50% {
		box-shadow: 0 8rpx 40rpx rgba(102, 126, 234, 0.6);
	}
}

// 加载状态
.loading-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 80rpx 40rpx;

	.loading-spinner {
		margin-bottom: 30rpx;
		animation: spin 1s linear infinite;
	}

	.loading-text {
		font-size: 28rpx;
		color: #666;
	}
}

@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

// 分析内容
.analysis-content {
	.analysis-section {
		margin-bottom: 30rpx;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: 10rpx;
		margin-bottom: 20rpx;

		.section-title {
			font-size: 28rpx;
			font-weight: bold;
			color: #333;
		}
	}

	.section-body {
		padding: 20rpx;
		background-color: #f8f9fa;
		border-radius: 12rpx;

		.summary-text {
			font-size: 26rpx;
			color: #666;
			line-height: 1.8;
		}
	}
}

// 数据亮点
.highlight-list {
	display: flex;
	flex-direction: column;
	gap: 15rpx;

	.highlight-item {
		display: flex;
		align-items: center;
		gap: 15rpx;
		padding: 16rpx 20rpx;
		background-color: #f8f9fa;
		border-radius: 12rpx;

		.highlight-dot {
			width: 12rpx;
			height: 12rpx;
			border-radius: 50%;
			flex-shrink: 0;
		}

		.highlight-text {
			font-size: 26rpx;
			color: #333;
		}
	}
}

// 提升建议
.suggestion-list {
	display: flex;
	flex-direction: column;
	gap: 15rpx;

	.suggestion-card {
		display: flex;
		gap: 15rpx;
		padding: 20rpx;
		background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
		border-radius: 12rpx;
		border: 1rpx solid #eee;

		.suggestion-icon {
			width: 40rpx;
			height: 40rpx;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;

			text {
				font-size: 20rpx;
				color: #fff;
				font-weight: bold;
			}
		}

		.suggestion-content {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 8rpx;

			.suggestion-title {
				font-size: 28rpx;
				font-weight: 500;
				color: #333;
			}

			.suggestion-desc {
				font-size: 24rpx;
				color: #999;
				line-height: 1.6;
			}
		}
	}
}

// 注意事项
.warning-list {
	display: flex;
	flex-direction: column;
	gap: 12rpx;

	.warning-item {
		display: flex;
		align-items: flex-start;
		gap: 10rpx;
		padding: 16rpx 20rpx;
		background-color: #fff3e0;
		border-radius: 12rpx;
		border-left: 4rpx solid #ff5722;

		.warning-text {
			flex: 1;
			font-size: 26rpx;
			color: #666;
			line-height: 1.6;
		}
	}
}

// 数据统计
.stats-section {
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 15rpx;

		.stat-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 20rpx 10rpx;
			background: linear-gradient(135deg, #e3f2fd 0%, #fff 100%);
			border-radius: 12rpx;

			.stat-value {
				font-size: 32rpx;
				font-weight: bold;
				color: #007aff;
				margin-bottom: 8rpx;
			}

			.stat-label {
				font-size: 22rpx;
				color: #999;
			}
		}
	}
}

// 底部按钮
.footer-btn {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	height: 76rpx;
	border-radius: 38rpx;
	font-size: 28rpx;
	font-weight: 500;
	border: none;
	transition: all 200ms;

	&.secondary {
		background-color: #f5f5f5;
		color: #333;

		&:active {
			background-color: #ebebeb;
		}
	}

	&.primary {
		background: linear-gradient(135deg, #007aff 0%, #5ac8fa 100%);
		color: #fff;
		box-shadow: 0 4rpx 16rpx rgba(0, 122, 255, 0.3);

		&:active {
			opacity: 0.85;
			transform: scale(0.98);
		}
	}
}
</style>
