<template>
	<view class="express-details-page">
		<image class="service-image" src="https://api.hcyj.xyz/images/dngg.png" mode="aspectFill"></image>

		<view class="service-intro-card">
			<text class="title">闪电速递，使命必达</text>
			<text class="subtitle">戴拿奥特曼化身光之快递员，30分钟内极速代取，包裹直送宿舍门口！</text>
			<view class="tags">
				<text class="tag">安全可靠</text>
				<text class="tag">24小时待命</text>
				<text class="tag">超能优惠</text>
			</view>
		</view>

		<view class="service-perks-card">
			<view class="perk-item">
				<uni-icons type="map-pin-ellipse" size="24" color="#007aff"></uni-icons>
				<view class="perk-text">
					<text class="perk-title">校园专属</text>
					<text class="perk-desc">路线规划比导航还准！</text>
				</view>
			</view>
			<view class="perk-item">
				<uni-icons type="paperplane" size="24" color="#28a745"></uni-icons>
				<view class="perk-text">
					<text class="perk-title">环保行动</text>
					<text class="perk-desc">每10单，种下1棵光之树</text>
				</view>
			</view>
			<view class="perk-item">
				<uni-icons type="gift" size="24" color="#ffc107"></uni-icons>
				<view class="perk-text">
					<text class="perk-title">隐藏彩蛋</text>
					<text class="perk-desc">随机掉落奥特曼徽章</text>
				</view>
			</view>
		</view>

		<view class="form-card">
			<view class="form-item" @click="selectAddress">
				<text class="label">收货地址</text>
				<view class="value">
					<text v-if="selectedAddress">{{ selectedAddress.fullAddress }}</text>
					<text v-else class="placeholder">请选择收货地址</text>
				</view>
				<uni-icons type="right" size="16"></uni-icons>
			</view>

			<view class="form-item">
				<text class="label">快递大小</text>
				<view class="segmented-control">
					<text v-for="(item, index) in packageSizes" :key="index"
						:class="['option', { active: packageSize === item }]" @click="packageSize = item">{{ item
						}}</text>
				</view>
			</view>

			<view class="form-item">
				<text class="label">预估重量</text>
				<view class="segmented-control">
					<text v-for="(item, index) in weights" :key="index" :class="['option', { active: weight === item }]"
						@click="weight = item">{{ item }}</text>
				</view>
			</view>
		</view>

		<view class="service-process-card">
			<text class="card-title">服务流程</text>
			<view class="steps">
				<view class="step-item">线上下单</view>
				<uni-icons type="arrow-right" size="18" color="#ccc"></uni-icons>
				<view class="step-item">骑手接单</view>
				<uni-icons type="arrow-right" size="18" color="#ccc"></uni-icons>
				<view class="step-item">送货上门</view>
				<uni-icons type="arrow-right" size="18" color="#ccc"></uni-icons>
				<view class="step-item">确认收货</view>
			</view>
		</view>

		<view class="user-reviews-card">
			<text class="card-title">用户评价</text>
			<view class="review-item">
				<view class="review-header">
					<image class="avatar" :src="getRandomAvatarUrl('光之巨人')"></image>
					<text class="username">光之巨人</text>
				</view>
				<text class="review-content">速度真的快，像光一样！以后快递都交给你们了！</text>
			</view>
			<view class="review-item">
				<view class="review-header">
					<image class="avatar" :src="getRandomAvatarUrl('校园懒人')"></image>
					<text class="username">校园懒人</text>
				</view>
				<text class="review-content">太方便了，再也不用顶着大太阳去取快递了，拯救了我的懒癌！</text>
			</view>
		</view>

		<view class="action-bar">
			<button class="order-button" @click="placeOrder">立即下单</button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { onShow } from '@dcloudio/uni-app';
import { getRandomAvatarUrl } from '@/utils/randomData.js';

const store = useStore();

const selectedAddress = computed(() => store.getters['address/get_default_address']);

const packageSizes = ['小件', '中件', '大件'];
const packageSize = ref('中件');

const weights = ['<1kg', '1-5kg', '>5kg'];
const weight = ref('1-5kg');

const selectAddress = () => {
	uni.navigateTo({
		url: '/pages/me/address/index'
	});
};

const placeOrder = async () => {
	if (!selectedAddress.value) {
		uni.showToast({
			title: '请选择收货地址',
			icon: 'none'
		});
		return;
	}

	const orderPayload = {
		type: 'express',
		data: {
			addressId: selectedAddress.value.id,
			addressDetails: selectedAddress.value.fullAddress,
			packageSize: packageSize.value,
			estimatedWeight: weight.value
		}
	};

	const newOrder = await store.dispatch('order/create_order', orderPayload);

	if (newOrder && newOrder.id) {
		uni.navigateTo({
			url: `/pages/service/success?orderId=${newOrder.id}`
		});
	} else {
		uni.showToast({
			title: '下单失败，请稍后重试',
			icon: 'none'
		});
	}
};

onShow(() => {
	store.dispatch('address/load_addresses');
});
</script>

<style lang="scss" scoped>
.express-details-page {
	background-color: #f5f5f5;
	min-height: 100vh;
	padding-bottom: 120rpx;

	.service-image {
		width: 100%;
		height: 400rpx;
	}

	.service-intro-card {
		background-color: #ffffff;
		margin: -60rpx 30rpx 20rpx;
		padding: 30rpx;
		border-radius: 20rpx;
		position: relative;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
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

	.form-card {
		background-color: #ffffff;
		margin: 0 30rpx;
		padding: 0 30rpx;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

		.form-item {
			display: flex;
			align-items: center;
			padding: 30rpx 0;
			border-bottom: 1rpx solid #f0f0f0;

			&:last-child {
				border-bottom: none;
			}

			.label {
				font-size: 30rpx;
				color: #333;
				width: 180rpx;
			}

			.value {
				flex: 1;
				font-size: 30rpx;
				color: #333;

				.placeholder {
					color: #999;
				}
			}

			.segmented-control {
				display: flex;
				flex: 1;
				justify-content: flex-start;

				.option {
					background-color: #f0f0f0;
					color: #333;
					padding: 12rpx 24rpx;
					border-radius: 30rpx;
					font-size: 26rpx;
					margin-right: 20rpx;
					transition: all 0.3s ease;

					&.active {
						background-color: #007aff;
						color: #ffffff;
						font-weight: bold;
					}
				}
			}
		}
	}

	.service-perks-card {
		background-color: #ffffff;
		margin: 20rpx 30rpx;
		padding: 20rpx 30rpx;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
		display: flex;
		justify-content: space-around;

		.perk-item {
			display: flex;
			flex-direction: column;
			align-items: center;

			.perk-text {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-top: 10rpx;

				.perk-title {
					font-size: 28rpx;
					color: #333;
					font-weight: bold;
				}

				.perk-desc {
					font-size: 22rpx;
					color: #999;
				}
			}
		}
	}

	.card-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
		display: block;
	}

	.service-process-card {
		@extend .service-perks-card;
		flex-direction: column;
		align-items: flex-start;

		.steps {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;

			.step-item {
				background-color: #f0f0f0;
				color: #555;
				padding: 10rpx 20rpx;
				border-radius: 10rpx;
				font-size: 24rpx;
			}
		}
	}

	.user-reviews-card {
		@extend .service-perks-card;
		flex-direction: column;
		align-items: flex-start;

		.review-item {
			width: 100%;
			margin-bottom: 20rpx;

			&:last-child {
				margin-bottom: 0;
			}

			.review-header {
				display: flex;
				align-items: center;
				margin-bottom: 10rpx;

				.avatar {
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
					margin-right: 15rpx;
				}

				.username {
					font-size: 28rpx;
					color: #555;
				}
			}

			.review-content {
				font-size: 26rpx;
				color: #333;
				line-height: 1.6;
			}
		}
	}

	.action-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #ffffff;
		padding: 20rpx 30rpx;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
		display: flex;
		justify-content: center;

		.order-button {
			width: 100%;
			height: 88rpx;
			line-height: 88rpx;
			background: linear-gradient(90deg, #007aff, #00c6ff);
			color: #ffffff;
			border-radius: 44rpx;
			font-size: 32rpx;
			text-align: center;
			box-shadow: 0 4rpx 15rpx rgba(0, 122, 255, 0.3);
		}
	}
}
</style>