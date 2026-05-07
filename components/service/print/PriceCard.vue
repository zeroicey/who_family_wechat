<template>
	<view class="price-card">
		<view class="card-header">
			<view class="title-group">
				<text class="card-kicker">价格说明</text>
				<text class="card-title">打印价格</text>
			</view>
			<view class="header-icon">
				<uni-icons type="wallet" size="18" color="#6D4AFF"></uni-icons>
			</view>
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
import { usePrintStore } from "@/stores/print";
const printStore = usePrintStore();

const priceText = computed(() => printStore.get_price_text);
const priceLoading = computed(() => printStore.get_price_loading);
</script>

<style lang="scss" scoped>
.price-card {
	background: #ffffff;
	margin: 20rpx 30rpx;
	padding: 28rpx;
	border-radius: 24rpx;
	box-shadow: var(--shadow-soft);
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 18rpx;
}

.card-kicker,
.card-title,
.price-text,
.loading-text,
.error-text {
	display: block;
}

.card-kicker {
	margin-bottom: 8rpx;
	font-size: 22rpx;
	font-weight: 600;
	color: var(--brand-primary);
}

.card-title {
	font-size: 30rpx;
	font-weight: 700;
	color: var(--text-primary);
}

.header-icon {
	width: 56rpx;
	height: 56rpx;
	border-radius: 18rpx;
	background: rgba(109, 74, 255, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
}

.price-text,
.loading-text,
.error-text {
	font-size: 24rpx;
	line-height: 1.6;
}

.price-text {
	color: var(--text-primary);
}

.loading-text {
	color: var(--text-tertiary);
}

.error-text {
	color: #dc3545;
}
</style>
