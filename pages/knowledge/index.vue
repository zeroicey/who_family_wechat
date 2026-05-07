<template>
  <view class="discover-page">
    <view class="discover-hero">
      <view>
        <text class="hero-kicker">发现</text>
        <text class="hero-title">把知识、招聘和校园信息放进同一个次级频道</text>
      </view>
      <text class="hero-desc">服务之外，你还可以在这里继续浏览内容与机会。</text>
    </view>

    <view class="discover-tabs">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        class="discover-tab"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        <text>{{ tab.label }}</text>
      </view>
    </view>

    <scroll-view class="discover-scroll" scroll-y="true">
      <view class="discover-content">
        <template v-if="activeTab === 'knowledge'">
          <view class="section-card section-card--highlight">
            <text class="section-title">知识精选</text>
            <text class="section-subtitle">保留原有知识内容，但换成更统一的发现结构。</text>
          </view>

          <view
            v-for="item in currentKnowledgeList"
            :key="item.id"
            class="content-card"
            @click="viewDetail(item)"
          >
            <view class="content-head">
              <view class="content-badges">
                <text v-if="item.isRecommended" class="badge badge--primary">推荐</text>
                <text class="badge badge--muted">{{ item.level }}</text>
              </view>
              <text class="content-stat">{{ formatNumber(item.views) }} 阅读</text>
            </view>
            <text class="content-title">{{ item.title }}</text>
            <text class="content-desc">{{ item.description }}</text>
            <view class="content-tags">
              <text v-for="tag in item.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</text>
            </view>
            <view class="content-footer">
              <text>{{ item.author }}</text>
              <text>{{ item.readTime }}</text>
            </view>
          </view>
        </template>

        <template v-else-if="activeTab === 'recruit'">
          <view class="section-card section-card--highlight">
            <text class="section-title">招聘机会</text>
            <text class="section-subtitle">招聘退到第二层，但仍然是一个易找、可浏览的频道。</text>
          </view>

          <view
            v-for="recruit in recruitList"
            :key="recruit.id"
            class="content-card"
            @click="goRecruitDetail(recruit.id)"
          >
            <view class="content-head">
              <view class="content-badges">
                <text class="badge badge--primary">招聘</text>
                <text v-if="recruit.isCollect === 1" class="badge badge--muted">已收藏</text>
              </view>
              <text class="content-stat">查看详情</text>
            </view>
            <text class="content-title">{{ recruit.name }}</text>
            <text class="content-desc">{{ recruit.description || '查看岗位详情、组织介绍与投递要求。' }}</text>
            <view class="content-footer">
              <text>{{ recruit.organizationName || '校内组织' }}</text>
              <text>{{ recruit.endTime || '长期有效' }}</text>
            </view>
          </view>

          <view class="action-row">
            <view class="action-pill" @click="goRecruitList">进入完整招聘列表</view>
          </view>
        </template>

        <template v-else>
          <view class="section-card section-card--highlight">
            <text class="section-title">校园资讯</text>
            <text class="section-subtitle">这一层先作为“发现”频道说明与后续校园内容承接位。</text>
          </view>

          <view class="info-card" v-for="item in infoCards" :key="item.title">
            <text class="info-title">{{ item.title }}</text>
            <text class="info-desc">{{ item.desc }}</text>
          </view>
        </template>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
import { knowledgeData } from "@/static/mock/knowledge/index.js";
import { useRecruitStore } from "@/stores/recruit";

const recruitStore = useRecruitStore();
const activeTab = ref("knowledge");

const tabs = [
  { label: "知识", value: "knowledge" },
  { label: "招聘", value: "recruit" },
  { label: "资讯", value: "info" }
];

const currentKnowledgeList = computed(() => knowledgeData[0] || []);
const recruitList = computed(() => (recruitStore.get_recruits || []).slice(0, 6));

const infoCards = [
  {
    title: "为什么把知识和招聘放进发现？",
    desc: "因为新版主轴已经切到服务入口，知识与招聘更适合作为可浏览、可探索的次级内容能力。"
  },
  {
    title: "这不是阉割，而是重新归位",
    desc: "你依然能快速找到招聘与知识，只是不再和首页高频服务抢首屏优先级。"
  }
];

onMounted(async () => {
  if (!recruitList.value.length) {
    await recruitStore.fetch_first_recruits();
  }
});

onShareAppMessage(() => {
  return {
    title: "互成一家｜发现更多校园内容",
    path: "/pages/knowledge/index",
    imageUrl: "/static/images/logo.png"
  };
});

onShareTimeline(() => ({
  title: "互成一家｜发现更多校园内容",
  imageUrl: "/static/images/logo.png"
}));

const viewDetail = (item) => {
  uni.navigateTo({
    url: `/pages/knowledge/article?id=${item.id}`
  });
};

const goRecruitList = () => {
  uni.navigateTo({
    url: "/pages/recruit/index"
  });
};

const goRecruitDetail = (id) => {
  uni.navigateTo({
    url: `/pages/recruit/detail?id=${id}`
  });
};

const formatNumber = (num) => {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}w`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return String(num);
};
</script>

<style scoped>
.discover-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f6ff 0%, #f5f7fb 34%, #f5f7fb 100%);
}

.discover-hero {
  padding: 32rpx;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24rpx;
}

.hero-kicker,
.hero-title,
.hero-desc,
.section-title,
.section-subtitle,
.content-title,
.content-desc,
.content-footer text,
.info-title,
.info-desc {
  display: block;
}

.hero-kicker {
  margin-bottom: 10rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: #6d4aff;
}

.hero-title {
  max-width: 500rpx;
  font-size: 38rpx;
  line-height: 1.35;
  font-weight: 700;
  color: #182131;
}

.hero-desc {
  max-width: 180rpx;
  font-size: 22rpx;
  line-height: 1.5;
  text-align: right;
  color: #8a93a5;
}

.discover-tabs {
  padding: 0 32rpx 20rpx;
  display: flex;
  gap: 16rpx;
}

.discover-tab {
  padding: 16rpx 28rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.72);
  border: 1rpx solid #e5e9f2;
}

.discover-tab text {
  font-size: 26rpx;
  color: #5b6475;
  font-weight: 600;
}

.discover-tab.active {
  background: #6d4aff;
  border-color: #6d4aff;
}

.discover-tab.active text {
  color: #fff;
}

.discover-scroll {
  height: calc(100vh - 220rpx);
}

.discover-content {
  padding: 0 32rpx 40rpx;
}

.section-card,
.content-card,
.info-card {
  background: #fff;
  border-radius: 28rpx;
  box-shadow: 0 10rpx 30rpx rgba(24, 33, 49, 0.06);
}

.section-card {
  padding: 26rpx;
  margin-bottom: 20rpx;
}

.section-card--highlight {
  background: linear-gradient(135deg, rgba(109, 74, 255, 0.12), rgba(255, 255, 255, 0.98));
}

.section-title {
  margin-bottom: 10rpx;
  font-size: 30rpx;
  font-weight: 700;
  color: #182131;
}

.section-subtitle {
  font-size: 24rpx;
  line-height: 1.55;
  color: #5b6475;
}

.content-card {
  padding: 24rpx;
  margin-bottom: 18rpx;
}

.content-head,
.content-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16rpx;
}

.content-head {
  margin-bottom: 14rpx;
}

.content-badges {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.badge {
  padding: 6rpx 14rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  font-weight: 600;
}

.badge--primary {
  background: rgba(109, 74, 255, 0.12);
  color: #6d4aff;
}

.badge--muted {
  background: #eef2f7;
  color: #5b6475;
}

.content-stat {
  font-size: 22rpx;
  color: #8a93a5;
}

.content-title {
  margin-bottom: 12rpx;
  font-size: 30rpx;
  line-height: 1.45;
  font-weight: 700;
  color: #182131;
}

.content-desc {
  margin-bottom: 16rpx;
  font-size: 24rpx;
  line-height: 1.6;
  color: #5b6475;
}

.content-tags {
  display: flex;
  gap: 10rpx;
  flex-wrap: wrap;
  margin-bottom: 16rpx;
}

.tag {
  padding: 6rpx 12rpx;
  border-radius: 999rpx;
  background: #f5f7fb;
  font-size: 22rpx;
  color: #6a7385;
}

.content-footer text {
  font-size: 22rpx;
  color: #8a93a5;
}

.action-row {
  padding-top: 8rpx;
}

.action-pill {
  display: inline-flex;
  padding: 18rpx 24rpx;
  border-radius: 999rpx;
  background: #6d4aff;
  color: #fff;
  font-size: 26rpx;
  font-weight: 600;
}

.info-card {
  padding: 24rpx;
  margin-bottom: 18rpx;
}

.info-title {
  margin-bottom: 10rpx;
  font-size: 28rpx;
  font-weight: 700;
  color: #182131;
}

.info-desc {
  font-size: 24rpx;
  line-height: 1.6;
  color: #5b6475;
}
</style>
