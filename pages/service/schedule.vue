<template>
	<view class="schedule-page">
		<view class="header-section">
			<view class="header-content">
				<view class="header-copy">
					<text class="header-kicker">服务</text>
					<text class="title">课程表查询</text>
					<text class="subtitle">把登录、周次切换和课表结果放进统一的服务页模板里。</text>
				</view>
				<view class="header-badge">
					<uni-icons type="calendar-filled" size="22" color="#6D4AFF"></uni-icons>
					<text>教务服务</text>
				</view>
			</view>
		</view>

		<!-- 登录表单 - Bento Card 风格 -->
		<view class="form-card" v-if="!isLoggedIn">
			<view class="card-glass-bg"></view>
			<view class="card-header">
				<view class="header-accent-bar"></view>
				<view class="header-title-group">
					<text class="card-title">教务系统登录</text>
					<text class="card-subtitle">统一服务页模板 · 教务能力</text>
				</view>
			</view>

			<view class="form-content">
				<view class="form-item">
					<view class="form-label">
						<view class="label-icon">
							<uni-icons type="person" size="16" color="#8E8E93"></uni-icons>
						</view>
						<text>学号</text>
					</view>
					<input class="form-input" v-model="loginForm.studentNo" placeholder="请输入学号" />
				</view>

				<view class="form-item">
					<view class="form-label">
						<view class="label-icon">
							<uni-icons type="locked" size="16" color="#8E8E93"></uni-icons>
						</view>
						<text>密码</text>
					</view>
					<input class="form-input" v-model="loginForm.password" placeholder="请输入教务系统密码" password />
				</view>

				<view class="form-item">
					<view class="form-label">
						<view class="label-icon">
							<uni-icons type="calendar" size="16" color="#8E8E93"></uni-icons>
						</view>
						<text>学期</text>
					</view>
					<picker @change="onTermChange" :value="termIndex" :range="termOptions" range-key="label"
						class="form-picker">
						<view class="picker-content">
							<text class="picker-text">{{ termOptions[termIndex]?.label || '请选择学期' }}</text>
							<uni-icons type="down" size="14" color="#C7C7CC"></uni-icons>
						</view>
					</picker>
				</view>

				<view class="form-item">
					<view class="form-label">
						<view class="label-icon">
							<uni-icons type="calendar" size="16" color="#8E8E93"></uni-icons>
						</view>
						<text>周次</text>
					</view>
					<picker @change="onWeekChange" :value="weekIndex" :range="weekOptions" class="form-picker">
						<view class="picker-content">
							<text class="picker-text">{{ weekOptions[weekIndex] || '请选择周次' }}</text>
							<uni-icons type="down" size="14" color="#C7C7CC"></uni-icons>
						</view>
					</picker>
				</view>

				<button class="login-button" @click="handleLogin" :loading="loading">
					<text>{{ loading ? '查询中...' : '查询课表' }}</text>
				</button>
			</view>
		</view>

		<!-- 周次切换 + 操作按钮 -->
		<view class="week-selector" v-if="isLoggedIn">
			<view class="week-stepper">
				<view class="stepper-btn" :class="{ disabled: currentWeek <= 1 }" @click="changeWeek(-1)">
					<uni-icons type="left" size="18" :color="currentWeek <= 1 ? '#C7C7CC' : '#007AFF'"></uni-icons>
				</view>
				<view class="week-display">
					<text class="week-text">第</text>
					<text class="week-number">{{ currentWeek }}</text>
					<text class="week-text">周</text>
				</view>
				<view class="stepper-btn" :class="{ disabled: currentWeek >= 17 }" @click="changeWeek(1)">
					<uni-icons type="right" size="18" :color="currentWeek >= 17 ? '#C7C7CC' : '#007AFF'"></uni-icons>
				</view>
				<view class="stepper-divider"></view>
				<view class="refresh-btn" @click="resetForm">
					<uni-icons type="refresh" size="18" color="#6D4AFF"></uni-icons>
					<text class="refresh-text">重置条件</text>
				</view>
			</view>
		</view>

		<!-- 课表展示 - 固定布局 -->
		<view class="schedule-card" v-if="isLoggedIn">
			<view class="schedule-container">
				<!-- 课表头部 -->
				<view class="schedule-header">
					<view class="header-glass"></view>
					<view class="time-column">
						<text class="header-text">时间</text>
					</view>
					<view class="day-column" :class="{ 'is-today': dayIndex === adjustedTodayIndex }"
						v-for="(day, dayIndex) in weekDays" :key="dayIndex">
						<text class="header-text">{{ day }}</text>
					</view>
				</view>

				<!-- 课表内容 -->
				<view class="schedule-content">
					<view class="schedule-row" v-for="(period, index) in timePeriods" :key="index">
						<!-- 时间轴 -->
						<view class="time-cell">
							<view class="time-info">
								<text class="period-number">{{ (index * 2 + 1) + '-' + (index * 2 + 2) }}节</text>
								<text class="time-range">{{ period }}</text>
							</view>
						</view>
						<!-- 课程格子 -->
						<view class="course-cell" :class="{ 'is-today': dayIndex === adjustedTodayIndex }"
							v-for="(_, dayIndex) in weekDays" :key="dayIndex">
							<view class="course-item"
								:class="'color-' + (getCourseForSlot(index * 2 + 1, dayIndex + 1)?.id % 10 || 0)"
								v-if="shouldShowCourse(getCourseForSlot(index * 2 + 1, dayIndex + 1), index * 2 + 1)"
								:style="{
									gridRowEnd: `span ${getCourseSpan(getCourseForSlot(index * 2 + 1, dayIndex + 1), index * 2 + 1)}`
								}" @tap="showCourseDetail(getCourseForSlot(index * 2 + 1, dayIndex + 1))">
								<view class="course-accent-bar"></view>
								<view class="course-body">
									<text class="course-name">{{ getCourseForSlot(index * 2 + 1, dayIndex + 1).name
									}}</text>
									<view class="course-detail">
										<view class="detail-row">
											<!-- <text class="detail-icon">📍</text> -->
											<text class="detail-text">{{ getCourseForSlot(index * 2 + 1, dayIndex +
												1).location }}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view class="empty-state" v-if="isLoggedIn && courses.length === 0">
			<view class="empty-icon">📚</view>
			<text class="empty-text">暂无课程数据</text>
			<text class="empty-desc">请检查周次选择或稍后重试</text>
		</view>

		<!-- AI分析组件 -->
		<AIAnalysis v-if="isLoggedIn" type="schedule" :data="courses" :currentWeek="currentWeek.toString()"
			window-title="AI课表分析" @analyze="handleAnalyze" />

		<!-- 课程详情弹窗 -->
		<view class="course-modal-mask" v-if="showModal" @tap="closeModal"></view>
		<view class="course-modal" :class="{ show: showModal }" @tap.stop>
			<view class="modal-header">
				<view class="modal-accent-bar" :class="'accent-' + (selectedCourse?.id % 10 || 0)"></view>
				<text class="modal-title">{{ selectedCourse?.name || '课程详情' }}</text>
				<view class="modal-close" @tap="closeModal">
					<text>✕</text>
				</view>
			</view>
			<view class="modal-body" v-if="selectedCourse">
				<view class="detail-item">
					<view class="detail-label">
						<text class="label-icon">📍</text>
						<text>教室</text>
					</view>
					<text class="detail-value">{{ selectedCourse.location || '未安排' }}</text>
				</view>
				<view class="detail-item">
					<view class="detail-label">
						<text class="label-icon">👨‍🏫</text>
						<text>教师</text>
					</view>
					<text class="detail-value">{{ selectedCourse.teacher || '未安排' }}</text>
				</view>
				<view class="detail-item">
					<view class="detail-label">
						<text class="label-icon">📅</text>
						<text>周次</text>
					</view>
					<text class="detail-value">第{{ selectedCourse.week }}周</text>
				</view>
				<view class="detail-item">
					<view class="detail-label">
						<text class="label-icon">🕐</text>
						<text>时间</text>
					</view>
					<text class="detail-value">
						{{ weekDays[selectedCourse.dayOfWeek - 1] }} 第{{ selectedCourse.startTime }}-{{
							selectedCourse.endTime }}节
					</text>
				</view>
				<view class="detail-item" v-if="selectedCourse.className">
					<view class="detail-label">
						<text class="label-icon">🏫</text>
						<text>班级</text>
					</view>
					<text class="detail-value">{{ selectedCourse.className }}</text>
				</view>
				<view class="detail-item" v-if="selectedCourse.credits">
					<view class="detail-label">
						<text class="label-icon">📖</text>
						<text>学分</text>
					</view>
					<text class="detail-value">{{ selectedCourse.credits }} 学分</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { fetchSchoolCourses } from '@/api/school.js';
import AIAnalysis from '@/components/AIAnalysis.vue';

// 设计一个简单的延迟函数
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
	term: termOptions[0].value,
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

// 今天是周几 (0-6, 0=周一)
const today = new Date().getDay();
const adjustedTodayIndex = today === 0 ? 6 : today - 1;

// 弹窗相关
const showModal = ref(false);
const selectedCourse = ref(null);

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
	if (isLoggedIn.value) {
		loadScheduleData();
	}
};

const changeWeek = (direction) => {
	const newWeek = currentWeek.value + direction;
	if (newWeek >= 1 && newWeek <= 17) {
		currentWeek.value = newWeek;
		weekIndex.value = newWeek - 1;
		loginForm.value.week = newWeek.toString();
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
	if (course.startTime === period) {
		return course.endTime - course.startTime + 1;
	}
	return 0;
};

// 检查是否应该显示课程
const shouldShowCourse = (course, period) => {
	if (!course) return false;
	return course.startTime === period;
};

// 显示课程详情弹窗
const showCourseDetail = (course) => {
	if (!course) return;
	selectedCourse.value = course;
	showModal.value = true;
};

// 关闭弹窗
const closeModal = () => {
	showModal.value = false;
	selectedCourse.value = null;
};

const loadScheduleData = async () => {
	if (!isLoggedIn.value) return;

	loading.value = true;
	try {
		const response = await fetchSchoolCourses(
			loginForm.value.studentNo,
			loginForm.value.password,
			loginForm.value.term,
			loginForm.value.week
		);

		const scheduleData = response.items || response.data;

		if (response.success && scheduleData && scheduleData.length > 0) {
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

	// 先开启 loading 状态
	loading.value = true;

	// 记录开始时间，确保 loading 至少持续 3 秒
	const startTime = Date.now();
	const minLoadingTime = 800;

	try {
		const result = await fetchSchoolCourses(
			loginForm.value.studentNo,
			loginForm.value.password,
			loginForm.value.term,
			loginForm.value.week
		);

		// 计算已过去的时间，补足剩余时间
		const elapsed = Date.now() - startTime;
		const remainingTime = Math.max(0, minLoadingTime - elapsed);
		if (remainingTime > 0) {
			await sleep(remainingTime);
		}

		console.log('正在查询课表，参数：', {
			studentNo: loginForm.value.studentNo,
			password: loginForm.value.password,
			term: loginForm.value.term,
			week: loginForm.value.week
		});
		// 【Bug Fix】严格判断返回状态
		// 情况1：网络请求成功但业务逻辑失败
		if (result.success === false) {
			uni.showToast({
				title: result.message || '账号或密码错误',
				icon: 'none',
				duration: 2000
			});
			loading.value = false;
			return; // 阻断跳转
		}

		// 情况2：返回数据为空
		const scheduleData = result.items || result.data;
		if (!scheduleData || scheduleData.length === 0) {
			uni.showToast({
				title: '暂无课程数据，请检查账号密码',
				icon: 'none',
				duration: 2000
			});
			loading.value = false;
			return; // 阻断跳转
		}

		// 情况3：课程数据为空数组
		const courseData = scheduleData[0] || [];
		if (courseData.length === 0) {
			uni.showToast({
				title: '该周次暂无课程安排',
				icon: 'none'
			});
			// 这里可以选择继续显示空状态还是阻断
		}

		// 【验证通过】保存凭据并跳转
		saveCredentials();

		// 处理课程数据
		courses.value = processCourseData(courseData);
		currentWeek.value = parseInt(loginForm.value.week);
		weekIndex.value = currentWeek.value - 1;
		isLoggedIn.value = true;

		uni.showToast({
			title: '查询成功',
			icon: 'success'
		});

	} catch (error) {
		console.error('查询课表失败:', error);
		// 确保错误时也保持 loading 时间
		const elapsed = Date.now() - startTime;
		const remainingTime = Math.max(0, minLoadingTime - elapsed);
		if (remainingTime > 0) {
			await sleep(remainingTime);
		}
		// 【Bug Fix】区分网络错误和认证错误
		let errorMsg = '查询失败，请稍后重试';
		if (error.message) {
			if (error.message.includes('401') || error.message.includes('Unauthorized')) {
				errorMsg = '账号或密码错误';
			} else if (error.message.includes('timeout')) {
				errorMsg = '网络超时，请检查网络';
			} else if (error.message.includes('network')) {
				errorMsg = '网络连接失败';
			}
		}
		uni.showToast({
			title: errorMsg,
			icon: 'none',
			duration: 2000
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
};
</script>

<style lang="scss" scoped>
// ==================== 设计变量 ====================
$primary-blue: #007AFF;
$primary-blue-light: #5AC8FA;
$primary-gradient: linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%);
$glass-bg: rgba(255, 255, 255, 0.72);
$glass-border: rgba(255, 255, 255, 0.5);
$text-primary: #1C1C1E;
$text-secondary: #8E8E93;
$text-tertiary: #C7C7CC;
$bg-page: linear-gradient(180deg, #F2F6FA 0%, #FFFFFF 100%);
$card-shadow: 0 8rpx 32rpx rgba(0, 122, 255, 0.08);

// 莫兰迪/马卡龙色系 - 课程卡片
$color-0: #E8F4FD;
$color-1: #F3E8FD;
$color-2: #E8FDF0;
$color-3: #FDF6E8;
$color-4: #FDE8F0;
$color-5: #E8FDF8;
$color-6: #F0FDE8;
$color-7: #FDFBE8;
$color-8: #ECE8FD;
$color-9: #F8F8F8;

// 对应的加深色
$accent-0: #5AC8FA;
$accent-1: #AF52DE;
$accent-2: #34C759;
$accent-3: #FF9500;
$accent-4: #FF2D55;
$accent-5: #00C7BE;
$accent-6: #30D158;
$accent-7: #FFD60A;
$accent-8: #BF5AF2;
$accent-9: #8E8E93;

// ==================== 页面容器 ====================
.schedule-page {
	min-height: 100vh;
	background: $bg-page;
	padding: 24rpx 24rpx calc(env(safe-area-inset-bottom) + 24rpx);
	position: relative;

	&::before {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image:
			radial-gradient(circle at 20% 20%, rgba(0, 122, 255, 0.03) 0%, transparent 50%),
			radial-gradient(circle at 80% 80%, rgba(90, 200, 250, 0.03) 0%, transparent 50%);
		pointer-events: none;
		z-index: 0;
	}
}

// ==================== 页面头部 ====================
.header-section {
	position: relative;
	background: $primary-gradient;
	border-radius: 24rpx;
	padding: 36rpx 32rpx;
	margin-bottom: 24rpx;
	overflow: hidden;
	box-shadow: $card-shadow;
	z-index: 1;

	.header-bg-pattern {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image:
			radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 30%),
			radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 40%);
		pointer-events: none;
	}

	.header-content {
		position: relative;
		display: flex;
		align-items: center;

		.header-icon-wrap {
			width: 64rpx;
			height: 64rpx;
			background: rgba(255, 255, 255, 0.2);
			backdrop-filter: blur(10rpx);
			-webkit-backdrop-filter: blur(10rpx);
			border-radius: 16rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.header-text {
			margin-left: 20rpx;

			.title {
				display: block;
				font-size: 36rpx;
				font-weight: 700;
				color: #FFFFFF;
				letter-spacing: 1rpx;
			}

			.subtitle {
				display: block;
				font-size: 24rpx;
				color: rgba(255, 255, 255, 0.8);
				margin-top: 6rpx;
			}
		}
	}
}

// ==================== 登录表单卡片 ====================
.form-card {
	position: relative;
	background: $glass-bg;
	backdrop-filter: blur(40rpx);
	-webkit-backdrop-filter: blur(40rpx);
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 24rpx;
	box-shadow: $card-shadow;
	border: 1rpx solid $glass-border;
	z-index: 1;

	.card-glass-bg {
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%);
		border-radius: 24rpx;
		z-index: -1;
	}

	.card-header {
		display: flex;
		align-items: center;
		margin-bottom: 28rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.04);

		.header-accent-bar {
			width: 6rpx;
			height: 36rpx;
			background: $primary-gradient;
			border-radius: 3rpx;
			margin-right: 16rpx;
		}

		.header-title-group {
			display: flex;
			flex-direction: column;
			gap: 4rpx;

			.card-title {
				font-size: 30rpx;
				font-weight: 600;
				color: $text-primary;
			}

			.card-subtitle {
				font-size: 20rpx;
				color: $text-tertiary;
				letter-spacing: 1rpx;
			}
		}
	}

	.form-content {
		.form-item {
			margin-bottom: 24rpx;

			.form-label {
				display: flex;
				align-items: center;
				margin-bottom: 12rpx;

				.label-icon {
					width: 32rpx;
					height: 32rpx;
					background: rgba(0, 122, 255, 0.08);
					border-radius: 8rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 12rpx;
				}

				text {
					font-size: 26rpx;
					color: $text-secondary;
					font-weight: 500;
				}
			}

			.form-input {
				width: 100%;
				height: 88rpx;
				background: rgba(0, 0, 0, 0.02);
				border-radius: 16rpx;
				padding: 0 24rpx;
				font-size: 28rpx;
				color: $text-primary;
				border: 2rpx solid transparent;
				box-sizing: border-box;
				transition: all 0.3s ease;

				&:focus {
					border-color: $primary-blue;
					background: rgba(255, 255, 255, 0.8);
					box-shadow: 0 0 0 4rpx rgba(0, 122, 255, 0.1);
				}

				&::placeholder {
					color: $text-tertiary;
				}
			}

			.form-picker {
				width: 100%;

				.picker-content {
					display: flex;
					align-items: center;
					justify-content: space-between;
					height: 88rpx;
					background: rgba(0, 0, 0, 0.02);
					border-radius: 16rpx;
					padding: 0 24rpx;
					transition: all 0.3s ease;

					&:active {
						background: rgba(0, 0, 0, 0.04);
					}

					.picker-text {
						font-size: 28rpx;
						color: $text-primary;
					}
				}
			}
		}

		.login-button {
			width: 100%;
			height: 96rpx;
			background: $primary-gradient;
			border-radius: 48rpx;
			border: none;
			color: #FFFFFF;
			font-size: 30rpx;
			font-weight: 600;
			margin-top: 16rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 8rpx 24rpx rgba(0, 122, 255, 0.3);
			transition: all 0.3s ease;

			&:active {
				transform: scale(0.98);
				box-shadow: 0 4rpx 16rpx rgba(0, 122, 255, 0.3);
			}
		}
	}
}

// ==================== 周次切换器 ====================
.week-selector {
	display: flex;
	justify-content: center;
	margin-bottom: 24rpx;
	z-index: 1;

	.week-stepper {
		display: flex;
		align-items: center;
		background: $glass-bg;
		backdrop-filter: blur(40rpx);
		-webkit-backdrop-filter: blur(40rpx);
		border-radius: 48rpx;
		overflow: hidden;
		box-shadow: $card-shadow;
		border: 1rpx solid $glass-border;

		.stepper-btn {
			width: 80rpx;
			height: 72rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: all 0.2s ease;

			&:active {
				background: rgba(0, 122, 255, 0.1);
			}

			&.disabled {
				opacity: 0.3;
				pointer-events: none;
			}
		}

		.week-display {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0 24rpx;
			height: 72rpx;

			.week-text {
				font-size: 26rpx;
				color: $text-secondary;
				font-weight: 400;
			}

			.week-number {
				font-size: 40rpx;
				font-weight: 700;
				color: $primary-blue;
				margin: 0 4rpx;
			}
		}

		.stepper-divider {
			width: 1rpx;
			height: 36rpx;
			background: rgba(0, 0, 0, 0.08);
			margin: 0 8rpx;
		}

		.refresh-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 6rpx;
			padding: 0 80rpx;
			height: 72rpx;
			transition: all 0.2s ease;

			&:active {
				background: rgba(0, 122, 255, 0.1);
			}

			.refresh-text {
				font-size: 26rpx;
				font-weight: 500;
				color: $primary-blue-light;
			}
		}
	}
}

// ==================== 课表卡片（固定布局，无滚动）====================
.schedule-card {
	width: 100%;
	margin-bottom: 24rpx;
	z-index: 1;
}

// ==================== 课表容器 ====================
.schedule-container {
	width: 100%;
	background: $glass-bg;
	backdrop-filter: blur(40rpx);
	-webkit-backdrop-filter: blur(40rpx);
	border-radius: 24rpx;
	box-shadow: $card-shadow;
	border: 1rpx solid $glass-border;
	overflow: hidden;
}

// ==================== 课表头部 ====================
.schedule-header {
	display: flex;
	position: relative;
	background: rgba(255, 255, 255, 0.9);

	.header-glass {
		position: absolute;
		inset: 0;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(20rpx);
		-webkit-backdrop-filter: blur(20rpx);
		z-index: -1;
	}

	.time-column {
		width: 65rpx;
		min-width: 65rpx;
		padding: 12rpx 4rpx;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;

		.header-text {
			font-size: 20rpx;
			font-weight: 600;
			color: $text-secondary;
		}
	}

	.day-column {
		flex: 1;
		padding: 12rpx 2rpx;
		text-align: center;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		&.is-today {
			.header-text {
				color: $primary-blue;
				font-weight: 700;
			}
		}

		.header-text {
			font-size: 24rpx;
			font-weight: 600;
			color: $text-secondary;
			transition: color 0.2s ease;
		}
	}
}

// ==================== 课表内容 ====================
.schedule-content {
	padding: 2rpx;

	.schedule-row {
		display: flex;
		width: 100%;

		// 时间轴
		.time-cell {
			width: 65rpx;
			min-width: 65rpx;
			min-height: 150rpx;
			padding: 8rpx 2rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: relative;
			border-right: 1rpx solid rgba(0, 122, 255, 0.08);

			.time-info {
				display: flex;
				flex-direction: column;
				align-items: center;
				text-align: center;
				width: 100%;

				.period-number {
					font-size: 25rpx;
					font-weight: 700;
					color: $primary-blue;
					margin-bottom: 2rpx;
					line-height: 1.2;
				}

				.time-range {
					font-size: 18rpx;
					color: $text-tertiary;
					line-height: 1.2;
					white-space: normal;
					word-break: break-all;
					width: 100%;
				}
			}
		}

		// 课程格子
		.course-cell {
			flex: 1;
			padding: 2rpx;
			position: relative;
			min-height: 160rpx;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;

			&.is-today {
				background: rgba(0, 122, 255, 0.03);
			}

			// 课程卡片
			.course-item {
				width: 100%;
				min-height: 150rpx;
				height: 100%;
				border-radius: 8rpx;
				padding: 6rpx;
				display: flex;
				flex-direction: row;
				overflow: hidden;
				position: relative;
				transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

				&:active {
					transform: scale(0.96);
				}

				.course-accent-bar {
					width: 4rpx;
					min-width: 4rpx;
					border-radius: 2rpx;
					margin-right: 4rpx;
					flex-shrink: 0;
				}

				.course-body {
					flex: 1;
					display: flex;
					flex-direction: column;
					min-width: 0;
					overflow: hidden;

					.course-name {
						font-size: 25rpx;
						font-weight: 600;
						color: $text-primary;
						margin-bottom: 2rpx;
						line-height: 1.3;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 3;
						line-clamp: 3;
						overflow: hidden;
						text-overflow: ellipsis;
						word-break: break-all;
						white-space: normal;
					}

					.course-detail {
						display: flex;
						flex-direction: column;
						gap: 2rpx;

						.detail-row {
							display: flex;
							align-items: center;
							gap: 2rpx;

							.detail-icon {
								font-size: 20rpx;
								flex-shrink: 0;
							}

							.detail-text {
								font-size: 20rpx;
								color: $text-secondary;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
						}
					}
				}

				// 莫兰迪色系
				&.color-0 {
					background: $color-0;
					box-shadow: 0 2rpx 12rpx rgba(90, 200, 250, 0.2);

					.course-accent-bar {
						background: $accent-0;
					}
				}

				&.color-1 {
					background: $color-1;
					box-shadow: 0 2rpx 12rpx rgba(175, 82, 222, 0.15);

					.course-accent-bar {
						background: $accent-1;
					}
				}

				&.color-2 {
					background: $color-2;
					box-shadow: 0 2rpx 12rpx rgba(52, 199, 89, 0.15);

					.course-accent-bar {
						background: $accent-2;
					}
				}

				&.color-3 {
					background: $color-3;
					box-shadow: 0 2rpx 12rpx rgba(255, 149, 0, 0.15);

					.course-accent-bar {
						background: $accent-3;
					}
				}

				&.color-4 {
					background: $color-4;
					box-shadow: 0 2rpx 12rpx rgba(255, 45, 85, 0.12);

					.course-accent-bar {
						background: $accent-4;
					}
				}

				&.color-5 {
					background: $color-5;
					box-shadow: 0 2rpx 12rpx rgba(0, 199, 190, 0.15);

					.course-accent-bar {
						background: $accent-5;
					}
				}

				&.color-6 {
					background: $color-6;
					box-shadow: 0 2rpx 12rpx rgba(48, 209, 88, 0.15);

					.course-accent-bar {
						background: $accent-6;
					}
				}

				&.color-7 {
					background: $color-7;
					box-shadow: 0 2rpx 12rpx rgba(255, 214, 10, 0.2);

					.course-accent-bar {
						background: $accent-7;
					}
				}

				&.color-8 {
					background: $color-8;
					box-shadow: 0 2rpx 12rpx rgba(191, 90, 242, 0.15);

					.course-accent-bar {
						background: $accent-8;
					}
				}

				&.color-9 {
					background: $color-9;
					box-shadow: 0 2rpx 12rpx rgba(142, 142, 142, 0.1);

					.course-accent-bar {
						background: $accent-9;
					}
				}
			}
		}
	}
}

// ==================== 空状态 ====================
.empty-state {
	background: $glass-bg;
	backdrop-filter: blur(40rpx);
	-webkit-backdrop-filter: blur(40rpx);
	border-radius: 24rpx;
	padding: 64rpx 32rpx;
	text-align: center;
	margin-bottom: 24rpx;
	box-shadow: $card-shadow;
	border: 1rpx solid $glass-border;
	z-index: 1;

	.empty-icon {
		font-size: 64rpx;
		margin-bottom: 16rpx;
	}

	.empty-text {
		display: block;
		font-size: 30rpx;
		color: $text-secondary;
		font-weight: 500;
		margin-bottom: 8rpx;
	}

	.empty-desc {
		display: block;
		font-size: 24rpx;
		color: $text-tertiary;
	}
}

// ==================== 课程详情弹窗 ====================
.course-modal-mask {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.4);
	backdrop-filter: blur(8rpx);
	-webkit-backdrop-filter: blur(8rpx);
	z-index: 100;
	animation: fadeIn 0.3s ease;
}

.course-modal {
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%) scale(0.9);
	width: 600rpx;
	max-width: 90vw;
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(40rpx);
	-webkit-backdrop-filter: blur(40rpx);
	border-radius: 24rpx;
	box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
	z-index: 101;
	opacity: 0;
	pointer-events: none;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

	&.show {
		opacity: 1;
		pointer-events: auto;
		transform: translate(-50%, -50%) scale(1);
	}

	.modal-header {
		display: flex;
		align-items: center;
		padding: 28rpx 24rpx;
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);

		.modal-accent-bar {
			width: 6rpx;
			height: 32rpx;
			border-radius: 3rpx;
			margin-right: 16rpx;

			&.accent-0 {
				background: $accent-0;
			}

			&.accent-1 {
				background: $accent-1;
			}

			&.accent-2 {
				background: $accent-2;
			}

			&.accent-3 {
				background: $accent-3;
			}

			&.accent-4 {
				background: $accent-4;
			}

			&.accent-5 {
				background: $accent-5;
			}

			&.accent-6 {
				background: $accent-6;
			}

			&.accent-7 {
				background: $accent-7;
			}

			&.accent-8 {
				background: $accent-8;
			}

			&.accent-9 {
				background: $accent-9;
			}
		}

		.modal-title {
			flex: 1;
			font-size: 32rpx;
			font-weight: 700;
			color: $text-primary;
		}

		.modal-close {
			width: 56rpx;
			height: 56rpx;
			background: rgba(0, 0, 0, 0.05);
			border-radius: 28rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: all 0.3s ease;

			&:active {
				background: rgba(0, 0, 0, 0.1);
				transform: scale(0.9);
			}

			text {
				font-size: 24rpx;
				color: $text-secondary;
			}
		}
	}

	.modal-body {
		padding: 20rpx 24rpx 32rpx;

		.detail-item {
			display: flex;
			align-items: flex-start;
			padding: 16rpx 0;
			border-bottom: 1rpx solid rgba(0, 0, 0, 0.03);

			&:last-child {
				border-bottom: none;
			}

			.detail-label {
				display: flex;
				align-items: center;
				gap: 8rpx;
				width: 140rpx;
				flex-shrink: 0;

				.label-icon {
					font-size: 24rpx;
				}

				text {
					font-size: 26rpx;
					color: $text-secondary;
				}
			}

			.detail-value {
				flex: 1;
				font-size: 28rpx;
				color: $text-primary;
				font-weight: 500;
			}
		}
	}
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}

	to {
		opacity: 1;
	}
}


// ===== Phase 4 service-shell overrides =====
.schedule-page {
	background: linear-gradient(180deg, #f7f4ff 0%, #f5f7fb 32%, #f5f7fb 100%);
	padding: 24rpx 24rpx calc(env(safe-area-inset-bottom) + 32rpx);
}

.header-section {
	background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(241, 237, 255, 0.98) 100%);
	box-shadow: var(--shadow-soft);
	padding: 30rpx;

	.header-content {
		justify-content: space-between;
		gap: 20rpx;
	}

	.header-copy {
		flex: 1;
		min-width: 0;
	}

	 .header-kicker,
	 .title,
	 .subtitle,
	 .header-badge text {
		display: block;
	 }

	.header-kicker {
		margin-bottom: 10rpx;
		font-size: 22rpx;
		font-weight: 600;
		color: var(--brand-primary);
	}

	.header-text,
	.header-bg-pattern,
	.header-icon-wrap {
		margin-left: 0;
		display: none;
	}

	.header-copy .title {
		font-size: 38rpx;
		font-weight: 700;
		color: var(--text-primary);
		letter-spacing: 0;
	}

	.header-copy .subtitle {
		margin-top: 10rpx;
		font-size: 24rpx;
		line-height: 1.6;
		color: var(--text-secondary);
	}

	.header-badge {
		padding: 14rpx 18rpx;
		border-radius: 20rpx;
		background: rgba(109, 74, 255, 0.1);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8rpx;
		flex-shrink: 0;
	}

	.header-badge text {
		font-size: 20rpx;
		font-weight: 600;
		color: var(--brand-primary);
	}
}

.form-card,
.week-selector,
.schedule-card,
.empty-state {
	box-shadow: var(--shadow-soft);
	border: none;
	backdrop-filter: none;
	-webkit-backdrop-filter: none;
}

.form-card {
	background: #ffffff;

	.card-glass-bg {
		display: none;
	}

	.card-title {
		color: var(--text-primary);
	}

	.card-subtitle {
		color: var(--text-tertiary);
		letter-spacing: 0;
		text-transform: none;
	}

	.form-input,
	.form-picker {
		background: #f8faff;
	}

	.form-item {
		border-bottom: 1rpx solid #eef2f7;
	}

	.login-button {
		background: linear-gradient(135deg, #6d4aff, #8d6bff);
		box-shadow: 0 16rpx 32rpx rgba(109, 74, 255, 0.18);
	}
}

.week-selector {
	background: #ffffff;
}

.week-stepper {
	background: #ffffff;
	box-shadow: none;
}

.refresh-btn {
	background: rgba(109, 74, 255, 0.08);
}

.refresh-text {
	color: var(--brand-primary);
}

.empty-state .empty-icon {
	font-size: 56rpx;
}

</style>