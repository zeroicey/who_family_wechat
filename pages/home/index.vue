<template>
  <view class="service-home-page">
    <HomeHeader />
    <ServiceRecommend />
    <CampusNotifications />
    <RecruitmentCard />
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup>
import ServiceRecommend from "@/components/home/ServiceRecommend.vue";
import HomeHeader from "@/components/home/HomeHeader.vue";
import CampusNotifications from "@/components/home/CampusNotifications.vue";
import RecruitmentCard from "@/components/home/RecruitmentCard.vue";
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";

onShareAppMessage(() => {
  return {
    title: "互成一家｜校园服务入口",
    path: "/pages/home/index",
    imageUrl: "/static/images/logo.png"
  };
});

onShareTimeline(() => ({
  title: "互成一家｜校园服务入口",
  imageUrl: "/static/images/logo.png"
}));
</script>

<style lang="scss" scoped>
.service-home-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(109, 74, 255, 0.1), transparent 34%),
    linear-gradient(180deg, #f8f6ff 0%, #f5f7fb 42%, #f5f7fb 100%);

  .safe-area-bottom {
    height: 40rpx;
  }
}
</style>
