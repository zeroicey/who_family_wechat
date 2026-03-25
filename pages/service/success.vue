<template>
    <view class="order-success-page">
        <view class="header-section">
            <text class="success-title">下单成功</text>
            <text class="success-subtitle">请添加商家微信进行联系</text>
        </view>

        <view class="card-container" v-if="order">
            <ExpressCard v-if="order.type === 'express'" :order="order" />
            <PrintCard v-if="order.type === 'print'" :order="order" />
        </view>



        <view class="footer-actions">
            <button class="btn back-home-btn" @click="backHome">返回首页</button>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';
import ExpressCard from '@/components/order/ExpressCard.vue';
import PrintCard from '@/components/order/PrintCard.vue';

const store = useStore();
const order = ref(null);

onLoad((options) => {
    const orderId = options.orderId;
    if (orderId) {
        const foundOrder = store.getters['order/get_order_by_id'](orderId);
        if (foundOrder) {
            order.value = foundOrder;
            console.log(order.value)
        } else {
            console.error(`[下单成功页] 未找到ID为 ${orderId} 的订单`);
            uni.showToast({
                title: '订单信息加载失败',
                icon: 'none'
            });
        }
    }
});



const backHome = () => {
    uni.switchTab({
        url: '/pages/home/index'
    });
};


</script>

<style lang="scss" scoped>
.order-success-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f5f5;
}

.header-section {
    padding: 30rpx 40rpx;
    text-align: left;
}

.success-title {
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
}

.success-subtitle {
    margin-left: 30rpx;
    font-size: 28rpx;
    color: #888;
    margin-top: 20rpx;
}

.card-container {
    padding: 0 30rpx;
    margin-bottom: 30rpx;

    ::v-deep .order-card {
        border-radius: 20rpx;
        padding: 30rpx;
        box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
        margin: 0;
    }
}



.footer-actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-around;
    background-color: #ffffff;
    padding: 20rpx 30rpx;
    padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    border-top: 1rpx solid #f0f0f0;
}

.btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    border-radius: 44rpx;
    font-size: 30rpx;
    text-align: center;

    &.back-home-btn {
        background: linear-gradient(to right, #ff8c00, #ff4500);
        color: #ffffff;
        border: none;
    }
}
</style>