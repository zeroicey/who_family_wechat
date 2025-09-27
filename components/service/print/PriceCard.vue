<template>
	<view class="price-card">
		<view class="card-header">
			<uni-icons type="wallet" size="24" color="#ffc107"></uni-icons>
			<text class="card-title">打印价格</text>
		</view>
		<view class="price-content">
			<text v-if="priceText" class="price-text">{{ priceText }}</text>
			<text v-else-if="priceLoading" class="loading-text">价格加载中...</text>
			<text v-else class="error-text">价格获取失败，请稍后重试</text>
		</view>
	</view>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const priceText = computed(() => store.getters['print/get_price_text']);
const priceLoading = computed(() => store.getters['print/get_price_loading']);
</script>

<style lang="scss" scoped>
.price-card {
	background-color: #ffffff;
	margin: 20rpx 30rpx;
	padding: 30rpx;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

	.card-header {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;

		.card-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-left: 10rpx;
		}
	}

	.price-content {
		.price-text {
			font-size: 28rpx;
			color: #333;
			line-height: 1.4;
		}

		.loading-text {
			font-size: 28rpx;
			color: #999;
		}

		.error-text {
			font-size: 28rpx;
			color: #dc3545;
		}
	}
}
</style>