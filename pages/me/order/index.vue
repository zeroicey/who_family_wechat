<template>
    <view class="order-page">
        <view class="tabs-container">
            <view v-for="(tab, index) in tabs" :key="index" :class="['tab-item', { active: currentTab === index }]"
                @click="changeTab(index)">
                {{ tab.name }}
            </view>
        </view>

        <scroll-view scroll-y class="order-list-container">
            <view v-if="filteredOrders.length > 0" class="order-list">
                <view v-for="order in filteredOrders" :key="order.id" class="order-item">
                    <ExpressCard v-if="order.type === 'express'" :order="order" />
                </view>
            </view>
            <view v-else class="empty-state">
                <text class="empty-text">暂无相关订单</text>
            </view>
        </scroll-view>
    </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import ExpressCard from '@/components/order/ExpressCard.vue';

const store = useStore();
const currentTab = ref(0);

const tabs = [
    { name: '全部', status: 'all' },
    { name: '待支付', status: '待支付' },
    { name: '待完成', status: '待完成' },
    { name: '已完成', status: '已完成' },
];

const orders = computed(() => store.getters['order/get_orders']);

const filteredOrders = computed(() => {
    const selectedStatus = tabs[currentTab.value].status;
    if (selectedStatus === 'all') {
        return orders.value;
    }
    return store.getters['order/get_orders_by_status'](selectedStatus);
});

const changeTab = (index) => {
    currentTab.value = index;
};

onShow(() => {
    store.dispatch('order/load_orders');
});

</script>

<style lang="scss" scoped>
.order-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f5f5f5;
}

.tabs-container {
    display: flex;
    background-color: #ffffff;
    border-bottom: 1rpx solid #f0f0f0;
    padding: 0 20rpx;
}

.tab-item {
    flex: 1;
    text-align: center;
    padding: 24rpx 0;
    font-size: 28rpx;
    color: #666;
    position: relative;
    transition: color 0.3s ease;

    &.active {
        color: #333;
        font-weight: bold;

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 60rpx;
            height: 6rpx;
            background-color: #2979ff;
            border-radius: 3rpx;
        }
    }
}

.order-list-container {
    flex: 1;
    overflow-y: auto;
}

.order-list {
    padding: 30rpx;
}

.order-item {
    margin-bottom: 30rpx;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 200rpx;
    color: #999;
}

.empty-icon {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 20rpx;
}

.empty-text {
    font-size: 28rpx;
}
</style>