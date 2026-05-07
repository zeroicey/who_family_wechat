<template>
  <view class="discovery-section">
    <view class="section-head">
      <view>
        <text class="section-kicker">发现内容</text>
        <text class="section-title">招聘退到第二层，但仍能快速找到</text>
      </view>
      <text class="more" @click="navigateToMore">进入发现</text>
    </view>

    <view class="recruitment-list">
      <view class="recruitment-item" v-for="item in recruits" :key="item.id" @click="viewDetail(item)">
        <view class="item-main">
          <text class="item-title">{{ item.name }}</text>
          <view class="item-meta">
            <text class="type-tag">{{ item.type }}</text>
            <text class="org-name">{{ item.organizationName }}</text>
          </view>
        </view>
        <text class="item-arrow">查看</text>
      </view>

      <view class="empty-state" v-if="recruits.length === 0">
        <text>暂无招聘信息</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRecruitStore } from "@/stores/recruit";

const recruitStore = useRecruitStore();

const recruits = computed(() => {
  const allRecruits = recruitStore.get_recruits || [];
  return allRecruits.slice(0, 3);
});

onMounted(async () => {
  if (!recruits.value.length) {
    await recruitStore.fetch_first_recruits();
  }
});

const navigateToMore = () => {
  uni.switchTab({
    url: "/pages/knowledge/index"
  });
};

const viewDetail = (item) => {
  uni.navigateTo({
    url: `/pages/recruit/detail?id=${item.id}`
  });
};
</script>

<style lang="scss" scoped>
.discovery-section {
  margin: 28rpx var(--content-gutter) 0;
  padding: 28rpx;
  border-radius: 28rpx;
  background: var(--surface-card);
  box-shadow: var(--shadow-soft);

  .section-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 20rpx;
    margin-bottom: 20rpx;
  }

  .section-kicker,
  .section-title,
  .more,
  .item-title,
  .empty-state text {
    display: block;
  }

  .section-kicker {
    margin-bottom: 10rpx;
    font-size: 22rpx;
    font-weight: 600;
    color: var(--brand-primary);
  }

  .section-title {
    font-size: 32rpx;
    line-height: 1.4;
    font-weight: 700;
    color: var(--text-primary);
  }

  .more {
    flex-shrink: 0;
    font-size: 24rpx;
    color: var(--brand-primary);
    font-weight: 600;
  }

  .recruitment-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 18rpx;
    padding: 22rpx 0;
    border-bottom: 1rpx solid var(--border-soft);

    &:last-child {
      padding-bottom: 0;
      border-bottom: none;
    }
  }

  .item-main {
    min-width: 0;
    flex: 1;
  }

  .item-title {
    margin-bottom: 10rpx;
    font-size: 28rpx;
    line-height: 1.45;
    font-weight: 600;
    color: var(--text-primary);
  }

  .item-meta {
    display: flex;
    align-items: center;
    gap: 12rpx;
    flex-wrap: wrap;
  }

  .type-tag {
    padding: 6rpx 14rpx;
    border-radius: 999rpx;
    background: rgba(109, 74, 255, 0.1);
    color: var(--brand-primary);
    font-size: 22rpx;
    font-weight: 600;
  }

  .org-name {
    font-size: 22rpx;
    color: var(--text-tertiary);
  }

  .item-arrow {
    flex-shrink: 0;
    font-size: 24rpx;
    color: var(--text-secondary);
  }

  .empty-state {
    padding: 12rpx 0 4rpx;

    text {
      font-size: 24rpx;
      color: var(--text-tertiary);
    }
  }
}
</style>
