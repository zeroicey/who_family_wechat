<template>
	<view class="service-intro-card">
		<text class="title">校园打印服务</text>
		<text class="subtitle">保留原有下单流程，但用更清楚的服务结构来承载它。</text>
		<view class="tags">
			<text class="tag">快速出稿</text>
			<text class="tag">多点可取</text>
			<text class="tag">学生优惠</text>
		</view>
	</view>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.service-intro-card {
	background: #ffffff;
	margin: 20rpx 30rpx;
	padding: 28rpx;
	border-radius: 24rpx;
	box-shadow: var(--shadow-soft);
	display: flex;
	flex-direction: column;
}

.title,
.subtitle {
	display: block;
}

.title {
	font-size: 34rpx;
	font-weight: 700;
	color: var(--text-primary);
}

.subtitle {
	margin-top: 12rpx;
	font-size: 24rpx;
	line-height: 1.6;
	color: var(--text-secondary);
}

.tags {
	display: flex;
	gap: 12rpx;
	flex-wrap: wrap;
	margin-top: 20rpx;
}

.tag {
	background: rgba(109, 74, 255, 0.1);
	color: var(--brand-primary);
	padding: 8rpx 16rpx;
	border-radius: 999rpx;
	font-size: 22rpx;
	font-weight: 600;
}
</style>
