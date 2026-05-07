<template>
	<view class="service-closed-overlay">
		<view class="service-closed-modal">
			<view class="modal-icon">
				<uni-icons type="info-filled" size="34" color="#6D4AFF"></uni-icons>
			</view>
			<view class="modal-title">打印服务暂未开启</view>
			<view class="modal-content">
				<text class="service-time">服务开启时间：周一至周五 8:00-18:00</text>
				<text class="service-note">请在服务时间内使用打印功能</text>
			</view>
			<view class="modal-actions">
				<button class="back-home-btn" @click="goToHome">返回服务主页</button>
			</view>
		</view>
	</view>
</template>

<script setup>
const goToHome = () => {
	uni.switchTab({
		url: '/pages/home/index'
	});
};
</script>

<style lang="scss" scoped>
.service-closed-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(24, 33, 49, 0.35);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999;
	backdrop-filter: blur(8rpx);
}

.service-closed-modal {
	background-color: #ffffff;
	border-radius: 28rpx;
	padding: 52rpx 40rpx;
	margin: 0 40rpx;
	text-align: center;
	box-shadow: 0 20rpx 60rpx rgba(24, 33, 49, 0.14);
}

.modal-icon {
	width: 88rpx;
	height: 88rpx;
	margin: 0 auto 24rpx;
	border-radius: 28rpx;
	background: rgba(109, 74, 255, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
}

.modal-title {
	font-size: 34rpx;
	font-weight: 700;
	color: var(--text-primary);
	margin-bottom: 24rpx;
}

.modal-content {
	margin-bottom: 32rpx;
}

.service-time,
.service-note {
	display: block;
}

.service-time {
	font-size: 26rpx;
	color: var(--text-primary);
	margin-bottom: 12rpx;
}

.service-note {
	font-size: 22rpx;
	line-height: 1.6;
	color: var(--text-tertiary);
}

.back-home-btn {
	background: linear-gradient(135deg, #6d4aff, #8d6bff);
	color: #ffffff;
	border: none;
	border-radius: 999rpx;
	padding: 24rpx 60rpx;
	font-size: 28rpx;
	font-weight: 700;
}
</style>
