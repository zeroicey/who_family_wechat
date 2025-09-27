<template>
	<view class="form-card">
		<view class="form-item">
			<text class="label">服务方式</text>
			<view class="service-type-selector">
				<view class="service-option" :class="{ active: serviceType === 'pickup' }"
					@click="handleServiceTypeChange('pickup')">
					<uni-icons type="person-filled" size="16"
						:color="serviceType === 'pickup' ? '#007aff' : '#999'"></uni-icons>
					<text>自己上门取件</text>
				</view>
				<view class="service-option" :class="{ active: serviceType === 'delivery' }"
					@click="handleServiceTypeChange('delivery')">
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
					<text class="placeholder-text">点击选择文件 (支持 PDF，DOCS，DOC)</text>
				</view>
				<view v-else class="file-selected">
					<uni-icons type="paperclip" size="20" color="#28a745"></uni-icons>
					<text class="file-name">{{ selectedFile.name.length > 15 ? selectedFile.name.substring(0, 15) +
						'...'
						: selectedFile.name }}</text>
					<view class="delete-file" @click.stop="removeFile">
						<uni-icons type="close" size="16" color="#dc3545"></uni-icons>
					</view>
				</view>
			</view>
		</view>

		<view class="form-item">
			<text class="label">打印份数</text>
			<view class="count-selector">
				<view class="count-button" @click="decreaseCount">
					<uni-icons type="minus" size="24" color="#007aff"></uni-icons>
				</view>
				<text class="count-value">{{ printCount }}</text>
				<view class="count-button" @click="increaseCount">
					<uni-icons type="plus" size="24" color="#007aff"></uni-icons>
				</view>
			</view>
		</view>

		<view class="form-item" v-if="serviceType === 'pickup'">
			<text class="label">联系电话</text>
			<input class="input-field" type="tel" v-model="phoneNumber"
				:placeholder="defaultPhoneNumber ? `默认: ${defaultPhoneNumber}` : '请输入手机号'" />
		</view>
		<view class="phone-notice" v-if="serviceType === 'pickup'">
			<uni-icons type="info" size="14" color="#ff6b35"></uni-icons>
			<text class="notice-text">
				{{ defaultPhoneNumber ? '已自动填入默认手机号，可修改。' : '请填写可以拨通的手机号，' }}务必确保手机号可以拨通，因手机号无法拨通导致的问题自行承担
			</text>
		</view>

		<view class="action-bar">
			<button class="order-button" @click="placeOrder">立即下单</button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// Props 和 Emits
const emit = defineEmits(['order-placed', 'service-type-change']);

// 响应式数据
const selectedFile = ref(null);
const phoneNumber = ref('');
const serviceType = ref('delivery'); // 默认选择派送服务
const printCount = ref(1); // 默认打印份数为1

// 计算属性
const selectedAddress = computed(() => store.getters['address/get_default_address']);

// 从默认地址获取手机号的计算属性
const defaultPhoneNumber = computed(() => {
	const defaultAddress = store.getters['address/get_default_address'];
	return defaultAddress?.phone || '';
});

// 方法
const selectAddress = () => {
	uni.navigateTo({
		url: '/pages/me/address/index'
	});
};

// 处理服务类型变更
const handleServiceTypeChange = (type) => {
	serviceType.value = type;

	// 通知父组件服务类型变化
	emit('service-type-change', type);

	// 根据服务类型重新设置手机号（只有当前手机号为空时才自动填入）
	if (!phoneNumber.value || phoneNumber.value.trim() === '') {
		const defaultPhone = defaultPhoneNumber.value;
		if (type === 'pickup') {
			// 上门取件：如果有默认手机号就使用，没有就让用户填写
			phoneNumber.value = defaultPhone || '';
		} else if (type === 'delivery') {
			// 派送服务：使用默认手机号（通常从地址获取）
			phoneNumber.value = defaultPhone || '';
		}
	}
};

const chooseFile = () => {
	uni.chooseMessageFile({
		count: 1,
		type: 'file',
		extension: ['pdf', 'doc', 'docx'],
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

const increaseCount = () => {
	if (printCount.value < 99) {
		printCount.value++;
	}
};

const decreaseCount = () => {
	if (printCount.value > 1) {
		printCount.value--;
	}
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

	// 如果选择派送服务，需要验证手机号（从地址或用户信息获取）
	if (serviceType.value === 'delivery') {
		const deliveryPhone = selectedAddress.value?.phone || store.getters['user/get_user_info']?.phone;
		if (!deliveryPhone || deliveryPhone.trim() === '') {
			uni.showToast({
				title: '收货地址缺少联系电话，请完善地址信息',
				icon: 'none'
			});
			return;
		}
	}

	try {
		// 显示加载提示
		uni.showLoading({
			title: '正在处理订单...'
		});

		// 获取用户信息
		const userInfo = store.getters['user/get_user_info'];

		// 将文件转换为base64
		const fileBase64 = await convertFileToBase64(selectedFile.value);

		// 构建订单数据
		const orderData = {
			type: serviceType.value === 'delivery' ? '派送服务' : '上门取件',
			address: serviceType.value === 'delivery' ? selectedAddress.value.fullAddress : '',
			name: userInfo.name || '用户',
			phone: serviceType.value === 'pickup' ? phoneNumber.value : (selectedAddress.value?.phone || userInfo.phone || ''),
			count: printCount.value,
			fileName: selectedFile.value.name,
			remark: '',
			file: fileBase64
		};

		// 调用store action上传订单
		const result = await store.dispatch('print/upload_print_order', orderData);

		uni.hideLoading();

		if (result && result.id) {
			uni.showToast({
				title: '订单创建成功',
				icon: 'success'
			});

			// 触发事件通知父组件
			emit('order-placed', result);

			// 跳转到成功页面
			setTimeout(() => {
				uni.navigateTo({
					url: `/pages/service/print/success?orderId=${result.id}`
				});
			}, 1500);
		} else {
			uni.showToast({
				title: '订单创建失败',
				icon: 'none'
			});
		}
	} catch (error) {
		uni.hideLoading();
		console.error('创建订单失败:', error);
		uni.showToast({
			title: error.message || '订单创建失败，请稍后重试',
			icon: 'none'
		});
	}
};

// 将文件转换为base64格式
const convertFileToBase64 = (file) => {
	return new Promise((resolve, reject) => {
		// 获取文件扩展名
		const fileName = file.name.toLowerCase();
		let mimeType = '';

		if (fileName.endsWith('.pdf')) {
			mimeType = 'data:application/pdf;base64,';
		} else if (fileName.endsWith('.doc')) {
			mimeType = 'data:application/msword;base64,';
		} else if (fileName.endsWith('.docx')) {
			mimeType = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,';
		} else {
			reject(new Error('不支持的文件格式，仅支持PDF、DOC、DOCX格式'));
			return;
		}

		// 使用uni.getFileSystemManager读取文件
		const fs = uni.getFileSystemManager();
		fs.readFile({
			filePath: file.path,
			encoding: 'base64',
			success: (res) => {
				resolve(mimeType + res.data);
			},
			fail: (error) => {
				console.error('读取文件失败:', error);
				reject(new Error('文件读取失败'));
			}
		});
	});
};

// 初始化手机号
const initializePhoneNumber = () => {
	// 只有当手机号为空时才自动填入默认手机号，避免覆盖用户已输入的内容
	if (!phoneNumber.value || phoneNumber.value.trim() === '') {
		const defaultPhone = defaultPhoneNumber.value;
		if (defaultPhone) {
			phoneNumber.value = defaultPhone;
		}
	}
};

// 暴露初始化方法给父组件调用
defineExpose({
	initializePhoneNumber
});
</script>

<style lang="scss" scoped>
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

		.count-selector {
			display: flex;
			align-items: center;
			margin-left: 20rpx;

			.count-button {
				width: 60rpx;
				height: 60rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: transparent;
				transition: all 0.3s ease;

				&:active {
					opacity: 0.6;
				}
			}

			.count-value {
				margin: 0 30rpx;
				font-size: 32rpx;
				font-weight: 600;
				color: #333;
				min-width: 60rpx;
				text-align: center;
			}
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

				.file-name {
					flex: 1;
					font-size: 28rpx;
					color: #333;
					margin-left: 10rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					min-width: 0;
					/* 确保flex子元素能够收缩 */
				}

				.delete-file {
					flex-shrink: 0;
					/* 防止删除按钮被压缩 */
					width: 30rpx;
					height: 30rpx;
					margin-left: 15rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: #ffffff;
					border-radius: 50%;
					box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
				}
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

	.action-bar {
		margin-top: 30rpx;
		padding-top: 20rpx;

		.order-button {
			width: 100%;
			background: linear-gradient(135deg, #007aff 0%, #0056cc 100%);
			color: #ffffff;
			border: none;
			border-radius: 16rpx;
			padding: 30rpx 0;
			font-size: 36rpx;
			font-weight: bold;
			box-shadow: 0 8rpx 24rpx rgba(0, 122, 255, 0.3);
			transition: all 0.3s ease;

			&:active {
				transform: translateY(2rpx);
				box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);
			}
		}
	}
}
</style>