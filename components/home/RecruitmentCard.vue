<template>
    <view class="recruitment-container">
        <view class="section-header">
            <text class="title">近期招聘</text>
            <text class="more" @click="navigateToMore">查看更多</text>
        </view>

        <view class="recruitment-list">
            <!-- 没有数据时显示空状态 -->
            <view class="empty-state" v-if="recruits.length == 0">
                <text class="empty-text">暂无招聘信息</text>
            </view>

            <!-- 加载中状态 -->
            <view class="loading-state" v-else-if="loading">
                <view class="loading-animation"></view>
                <text class="loading-text">正在加载...</text>
            </view>

            <!-- 招聘列表 -->
            <view class="recruitment-item" v-for="(item, index) in recruits" :key="index" @click="viewDetail(item)"
                v-else>
                <view class="recruitment-info">
                    <view class="recruitment-title">{{ item.name }}</view>
                    <view class="recruitment-tags">
                        <text class="tag type-default">{{ item.type }}</text> <!-- 使用默认的 type-default 样式 -->
                        <text class="deadline">截止: {{ item.endTime }}</text>
                    </view>
                    <view class="recruitment-org">{{ item.organizationName }}</view>
                </view>
                <view class="recruitment-right">
                    <!-- <text class="status" :class="{ 'status-urgent': item.isUrgent }">{{ item.status }}</text> --> <!-- 移除 status 和 isUrgent -->
                    <text class="arrow">›</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore()

// 加载状态
const loading = ref(false);

// 招聘数据
const recruits = computed(() => store.getters["recruit/get_recruits"]);


onMounted(async () => {
    if (!recruits.value || recruits.value.length === 0) {
        await store.dispatch("recruit/fetch_first_recruits");
    }
    console.log(recruits.value)
})

// 查看更多
const navigateToMore = () => {
    uni.switchTab({
        url: '/pages/recruit/index'
    });
};

// 查看详情
const viewDetail = (item) => {
    uni.navigateTo({
        url: `/pages/recruit/detail?id=${item.id}`
    });
};
</script>

<style lang="scss" scoped>
.recruitment-container {
    margin: 3vw;
    padding: 4vw;
    background-color: #ffffff;
    border-radius: 4vw;
    box-shadow: 0 1vw 3vw rgba(0, 0, 0, 0.06);

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4vw;
        position: relative;
        padding-left: 3vw;

        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 1vw;
            height: 5vw;
            background: linear-gradient(to bottom, #1890ff, #36a6ff);
            border-radius: 0.6vw;
        }

        .title {
            font-size: 4.2vw;
            font-weight: 600;
            color: #333;
            letter-spacing: 0.2vw;
        }

        .more {
            font-size: 3.2vw;
            color: #1890ff;
            padding: 1vw 2vw;
            background-color: rgba(24, 144, 255, 0.08);
            border-radius: 5vw;
            transition: all 0.3s;

            &:active {
                background-color: rgba(24, 144, 255, 0.15);
            }
        }
    }

    .recruitment-list {

        // 空状态样式
        .empty-state {
            padding: 10vw 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .empty-text {
                font-size: 3.5vw;
                color: #aaa;
                margin-top: 3vw;
            }
        }

        // 加载中状态
        .loading-state {
            padding: 6vw 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .loading-animation {
                width: 6vw;
                height: 6vw;
                border: 0.5vw solid #f0f0f0;
                border-top: 0.5vw solid #1890ff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            .loading-text {
                font-size: 3.2vw;
                color: #999;
                margin-top: 2vw;
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

        .recruitment-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 3.5vw 2vw;
            border-bottom: 1px dashed #f0f0f0;
            margin-bottom: 1vw;
            border-radius: 2vw;
            transition: all 0.3s;

            &:active {
                background-color: #f9fafc;
                transform: scale(0.98);
            }

            &:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }

            .recruitment-info {
                flex: 1;

                .recruitment-title {
                    font-size: 4vw;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 2vw;
                    line-height: 1.4;
                }

                .recruitment-tags {
                    display: flex;
                    align-items: center;
                    margin-bottom: 2vw;

                    .tag {
                        font-size: 2.8vw;
                        padding: 0.8vw 2vw;
                        border-radius: 3vw;
                        margin-right: 3vw;
                        font-weight: 500;
                    }

                    .type-default {
                        background-color: #e6f7ff; /* 默认背景色 */
                        color: #1890ff; /* 默认文字颜色 */
                    }

                    /* 保留其他特定类型样式，如果将来需要可以取消注释 */
                    /* .type-campus {
                        background-color: #e6f7ff;
                        color: #1890ff;
                    }

                    .type-volunteer {
                        background-color: #f6ffed;
                        color: #52c41a;
                    }

                    .type-club {
                        background-color: #f9f0ff;
                        color: #722ed1;
                    } */

                    .deadline {
                        font-size: 2.8vw;
                        color: #fa8c16;
                        font-weight: 500;
                    }
                }

                .recruitment-org {
                    font-size: 3vw;
                    color: #666;
                    background-color: #f5f7fa;
                    display: inline-block;
                    padding: 0.5vw 2vw;
                    border-radius: 3vw;
                }
            }

            .recruitment-right {
                display: flex;
                align-items: center;

                /* .status {
                    font-size: 3vw;
                    color: #52c41a;
                    margin-right: 2vw;
                    font-weight: 500;
                    background-color: rgba(82, 196, 26, 0.1);
                    padding: 0.8vw 2vw;
                    border-radius: 3vw;
                }

                .status-urgent {
                    color: #f5222d;
                    background-color: rgba(245, 34, 45, 0.1);
                } */

                .arrow {
                    font-size: 5vw;
                    color: #bfbfbf;
                    width: 6vw;
                    height: 6vw;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background-color: #f5f7fa;
                }
            }
        }
    }
}
</style>