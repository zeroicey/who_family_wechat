<template>
    <view class="order-success-page">
        <view class="header-section">
            <text class="success-title">下单成功</text>
            <text class="success-subtitle">请添加商家微信进行联系</text>
        </view>

        <view class="card-container" v-if="order">
            <!-- 内联的打印订单卡片 -->
            <view class="order-card print-card">
                <view class="card-header">
                    <view class="order-type">
                        <uni-icons type="printer-filled" size="20" color="#2979ff"></uni-icons>
                        <text class="type-text">文件打印</text>
                    </view>
                    <view :class="['order-status', statusClass]">{{ order.status }}</view>
                </view>
                <view class="card-body">
                    <view class="info-row">
                        <text class="label">订单号:</text>
                        <text class="value">{{ order.id }}</text>
                    </view>
                    <view class="info-row">
                        <text class="label">收货地址:</text>
                        <text class="value">{{ order.data.addressDetails }}</text>
                    </view>
                    <view class="info-row">
                        <text class="label">打印份数:</text>
                        <text class="value">{{ order.data.copies }} 份</text>
                    </view>
                    <view class="info-row">
                        <text class="label">创建时间:</text>
                        <text class="value">{{ formattedCreatedAt }}</text>
                    </view>
                </view>
            </view>
        </view>

        <view class="card-container">
            <view class="contact-card">
                <text class="contact-title">联系商家，跟进订单状态</text>
                <image class="qr-code" src="https://api.hcyj.xyz/images/dnwx.png" mode="aspectFit"></image>
                <view class="wechat-info">
                    <text>微信号：Dianasyxl18024113874</text>
                    <button class="copy-btn" @click="copyWechat">复制</button>
                </view>
            </view>
        </view>

        <view class="footer-actions">
            <button class="btn back-home-btn" @click="backHome">返回首页</button>
        </view>
    </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';

const store = useStore();
const order = ref(null);

// 从 PrintCard 组件迁移的计算属性
const statusClass = computed(() => {
    if (!order.value) return '';
    switch (order.value.status) {
        case '待支付':
            return 'status-pending';
        case '待完成':
            return 'status-processing';
        case '已完成':
            return 'status-completed';
        case '已取消':
            return 'status-cancelled';
        default:
            return '';
    }
});

const formattedCreatedAt = computed(() => {
    if (!order.value) return '';
    return new Date(order.value.createdAt).toLocaleString();
});

onLoad((options) => {
    const orderId = options.orderId;
    if (orderId) {
        const foundOrder = store.getters['print/get_order_by_id'](orderId);
        if (foundOrder) {
            order.value = foundOrder;
            console.log(order.value)
        } else {
            console.error(`[打印订单成功页] 未找到ID为 ${orderId} 的订单`);
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

const copyWechat = () => {
    uni.setClipboardData({
        data: 'Dianasyxl18024113874',
        success: function () {
            uni.showToast({
                title: '微信号已复制',
                icon: 'success'
            });
        }
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
}

/* 从 PrintCard 组件迁移的样式 */
.order-card {
    background-color: #ffffff;
    border-radius: 20rpx;
    padding: 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
    margin: 0;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.12);
    }
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 24rpx;
    border-bottom: 2rpx solid #f0f0f0;
}

.order-type {
    display: flex;
    align-items: center;
    font-size: 32rpx;
    font-weight: bold;
    color: #333;

    .type-text {
        margin-left: 16rpx;
    }
}

.order-status {
    padding: 8rpx 20rpx;
    border-radius: 24rpx;
    font-size: 24rpx;
    font-weight: bold;

    &.status-pending {
        background-color: #fffbe6;
        color: #faad14;
    }

    &.status-processing {
        background-color: #e6f7ff;
        color: #1890ff;
    }

    &.status-completed {
        background-color: #f6ffed;
        color: #52c41a;
    }

    &.status-cancelled {
        background-color: #f5f5f5;
        color: #bfbfbf;
    }
}

.card-body {
    padding: 32rpx 0;
}

.info-row {
    display: flex;
    justify-content: space-between;
    font-size: 28rpx;
    margin-bottom: 24rpx;

    .label {
        color: #888;
    }

    .value {
        color: #333;
        font-weight: 500;
    }

    &:last-child {
        margin-bottom: 0;
    }
}

.contact-card {
    background-color: #ffffff;
    border-radius: 20rpx;
    padding: 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
    text-align: center;
}

.contact-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 20rpx;
}

.qr-code {
    width: 300rpx;
    height: 300rpx;
    margin: 0 auto 20rpx;
}

.wechat-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #555;
}

.copy-btn {
    margin-top: 20rpx;
    font-size: 24rpx;
    padding: 5rpx 20rpx;
    background-color: #007aff;
    color: #ffffff;
    border-radius: 30rpx;
    line-height: 1.5;
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