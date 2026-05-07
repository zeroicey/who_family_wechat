<template>
	<view class="print-details-page">
		<!-- 服务未开启遮罩 -->
		<ServiceClosedModal v-if="isServiceOpen === false" @go-home="goToHome" />

		<view v-else class="content">
			<view class="service-hero">
				<view>
					<text class="hero-kicker">服务</text>
					<text class="hero-title">校园打印服务</text>
					<text class="hero-desc">上传文件、选择服务方式、确认地址与份数，保持流程不变，只统一成一套服务页表达。</text>
				</view>
				<view class="hero-badge">
					<text>打印</text>
				</view>
			</view>
			<image class="service-image" src="https://api.hcyj.xyz/images/dnfw.png" mode="aspectFill"></image>

			<!-- 服务介绍卡片 -->
			<ServiceIntroCard />

			<!-- 服务范围说明 -->
			<ServiceAreaNotice />

			<!-- 价格卡片 -->
			<PriceCard />

			<!-- 打印表单 -->
			<PrintForm ref="printFormRef" @order-placed="handleOrderPlaced"
				@service-type-change="handleServiceTypeChange" />

			<!-- 服务信息卡片 -->
			<ServiceInfoCard :service-type="serviceType" />

			<!-- 服务优势说明 -->
			<WhyUsCard />
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'

onShareAppMessage(() => {
	return {
		title: '互成一家 | 校园打印服务',
		path: '/pages/service/print/index',
		imageUrl: 'https://api.hcyj.xyz/images/dnfw.png'
	}
})

onShareTimeline(() => ({
	title: '互成一家 | 校园打印服务',
	imageUrl: 'https://api.hcyj.xyz/images/dnfw.png'
}))

// 引入组件
import ServiceClosedModal from '@/components/service/print/ServiceClosedModal.vue';
import ServiceIntroCard from '@/components/service/print/ServiceIntroCard.vue';
import ServiceAreaNotice from '@/components/service/print/ServiceAreaNotice.vue';
import PriceCard from '@/components/service/print/PriceCard.vue';
import PrintForm from '@/components/service/print/PrintForm.vue';
import ServiceInfoCard from '@/components/service/print/ServiceInfoCard.vue';
import WhyUsCard from '@/components/service/print/WhyUsCard.vue';
import { useAddressStore } from "@/stores/address";
import { usePrintStore } from "@/stores/print";
const addressStore = useAddressStore();
const printStore = usePrintStore();

// 响应式数据
const serviceType = ref('delivery'); // 默认选择派送服务
const printFormRef = ref(null);

// 计算属性
const selectedAddress = computed(() => addressStore.get_default_address);
const isServiceOpen = computed(() => printStore.get_is_service_open);

// 从默认地址获取手机号的计算属性
const defaultPhoneNumber = computed(() => {
	const defaultAddress = addressStore.get_default_address;
	return defaultAddress?.phone || '';
});

// 生命周期函数
onShow(async () => {
	try {
		// 检查打印服务是否开启
		await printStore.check_service_open();

		// 加载地址列表
		await addressStore.load_addresses();

		// 获取打印价格
		await printStore.fetch_print_price();

		// 初始化打印表单的手机号
		if (printFormRef.value && printFormRef.value.initializePhoneNumber) {
			printFormRef.value.initializePhoneNumber();
		}
	} catch (error) {
		console.error('页面初始化失败:', error);
	}
});

// 方法
const goToHome = () => {
	uni.switchTab({
		url: '/pages/home/index'
	});
};

const handleOrderPlaced = (orderResult) => {
	console.log('订单创建成功:', orderResult);
	// 可以在这里添加额外的处理逻辑
};

// 监听服务类型变化（从PrintForm组件传递过来）
const handleServiceTypeChange = (type) => {
	serviceType.value = type;
};

// 暴露给PrintForm组件使用
defineExpose({
	serviceType,
	selectedAddress,
	defaultPhoneNumber,
	handleServiceTypeChange
});
</script>

<style lang="scss" scoped>
.print-details-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #f7f4ff 0%, #f5f7fb 34%, #f5f7fb 100%);
	position: relative;

	.content {
		padding: 24rpx 0 40rpx;
	}

	.service-hero {
		margin: 0 30rpx 20rpx;
		padding: 28rpx;
		border-radius: 28rpx;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(241, 237, 255, 0.98) 100%);
		box-shadow: var(--shadow-soft);
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 20rpx;
	}

	.hero-kicker,
	.hero-title,
	.hero-desc,
	.hero-badge text {
		display: block;
	}

	.hero-kicker {
		margin-bottom: 10rpx;
		font-size: 22rpx;
		font-weight: 600;
		color: var(--brand-primary);
	}

	.hero-title {
		font-size: 38rpx;
		font-weight: 700;
		color: var(--text-primary);
	}

	.hero-desc {
		max-width: 520rpx;
		margin-top: 10rpx;
		font-size: 24rpx;
		line-height: 1.6;
		color: var(--text-secondary);
	}

	.hero-badge {
		padding: 14rpx 18rpx;
		border-radius: 20rpx;
		background: rgba(109, 74, 255, 0.1);
	}

	.hero-badge text {
		font-size: 20rpx;
		font-weight: 600;
		color: var(--brand-primary);
	}

	.service-image {
		width: calc(100% - 60rpx);
		margin: 0 30rpx;
		height: 320rpx;
		border-radius: 28rpx;
		box-shadow: var(--shadow-soft);
	}
}
</style>
