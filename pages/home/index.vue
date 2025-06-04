<template>
    <view class="home-container">

        <!-- 下拉刷新 -->
        <scroll-view class="home-scroll" scroll-y refresher-enabled :refresher-triggered="refreshing"
            @refresherrefresh="onRefresh">
            <!-- 顶部区域：搜索、欢迎语、轮播图 -->
            <HomeHeader />

            <!-- 核心功能区：任务待办、习惯打卡、专注时刻 -->
            <CoreFunctions />

            <!-- 校园动态通知区 -->
            <CampusNotifications />

            <!-- 近期招聘区 -->
            <RecruitmentCard />

            <!-- 底部安全区域 -->
            <view class="safe-area-bottom"></view>
        </scroll-view>

    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

// 导入TabBar组件


// 导入组件
import HomeHeader from '@/components/home/HomeHeader.vue';
import CoreFunctions from '@/components/home/CoreFunctions.vue';
import CampusNotifications from '@/components/home/CampusNotifications.vue';
import RecruitmentCard from '@/components/home/RecruitmentCard.vue';

// 初始化 store
const store = useStore();

// 下拉刷新状态
const refreshing = ref(false);

// 刷新首页数据
const refreshHomeData = async () => {
    try {
        // 显示加载状态
        uni.showLoading({
            title: '加载中...',
            mask: true
        });

        // 调用Vuex获取首页所有数据
        await store.dispatch('home/getHomeData');

        console.log('首页数据刷新成功');
    } catch (error) {
        console.error('刷新首页数据失败', error);
        uni.showToast({
            title: '刷新失败，请稍后再试',
            icon: 'none',
            duration: 2000
        });
    } finally {
        // 结束刷新状态
        refreshing.value = false;
        uni.stopPullDownRefresh();
        uni.hideLoading();
    }
};

// 下拉刷新事件
const onRefresh = () => {
    refreshing.value = true;
    refreshHomeData();
};

// 页面加载时获取数据
onMounted(() => {
    refreshHomeData();
});
</script>

<style lang="scss" scoped>
.home-container {
    min-height: 100vh;
    background-color: #f7f8fa;

    .home-scroll {
        height: 100vh;
    }

    .safe-area-bottom {
        height: 4vw;
    }
}
</style>