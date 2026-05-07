<template>
	<view>
		<view class="why-us-card">
			<text class="card-kicker">服务优势</text>
			<text class="card-title">为什么放在校园服务主入口里</text>
			<view class="reason-item">
				<uni-icons type="paperplane-filled" size="18" color="#6D4AFF"></uni-icons>
				<text>简单操作，一键上传文件</text>
			</view>
			<view class="reason-item">
				<uni-icons type="gear-filled" size="18" color="#22C55E"></uni-icons>
				<text>专业设备，高质量打印</text>
			</view>
			<view class="reason-item">
				<uni-icons type="hand-up-filled" size="18" color="#F59E0B"></uni-icons>
				<text>增值服务，装订整理</text>
			</view>
		</view>

		<view class="hidden-perks-card">
			<text class="card-kicker">附加服务</text>
			<text class="card-title">用于处理更多长尾打印需求</text>
			<view class="perk-item">
				<uni-icons type="fire-filled" size="18" color="#EF4444"></uni-icons>
				<text>加急服务，快速处理</text>
			</view>
			<view class="perk-item">
				<uni-icons type="download-filled" size="18" color="#0EA5E9"></uni-icons>
				<text>多种格式，全面支持</text>
			</view>
			<view class="perk-item">
				<uni-icons type="auth-filled" size="18" color="#8B5CF6"></uni-icons>
				<text>专业装帧，精美呈现</text>
			</view>
		</view>
	</view>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.why-us-card,
.hidden-perks-card {
	background: #ffffff;
	margin: 20rpx 30rpx;
	padding: 28rpx;
	border-radius: 24rpx;
	box-shadow: var(--shadow-soft);
}

.card-kicker,
.card-title {
	display: block;
}

.card-kicker {
	margin-bottom: 8rpx;
	font-size: 22rpx;
	font-weight: 600;
	color: var(--brand-primary);
}

.card-title {
	margin-bottom: 20rpx;
	font-size: 30rpx;
	font-weight: 700;
	color: var(--text-primary);
}

.reason-item,
.perk-item {
	display: flex;
	align-items: center;
	gap: 14rpx;
	padding: 16rpx 0;
	font-size: 26rpx;
	color: var(--text-secondary);
	border-bottom: 1rpx solid #eef2f7;

	&:last-child {
		padding-bottom: 0;
		border-bottom: none;
	}
}
</style>
