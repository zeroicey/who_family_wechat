<template>
	<view class="grade-page">
		<!-- 顶部标题区域 -->
		<view class="header-section">
			<view class="header-content">
				<uni-icons type="medal" size="32" color="#007aff"></uni-icons>
				<view class="header-text">
					<text class="title">成绩查询</text>
					<text class="subtitle">查看您的学习成果</text>
				</view>
			</view>
		</view>

		<!-- 登录表单卡片 -->
		<view class="form-card" v-if="!isLoggedIn">
			<view class="card-header">
				<uni-icons type="person" size="24" color="#007aff"></uni-icons>
				<text class="card-title">教务系统登录</text>
			</view>
			
			<view class="form-content">
				<view class="form-item">
					<view class="form-label">
						<uni-icons type="person-filled" size="18" color="#666"></uni-icons>
						<text>学号</text>
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
						<text>密码</text>
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
						<text>学期</text>
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
				>
					<uni-icons v-if="loading" type="spinner-cycle" size="18" color="#fff" class="loading-icon"></uni-icons>
					<text>{{ loading ? '查询中...' : '查询成绩' }}</text>
				</button>
			</view>
		</view>

		<!-- 成绩展示区域 -->
		<view class="grades-section" v-if="isLoggedIn && grades.length > 0">
			<view class="section-header">
				<uni-icons type="list" size="24" color="#007aff"></uni-icons>
				<text class="section-title">成绩单</text>
				<view class="term-info">
					<text>{{ currentTerm }}</text>
				</view>
			</view>

			<!-- 成绩统计卡片 -->
			<view class="stats-card">
				<view class="stat-item">
					<text class="stat-value">{{ gradeStats.totalCourses }}</text>
					<text class="stat-label">总课程数</text>
				</view>
				<view class="stat-item">
					<text class="stat-value">{{ gradeStats.totalCredits }}</text>
					<text class="stat-label">总学分</text>
				</view>
				<view class="stat-item">
					<text class="stat-value">{{ gradeStats.averageScore }}</text>
					<text class="stat-label">平均分</text>
				</view>
				<view class="stat-item">
					<text class="stat-value">{{ gradeStats.averageGPA }}</text>
					<text class="stat-label">平均绩点</text>
				</view>
			</view>

			<!-- 成绩列表 -->
			<view class="grades-list">
				<view class="grade-item" v-for="grade in grades" :key="grade.id">
					<view class="grade-header">
						<view class="course-info">
							<text class="course-name">{{ grade.courseName }}</text>
							<text class="course-code">{{ grade.courseCode }}</text>
						</view>
						<view class="score-info">
							<text class="score" :class="getScoreLevel(grade.score)">{{ grade.score }}</text>
							<text class="score-type">{{ grade.scoreType }}</text>
						</view>
					</view>
					<view class="grade-details">
						<view class="detail-item">
							<text class="detail-label">学分</text>
							<text class="detail-value">{{ grade.credit }}</text>
						</view>
						<view class="detail-item">
							<text class="detail-label">绩点</text>
							<text class="detail-value">{{ grade.gpa }}</text>
						</view>
						<view class="detail-item">
							<text class="detail-label">类型</text>
							<text class="detail-value">{{ grade.type }}</text>
						</view>
						<view class="detail-item">
							<text class="detail-label">类别</text>
							<text class="detail-value">{{ grade.category }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view class="empty-state" v-if="isLoggedIn && grades.length === 0">
			<uni-icons type="info-filled" size="48" color="#ccc"></uni-icons>
			<text class="empty-text">暂无成绩数据</text>
			<text class="empty-desc">请检查学期选择或稍后重试</text>
		</view>

		<!-- 重新查询按钮 -->
		<view class="action-bar" v-if="isLoggedIn">
			<button class="secondary-button" @click="resetForm">
				<uni-icons type="refresh" size="18" color="#007aff"></uni-icons>
				<text>重新查询</text>
			</button>
		</view>

		<!-- AI分析组件 -->
		<AIAnalysis
			v-if="isLoggedIn"
			type="grade"
			:data="grades"
			window-title="AI成绩分析"
			@analyze="handleAnalyze"
		/>
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
const termIndex = ref(0);
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
		
		// 检查API返回结果
		if (result && result.success && result.items && Array.isArray(result.items)) {
			// 保存凭据到本地存储
			saveCredentials();

			// 转换API数据格式为页面所需格式
			const convertedGrades = result.items.map(item => ({
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
	termIndex.value = 0;
	currentTerm.value = '';
};

// AI分析处理
const handleAnalyze = (type) => {
	console.log('触发AI分析:', type);
	// 这里可以调用真实的AI分析API
	// 目前使用mock数据展示
};
</script>

<style lang="scss" scoped>
.grade-page {
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
			position: relative;
			
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
			border-radius: 12rpx;
			border: none;
			color: #fff;
			font-size: 28rpx;
			font-weight: bold;
			display: flex;
			align-items: center;
			justify-content: center;
			
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

.grades-section {
	.section-header {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		
		.section-title {
			font-size: 28rpx;
			font-weight: bold;
			color: #333;
			margin-left: 15rpx;
			flex: 1;
		}
		
		.term-info {
			background-color: #e3f2fd;
			padding: 8rpx 16rpx;
			border-radius: 20rpx;
			
			text {
				font-size: 22rpx;
				color: #1976d2;
			}
		}
	}
}

.stats-card {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	display: flex;
	justify-content: space-around;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	
	.stat-item {
		text-align: center;
		
		.stat-value {
			display: block;
			font-size: 32rpx;
			font-weight: bold;
			color: #007aff;
		}
		
		.stat-label {
			display: block;
			font-size: 22rpx;
			color: #666;
			margin-top: 8rpx;
		}
	}
}

.grades-list {
	.grade-item {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 25rpx;
		margin-bottom: 15rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
		
		.grade-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20rpx;
			
			.course-name {
				font-size: 28rpx;
				font-weight: bold;
				color: #333;
				flex: 1;
			}
			
			.score-badge {
				padding: 8rpx 16rpx;
				border-radius: 20rpx;
				
				.score {
					font-size: 24rpx;
					font-weight: bold;
				}
				
				&.excellent {
					background-color: #e8f5e8;
					color: #4caf50;
				}
				
				&.good {
					background-color: #e3f2fd;
					color: #2196f3;
				}
				
				&.fair {
					background-color: #fff3e0;
					color: #ff9800;
				}
				
				&.pass {
					background-color: #f3e5f5;
					color: #9c27b0;
				}
				
				&.fail {
					background-color: #ffebee;
					color: #f44336;
				}
			}
		}
		
		.grade-details {
			display: flex;
			flex-wrap: wrap;
			gap: 20rpx;
			
			.detail-item {
				display: flex;
				align-items: center;
				min-width: 45%;
				
				.detail-label {
					font-size: 22rpx;
					color: #666;
					margin-right: 8rpx;
				}
				
				.detail-value {
					font-size: 22rpx;
					color: #333;
					font-weight: 500;
				}
			}
		}
	}
}

.empty-state {
	text-align: center;
	padding: 80rpx 40rpx;
	
	.empty-text {
		display: block;
		font-size: 28rpx;
		color: #666;
		margin: 20rpx 0 10rpx;
	}
	
	.empty-desc {
		display: block;
		font-size: 24rpx;
		color: #999;
	}
}

.action-bar {
	padding: 20rpx 0;
	
	.secondary-button {
		width: 100%;
		height: 80rpx;
		background-color: #fff;
		border: 2rpx solid #007aff;
		border-radius: 12rpx;
		color: #007aff;
		font-size: 26rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		
		text {
			margin-left: 10rpx;
		}
	}
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}
</style>
