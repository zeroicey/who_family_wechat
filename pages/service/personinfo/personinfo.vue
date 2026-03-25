<template>
	<view class="monitor-page">
		<!-- 顶部标题卡片 -->
		<view class="header-card">
			<view class="header-bg"></view>
			<view class="header-content">
				<view class="header-main">
					<text class="header-title">校园实时监测</text>
					<text class="header-subtitle">Campus Real-time Monitoring</text>
				</view>
				<view class="header-badge">
					<view class="live-dot"></view>
					<text class="live-text">实时</text>
				</view>
			</view>
		</view>

		<!-- 第一层：主分类分段器 -->
		<view class="segment-control">
			<view
				v-for="(category, index) in categories"
				:key="index"
				class="segment-item"
				:class="{ active: currentCategory === category }"
				@tap="handleCategoryChange(category)"
			>
				<text class="segment-text">{{ category }}</text>
			</view>
		</view>

		<!-- 第二层：具体地点胶囊滚动 -->
		<view class="location-switcher">
			<scroll-view scroll-x :show-scrollbar="false" class="location-scroll">
				<view class="location-list">
					<view
						v-for="(location, index) in currentLocations"
						:key="index"
						class="location-pill"
						:class="{ active: currentLocation === location }"
						@tap="handleLocationChange(location)"
					>
						<text class="pill-text">{{ location }}</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 人流监测卡片 -->
		<view class="crowd-card">
			<!-- 卡片标题 -->
			<view class="card-header">
				<view class="title-accent"></view>
				<view class="title-group">
					<text class="card-title">人流监测</text>
					<text class="card-subtitle">CROWD MONITORING</text>
				</view>
				<view class="current-location-badge">
					<text>{{ currentLocation }}</text>
				</view>
			</view>

			<!-- 人型图标展示 -->
			<view class="crowd-visual">
				<view class="person-grid">
					<view
						v-for="(_, index) in 5"
						:key="index"
						class="person-item"
					>
						<view
							class="person-icon"
							:style="{ backgroundColor: getPersonColor(index) }"
						></view>
					</view>
				</view>
			</view>

			<!-- 状态信息 -->
			<view class="crowd-status">
				<view class="status-badge" :class="'status-' + crowdStatus">
					<view class="status-indicator"></view>
					<text class="status-label">{{ statusLabel }}</text>
				</view>
				<text class="percent-value">{{ currentPercentage }}%</text>
			</view>

			<!-- 进度条 -->
			<view class="progress-track">
				<view class="progress-fill" :style="{ width: currentPercentage + '%', backgroundColor: statusColor }"></view>
			</view>

			<!-- 场景化动态建议 -->
			<view class="advice-box" :class="'advice-' + crowdStatus">
				<view class="advice-icon">
					<text>{{ adviceIcon }}</text>
				</view>
				<text class="advice-text">{{ adviceText }}</text>
			</view>

			<!-- 数据更新时间 -->
			<view class="data-timestamp">
				<text>数据更新于：{{ updateTime }} (无人机与课表系统联合分析)</text>
			</view>
		</view>

		<!-- 环境/天气卡片 -->
		<view class="weather-card">
			<!-- 卡片标题 -->
			<view class="card-header">
				<view class="title-accent green"></view>
				<view class="title-group">
					<text class="card-title">环境感知</text>
					<text class="card-subtitle">ENVIRONMENT</text>
				</view>
			</view>

			<!-- 天气主数据 -->
			<view class="weather-main">
				<!-- 左侧：天气图标 + 温度 -->
				<view class="weather-left">
					<view class="weather-icon-wrap">
						<text class="weather-icon">{{ weatherEmoji }}</text>
					</view>
					<view class="temp-group">
						<text class="temp-value">{{ weatherData.temperature }}</text>
						<text class="temp-unit">°C</text>
					</view>
					<text class="weather-desc">{{ weatherData.weather }}</text>
				</view>
				<!-- 右侧：PM2.5 + 空气质量 -->
				<view class="weather-right">
					<view class="metric-row">
						<text class="metric-label">PM2.5</text>
						<view class="metric-value-group">
							<text class="metric-num">{{ weatherData.pm25 }}</text>
							<text class="metric-unit">μg/m³</text>
						</view>
					</view>
					<view class="metric-row">
						<text class="metric-label">空气质量</text>
						<view class="aqi-badge" :class="'aqi-' + weatherData.aqiLevel">
							<text>{{ weatherData.aqiLabel }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 数据更新时间 -->
			<view class="data-timestamp">
				<text>数据更新于：{{ updateTime }} (无人机与课表系统联合分析)</text>
			</view>
		</view>

		<!-- 底部安全区 -->
		<view class="safe-footer">
			<text class="footer-text">数据仅供参考 · 请以实际情况为准</text>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';

// ==================== 数据结构定义 ====================
// 校园地点数据源
const campusData = reactive({
	'教学楼': ['AB栋', 'H栋', 'C栋', 'G栋', 'D栋', 'E栋', 'F栋', '体育馆'],
	'饭堂': ['学四饭堂', '学五饭堂', '学二饭堂', '学二饭堂楼下'],
	'校道': ['星光大道', '行政楼路口', '钟楼到java宿舍', 'EF栋一楼路', '图书馆到学五路', '操场c栋', '图书馆到东南二门路线']
});

// 模拟人流百分比数据 (地点 -> 百分比)
const mockPercentages = reactive({
	// 教学楼
	'AB栋': 72,
	'H栋': 35,
	'C栋': 88,
	'G栋': 28,
	'D栋': 55,
	'E栋': 45,
	'F栋': 15,
	'体育馆': 62,
	// 饭堂
	'学四饭堂': 42,
	'学五饭堂': 78,
	'学二饭堂': 18,
	'学二饭堂楼下': 92,
	// 校道
	'星光大道': 35,
	'行政楼路口': 65,
	'钟楼到java宿舍': 22,
	'EF栋一楼路': 48,
	'图书馆到学五路': 75,
	'操场c栋': 30,
	'图书馆到东南二门路线': 55
});

// 主分类列表
const categories = computed(() => Object.keys(campusData));

// 当前选中的主分类
const currentCategory = ref('教学楼');

// 当前选中的具体地点
const currentLocation = ref('AB栋');

// 更新时间
const updateTime = ref('2026-03-23 18:30:00');

// 天气数据
const weatherData = reactive({
	aqiLevel: 'good',
	aqiLabel: '良',
	pm25: 35,
	weather: '多云',
	temperature: 26
});

// ==================== 状态配置 ====================
const statusConfig = {
	comfortable: { label: '舒适', color: '#4CAF50', icon: '✓' },
	moderate: { label: '适中', color: '#2196F3', icon: '◐' },
	crowded: { label: '拥挤', color: '#FF9800', icon: '◑' },
	saturated: { label: '饱和', color: '#F44336', icon: '✕' }
};

// 场景化建议配置
const adviceConfig = {
	'教学楼': {
		comfortable: '空教室较多，适合自习与学习',
		moderate: '部分教室有空位，学习环境良好',
		crowded: '正值课间或考试周，教室座位紧张',
		saturated: '教学楼人流已达上限，建议前往其他区域'
	},
	'饭堂': {
		comfortable: '空位充足，点餐无需等待',
		moderate: '人流正常，点餐基本无需等待',
		crowded: '正值就餐高峰，预计需要排队寻找座位',
		saturated: '人流已达上限，建议错峰就餐或选择打包'
	},
	'校道': {
		comfortable: '道路通畅，可正常通行',
		moderate: '人流适中，通行无阻',
		crowded: '人流密集，请慢行注意安全',
		saturated: '道路拥挤，建议绕行或稍后通过'
	}
};

const aqiConfig = {
	excellent: { emoji: '☀️', label: '优' },
	good: { emoji: '🌤️', label: '良' },
	light: { emoji: '⛅', label: '轻度污染' },
	moderate: { emoji: '🌥️', label: '中度污染' },
	heavy: { emoji: '🌫️', label: '重度污染' }
};

const inactiveColor = '#E8E8E8';

// ==================== 计算属性 ====================
// 当前分类下的地点列表
const currentLocations = computed(() => campusData[currentCategory.value] || []);

// 当前人流百分比
const currentPercentage = computed(() => mockPercentages[currentLocation.value] || 0);

// 当前拥挤状态
const crowdStatus = computed(() => {
	const p = currentPercentage.value;
	if (p < 20) return 'comfortable';
	if (p <= 60) return 'moderate';
	if (p <= 80) return 'crowded';
	return 'saturated';
});

// 状态标签
const statusLabel = computed(() => statusConfig[crowdStatus.value]?.label || '适中');

// 状态颜色
const statusColor = computed(() => statusConfig[crowdStatus.value]?.color || '#2196F3');

// 建议图标
const adviceIcon = computed(() => statusConfig[crowdStatus.value]?.icon || '◐');

// 场景化建议文案
const adviceText = computed(() => {
	return adviceConfig[currentCategory.value]?.[crowdStatus.value] || '暂无建议';
});

// 天气图标
const weatherEmoji = computed(() => aqiConfig[weatherData.aqiLevel]?.emoji || '🌤️');

// ==================== 方法 ====================
// 获取人形图标颜色
const getPersonColor = (index) => {
	const threshold = (index + 1) * 20;
	if (currentPercentage.value >= threshold) {
		return statusColor.value;
	}
	if (currentPercentage.value > index * 20) {
		return statusColor.value;
	}
	return inactiveColor;
};

// 切换主分类
const handleCategoryChange = (category) => {
	if (currentCategory.value === category) return;
	currentCategory.value = category;
	// 自动选择该分类下的第一个地点
	const locations = campusData[category];
	if (locations && locations.length > 0) {
		currentLocation.value = locations[0];
	}

	uni.showToast({
		title: `已切换至${category}`,
		icon: 'none',
		duration: 1500
	});
};

// 切换具体地点
const handleLocationChange = (location) => {
	if (currentLocation.value === location) return;
	currentLocation.value = location;

	uni.showToast({
		title: `已选择 ${location}`,
		icon: 'none',
		duration: 1500
	});
};
</script>

<style lang="scss" scoped>
// ==================== 设计变量 ====================
$primary-green: #4CAF50;
$primary-green-light: #66BB6A;
$primary-green-gradient: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
$card-radius: 20rpx;
$card-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);

// ==================== 页面容器 ====================
.monitor-page {
	min-height: 100vh;
	background: #F5F5F7;
	padding: 24rpx 24rpx calc(env(safe-area-inset-bottom) + 24rpx);
}

// ==================== 顶部标题卡片 ====================
.header-card {
	position: relative;
	background: $primary-green-gradient;
	border-radius: $card-radius;
	padding: 36rpx 32rpx;
	margin-bottom: 24rpx;
	overflow: hidden;
	box-shadow: 0 8rpx 32rpx rgba(76, 175, 80, 0.25);

	.header-bg {
		position: absolute;
		top: -50%;
		right: -20%;
		width: 280rpx;
		height: 280rpx;
		background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
		pointer-events: none;
	}

	.header-content {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.header-main {
			.header-title {
				display: block;
				font-size: 40rpx;
				font-weight: 700;
				color: #FFFFFF;
				letter-spacing: 2rpx;
				margin-bottom: 8rpx;
			}

			.header-subtitle {
				display: block;
				font-size: 22rpx;
				font-weight: 400;
				color: rgba(255, 255, 255, 0.85);
				letter-spacing: 1rpx;
			}
		}

		.header-badge {
			display: flex;
			align-items: center;
			gap: 8rpx;
			padding: 12rpx 20rpx;
			background: rgba(255, 255, 255, 0.2);
			border-radius: 20rpx;

			.live-dot {
				width: 12rpx;
				height: 12rpx;
				background: #FFFFFF;
				border-radius: 50%;
				animation: pulse 2s infinite;
			}

			.live-text {
				font-size: 22rpx;
				font-weight: 600;
				color: #FFFFFF;
			}
		}
	}
}

@keyframes pulse {
	0%, 100% { opacity: 1; transform: scale(1); }
	50% { opacity: 0.6; transform: scale(1.3); }
}

// ==================== 第一层：主分类分段器 ====================
.segment-control {
	display: flex;
	background: #FFFFFF;
	border-radius: 16rpx;
	padding: 6rpx;
	margin-bottom: 20rpx;
	box-shadow: $card-shadow;

	.segment-item {
		flex: 1;
		padding: 20rpx 0;
		text-align: center;
		border-radius: 12rpx;
		transition: all 0.3s ease;

		&.active {
			background: $primary-green-gradient;
			box-shadow: 0 4rpx 16rpx rgba(76, 175, 80, 0.3);

			.segment-text {
				color: #FFFFFF;
				font-weight: 600;
			}
		}

		.segment-text {
			font-size: 28rpx;
			color: #3A3A3C;
			font-weight: 500;
			transition: color 0.3s ease;
		}
	}
}

// ==================== 第二层：具体地点滚动 ====================
.location-switcher {
	margin-bottom: 24rpx;

	.location-scroll {
		white-space: nowrap;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	.location-list {
		display: inline-flex;
		gap: 12rpx;
		padding: 4rpx 0;
	}

	.location-pill {
		flex-shrink: 0;
		padding: 16rpx 28rpx;
		background: #FFFFFF;
		border-radius: 28rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
		transition: all 0.3s ease;

		&:active {
			transform: scale(0.96);
		}

		&.active {
			background: $primary-green-gradient;
			box-shadow: 0 4rpx 20rpx rgba(76, 175, 80, 0.35);

			.pill-text {
				color: #FFFFFF;
				font-weight: 600;
			}
		}

		.pill-text {
			font-size: 26rpx;
			color: #3A3A3C;
			font-weight: 500;
			transition: color 0.3s ease;
		}
	}
}

// ==================== 通用卡片标题 ====================
.card-header {
	display: flex;
	align-items: center;
	margin-bottom: 24rpx;

	.title-accent {
		width: 6rpx;
		height: 36rpx;
		background: $primary-green-gradient;
		border-radius: 3rpx;
		margin-right: 16rpx;

		&.green {
			background: $primary-green-gradient;
		}
	}

	.title-group {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 4rpx;

		.card-title {
			font-size: 30rpx;
			font-weight: 600;
			color: #1C1C1E;
		}

		.card-subtitle {
			font-size: 20rpx;
			color: #8E8E93;
			letter-spacing: 1rpx;
		}
	}

	.current-location-badge {
		padding: 8rpx 16rpx;
		background: rgba(76, 175, 80, 0.1);
		border-radius: 12rpx;

		text {
			font-size: 22rpx;
			color: #4CAF50;
			font-weight: 500;
		}
	}
}

// ==================== 人流监测卡片 ====================
.crowd-card {
	background: #FFFFFF;
	border-radius: $card-radius;
	padding: 28rpx;
	margin-bottom: 24rpx;
	box-shadow: $card-shadow;

	// 人型图标展示
	.crowd-visual {
		display: flex;
		justify-content: center;
		padding: 20rpx 0 28rpx;

		.person-grid {
			display: flex;
			gap: 28rpx;

			.person-item {
				width: 72rpx;
				height: 72rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				transition: transform 0.2s ease;

				&:active {
					transform: scale(0.9);
				}

				// CSS Mask 动态上色（微信小程序兼容方案）
				.person-icon {
					width: 100%;
					height: 100%;
					// 使用 URL 编码的 SVG，兼容微信小程序
					// SVG 来源: @/static/images/service/person/person1.svg
					-webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M809.3 549.2c-19-87.5-82.1-205.6-130.6-265-27.7-33.9-61.3-57.3-94.9-70.9 21.4-26.4 29.6-72.1 29.6-108.3 0-54.5-44.2-98.6-98.6-98.6s-98.6 44.2-98.6 98.6c0 36.1 7.2 81.5 27.7 107.6-35.5 13.4-71.3 36.4-98.9 70.3-48.5 59.4-105.7 178.8-124.7 266-10.6 48.5 56.9 66.3 74.3 17.4 26.2-72.5 35.5-60.1 79.7-110.4 23.4 143-51.7 318.8-56.6 458.2 0 23.6 16.8 44.2 40.1 48.5 23.4 4.4 46.3-8.8 55.1-30.8 22.4-78.1 101.7-264.4 101.7-264.4s79.3 186.3 101.7 264.4c8.4 22.1 31.7 35.2 55.1 30.8 23.4-4.4 40.4-24.6 40.1-48.5-5-139.4-88.1-324.1-65-467.2 44.2 50.4 61.9 47 88.1 119.4 17.8 49.1 85.3 31.4 74.7-17.1z'/%3E%3C/svg%3E");
					mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M809.3 549.2c-19-87.5-82.1-205.6-130.6-265-27.7-33.9-61.3-57.3-94.9-70.9 21.4-26.4 29.6-72.1 29.6-108.3 0-54.5-44.2-98.6-98.6-98.6s-98.6 44.2-98.6 98.6c0 36.1 7.2 81.5 27.7 107.6-35.5 13.4-71.3 36.4-98.9 70.3-48.5 59.4-105.7 178.8-124.7 266-10.6 48.5 56.9 66.3 74.3 17.4 26.2-72.5 35.5-60.1 79.7-110.4 23.4 143-51.7 318.8-56.6 458.2 0 23.6 16.8 44.2 40.1 48.5 23.4 4.4 46.3-8.8 55.1-30.8 22.4-78.1 101.7-264.4 101.7-264.4s79.3 186.3 101.7 264.4c8.4 22.1 31.7 35.2 55.1 30.8 23.4-4.4 40.4-24.6 40.1-48.5-5-139.4-88.1-324.1-65-467.2 44.2 50.4 61.9 47 88.1 119.4 17.8 49.1 85.3 31.4 74.7-17.1z'/%3E%3C/svg%3E");
					-webkit-mask-size: contain;
					mask-size: contain;
					-webkit-mask-repeat: no-repeat;
					mask-repeat: no-repeat;
					-webkit-mask-position: center;
					mask-position: center;
					transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
				}
			}
		}
	}

	// 状态信息
	.crowd-status {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20rpx;
		margin-bottom: 20rpx;

		.status-badge {
			display: flex;
			align-items: center;
			gap: 10rpx;
			padding: 12rpx 24rpx;
			border-radius: 24rpx;

			.status-indicator {
				width: 14rpx;
				height: 14rpx;
				border-radius: 50%;
				background: currentColor;
			}

			.status-label {
				font-size: 28rpx;
				font-weight: 600;
				color: currentColor;
			}

			&.status-comfortable {
				background: rgba(76, 175, 80, 0.12);
				color: #4CAF50;
			}

			&.status-moderate {
				background: rgba(33, 150, 243, 0.12);
				color: #2196F3;
			}

			&.status-crowded {
				background: rgba(255, 152, 0, 0.12);
				color: #FF9800;
			}

			&.status-saturated {
				background: rgba(244, 67, 54, 0.12);
				color: #F44336;
			}
		}

		.percent-value {
			font-size: 52rpx;
			font-weight: 200;
			color: #1C1C1E;
			letter-spacing: -2rpx;
		}
	}

	// 进度条
	.progress-track {
		height: 8rpx;
		background: #F2F2F7;
		border-radius: 4rpx;
		overflow: hidden;
		margin-bottom: 24rpx;

		.progress-fill {
			height: 100%;
			border-radius: 4rpx;
			transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease;
		}
	}

	// 场景化动态建议
	.advice-box {
		display: flex;
		align-items: center;
		gap: 16rpx;
		padding: 20rpx 24rpx;
		border-radius: 16rpx;
		margin-bottom: 20rpx;

		.advice-icon {
			width: 44rpx;
			height: 44rpx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24rpx;
			font-weight: 600;
		}

		.advice-text {
			flex: 1;
			font-size: 26rpx;
			font-weight: 500;
			line-height: 1.5;
		}

		&.advice-comfortable {
			background: rgba(76, 175, 80, 0.08);

			.advice-icon {
				background: rgba(76, 175, 80, 0.15);
				color: #4CAF50;
			}

			.advice-text { color: #2E7D32; }
		}

		&.advice-moderate {
			background: rgba(33, 150, 243, 0.08);

			.advice-icon {
				background: rgba(33, 150, 243, 0.15);
				color: #2196F3;
			}

			.advice-text { color: #1565C0; }
		}

		&.advice-crowded {
			background: rgba(255, 152, 0, 0.08);

			.advice-icon {
				background: rgba(255, 152, 0, 0.15);
				color: #FF9800;
			}

			.advice-text { color: #EF6C00; }
		}

		&.advice-saturated {
			background: rgba(244, 67, 54, 0.08);

			.advice-icon {
				background: rgba(244, 67, 54, 0.15);
				color: #F44336;
			}

			.advice-text { color: #C62828; }
		}
	}

	// 数据更新时间
	.data-timestamp {
		text-align: center;
		padding-top: 16rpx;
		border-top: 1rpx solid #F2F2F7;

		text {
			font-size: 22rpx;
			color: #C7C7CC;
		}
	}
}

// ==================== 环境/天气卡片 ====================
.weather-card {
	background: #FFFFFF;
	border-radius: $card-radius;
	padding: 28rpx;
	box-shadow: $card-shadow;

	.weather-main {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.weather-left {
			display: flex;
			align-items: center;
			gap: 16rpx;

			.weather-icon-wrap {
				width: 88rpx;
				height: 88rpx;
				background: linear-gradient(135deg, #F2F2F7 0%, #E8E8E8 100%);
				border-radius: 22rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				.weather-icon {
					font-size: 48rpx;
				}
			}

			.temp-group {
				display: flex;
				align-items: baseline;
				line-height: 1;

				.temp-value {
					font-size: 64rpx;
					font-weight: 200;
					color: #1C1C1E;
					letter-spacing: -4rpx;
				}

				.temp-unit {
					font-size: 28rpx;
					font-weight: 400;
					color: #8E8E93;
					margin-left: 4rpx;
				}
			}

			.weather-desc {
				font-size: 26rpx;
				color: #8E8E93;
				font-weight: 400;
				margin-left: 12rpx;
			}
		}

		.weather-right {
			display: flex;
			flex-direction: column;
			gap: 16rpx;
			align-items: flex-end;

			.metric-row {
				display: flex;
				align-items: center;
				gap: 12rpx;

				.metric-label {
					font-size: 24rpx;
					color: #8E8E93;
				}

				.metric-value-group {
					display: flex;
					align-items: baseline;
					gap: 4rpx;

					.metric-num {
						font-size: 34rpx;
						font-weight: 600;
						color: #1C1C1E;
					}

					.metric-unit {
						font-size: 20rpx;
						color: #8E8E93;
					}
				}
			}
		}
	}

	// AQI 徽标样式
	.aqi-badge {
		padding: 10rpx 24rpx;
		border-radius: 18rpx;

		text {
			font-size: 26rpx;
			font-weight: 600;
		}

		&.aqi-excellent {
			background: rgba(76, 175, 80, 0.12);
			text { color: #4CAF50; }
		}

		&.aqi-good {
			background: rgba(33, 150, 243, 0.12);
			text { color: #2196F3; }
		}

		&.aqi-light {
			background: rgba(255, 152, 0, 0.12);
			text { color: #FF9800; }
		}

		&.aqi-moderate {
			background: rgba(255, 107, 61, 0.12);
			text { color: #FF6B3D; }
		}

		&.aqi-heavy {
			background: rgba(244, 67, 54, 0.12);
			text { color: #F44336; }
		}
	}

	// 数据更新时间
	.data-timestamp {
		text-align: center;
		margin-top: 20rpx;
		padding-top: 16rpx;
		border-top: 1rpx solid #F2F2F7;

		text {
			font-size: 22rpx;
			color: #C7C7CC;
		}
	}
}

// ==================== 底部安全区 ====================
.safe-footer {
	text-align: center;
	padding: 24rpx 0;

	.footer-text {
		font-size: 22rpx;
		color: #C7C7CC;
		letter-spacing: 1rpx;
	}
}
</style>