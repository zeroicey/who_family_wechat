<template>
	<view class="service-intro-card">
		<text class="title">校园打印服务 | 便捷文印助手</text>
		<text class="subtitle">快速便民，打印服务触手可及！</text>
		<view class="tags">
			<text class="tag">快速出稿</text>
			<text class="tag">多点可取</text>
			<text class="tag">学生优惠</text>
		</view>
	</view>
</template>

<script setup>
// 无需额外逻辑，纯展示组件
</script>

<style lang="scss" scoped>
.service-intro-card {
	background-color: #ffffff;
	margin: -60rpx 30rpx 20rpx;
	padding: 30rpx;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	position: relative;
	display: flex;
	flex-direction: column;

	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.subtitle {
		font-size: 26rpx;
		color: #666;
		margin-top: 15rpx;
	}

	.tags {
		display: flex;
		margin-top: 25rpx;

		.tag {
			background-color: #e8f4ff;
			color: #007aff;
			padding: 8rpx 16rpx;
			border-radius: 20rpx;
			font-size: 22rpx;
			margin-right: 15rpx;
		}
	}
}
</style>