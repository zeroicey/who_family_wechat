<template>
	<view class="grade-page">
		<!-- 顶部标题区域 -->
		<view class="header-section">
			<view class="header-content">
				<uni-icons type="medal" size="36" color="#fff"></uni-icons>
				<view class="header-text">
					<text class="title">成绩查询</text>
					<text class="subtitle">查看您的学习成果与学业表现</text>
				</view>
			</view>
			<!-- 装饰元素 -->
			<view class="header-decoration">
				<view class="decoration-circle circle-1"></view>
				<view class="decoration-circle circle-2"></view>
				<view class="decoration-circle circle-3"></view>
			</view>
		</view>

		<!-- 登录表单卡片 -->
		<view class="form-card" v-if="!isLoggedIn">
			<view class="card-header">
				<view class="header-icon-wrapper">
					<uni-icons type="person" size="22" color="#007aff"></uni-icons>
				</view>
				<view class="header-text-wrapper">
					<text class="card-title">教务系统登录</text>
					<text class="card-subtitle">请输入您的学号和密码查询成绩</text>
				</view>
			</view>

			<view class="form-content">
				<view class="form-item">
					<view class="form-label">
						<uni-icons type="person-filled" size="18" color="#666"></uni-icons>
						<text class="label-text">学号</text>
					</view>
					<input
						class="form-input"
						v-model="loginForm.studentNo"
						placeholder="请输入学号"
						type="text"
					/>
				</view>

				<view class="form-item">
					<view class="form-label">
						<uni-icons type="locked" size="18" color="#666"></uni-icons>
						<text class="label-text">密码</text>
					</view>
					<input
						class="form-input"
						v-model="loginForm.password"
						placeholder="请输入教务系统密码"
						password
					/>
				</view>

				<view class="form-item">
					<view class="form-label">
						<uni-icons type="calendar" size="18" color="#666"></uni-icons>
						<text class="label-text">学期</text>
					</view>
					<picker
						@change="onTermChange"
						:value="termIndex"
						:range="termOptions"
						range-key="label"
						class="form-picker"
					>
						<view class="picker-content">
							<text class="picker-text">{{ termOptions[termIndex]?.label || '请选择学期' }}</text>
							<uni-icons type="down" size="16" color="#999"></uni-icons>
						</view>
					</picker>
				</view>

				<button
					class="login-button"
					@click="handleLogin"
					:disabled="loading"
					hover-class="login-button-hover"
				>
					<uni-icons v-if="loading" type="spinner-cycle" size="18" color="#fff" class="loading-icon"></uni-icons>
					<text>{{ loading ? '查询中...' : '查询成绩' }}</text>
				</button>
			</view>
		</view>

		<!-- 成绩展示区域 -->
		<view class="grades-section" v-if="isLoggedIn && grades.length > 0">
			<!-- 成绩头部卡片 -->
			<view class="grades-header-card">
				<view class="header-left">
					<uni-icons type="list" size="24" color="#007aff"></uni-icons>
					<text class="section-title">成绩单</text>
				</view>
				<view class="term-badge">
					<text>{{ currentTerm }}</text>
				</view>
			</view>

			<!-- 成绩统计卡片 -->
			<view class="stats-card">
				<view class="stat-item">
					<view class="stat-icon-wrapper stat-icon-blue">
						<text class="stat-icon">📚</text>
					</view>
					<view class="stat-content">
						<text class="stat-value">{{ gradeStats.totalCourses }}</text>
						<text class="stat-label">总课程数</text>
					</view>
				</view>
				<view class="stat-item">
					<view class="stat-icon-wrapper stat-icon-purple">
						<text class="stat-icon">🎓</text>
					</view>
					<view class="stat-content">
						<text class="stat-value">{{ gradeStats.totalCredits }}</text>
						<text class="stat-label">总学分</text>
					</view>
				</view>
				<view class="stat-item">
					<view class="stat-icon-wrapper stat-icon-green">
						<text class="stat-icon">📊</text>
					</view>
					<view class="stat-content">
						<text class="stat-value">{{ gradeStats.averageScore }}</text>
						<text class="stat-label">平均分</text>
					</view>
				</view>
				<view class="stat-item">
					<view class="stat-icon-wrapper stat-icon-orange">
						<text class="stat-icon">⭐</text>
					</view>
					<view class="stat-content">
						<text class="stat-value">{{ gradeStats.averageGPA }}</text>
						<text class="stat-label">平均绩点</text>
					</view>
				</view>
			</view>

			<!-- 成绩列表 -->
			<view class="grades-list">
				<view class="grade-item" v-for="grade in grades" :key="grade.id" hover-class="grade-item-hover">
					<view class="grade-header">
						<view class="course-info">
							<text class="course-name">{{ grade.courseName }}</text>
							<view class="course-meta">
								<text
									class="course-code"
									:style="{ backgroundColor: getCourseCodeColor(grade.courseCode) }"
								>
									{{ grade.courseCode || '无代码' }}
								</text>
								<text
									class="course-category"
									:style="{ backgroundColor: getCategoryColor(grade.category) }"
								>
									{{ grade.category || '其他' }}
								</text>
							</view>
						</view>
						<view class="score-badge" :class="getScoreLevel(grade.score)">
							<text class="score-number">{{ grade.score }}</text>
							<text class="score-label">{{ getScoreLabel(grade.score) }}</text>
						</view>
					</view>
					<view class="grade-details">
						<view class="detail-item">
							<uni-icons type="bookmark" size="16" color="#999"></uni-icons>
							<view class="detail-content">
								<text class="detail-label">学分</text>
								<text class="detail-value">{{ grade.credit }}</text>
							</view>
						</view>
						<view class="detail-item">
							<uni-icons type="star" size="16" color="#999"></uni-icons>
							<view class="detail-content">
								<text class="detail-label">绩点</text>
								<text class="detail-value">{{ grade.gpa }}</text>
							</view>
						</view>
						<view class="detail-item">
							<uni-icons type="tag" size="16" color="#999"></uni-icons>
							<view class="detail-content">
								<text class="detail-label">类型</text>
								<text class="detail-value">{{ grade.type || '未知' }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view class="empty-state" v-if="isLoggedIn && grades.length === 0">
			<view class="empty-icon-wrapper">
				<uni-icons type="info-filled" size="64" color="#ddd"></uni-icons>
			</view>
			<text class="empty-text">暂无成绩数据</text>
			<text class="empty-desc">请检查学期选择或稍后重试</text>
			<button class="retry-button" @click="resetForm" hover-class="retry-button-hover">
				<uni-icons type="refresh" size="16" color="#007aff"></uni-icons>
				<text>重新选择学期</text>
			</button>
		</view>

		<!-- 重新查询按钮 -->
		<view class="action-bar" v-if="isLoggedIn && grades.length > 0">
			<button class="secondary-button" @click="resetForm" hover-class="secondary-button-hover">
				<uni-icons type="refresh" size="18" color="#007aff"></uni-icons>
				<text>重新查询</text>
			</button>
		</view>

		<!-- AI分析组件 -->
		<AIAnalysis v-if="isLoggedIn" type="grade" :data="grades" window-title="AI成绩分析" @analyze="handleAnalyze" />
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchSchoolGrades } from '@/api/school';
import AIAnalysis from '@/components/AIAnalysis.vue';

// 存储键名
const STORAGE_KEY = 'grade_credentials';

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

// 响应式数据
const isLoggedIn = ref(false);
const loading = ref(false);

// 表单数据
const loginForm = ref({
	studentNo: '',
	password: '',
	term: '20243'
});

// 学期选项
const termOptions = [
	{ label: '2025-2026-2', value: '20252' },
	{ label: '2025-2026-1', value: '20251' },
	{ label: '2024-2025-3', value: '20243' },
	{ label: '2024-2025-2', value: '20242' },
	{ label: '2024-2025-1', value: '20241' },
	{ label: '2023-2024-3', value: '20233' },
	{ label: '2023-2024-2', value: '20232' },
	{ label: '2023-2024-1', value: '20231' },
	{ label: '2022-2023-3', value: '20223' },
	{ label: '2022-2023-2', value: '20222' },
	{ label: '2022-2023-1', value: '20221' }
];
const termIndex = ref(2); // 默认选择 2024-2025-3
const currentTerm = ref('');

// 成绩数据
const grades = ref([]);

// 计算成绩统计
const gradeStats = computed(() => {
	if (!grades.value || grades.value.length === 0) {
		return {
			totalCourses: 0,
			totalCredits: 0,
			averageScore: 0,
			averageGPA: 0
		};
	}

	const totalCourses = grades.value.length;
	const totalCredits = grades.value.reduce((sum, grade) => sum + grade.credit, 0);
	const totalScore = grades.value.reduce((sum, grade) => sum + grade.score, 0);
	const totalGPA = grades.value.reduce((sum, grade) => sum + grade.gpa, 0);

	return {
		totalCourses,
		totalCredits: Math.round(totalCredits * 10) / 10,
		averageScore: Math.round(totalScore / totalCourses * 10) / 10,
		averageGPA: Math.round(totalGPA / totalCourses * 100) / 100
	};
});

// 获取分数等级
const getScoreLevel = (score) => {
	if (score >= 90) return 'excellent';
	if (score >= 80) return 'good';
	if (score >= 70) return 'average';
	if (score >= 60) return 'pass';
	return 'fail';
};

// 获取分数标签
const getScoreLabel = (score) => {
	if (score >= 90) return '优秀';
	if (score >= 80) return '良好';
	if (score >= 70) return '中等';
	if (score >= 60) return '及格';
	return '不及格';
};

// 颜色调色板 - 丰富的色彩方案
const colorPalette = [
	'#FF6B6B', // 珊瑚红
	'#4ECDC4', // 青绿色
	'#45B7D1', // 天蓝色
	'#FFA07A', // 浅珊瑚色
	'#98D8C8', // 薄荷绿
	'#F7DC6F', // 浅粉色
	'#BB8FCE', // 淡紫色
	'#85C1E2', // 淡蓝色
	'#F8B500', // 金黄色
	'#FF6F61', // 珊瑚红
	'#6C5CE7', // 紫罗兰色
	'#00CEC9', // 青色
	'#FF7675', // 浅红色
	'#74B9FF', // 亮蓝色
	'#A29BFE', // 淡紫罗兰
	'#FD79A8', // 粉紫色
	'#FDCB6E', // 橙黄色
	'#E17055', // 陶土色
	'#00B894', // 翠绿
	'#0984E3', // 宝蓝色
	'#6C5CE7', // 紫色
	'#E84393', // 粉红
	'#00CEC9', // 青色
	'#FAB1A0', // 沙色
	'#74B9FF', // 蓝色
	'#A29BFE', // 紫色
	'#FF7675', // 红
	'#FD79A8', // 粉
	'#FDCB6E', // 橙
	'#E17055', // 棕
	'#00B894', // 绿
	'#0984E3', // 蓝
	'#6C5CE7', // 紫
	'#F39C12', // 橙
	'#D63031', // 深红
	'#E84393', // 粉
	'#00CEC9', // 青
];

// 根据字符串生成一致的随机颜色
const stringToColor = (str) => {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	const index = Math.abs(hash) % colorPalette.length;
	return colorPalette[index];
};

// 获取课程代码颜色
const getCourseCodeColor = (courseCode) => {
	if (!courseCode) return '#BDC3C7';
	return stringToColor(courseCode);
};

// 获取类别颜色
const getCategoryColor = (category) => {
	if (!category) return '#CFD8DC';
	return stringToColor(category);
};

// 方法
const onTermChange = (e) => {
	termIndex.value = e.detail.value;
	loginForm.value.term = termOptions[e.detail.value].value;
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
		// 调用真实API获取成绩数据
		console.log('正在调用API，参数:', {
			studentNo: loginForm.value.studentNo,
			password: loginForm.value.password,
			term: loginForm.value.term
		});

		const result = await fetchSchoolGrades(
			loginForm.value.studentNo,
			loginForm.value.password,
			loginForm.value.term
		);

		// 检查API返回结果（兼容新旧格式）
		const gradeData = result.data || result.items;

		if (result && result.success && gradeData && Array.isArray(gradeData)) {
			// 保存凭据到本地存储
			saveCredentials();

			// 转换API数据格式为页面所需格式
			const convertedGrades = gradeData.map(item => ({
				id: item.rownum_ || Math.random().toString(36).substr(2, 9),
				courseName: item.kcmc || '未知课程',
				courseCode: item.kcbh || '',
				score: parseFloat(item.zcj) || 0,
				credit: parseFloat(item.xf) || 0,
				gpa: parseFloat(item.cjjd) || 0,
				type: item.xdfsmc || '未知',
				category: item.kcdlmc || '其他',
				scoreType: item.cjfsmc || '百分制',
				term: item.xnxqmc || loginForm.value.term
			}));

			grades.value = convertedGrades;
			currentTerm.value = loginForm.value.term;
			isLoggedIn.value = true;

			console.log('成功获取成绩数据:', convertedGrades);

			uni.showToast({
				title: `查询成功，共${convertedGrades.length}门课程`,
				icon: 'success'
			});
		} else {
			// API返回格式不正确或查询失败
			console.error('API返回数据格式异常:', result);
			throw new Error(result?.message || '数据格式异常');
		}

	} catch (error) {
		console.error('=== API调用失败 ===');
		console.error('错误详情:', error);
		console.error('错误类型:', typeof error);

		if (error && typeof error === 'object') {
			console.error('错误对象键名:', Object.keys(error));
		}

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
	grades.value = [];
	loginForm.value = {
		studentNo: '',
		password: '',
			term: '20243'
	};
	termIndex.value = 2;
	currentTerm.value = '';
};

// AI分析处理
const handleAnalyze = (type) => {
	console.log('触发AI分析:', type);
	// AI分析功能已在 AIAnalysis 组件中实现
};
</script>

<style lang="scss" scoped>
.grade-page {
	background: linear-gradient(180deg, #f8f9ff 0%, #f7f8fa 100%);
	min-height: 100vh;
	padding: 20rpx;
}

// 头部区域优化
.header-section {
	position: relative;
	background: linear-gradient(135deg, #007aff 0%, #5ac8fa 50%, #4fc3f7 100%);
	border-radius: 24rpx;
	padding: 50rpx 30rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
	box-shadow: 0 8rpx 24rpx rgba(0, 122, 255, 0.15);

	.header-content {
		display: flex;
		align-items: center;
		position: relative;
		z-index: 2;

		.header-text {
			margin-left: 20rpx;

			.title {
				display: block;
				font-size: 36rpx;
				font-weight: bold;
				color: #fff;
				margin-bottom: 8rpx;
			}

			.subtitle {
				display: block;
				font-size: 24rpx;
				color: rgba(255, 255, 255, 0.9);
			}
		}
	}

	.header-decoration {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1;
		pointer-events: none;

		.decoration-circle {
			position: absolute;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.1);

			&.circle-1 {
				width: 200rpx;
				height: 200rpx;
				top: -50rpx;
				right: -30rpx;
			}

			&.circle-2 {
				width: 120rpx;
				height: 120rpx;
				bottom: 20rpx;
				left: 20rpx;
			}

			&.circle-3 {
				width: 80rpx;
				height: 80rpx;
				top: 50%;
				right: 80rpx;
			}
		}
	}
}

// 表单卡片优化
.form-card {
	background-color: #fff;
	border-radius: 24rpx;
	padding: 36rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

	.card-header {
		display: flex;
		align-items: center;
		margin-bottom: 32rpx;

		.header-icon-wrapper {
			width: 48rpx;
			height: 48rpx;
			background: linear-gradient(135deg, #007aff 0%, #5ac8fa 100%);
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 16rpx;
		}

		.header-text-wrapper {
			flex: 1;

			.card-title {
				display: block;
				font-size: 30rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 6rpx;
			}

			.card-subtitle {
				display: block;
				font-size: 24rpx;
				color: #999;
			}
		}
	}

	.form-content {
		.form-item {
			margin-bottom: 28rpx;

			.form-label {
				display: flex;
				align-items: center;
				margin-bottom: 14rpx;

				.label-text {
					font-size: 28rpx;
					color: #333;
					font-weight: 500;
					margin-left: 10rpx;
				}
			}

			.form-input {
				width: 100%;
				height: 88rpx;
				background-color: #f8f9fa;
				border-radius: 16rpx;
				padding: 0 24rpx;
				font-size: 28rpx;
				border: 2rpx solid transparent;
				box-sizing: border-box;
				transition: all 0.3s ease;

				&:focus {
					border-color: #007aff;
					background-color: #fff;
					box-shadow: 0 0 0 4rpx rgba(0, 122, 255, 0.1);
				}
			}

			.form-picker {
				width: 100%;

				.picker-content {
					display: flex;
					align-items: center;
					justify-content: space-between;
					height: 88rpx;
					background-color: #f8f9fa;
					border-radius: 16rpx;
					padding: 0 24rpx;
					transition: all 0.3s ease;
					border: 2rpx solid transparent;

					.picker-text {
						font-size: 28rpx;
						color: #333;
					}
				}
			}
		}

		.login-button {
			width: 100%;
			height: 96rpx;
			background: linear-gradient(135deg, #007aff 0%, #5ac8fa 100%);
			border-radius: 16rpx;
			border: none;
			color: #fff;
			font-size: 30rpx;
			font-weight: bold;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 12rpx;
			transition: all 0.3s ease;
			box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);

			&:active {
				transform: scale(0.98);
			}

			&:disabled {
				opacity: 0.6;
			}

			.loading-icon {
				margin-right: 10rpx;
				animation: spin 1s linear infinite;
			}
		}
	}
}

// 成绩展示区域优化
.grades-section {
	.grades-header-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 28rpx 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

		.header-left {
			display: flex;
			align-items: center;
			gap: 12rpx;

			.section-title {
				font-size: 30rpx;
				font-weight: bold;
				color: #333;
			}
		}

		.term-badge {
			background: linear-gradient(135deg, #007aff 0%, #5ac8fa 100%);
			padding: 8rpx 20rpx;
			border-radius: 20rpx;
			box-shadow: 0 2rpx 8rpx rgba(0, 122, 255, 0.2);

			text {
				font-size: 24rpx;
				color: #fff;
				font-weight: 500;
			}
		}
	}
}

// 统计卡片优化
.stats-card {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 32rpx 24rpx;
	margin-bottom: 20rpx;
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 24rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;

		.stat-icon-wrapper {
			width: 64rpx;
			height: 64rpx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 12rpx;

			&.stat-icon-blue {
				background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
			}

			&.stat-icon-purple {
				background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
			}

			&.stat-icon-green {
				background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
			}

			&.stat-icon-orange {
				background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
			}

			.stat-icon {
				font-size: 32rpx;
			}
		}

		.stat-content {
			.stat-value {
				display: block;
				font-size: 36rpx;
				font-weight: bold;
				color: #007aff;
				margin-bottom: 6rpx;
			}

			.stat-label {
				display: block;
				font-size: 24rpx;
				color: #666;
			}
		}
	}
}

// 成绩列表优化
.grades-list {
	.grade-item {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 28rpx;
		margin-bottom: 16rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
		transition: all 0.3s ease;

		&.grade-item-hover {
			transform: translateY(-2rpx);
			box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
		}

		.grade-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20rpx;
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #f0f0f0;

			.course-info {
				flex: 1;
				padding-right: 20rpx;

				.course-name {
					display: block;
					font-size: 30rpx;
					font-weight: bold;
					color: #333;
					margin-bottom: 10rpx;
					line-height: 1.4;
				}

				.course-meta {
					display: flex;
					gap: 12rpx;

					.course-code {
						font-size: 24rpx;
						color: #fff;
						background-color: #999;
						padding: 6rpx 14rpx;
						border-radius: 12rpx;
						font-weight: 500;
						box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
						transition: all 0.3s ease;
					}

					.course-category {
						font-size: 24rpx;
						color: #fff;
						background-color: #999;
						padding: 6rpx 14rpx;
						border-radius: 12rpx;
						font-weight: 500;
						box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
						transition: all 0.3s ease;
					}
				}
			}

			.score-badge {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 16rpx 24rpx;
				border-radius: 16rpx;
				min-width: 100rpx;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

				.score-number {
					font-size: 36rpx;
					font-weight: bold;
					line-height: 1;
				}

				.score-label {
					font-size: 22rpx;
					margin-top: 6rpx;
					opacity: 0.9;
				}

				&.excellent {
					background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
					color: #fff;
				}

				&.good {
					background: linear-gradient(135deg, #2196f3 0%, #42a5f5 100%);
					color: #fff;
				}

				&.average {
					background: linear-gradient(135deg, #ff9800 0%, #ffa726 100%);
					color: #fff;
				}

				&.pass {
					background: linear-gradient(135deg, #9c27b0 0%, #ab47bc 100%);
					color: #fff;
				}

				&.fail {
					background: linear-gradient(135deg, #f44336 0%, #ef5350 100%);
					color: #fff;
				}
			}
		}

		.grade-details {
			display: flex;
			gap: 24rpx;

			.detail-item {
				flex: 1;
				display: flex;
				align-items: center;
				gap: 10rpx;
				padding: 16rpx;
				background-color: #f8f9fa;
				border-radius: 12rpx;

				.detail-content {
					display: flex;
					flex-direction: column;

					.detail-label {
						font-size: 22rpx;
						color: #999;
						margin-bottom: 4rpx;
					}

					.detail-value {
						font-size: 26rpx;
						color: #333;
						font-weight: 500;
					}
				}
			}
		}
	}
}

// 空状态优化
.empty-state {
	background-color: #fff;
	border-radius: 24rpx;
	padding: 100rpx 40rpx;
	text-align: center;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

	.empty-icon-wrapper {
		margin-bottom: 30rpx;
	}

	.empty-text {
		display: block;
		font-size: 30rpx;
		color: #333;
		font-weight: 500;
		margin-bottom: 12rpx;
	}

	.empty-desc {
		display: block;
		font-size: 26rpx;
		color: #999;
		margin-bottom: 40rpx;
	}

	.retry-button {
		display: inline-flex;
		align-items: center;
		gap: 10rpx;
		padding: 20rpx 40rpx;
		background-color: #007aff;
		color: #fff;
		border-radius: 50rpx;
		font-size: 28rpx;
		border: none;
		box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);

		&:active {
			transform: scale(0.98);
		}
	}
}

// 操作按钮区域
.action-bar {
	padding: 20rpx 0;

	.secondary-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10rpx;
		padding: 24rpx;
		background-color: #fff;
		border: 2rpx solid #007aff;
		border-radius: 16rpx;
		color: #007aff;
		font-size: 28rpx;
		transition: all 0.3s ease;
		box-shadow: 0 2rpx 8rpx rgba(0, 122, 255, 0.1);

		&:active {
			transform: scale(0.98);
			background-color: #f0f8ff;
		}
	}
}

// 动画
@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

// 响应式优化
@media screen and (max-width: 600px) {
	.stats-card {
		grid-template-columns: repeat(2, 1fr);
		gap: 20rpx;
	}
}
</style>
