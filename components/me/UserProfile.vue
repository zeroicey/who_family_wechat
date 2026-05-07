<template>
  <view class="profile-shell">
    <view class="profile-card" @tap="navigateToEdit">
      <view class="profile-main">
        <view class="avatar-wrapper">
          <image class="user-avatar" :src="avatarUrl" mode="aspectFill"></image>
          <view class="level-badge">Lv.{{ userInfo.level || 0 }}</view>
        </view>

        <view class="user-info">
          <view class="name-row">
            <text class="user-name">{{ userInfo.name || "用户" }}</text>
            <text class="user-brand">{{ userBrand }}</text>
          </view>
          <text class="user-bio">{{ truncatedBio || "这个用户还没有写简介，先去完善一下个人资料吧。" }}</text>
        </view>

        <view class="edit-pill">
          <text>编辑</text>
        </view>
      </view>

      <view class="school-grid">
        <view class="school-item">
          <text class="item-label">学校</text>
          <text class="item-value">{{ userInfo.school || "未填写" }}</text>
        </view>
        <view class="school-item">
          <text class="item-label">专业</text>
          <text class="item-value">{{ userInfo.major || "未填写" }}</text>
        </view>
        <view class="school-item">
          <text class="item-label">年级</text>
          <text class="item-value">{{ userInfo.grade || "未填写" }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const userInfo = computed(() => userStore.get_user_info || {});
const avatarUrl = computed(() => userStore.get_user_avatar_url);

const brandTitles = [
  "卷王", "躺平王", "摸鱼大师", "早八人", "夜猫子", "复习达人",
  "课表杀手", "DDL战士", "食堂VIP", "图书馆常驻", "运动健将",
  "社团大佬", "宿舍躺王", "外卖达人", "校园百事通", "社交恐怖",
  "萌新", "老油条", "传说", "工具人", "水课王", "干饭人",
  "摸鱼专业户", "起床困难户", "拖延症晚期", "复习困难户"
];

const userBrand = computed(() => {
  const name = userInfo.value.name || "用户";
  let seed = 0;
  for (let i = 0; i < name.length; i++) {
    seed += name.charCodeAt(i);
  }
  return brandTitles[seed % brandTitles.length];
});

const truncatedBio = computed(() => {
  const bio = userInfo.value.bio;
  if (bio && bio.length > 28) {
    return bio.substring(0, 28) + "...";
  }
  return bio;
});

const navigateToEdit = () => {
  uni.navigateTo({
    url: "/pages/me/profile/index"
  });
};
</script>

<style lang="scss" scoped>
.profile-shell {
  padding: 0 24rpx;
}

.profile-card {
  padding: 28rpx;
  border-radius: 32rpx;
  background: linear-gradient(135deg, #ffffff 0%, #f3efff 100%);
  box-shadow: var(--shadow-soft);
}

.profile-main {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.user-avatar {
  width: 128rpx;
  height: 128rpx;
  border-radius: 36rpx;
  background: #eef2f7;
}

.level-badge {
  position: absolute;
  left: 10rpx;
  bottom: -10rpx;
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: #fff;
  font-size: 20rpx;
  font-weight: 700;
}

.user-info {
  min-width: 0;
  flex: 1;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-wrap: wrap;
  margin-bottom: 10rpx;
}

.user-name,
.user-brand,
.user-bio,
.item-label,
.item-value,
.edit-pill text {
  display: block;
}

.user-name {
  font-size: 34rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.user-brand {
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  background: rgba(109, 74, 255, 0.1);
  color: var(--brand-primary);
  font-size: 20rpx;
  font-weight: 700;
}

.user-bio {
  font-size: 24rpx;
  line-height: 1.6;
  color: var(--text-secondary);
}

.edit-pill {
  padding: 14rpx 18rpx;
  border-radius: 999rpx;
  background: #ffffff;
  border: 1rpx solid var(--border-soft);
  flex-shrink: 0;
}

.edit-pill text {
  font-size: 22rpx;
  font-weight: 600;
  color: var(--text-primary);
}

.school-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14rpx;
}

.school-item {
  padding: 18rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.86);
  border: 1rpx solid rgba(109, 74, 255, 0.08);
}

.item-label {
  margin-bottom: 8rpx;
  font-size: 20rpx;
  color: var(--text-tertiary);
}

.item-value {
  font-size: 24rpx;
  line-height: 1.45;
  font-weight: 600;
  color: var(--text-primary);
}
</style>
