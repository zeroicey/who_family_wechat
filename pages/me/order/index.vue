<template>
    <view class="container">

        <!-- 订单状态筛选 -->
        <view class="filter-tabs">
            <view class="filter-tab" :class="{ active: activeFilter === 'all' }" @click="setFilter('all')">
                全部
            </view>
            <view class="filter-tab" :class="{ active: activeFilter === '待处理' }" @click="setFilter('待处理')">
                待处理
            </view>
            <view class="filter-tab" :class="{ active: activeFilter === '处理中' }" @click="setFilter('处理中')">
                处理中
            </view>
            <view class="filter-tab" :class="{ active: activeFilter === '已完成' }" @click="setFilter('已完成')">
                已完成
            </view>
        </view>

        <!-- 加载状态 -->
        <view v-if="ordersLoading" class="loading-container">
            <uni-load-more status="loading"
                content-text="{ contentText: { contentdown: '上拉显示更多', contentrefresh: '正在加载...', contentnomore: '没有更多数据了' } }"></uni-load-more>
        </view>

        <!-- 订单列表 -->
        <view v-else-if="filteredOrders.length > 0" class="order-list">
            <view v-for="order in filteredOrders" :key="order.id" class="order-card" @click="viewOrderDetail(order)">
                <!-- 订单头部 -->
                <view class="order-header">
                    <view class="order-info">
                        <text class="order-id">订单号: {{ order.id }}</text>
                        <text class="order-time">{{ order.startOrderTime }}</text>
                    </view>
                    <view class="order-status" :class="getStatusClass(order.status)">
                        {{ order.status }}
                    </view>
                </view>

                <!-- 订单内容 -->
                <view class="order-content">
                    <view class="order-item">
                        <uni-icons type="paperplane" size="20" color="#007aff"></uni-icons>
                        <view class="item-info">
                            <text class="item-title">打印服务</text>
                            <text class="item-desc">{{ order.fileName || '文件打印' }}</text>
                        </view>
                        <text class="item-count">{{ order.count || 1 }}份</text>
                    </view>

                    <!-- 服务信息 -->
                    <view class="service-info">
                        <view class="info-row">
                            <text class="info-label">服务方式:</text>
                            <text class="info-value">{{ order.type }}</text>
                        </view>
                        <view class="info-row" v-if="order.name">
                            <text class="info-label">联系人:</text>
                            <text class="info-value">{{ order.name }}</text>
                        </view>
                        <view class="info-row" v-if="order.phone">
                            <text class="info-label">联系电话:</text>
                            <text class="info-value">{{ order.phone }}</text>
                        </view>
                        <view v-if="order.type === '派送服务' && order.address" class="info-row">
                            <text class="info-label">配送地址:</text>
                            <text class="info-value">{{ order.address }}</text>
                        </view>
                        <view v-if="order.remark" class="info-row">
                            <text class="info-label">备注:</text>
                            <text class="info-value">{{ order.remark }}</text>
                        </view>
                        <view class="info-row" v-if="order.startOrderTime">
                            <text class="info-label">创建时间:</text>
                            <text class="info-value">{{ order.startOrderTime }}</text>
                        </view>
                        <view class="info-row" v-if="order.endOrderTime">
                            <text class="info-label">完成时间:</text>
                            <text class="info-value">{{ order.endOrderTime }}</text>
                        </view>
                    </view>
                </view>


            </view>
        </view>

        <!-- 空状态 -->
        <view v-else class="empty-state">
            <uni-icons type="list" size="80" color="#ccc"></uni-icons>
            <text class="empty-text">暂无订单记录</text>
            <text class="empty-desc">您还没有任何打印订单</text>
            <button class="goto-print-btn" @click="gotoPrint">去打印</button>
        </view>
    </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app';
import { useStore } from 'vuex'

const store = useStore()

// 响应式数据
const activeFilter = ref('all')
const ordersLoading = computed(() => store.getters['print/get_orders_loading'])
const orders = computed(() => store.getters['print/get_orders'])

// 筛选后的订单列表
const filteredOrders = computed(() => {
    if (activeFilter.value === 'all') {
        return orders.value
    }
    return orders.value.filter(order => order.status === activeFilter.value)
})

// 设置筛选条件
const setFilter = (filter) => {
    activeFilter.value = filter
}

// 获取状态样式类
const getStatusClass = (status) => {
    const statusMap = {
        '待处理': 'pending',
        '处理中': 'processing',
        '已完成': 'completed',
        '已取消': 'cancelled'
    }
    return statusMap[status] || 'pending'
}





// 查看订单详情
const viewOrderDetail = (order) => {
    console.log('查看订单详情:', order)
    // 移除详情页跳转，直接在当前页面显示所有信息
}




// 跳转到打印页面
const gotoPrint = () => {
    uni.navigateTo({
        url: '/pages/service/print/index'
    })
}



// 页面加载时获取订单数据
onMounted(async () => {
    try {
        await store.dispatch('print/fetch_print_orders')
    } catch (error) {
        console.error('获取订单列表失败:', error)
        uni.showToast({
            title: '获取订单失败',
            icon: 'error'
        })
    }
})

// 页面显示时刷新数据
onShow(() => {
    store.dispatch('print/fetch_print_orders')
})
</script>

<style lang="scss" scoped>
.container {
    min-height: 100vh;
    background-color: #f5f5f5;
}

.filter-tabs {
    display: flex;
    background-color: #ffffff;
    padding: 0 40rpx;
    border-bottom: 1rpx solid #eee;

    .filter-tab {
        flex: 1;
        text-align: center;
        padding: 30rpx 0;
        font-size: 28rpx;
        color: #666;
        position: relative;

        &.active {
            color: #007aff;
            font-weight: 600;

            &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 60rpx;
                height: 4rpx;
                background-color: #007aff;
                border-radius: 2rpx;
            }
        }
    }
}

.loading-container {
    padding: 60rpx 0;
}

.order-list {
    padding: 20rpx;
}

.order-card {
    background-color: #ffffff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    padding: 30rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);

    .order-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20rpx;

        .order-info {
            flex: 1;

            .order-id {
                display: block;
                font-size: 28rpx;
                color: #333;
                font-weight: 600;
                margin-bottom: 8rpx;
            }

            .order-time {
                font-size: 24rpx;
                color: #999;
            }
        }

        .order-status {
            padding: 8rpx 16rpx;
            border-radius: 20rpx;
            font-size: 24rpx;
            font-weight: 500;

            &.pending {
                background-color: #fff3e0;
                color: #f57c00;
            }

            &.processing {
                background-color: #e3f2fd;
                color: #1976d2;
            }

            &.completed {
                background-color: #e8f5e8;
                color: #388e3c;
            }

            &.cancelled {
                background-color: #fce4ec;
                color: #d32f2f;
            }
        }
    }

    .order-content {
        .order-item {
            display: flex;
            align-items: center;
            padding: 20rpx 0;
            border-bottom: 1rpx solid #f0f0f0;

            .item-info {
                flex: 1;
                margin-left: 20rpx;

                .item-title {
                    display: block;
                    font-size: 28rpx;
                    color: #333;
                    font-weight: 500;
                    margin-bottom: 8rpx;
                }

                .item-desc {
                    font-size: 24rpx;
                    color: #666;
                }
            }

            .item-count {
                font-size: 26rpx;
                color: #007aff;
                font-weight: 600;
            }
        }

        .service-info {
            padding-top: 20rpx;

            .info-row {
                display: flex;
                margin-bottom: 12rpx;

                .info-label {
                    width: 160rpx;
                    color: #666;
                }

                .info-value {
                    flex: 1;
                    text-align: right;
                    color: #333;
                    word-break: break-all;
                }
            }
        }
    }
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 40rpx;

    .empty-text {
        font-size: 32rpx;
        color: #666;
        margin: 30rpx 0 10rpx;
    }

    .empty-desc {
        font-size: 26rpx;
        color: #999;
        margin-bottom: 40rpx;
    }

    .goto-print-btn {
        background: linear-gradient(135deg, #007aff 0%, #0056cc 100%);
        color: #ffffff;
        border: none;
        border-radius: 24rpx;
        padding: 20rpx 40rpx;
        font-size: 28rpx;
    }
}
</style>