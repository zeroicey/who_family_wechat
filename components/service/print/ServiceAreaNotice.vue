<template>
	<view class="service-area-notice">
		<view class="notice-header">
			<uni-icons type="info-filled" size="20" color="#ff6b35"></uni-icons>
			<text class="notice-title">服务范围说明</text>
		</view>
		<text class="notice-text">仅限南海大学城区域内下单，超出范围无法提供相应服务请谅解，配送仅限广东东软学院校内以及小镇宿舍</text>
	</view>
</template>

<script setup>
// 无需额外逻辑，纯展示组件
</script>

<style lang="scss" scoped>
.service-area-notice {
	background-color: #fff8f0;
	border: 1rpx solid #ff6b35;
	margin: 20rpx 30rpx;
	padding: 20rpx;
	border-radius: 12rpx;

	.notice-header {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;

		.notice-title {
			font-size: 28rpx;
			font-weight: bold;
			color: #ff6b35;
			margin-left: 8rpx;
		}
	}

	.notice-text {
		font-size: 24rpx;
		color: #666;
		line-height: 1.4;
	}
}
</style>