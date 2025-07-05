<template>
    <view class="home-container">
        <!-- 顶部区域：搜索、欢迎语、轮播图 -->
        <HomeHeader />

        <!-- 核心功能区：任务待办、习惯打卡、专注时刻 -->
        <CoreFunctions />

        <!-- 推荐服务区 -->
        <ServiceRecommend />

        <!-- 校园动态通知区 -->
        <CampusNotifications />

        <!-- 近期招聘区 -->
        <RecruitmentCard />

        <!-- 底部安全区域 -->
        <view class="safe-area-bottom"></view>

    </view>
</template>

<script setup>
import ServiceRecommend from '@/components/home/ServiceRecommend.vue';
import HomeHeader from '@/components/home/HomeHeader.vue';
import CoreFunctions from '@/components/home/CoreFunctions.vue';
import CampusNotifications from '@/components/home/CampusNotifications.vue';
import RecruitmentCard from '@/components/home/RecruitmentCard.vue';
</script>

<style lang="scss" scoped>
.home-container {
    min-height: 100vh;
    background-color: #f7f8fa;

    .safe-area-bottom {
        height: 4vw;
    }
}
</style>