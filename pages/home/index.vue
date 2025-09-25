<template>
    <view class="home-container">
        <!-- 顶部区域：搜索、欢迎语、轮播图 -->
        <HomeHeader />

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
import CampusNotifications from '@/components/home/CampusNotifications.vue';
import RecruitmentCard from '@/components/home/RecruitmentCard.vue';

import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'

onShareAppMessage(() => {
  return {
    title: '互成一家小程序',
    path: '/pages/home/index',
    imageUrl: '/static/images/logo.png'
  }
})

onShareTimeline(() => ({
  title: '互成一家小程序',
  imageUrl: '/static/images/logo.png'
}))
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