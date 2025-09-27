<template>
	<view class="service-info-card">
		<text class="card-title">服务信息</text>
		<view class="info-item" v-if="serviceType === 'pickup'">
			<text class="info-label">上门取件地址：</text>
			<text class="info-value">广东东软学院图书馆4楼sovo互成一家工位</text>
		</view>
		<view class="info-item" v-if="serviceType === 'delivery'">
			<text class="info-label">送货上门地址：</text>
			<text class="info-value">{{ selectedAddress ? selectedAddress.fullAddress : '请先选择收货地址' }}</text>
		</view>
		<view class="info-item" v-if="serviceType === 'pickup'">
			<text class="info-label">营业时间：</text>
			<text class="info-value">周一至周日 9:00-21:00</text>
		</view>
		<view class="info-item" v-if="serviceType === 'delivery'">
			<text class="info-label">配送时间：</text>
			<text class="info-value">工作日 10:00-18:00（节假日顺延）</text>
		</view>
	</view>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

// Props
const props = defineProps({
	serviceType: {
		type: String,
		default: 'delivery'
	}
});

const store = useStore();

// 计算属性
const selectedAddress = computed(() => store.getters['address/get_default_address']);
</script>

<style lang="scss" scoped>
.service-info-card {
	background-color: #ffffff;
	margin: 20rpx 30rpx;
	padding: 30rpx;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

	.card-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
		display: block;
	}

	.info-item {
		display: flex;
		margin-bottom: 15rpx;
		align-items: flex-start;

		&:last-child {
			margin-bottom: 0;
		}

		.info-label {
			font-size: 28rpx;
			color: #666;
			width: 160rpx;
			flex-shrink: 0;
		}

		.info-value {
			font-size: 28rpx;
			color: #333;
			flex: 1;
			line-height: 1.4;
		}
	}
}
</style>