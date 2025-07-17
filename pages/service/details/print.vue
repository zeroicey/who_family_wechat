<template>
	<view class="print-details-page">
		<image class="service-image" src="https://api.hcyj.xyz/images/dnfw.png" mode="aspectFill"></image>

		<view class="service-intro-card">
			<text class="title">戴拿打印站 | 校园全能文印管家</text>
			<text class="subtitle">24小时不打烊，打印像点外卖一样简单！</text>
			<view class="tags">
				<text class="tag">极速出稿</text>
				<text class="tag">多点可取</text>
				<text class="tag">学生特惠</text>
			</view>
		</view>

		<view class="service-perks-card">
			<view class="perk-item">
				<uni-icons type="wallet" size="24" color="#ffc107"></uni-icons>
				<view class="perk-text">
					<text class="perk-title">首单特惠</text>
					<text class="perk-desc">新用户享1元打印</text>
				</view>
			</view>
			<view class="perk-item">
				<uni-icons type="moon" size="24" color="#6f42c1"></uni-icons>
				<view class="perk-text">
					<text class="perk-title">深夜补贴</text>
					<text class="perk-desc">22点后下单享8折</text>
				</view>
			</view>
			<view class="perk-item">
				<uni-icons type="paperplane" size="24" color="#28a745"></uni-icons>
				<view class="perk-text">
					<text class="perk-title">环保彩蛋</text>
					<text class="perk-desc">每100页种1棵树</text>
				</view>
			</view>
		</view>

		<view class="form-card">
			<view class="form-item" @click="selectAddress">
				<text class="label">取件地址</text>
				<view class="value">
					<text v-if="selectedAddress">{{ selectedAddress.fullAddress }}</text>
					<text v-else class="placeholder">请选择或新建地址</text>
				</view>
				<uni-icons type="right" size="16"></uni-icons>
			</view>

			<view class="form-item">
				<text class="label">打印份数</text>
				<input class="input-field" type="number" v-model.number="printCopies" placeholder="请输入份数" />
			</view>
		</view>

		<view class="why-us-card">
			<text class="card-title">为什么选戴拿？</text>
			<view class="reason-item">
				<uni-icons type="paperplane-filled" size="20" color="#007aff"></uni-icons>
				<text>傻瓜式操作，微信一键上传</text>
			</view>
			<view class="reason-item">
				<uni-icons type="gear-filled" size="20" color="#28a745"></uni-icons>
				<text>学霸级配置，高速激光打印</text>
			</view>
			<view class="reason-item">
				<uni-icons type="hand-up-filled" size="20" color="#ffc107"></uni-icons>
				<text>免费裁切/打孔/胶装</text>
			</view>
		</view>

		<view class="hidden-perks-card">
			<text class="card-title">隐藏服务</text>
			<view class="perk-item">
				<uni-icons type="fire-filled" size="20" color="#dc3545"></uni-icons>
				<text>10分钟加急通道，告别挂科</text>
			</view>
			<view class="perk-item">
				<uni-icons type="download-filled" size="20" color="#17a2b8"></uni-icons>
				<text>共享往届真题/课件模板</text>
			</view>
			<view class="perk-item">
				<uni-icons type="auth-filled" size="20" color="#6f42c1"></uni-icons>
				<text>封面可选戴拿限定皮肤</text>
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

const store = useStore();

const selectedAddress = computed(() => store.getters['address/get_default_address']);
const printCopies = ref(1);

const selectAddress = () => {
	uni.navigateTo({
		url: '/pages/me/address/index'
	});
};

const placeOrder = async () => {
	if (!selectedAddress.value) {
		uni.showToast({
			title: '请选择取件地址',
			icon: 'none'
		});
		return;
	}

	const orderPayload = {
		type: 'print',
		data: {
			addressId: selectedAddress.value.id,
			addressDetails: selectedAddress.value.fullAddress,
			copies: printCopies.value
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
.print-details-page {
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

			.input-field {
				flex: 1;
				font-size: 30rpx;
				color: #333;
				text-align: right;
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

	.why-us-card,
	.hidden-perks-card {
		@extend .service-intro-card;
		margin-top: 20rpx;
		align-items: flex-start;

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