<template>
	<view class="service-closed-overlay">
		<view class="service-closed-modal">
			<view class="modal-icon">
				<text class="icon">🚫</text>
			</view>
			<view class="modal-title">打印服务暂未开启</view>
			<view class="modal-content">
				<text class="service-time">服务开启时间：周一至周五 8:00-18:00</text>
				<text class="service-note">请在服务时间内使用打印功能</text>
			</view>
			<view class="modal-actions">
				<button class="back-home-btn" @click="goToHome">返回主页</button>
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
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999;
}

.service-closed-modal {
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 60rpx 40rpx;
	margin: 0 40rpx;
	text-align: center;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.modal-icon {
	margin-bottom: 30rpx;
}

.modal-icon .icon {
	font-size: 80rpx;
}

.modal-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 30rpx;
}

.modal-content {
	margin-bottom: 40rpx;
}

.service-time {
	display: block;
	font-size: 28rpx;
	color: #666666;
	margin-bottom: 16rpx;
}

.service-note {
	display: block;
	font-size: 24rpx;
	color: #999999;
}

.modal-actions {
	margin-top: 40rpx;
}

.back-home-btn {
	background-color: #007aff;
	color: #ffffff;
	border: none;
	border-radius: 8rpx;
	padding: 24rpx 60rpx;
	font-size: 32rpx;
	font-weight: bold;
}

.back-home-btn:active {
	background-color: #0056cc;
}
</style>