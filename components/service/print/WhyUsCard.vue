<template>
	<view>
		<!-- 服务优势卡片 -->
		<view class="why-us-card">
			<text class="card-title">服务优势</text>
			<view class="reason-item">
				<uni-icons type="paperplane-filled" size="20" color="#007aff"></uni-icons>
				<text>简单操作，一键上传文件</text>
			</view>
			<view class="reason-item">
				<uni-icons type="gear-filled" size="20" color="#28a745"></uni-icons>
				<text>专业设备，高质量打印</text>
			</view>
			<view class="reason-item">
				<uni-icons type="hand-up-filled" size="20" color="#ffc107"></uni-icons>
				<text>增值服务，装订整理</text>
			</view>
		</view>

		<!-- 附加服务卡片 -->
		<view class="hidden-perks-card">
			<text class="card-title">附加服务</text>
			<view class="perk-item">
				<uni-icons type="fire-filled" size="20" color="#dc3545"></uni-icons>
				<text>加急服务，快速处理</text>
			</view>
			<view class="perk-item">
				<uni-icons type="download-filled" size="20" color="#17a2b8"></uni-icons>
				<text>多种格式，全面支持</text>
			</view>
			<view class="perk-item">
				<uni-icons type="auth-filled" size="20" color="#6f42c1"></uni-icons>
				<text>专业装帧，精美呈现</text>
			</view>
		</view>
	</view>
</template>

<script setup>
// 这是一个纯展示组件，不需要任何逻辑
</script>

<style lang="scss" scoped>
.why-us-card,
.hidden-perks-card {
	background-color: #ffffff;
	margin: 20rpx 30rpx;
	padding: 30rpx;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	align-items: flex-start;

	.card-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
		display: block;
	}

	.reason-item,
	.perk-item {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #555;
		margin-bottom: 15rpx;

		&:last-child {
			margin-bottom: 0;
		}

		.uni-icons {
			margin-right: 15rpx;
		}
	}
}

.hidden-perks-card {
	margin-top: 20rpx;
}
</style>