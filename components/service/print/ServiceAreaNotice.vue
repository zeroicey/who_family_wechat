<template>
	<view class="service-area-notice">
		<view class="notice-header">
			<view class="notice-icon">
				<uni-icons type="info-filled" size="16" color="#F59E0B"></uni-icons>
			</view>
			<view>
				<text class="notice-kicker">服务范围</text>
				<text class="notice-title">当前配送与下单说明</text>
			</view>
		</view>
		<text class="notice-text">仅限南海大学城区域内下单，超出范围无法提供相应服务；配送仅限广东东软学院校内以及小镇宿舍。</text>
	</view>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.service-area-notice {
	background: #fffaf0;
	border: 1rpx solid rgba(245, 158, 11, 0.18);
	margin: 20rpx 30rpx;
	padding: 24rpx;
	border-radius: 24rpx;
	box-shadow: var(--shadow-soft);
}

.notice-header {
	display: flex;
	align-items: center;
	gap: 16rpx;
	margin-bottom: 12rpx;
}

.notice-icon {
	width: 48rpx;
	height: 48rpx;
	border-radius: 16rpx;
	background: rgba(245, 158, 11, 0.12);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.notice-kicker,
.notice-title,
.notice-text {
	display: block;
}

.notice-kicker {
	margin-bottom: 6rpx;
	font-size: 20rpx;
	font-weight: 600;
	color: #d97706;
}

.notice-title {
	font-size: 28rpx;
	font-weight: 700;
	color: var(--text-primary);
}

.notice-text {
	font-size: 24rpx;
	line-height: 1.6;
	color: var(--text-secondary);
}
</style>
