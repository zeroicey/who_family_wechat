<template>
	<view class="schedule-page">
		<!-- 页面头部 -->
		<view class="header-section">
			<view class="header-content">
				<uni-icons type="calendar-filled" size="32" color="#fff"></uni-icons>
				<view class="header-text">
					<text class="title">课表查询</text>
					<text class="subtitle">查看您的课程安排</text>
				</view>
			</view>
		</view>

		<!-- 登录表单 -->
		<view class="form-card" v-if="!isLoggedIn">
			<view class="card-header">
				<uni-icons type="person-filled" size="20" color="#007aff"></uni-icons>
				<text class="card-title">教务系统登录</text>
			</view>

			<view class="form-content">
				<view class="form-item">
					<view class="form-label">
						<uni-icons type="person" size="18" color="#666"></uni-icons>
						<text>学号</text>
					</view>
					<input class="form-input" v-model="loginForm.studentNo" placeholder="请输入学号" />
				</view>

				<view class="form-item">
					<view class="form-label">
						<uni-icons type="locked" size="18" color="#666"></uni-icons>
						<text>密码</text>
					</view>
					<input class="form-input" v-model="loginForm.password" placeholder="请输入教务系统密码" password />
				</view>

				<view class="form-item">
					<view class="form-label">
						<uni-icons type="calendar" size="18" color="#666"></uni-icons>
						<text>学期</text>
					</view>
					<picker @change="onTermChange" :value="termIndex" :range="termOptions" range-key="label"
						class="form-picker">
						<view class="picker-content">
							<text class="picker-text">{{ termOptions[termIndex]?.label || '请选择学期' }}</text>
							<uni-icons type="down" size="16" color="#999"></uni-icons>
						</view>
					</picker>
				</view>

				<view class="form-item">
					<view class="form-label">
						<uni-icons type="calendar" size="18" color="#666"></uni-icons>
						<text>周次</text>
					</view>
					<picker @change="onWeekChange" :value="weekIndex" :range="weekOptions" class="form-picker">
						<view class="picker-content">
							<text class="picker-text">{{ weekOptions[weekIndex] || '请选择周次' }}</text>
							<uni-icons type="down" size="16" color="#999"></uni-icons>
						</view>
					</picker>
				</view>

				<button class="login-button" @click="handleLogin" :loading="loading">
					<text>查询课表</text>
				</button>
			</view>
		</view>

		<!-- 周次切换 -->
		<view class="week-selector" v-if="isLoggedIn">
			<view class="week-header">
				<text class="current-week">第{{ currentWeek }}周课表</text>
				<view class="week-actions">
					<button class="week-btn" @click="changeWeek(-1)" :disabled="currentWeek <= 1">
						<uni-icons type="left" size="16" color="#007aff"></uni-icons>
					</button>
					<button class="week-btn" @click="changeWeek(1)" :disabled="currentWeek >= 17">
						<uni-icons type="right" size="16" color="#007aff"></uni-icons>
					</button>
				</view>
			</view>
		</view>

		<!-- 课表展示 -->
		<view class="schedule-container" v-if="isLoggedIn">
			<!-- 课表头部 -->
			<view class="schedule-header">
				<view class="time-column">时间</view>
				<view class="day-column" v-for="day in weekDays" :key="day">{{ day }}</view>
			</view>

			<!-- 课表内容 -->
			<view class="schedule-content">
				<view class="schedule-row" v-for="(period, index) in timePeriods" :key="index">
					<view class="time-cell">
						<text class="period-number">{{ (index * 2 + 1) + '-' + (index * 2 + 2) }}</text>
						<text class="time-range">{{ period }}</text>
					</view>
					<view class="course-cell" v-for="(day, dayIndex) in weekDays" :key="dayIndex">
						<view class="course-item"
							v-if="shouldShowCourse(getCourseForSlot(index * 2 + 1, dayIndex + 1), index * 2 + 1)"
							:style="{
								backgroundColor: getCourseColor(getCourseForSlot(index * 2 + 1, dayIndex + 1)),
								gridRowEnd: `span ${getCourseSpan(getCourseForSlot(index * 2 + 1, dayIndex + 1), index * 2 + 1)}`
							}">
							<text class="course-name">{{ getCourseForSlot(index * 2 + 1, dayIndex + 1).name }}</text>
							<text class="course-location">{{ getCourseForSlot(index * 2 + 1, dayIndex + 1).location
							}}</text>
							<text class="course-teacher">{{ getCourseForSlot(index * 2 + 1, dayIndex + 1).teacher
							}}</text>
							<text class="course-code">{{ getCourseForSlot(index * 2 + 1, dayIndex + 1).courseCode
							}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view class="empty-state" v-if="isLoggedIn && courses.length === 0">
			<uni-icons type="info-filled" size="48" color="#ccc"></uni-icons>
			<text class="empty-text">暂无课程数据</text>
			<text class="empty-desc">请检查周次选择或稍后重试</text>
		</view>

		<!-- 重新查询按钮 -->
		<view class="action-bar" v-if="isLoggedIn">
			<button class="secondary-button" @click="resetForm">
				<uni-icons type="refresh" size="18" color="#007aff"></uni-icons>
				<text>重新查询</text>
			</button>
		</view>

		<!-- AI分析组件 -->
		<AIAnalysis v-if="isLoggedIn" type="schedule" :data="courses" :currentWeek="currentWeek.toString()"
			window-title="AI课表分析" @analyze="handleAnalyze" />
	</view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { fetchSchoolCourses } from '@/api/school.js';
import AIAnalysis from '@/components/AIAnalysis.vue';

// 存储键名
const STORAGE_KEY = 'schedule_credentials';

// 从本地存储加载凭据
const loadCredentials = () => {
	const credentials = uni.getStorageSync(STORAGE_KEY);
	if (credentials) {
		loginForm.value.studentNo = credentials.studentNo || '';
		loginForm.value.password = credentials.password || '';
	}
};

// 保存凭据到本地存储
const saveCredentials = () => {
	uni.setStorageSync(STORAGE_KEY, {
		studentNo: loginForm.value.studentNo,
		password: loginForm.value.password
	});
};

// 清除凭据
const clearCredentials = () => {
	uni.removeStorageSync(STORAGE_KEY);
};

// 页面加载时读取凭据
onMounted(() => {
	loadCredentials();
});

// 数据处理函数
const processCourseData = (courseData) => {
	const processedCourses = [];

	courseData.forEach(course => {
		// 解析节次信息 (jcdm2: "01,02" 表示第1-2节)
		const periods = course.jcdm2.split(',').map(p => parseInt(p));
		const startPeriod = Math.min(...periods);
		const endPeriod = Math.max(...periods);

		// 转换星期 (xq: "3" 表示星期三)
		const dayOfWeek = parseInt(course.xq);

		processedCourses.push({
			id: course.dgksdm,
			name: course.kcmc,
			teacher: course.teaxms,
			location: course.jxcdmc,
			courseCode: course.kcbh,
			className: course.jxbmc,
			dayOfWeek: dayOfWeek,
			startTime: startPeriod,
			endTime: endPeriod,
			week: parseInt(course.zc),
			credits: parseFloat(course.xs),
			hours: parseInt(course.zxs),
			studentCount: parseInt(course.pkrs),
			teachingMethod: course.jxhjmc,
			description: course.sknrjj || ''
		});
	});

	return processedCourses;
};

// 响应式数据
const isLoggedIn = ref(false);
const loading = ref(false);

// 学期选项
const termOptions = [
	{ label: '2025-2026-2', value: '20252' },
	{ label: '2025-2026-1', value: '20251' },
	{ label: '2024-2025-3', value: '20243' },
	{ label: '2024-2025-2', value: '20242' },
	{ label: '2024-2025-1', value: '20241' },
	{ label: '2023-2024-3', value: '20233' },
	{ label: '2023-2024-2', value: '20232' },
	{ label: '2023-2024-1', value: '20231' }
];
const termIndex = ref(0);

// 表单数据
const loginForm = ref({
	studentNo: '',
	password: '',
	term: termOptions[0].value, // 使用 termOptions 的第一个值，保持一致
	week: '1'
});

// 周次选项
const weekOptions = Array.from({ length: 17 }, (_, i) => `第${i + 1}周`);
const weekIndex = ref(0);
const currentWeek = ref(1);

// 课表数据
const courses = ref([]);

// 时间段和星期
const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const timePeriods = [
	'08:30-10:05',
	'10:25-12:00',
	'14:00-15:35',
	'15:55-17:30',
	'18:30-20:05',
	'20:25-22:00'
];

// 课程颜色配置
const courseColors = [
	'#e3f2fd', '#f3e5f5', '#e8f5e8', '#fff3e0', '#fce4ec',
	'#e0f2f1', '#f1f8e9', '#fff8e1', '#e8eaf6', '#fafafa'
];

// 方法
const onTermChange = (e) => {
	termIndex.value = e.detail.value;
	loginForm.value.term = termOptions[e.detail.value].value;
};

const onWeekChange = (e) => {
	weekIndex.value = e.detail.value;
	const selectedWeek = e.detail.value + 1;
	currentWeek.value = selectedWeek;
	loginForm.value.week = selectedWeek.toString();
	// 重新获取课表数据
	if (isLoggedIn.value) {
		loadScheduleData();
	}
};

const changeWeek = (direction) => {
	const newWeek = currentWeek.value + direction;
	if (newWeek >= 1 && newWeek <= 17) {
		currentWeek.value = newWeek;
		weekIndex.value = newWeek - 1; // 同步更新picker的索引
		loginForm.value.week = newWeek.toString();
		// 重新获取课表数据
		loadScheduleData();
	}
};

// 获取指定时间段和星期的课程
const getCourseForSlot = (period, dayOfWeek) => {
	return courses.value.find(course =>
		course.dayOfWeek === dayOfWeek &&
		course.startTime <= period &&
		course.endTime >= period
	);
};

// 检查课程是否跨越多个时间段
const getCourseSpan = (course, period) => {
	if (!course) return 1;

	// 如果是课程的第一个时间段，返回跨越的时间段数
	if (course.startTime === period) {
		return course.endTime - course.startTime + 1;
	}

	// 如果不是第一个时间段，返回0（不显示）
	return 0;
};

// 检查是否应该显示课程（避免重复显示）
const shouldShowCourse = (course, period) => {
	if (!course) return false;
	return course.startTime === period;
};

const getCourseColor = (course) => {
	if (!course) return '#f5f5f5';
	const index = course.id % courseColors.length;
	return courseColors[index];
};

const loadScheduleData = async () => {
	if (!isLoggedIn.value) return;

	loading.value = true;
	try {
		console.log('切换周次，重新获取课表，参数:', {
			studentNo: loginForm.value.studentNo,
			password: loginForm.value.password,
			term: loginForm.value.term,
			week: loginForm.value.week
		});

		const response = await fetchSchoolCourses(
			loginForm.value.studentNo,
			loginForm.value.password,
			loginForm.value.term,
			loginForm.value.week
		);

		// 兼容新旧API格式（items 或 data）
		const scheduleData = response.items || response.data;

		if (response.success && scheduleData && scheduleData.length > 0) {
			// 处理课程数据
			const courseData = scheduleData[0] || [];
			courses.value = processCourseData(courseData);

			uni.showToast({
				title: `第${currentWeek.value}周课表加载成功`,
				icon: 'success',
				duration: 1500
			});
		} else {
			uni.showToast({
				title: `第${currentWeek.value}周暂无课程`,
				icon: 'none'
			});
			courses.value = [];
		}
	} catch (error) {
		console.error('获取课表失败:', error);
		uni.showToast({
			title: '网络错误，请重试',
			icon: 'none'
		});
	} finally {
		loading.value = false;
	}
};

const handleLogin = async () => {
	// 表单验证
	if (!loginForm.value.studentNo) {
		uni.showToast({
			title: '请输入学号',
			icon: 'none'
		});
		return;
	}

	if (!loginForm.value.password) {
		uni.showToast({
			title: '请输入密码',
			icon: 'none'
		});
		return;
	}

	if (!loginForm.value.term) {
		uni.showToast({
			title: '请选择学期',
			icon: 'none'
		});
		return;
	}

	loading.value = true;

	try {
		console.log('正在查询课表，参数:', {
			studentNo: loginForm.value.studentNo,
			password: loginForm.value.password,
			term: loginForm.value.term,
			week: loginForm.value.week
		});

		// 调用真实API
		const result = await fetchSchoolCourses(
			loginForm.value.studentNo,
			loginForm.value.password,
			loginForm.value.term,
			loginForm.value.week
		);

		// 兼容新旧API格式（items 或 data）
		const scheduleData = result.items || result.data;

		if (result.success && scheduleData && scheduleData.length > 0) {
			// 保存凭据到本地存储
			saveCredentials();

			// 处理课程数据
			const courseData = scheduleData[0] || [];
			const dateData = scheduleData[1] || [];

			// 转换数据格式
			courses.value = processCourseData(courseData);
			currentWeek.value = parseInt(loginForm.value.week);
			weekIndex.value = currentWeek.value - 1; // 同步更新picker索引
			isLoggedIn.value = true;

			uni.showToast({
				title: '查询成功',
				icon: 'success'
			});
		} else {
			uni.showToast({
				title: '暂无课程数据',
				icon: 'none'
			});
			// 显示空状态
			courses.value = [];
			isLoggedIn.value = true;
			currentWeek.value = parseInt(loginForm.value.week);
			weekIndex.value = currentWeek.value - 1; // 同步更新picker索引
		}

	} catch (error) {
		console.error('查询课表失败:', error);
		uni.showToast({
			title: '查询失败，请检查账号密码',
			icon: 'none'
		});
	} finally {
		loading.value = false;
	}
};

const resetForm = () => {
	isLoggedIn.value = false;
	courses.value = [];
	loginForm.value = {
		studentNo: '',
		password: '',
		term: '20251',
		week: '1'
	};
	termIndex.value = 0;
	weekIndex.value = 0;
	currentWeek.value = 1;
};

// AI分析处理
const handleAnalyze = (type) => {
	console.log('触发AI分析:', type);
	// 这里可以调用真实的AI分析API
	// 目前使用mock数据展示
};
</script>

<style lang="scss" scoped>
.schedule-page {
	background-color: #f7f8fa;
	min-height: 100vh;
	padding: 20rpx;
}

.header-section {
	background: linear-gradient(135deg, #007aff 0%, #5ac8fa 100%);
	border-radius: 20rpx;
	padding: 40rpx 30rpx;
	margin-bottom: 20rpx;

	.header-content {
		display: flex;
		align-items: center;

		.header-text {
			margin-left: 20rpx;

			.title {
				display: block;
				font-size: 32rpx;
				font-weight: bold;
				color: #fff;
			}

			.subtitle {
				display: block;
				font-size: 24rpx;
				color: rgba(255, 255, 255, 0.8);
				margin-top: 8rpx;
			}
		}
	}
}

.form-card {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

	.card-header {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;

		.card-title {
			font-size: 28rpx;
			font-weight: bold;
			color: #333;
			margin-left: 15rpx;
		}
	}

	.form-content {
		.form-item {
			margin-bottom: 30rpx;

			.form-label {
				display: flex;
				align-items: center;
				margin-bottom: 15rpx;

				text {
					font-size: 26rpx;
					color: #666;
					margin-left: 10rpx;
				}
			}

			.form-input {
				width: 100%;
				height: 80rpx;
				background-color: #f8f9fa;
				border-radius: 12rpx;
				padding: 0 20rpx;
				font-size: 26rpx;
				border: 2rpx solid transparent;
				box-sizing: border-box;

				&:focus {
					border-color: #007aff;
					background-color: #fff;
				}
			}

			.form-picker {
				width: 100%;

				.picker-content {
					display: flex;
					align-items: center;
					justify-content: space-between;
					height: 80rpx;
					background-color: #f8f9fa;
					border-radius: 12rpx;
					padding: 0 20rpx;

					.picker-text {
						font-size: 26rpx;
						color: #333;
					}
				}
			}
		}

		.login-button {
			width: 100%;
			height: 88rpx;
			background: linear-gradient(135deg, #007aff 0%, #5ac8fa 100%);
			border-radius: 44rpx;
			border: none;
			color: #fff;
			font-size: 28rpx;
			font-weight: bold;
			margin-top: 20rpx;

			&:active {
				opacity: 0.8;
			}
		}
	}
}

.week-selector {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

	.week-header {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.current-week {
			font-size: 28rpx;
			font-weight: bold;
			color: #333;
		}

		.week-actions {
			display: flex;
			gap: 20rpx;

			.week-btn {
				width: 60rpx;
				height: 60rpx;
				background-color: #f8f9fa;
				border-radius: 30rpx;
				border: none;
				display: flex;
				align-items: center;
				justify-content: center;

				&:active {
					background-color: #e9ecef;
				}

				&:disabled {
					opacity: 0.5;
				}
			}
		}
	}
}

.schedule-container {
	background-color: #fff;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	overflow-x: auto;
	overflow-y: hidden;
}

.schedule-header {
	display: flex;
	background-color: #f8f9fa;
	border-bottom: 2rpx solid #e9ecef;
	min-width: 1000rpx;

	.time-column {
		width: 120rpx;
		min-width: 120rpx;
		padding: 20rpx 10rpx;
		text-align: center;
		font-size: 24rpx;
		font-weight: bold;
		color: #666;
		border-right: 2rpx solid #e9ecef;
	}

	.day-column {
		width: 125rpx;
		min-width: 125rpx;
		padding: 20rpx 10rpx;
		text-align: center;
		font-size: 24rpx;
		font-weight: bold;
		color: #666;
		border-right: 2rpx solid #e9ecef;

		&:last-child {
			border-right: none;
		}
	}
}

.schedule-content {
	min-width: 1000rpx;

	.schedule-row {
		display: flex;
		border-bottom: 2rpx solid #f0f0f0;

		&:last-child {
			border-bottom: none;
		}

		.time-cell {
			width: 120rpx;
			min-width: 120rpx;
			padding: 15rpx 10rpx;
			border-right: 2rpx solid #f0f0f0;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.period-number {
				font-size: 28rpx;
				font-weight: bold;
				color: #007aff;
				margin-bottom: 5rpx;
			}

			.time-range {
				font-size: 20rpx;
				color: #999;
			}
		}

		.course-cell {
			width: 125rpx;
			min-width: 125rpx;
			min-height: 120rpx;
			border-right: 2rpx solid #f0f0f0;
			padding: 10rpx;

			&:last-child {
				border-right: none;
			}

			.course-item {
				width: 100%;
				height: 100%;
				border-radius: 8rpx;
				padding: 8rpx 6rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				box-sizing: border-box;

				.course-name {
					font-size: 20rpx;
					font-weight: bold;
					color: #333;
					margin-bottom: 4rpx;
					text-align: center;
					line-height: 1.2;
					word-break: break-all;
					overflow: hidden;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}

				.course-location {
					font-size: 16rpx;
					color: #666;
					margin-bottom: 2rpx;
					text-align: center;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					width: 100%;
				}

				.course-teacher {
					font-size: 16rpx;
					color: #999;
					text-align: center;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					width: 100%;
				}
			}
		}
	}
}

.empty-state {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 80rpx 30rpx;
	text-align: center;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

	.empty-text {
		display: block;
		font-size: 28rpx;
		color: #999;
		margin: 20rpx 0 10rpx;
	}

	.empty-desc {
		display: block;
		font-size: 24rpx;
		color: #ccc;
	}
}

.action-bar {
	display: flex;
	justify-content: center;
	padding: 20rpx 0;

	.secondary-button {
		display: flex;
		align-items: center;
		gap: 10rpx;
		padding: 20rpx 40rpx;
		background-color: #fff;
		border: 2rpx solid #007aff;
		border-radius: 25rpx;
		color: #007aff;
		font-size: 26rpx;

		&:active {
			background-color: #f0f8ff;
		}
	}
}
</style>