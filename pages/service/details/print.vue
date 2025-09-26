<template>
	<view class="print-details-page">
		<image class="service-image" src="https://api.hcyj.xyz/images/dnfw.png" mode="aspectFill"></image>

		<view class="service-intro-card">
			<text class="title">校园打印服务 | 便捷文印助手</text>
			<text class="subtitle">快速便民，打印服务触手可及！</text>
			<view class="tags">
				<text class="tag">快速出稿</text>
				<text class="tag">多点可取</text>
				<text class="tag">学生优惠</text>
			</view>
		</view>

		<view class="service-area-notice">
			<view class="notice-header">
				<uni-icons type="info-filled" size="20" color="#ff6b35"></uni-icons>
				<text class="notice-title">服务范围说明</text>
			</view>
			<text class="notice-text">仅限南海大学城区域内下单，超出范围无法提供相应服务请谅解，配送仅限广东东软学院校内以及小镇宿舍</text>
		</view>

		<view class="service-perks-card">
			<view class="perk-item">
				<uni-icons type="wallet" size="24" color="#ffc107"></uni-icons>
				<view class="perk-text">
					<text class="perk-title">价格优惠</text>
					<text class="perk-desc">学生专享优惠价</text>
				</view>
			</view>
			<view class="perk-item">
				<uni-icons type="time" size="24" color="#6f42c1"></uni-icons>
				<view class="perk-text">
					<text class="perk-title">快速便捷</text>
					<text class="perk-desc">高效打印服务</text>
				</view>
			</view>
			<view class="perk-item">
				<uni-icons type="checkmarkempty" size="24" color="#28a745"></uni-icons>
				<view class="perk-text">
					<text class="perk-title">质量保证</text>
					<text class="perk-desc">专业设备保障</text>
				</view>
			</view>
		</view>

		<view class="form-card">
			<view class="form-item">
				<text class="label">服务方式</text>
				<view class="service-type-selector">
					<view class="service-option" :class="{ active: serviceType === 'pickup' }"
						@click="serviceType = 'pickup'">
						<uni-icons type="person-filled" size="16"
							:color="serviceType === 'pickup' ? '#007aff' : '#999'"></uni-icons>
						<text>自己上门取件</text>
					</view>
					<view class="service-option" :class="{ active: serviceType === 'delivery' }"
						@click="serviceType = 'delivery'">
						<uni-icons type="paperplane-filled" size="16"
							:color="serviceType === 'delivery' ? '#007aff' : '#999'"></uni-icons>
						<text>派送服务</text>
					</view>
				</view>
			</view>

			<view class="form-item" @click="selectAddress" v-if="serviceType === 'delivery'">
				<text class="label">收货地址</text>
				<view class="value">
					<text v-if="selectedAddress">{{ selectedAddress.fullAddress }}</text>
					<text v-else class="placeholder">请选择或新建地址</text>
				</view>
				<uni-icons type="right" size="16"></uni-icons>
			</view>

			<view class="form-item">
				<text class="label">上传文件</text>
				<view class="file-uploader" @click="chooseFile">
					<view v-if="!selectedFile" class="file-placeholder">
						<uni-icons type="upload" size="24" color="#007aff"></uni-icons>
						<text class="placeholder-text">点击选择文件 (支持 PDF、DOCX 等)</text>
					</view>
					<view v-else class="file-selected">
						<uni-icons type="paperclip" size="20" color="#28a745"></uni-icons>
						<text class="file-name">{{ selectedFile.name }}</text>
						<view class="delete-file" @click.stop="removeFile">
							<uni-icons type="close" size="16" color="#dc3545"></uni-icons>
						</view>
					</view>
				</view>
			</view>

			<view class="form-item" v-if="serviceType === 'pickup'">
				<text class="label">联系电话</text>
				<input class="input-field" type="tel" v-model="phoneNumber" placeholder="请输入手机号" />
			</view>
			<view class="phone-notice" v-if="serviceType === 'pickup'">
				<uni-icons type="info" size="14" color="#ff6b35"></uni-icons>
				<text class="notice-text">务必填写可以拨通的手机号，因手机号无法拨通导致的问题自行承担</text>
			</view>
		</view>

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

		<view class="action-bar">
			<button class="order-button" @click="placeOrder">立即下单</button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { onShow } from '@dcloudio/uni-app';
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'

onShareAppMessage(() => {
	return {
		title: '互成一家 | 校园打印服务',
		path: '/pages/service/details/print',
		imageUrl: 'https://api.hcyj.xyz/images/dnfw.png'
	}
})

onShareTimeline(() => ({
	title: '互成一家 | 校园打印服务',
	imageUrl: 'https://api.hcyj.xyz/images/dnfw.png'
}))

const store = useStore();

const selectedAddress = computed(() => store.getters['address/get_default_address']);
const selectedFile = ref(null);
const phoneNumber = ref('');
const serviceType = ref('delivery'); // 默认选择派送服务

const selectAddress = () => {
	uni.navigateTo({
		url: '/pages/me/address/index'
	});
};

const chooseFile = () => {
	uni.chooseMessageFile({
		count: 1,
		type: 'file',
		extension: ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'],
		success: (res) => {
			console.log('选择的文件:', res.tempFiles[0]);
			const file = res.tempFiles[0];
			selectedFile.value = {
				name: file.name,
				path: file.path,
				size: file.size,
				type: file.type
			};
			uni.showToast({
				title: '文件选择成功',
				icon: 'success'
			});
		},
		fail: (err) => {
			console.error('文件选择失败:', err);
			uni.showToast({
				title: '文件选择失败',
				icon: 'none'
			});
		}
	});
};

const removeFile = () => {
	selectedFile.value = null;
	uni.showToast({
		title: '文件已移除',
		icon: 'success'
	});
};

const placeOrder = async () => {
	// 验证是否已选择文件
	if (!selectedFile.value) {
		uni.showToast({
			title: '请先选择要打印的文件',
			icon: 'none'
		});
		return;
	}

	// 如果选择派送服务，需要验证收货地址
	if (serviceType.value === 'delivery' && !selectedAddress.value) {
		uni.showToast({
			title: '请选择收货地址',
			icon: 'none'
		});
		return;
	}

	// 如果选择上门取件，需要验证联系电话
	if (serviceType.value === 'pickup' && (!phoneNumber.value || phoneNumber.value.trim() === '')) {
		uni.showToast({
			title: '请填写联系电话',
			icon: 'none'
		});
		return;
	}

	const orderPayload = {
		type: 'print',
		data: {
			serviceType: serviceType.value,
			fileName: selectedFile.value.name,
			fileSize: selectedFile.value.size,
			fileType: selectedFile.value.type,
			filePath: selectedFile.value.path
		}
	};

	// 根据服务类型添加不同的数据
	if (serviceType.value === 'delivery') {
		orderPayload.data.addressId = selectedAddress.value.id;
		orderPayload.data.addressDetails = selectedAddress.value.fullAddress;
	} else if (serviceType.value === 'pickup') {
		orderPayload.data.phoneNumber = phoneNumber.value;
		orderPayload.data.pickupLocation = '广东东软学院图书馆4楼sovo互成一家工位';
	}

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

	.service-area-notice {
		background-color: #fff8f0;
		border: 1rpx solid #ff6b35;
		margin: 20rpx 30rpx;
		padding: 20rpx;
		border-radius: 12rpx;

		.notice-header {
			display: flex;
			align-items: center;
			margin-bottom: 10rpx;

			.notice-title {
				font-size: 28rpx;
				font-weight: bold;
				color: #ff6b35;
				margin-left: 8rpx;
			}
		}

		.notice-text {
			font-size: 24rpx;
			color: #666;
			line-height: 1.4;
		}
	}

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

	.phone-notice {
		display: flex;
		align-items: flex-start;
		padding: 15rpx 0 0 0;
		margin-top: -10rpx;

		.notice-text {
			font-size: 22rpx;
			color: #ff6b35;
			margin-left: 8rpx;
			line-height: 1.3;
		}
	}

	.form-card {
		background-color: #ffffff;
		margin: 20rpx 30rpx;
		padding: 30rpx;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

		.form-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 25rpx 0;
			border-bottom: 1rpx solid #f0f0f0;

			&:last-child {
				border-bottom: none;
			}

			.label {
				font-size: 32rpx;
				color: #333;
				font-weight: 500;
				min-width: 160rpx;
			}

			.service-type-selector {
				display: flex;
				flex: 1;
				margin-left: 20rpx;
				border: 1rpx solid #e0e0e0;
				border-radius: 12rpx;
				overflow: hidden;

				.service-option {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 20rpx 15rpx;
					background-color: #f8f9fa;
					color: #666;
					font-size: 28rpx;
					transition: all 0.3s ease;

					&.active {
						background-color: #007aff;
						color: #ffffff;
					}

					.uni-icons {
						margin-right: 8rpx;
					}

					text {
						font-size: 26rpx;
					}
				}
			}

			.value {
				flex: 1;
				text-align: right;
				margin-right: 20rpx;

				text {
					font-size: 30rpx;
					color: #333;

					&.placeholder {
						color: #999;
					}
				}
			}

			.input-field {
				flex: 1;
				text-align: right;
				font-size: 30rpx;
				color: #333;
			}

			.file-uploader {
				flex: 1;
				margin-left: 20rpx;

				.file-placeholder {
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 30rpx 20rpx;
					border: 2rpx dashed #007aff;
					border-radius: 12rpx;
					background-color: #f8f9ff;
					transition: all 0.3s ease;

					&:active {
						background-color: #e8f0ff;
						border-color: #0056cc;
					}

					.placeholder-text {
						font-size: 26rpx;
						color: #007aff;
						margin-left: 10rpx;
					}
				}

				.file-selected {
					display: flex;
					align-items: center;
					padding: 20rpx;
					background-color: #f0f9ff;
					border: 1rpx solid #28a745;
					border-radius: 12rpx;
					position: relative;

					.file-name {
						flex: 1;
						font-size: 28rpx;
						color: #333;
						margin-left: 10rpx;
						margin-right: 40rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.delete-file {
						position: absolute;
						right: 15rpx;
						top: 50%;
						transform: translateY(-50%);
						width: 32rpx;
						height: 32rpx;
						background-color: rgba(220, 53, 69, 0.1);
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						transition: all 0.3s ease;

						&:active {
							background-color: rgba(220, 53, 69, 0.2);
						}
					}
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