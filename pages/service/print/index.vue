<template>
	<view class="print-details-page">
		<!-- 服务未开启遮罩 -->
		<ServiceClosedModal v-if="isServiceOpen === false" @go-home="goToHome" />

		<!-- 原有内容 -->
		<view v-else class="content">
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
import { useStore } from 'vuex';
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

// 引入组件
import ServiceClosedModal from '@/components/service/print/ServiceClosedModal.vue';
import ServiceIntroCard from '@/components/service/print/ServiceIntroCard.vue';
import ServiceAreaNotice from '@/components/service/print/ServiceAreaNotice.vue';
import PriceCard from '@/components/service/print/PriceCard.vue';
import PrintForm from '@/components/service/print/PrintForm.vue';
import ServiceInfoCard from '@/components/service/print/ServiceInfoCard.vue';
import WhyUsCard from '@/components/service/print/WhyUsCard.vue';

const store = useStore();

// 响应式数据
const serviceType = ref('delivery'); // 默认选择派送服务
const printFormRef = ref(null);

// 计算属性
const selectedAddress = computed(() => store.getters['address/get_default_address']);
const isServiceOpen = computed(() => store.getters['print/get_is_service_open']);

// 从默认地址获取手机号的计算属性
const defaultPhoneNumber = computed(() => {
	const defaultAddress = store.getters['address/get_default_address'];
	return defaultAddress?.phone || '';
});

// 生命周期函数
onShow(async () => {
	try {
		// 加载地址列表
		await store.dispatch('address/load_addresses');

		// 获取打印价格
		await store.dispatch('print/fetch_print_price');

		// 检查打印服务是否开启
		await store.dispatch('print/check_service_open');

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
		url: '/pages/index/index'
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
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	position: relative;

	.content {
		padding-bottom: 40rpx;
	}

	.service-image {
		width: 100%;
		height: 400rpx;
		border-radius: 0 0 40rpx 40rpx;
		box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
	}
}
</style>