<template>
    <view class="orders-container">
        <OrderTabBar v-model:activeTab="activeTab" />

        <!-- 加载中状态 -->
        <view class="loading-container" v-if="loading">
            <view class="loading-spinner"></view>
            <text class="loading-text">正在加载订单...</text>
        </view>

        <!-- 订单列表 -->
        <view class="order-list" v-else-if="filteredOrders.length > 0">
            <OrderItem v-for="order in filteredOrders" :key="order.id" :order="order"
                @view-detail="handleViewOrderDetail" @pay="handlePayOrder" @confirm="handleConfirmReceipt"
                @view-logistics="handleViewLogistics" />
        </view>

        <!-- 空状态 -->
        <EmptyOrder v-else :type="activeTab" />
    </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
// 引入组件
import OrderTabBar from '@/components/me/orders/OrderTabBar.vue';
import OrderItem from '@/components/me/orders/OrderItem.vue';
import EmptyOrder from '@/components/me/orders/EmptyOrder.vue';

const store = useStore();

// 获取路由参数
const activeTab = ref('all');

// 加载状态
const loading = computed(() => store.state.order.loadingOrderList);

// 使用Vuex中的订单列表
const orders = computed(() => store.state.order.orderList);

// 根据标签筛选订单
const filteredOrders = computed(() => {
    if (activeTab.value === 'all') {
        return orders.value;
    }
    return orders.value.filter(order => order.status === activeTab.value);
});


// 处理支付订单
const handlePayOrder = async (orderId) => {
    const success = await store.dispatch('order/payOrder', orderId);
    if (success) {
        // 支付成功后刷新列表
        fetchOrderList();
    }
};

// 处理确认收货
const handleConfirmReceipt = async (orderId) => {
    uni.showModal({
        title: '确认收货',
        content: '你确定已经收到该商品吗？',
        success: async (res) => {
            if (res.confirm) {
                const success = await store.dispatch('order/confirmReceipt', orderId);
                if (success) {
                    // 收货成功后刷新列表
                    fetchOrderList();
                }
            }
        }
    });
};

// 处理查看物流
const handleViewLogistics = (orderId) => {
    uni.navigateTo({
        url: `/pages/me/orders/logistics?id=${orderId}`
    });
};

// 跳转到订单详情
const handleViewOrderDetail = (orderId) => {
    uni.navigateTo({
        url: `/pages/me/orders/detail?id=${orderId}`
    });
};

// 获取订单列表
const fetchOrderList = () => {
    store.dispatch('order/fetchOrderList');
};

// 返回上一级页面
const navigateBack = () => {
    uni.navigateBack();
};

onMounted(() => {
    // 获取路由参数
    const query = uni.getSystemInfoSync().platform === 'devtools'
        ? {}
        : uni.getLaunchOptionsSync().query;

    if (query.type && ['all', 'unpaid', 'undelivered', 'delivered', 'completed'].includes(query.type)) {
        activeTab.value = query.type;
    }

    // 获取订单列表
    fetchOrderList();
});
</script>

<style lang="scss" scoped>
.orders-container {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding-bottom: 2vw;

    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 10vw 0;

        .loading-spinner {
            width: 8vw;
            height: 8vw;
            border-radius: 50%;
            border: 0.5vw solid #f3f3f3;
            border-top: 0.5vw solid #07c160;
            animation: spin 1s linear infinite;
            margin-bottom: 3vw;
        }

        .loading-text {
            font-size: 3.5vw;
            color: #999;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }
    }

    .order-list {
        padding: 2vw;
    }
}
</style>