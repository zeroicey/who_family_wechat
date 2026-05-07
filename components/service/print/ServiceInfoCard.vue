<template>
	<view class="service-info-card">
		<text class="card-kicker">服务信息</text>
		<text class="card-title">{{ serviceType === 'pickup' ? '取件安排' : '配送安排' }}</text>
		<view class="info-item" v-if="serviceType === 'pickup'">
			<text class="info-label">取件地址</text>
			<text class="info-value">广东东软学院图书馆4楼 sovo 互成一家工位</text>
		</view>
		<view class="info-item" v-if="serviceType === 'delivery'">
			<text class="info-label">配送地址</text>
			<text class="info-value">{{ selectedAddress ? selectedAddress.fullAddress : '请先选择收货地址' }}</text>
		</view>
		<view class="info-item" v-if="serviceType === 'pickup'">
			<text class="info-label">营业时间</text>
			<text class="info-value">周一至周日 9:00-21:00</text>
		</view>
		<view class="info-item" v-if="serviceType === 'delivery'">
			<text class="info-label">配送时间</text>
			<text class="info-value">工作日 10:00-18:00（节假日顺延）</text>
		</view>
	</view>
</template>

<script setup>
import { computed } from 'vue';
import { useAddressStore } from "@/stores/address";
const addressStore = useAddressStore();

const props = defineProps({
	serviceType: {
		type: String,
		default: 'delivery'
	}
});

const selectedAddress = computed(() => addressStore.get_default_address);
</script>

<style lang="scss" scoped>
.service-info-card {
	background: #ffffff;
	margin: 20rpx 30rpx;
	padding: 28rpx;
	border-radius: 24rpx;
	box-shadow: var(--shadow-soft);
}

.card-kicker,
.card-title,
.info-label,
.info-value {
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

.info-item {
	padding: 18rpx 0;
	border-bottom: 1rpx solid #eef2f7;

	&:last-child {
		padding-bottom: 0;
		border-bottom: none;
	}
}

.info-label {
	margin-bottom: 8rpx;
	font-size: 22rpx;
	color: var(--text-tertiary);
}

.info-value {
	font-size: 26rpx;
	line-height: 1.6;
	color: var(--text-primary);
}
</style>
