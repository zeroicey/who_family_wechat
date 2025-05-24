<template>
  <view class="profile-container">
    <!-- 个人信息卡片 -->
    <view class="profile-card" @tap="navigateToEdit">
      <view class="card-header">
        <view class="avatar-wrapper">
          <image class="user-avatar" :src="avatarUrl" mode="aspectFill"></image>
          <view class="level-badge">Lv.{{ userInfo.level || 0 }}</view>
        </view>
        <view class="user-info">
          <text class="user-name">{{ userInfo.name || "用户" }}</text>
          <view class="user-bio" v-if="userInfo.bio">{{ userInfo.bio }}</view>
          <view class="user-bio" v-else>这个用户很懒，还没有填写简介哦~</view>
        </view>
        <view class="edit-icon">
          <text class="iconfont">&#xe612;</text>
        </view>
      </view>

      <!-- 学校信息部分 -->
      <view class="school-info-section" v-if="userInfo.school || userInfo.major || userInfo.grade || true">
        <view class="section-divider"></view>
        <view class="school-info-row">
          <text class="info-icon">&#xe645;</text>
          <text class="info-label">学校:</text>
          <text class="info-value">{{ userInfo.school || "未填写" }}</text>
        </view>
        <view class="school-info-row">
          <text class="info-icon">&#xe604;</text>
          <text class="info-label">专业:</text>
          <text class="info-value">{{ userInfo.major || "未填写" }}</text>
        </view>
        <view class="school-info-row">
          <text class="info-icon">&#xe624;</text>
          <text class="info-label">年级:</text>
          <text class="info-value">{{ userInfo.grade || "未填写" }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const userInfo = computed(() => store.getters["user/getUserInfo"]);
const avatarUrl = computed(() => store.getters["user/getUserAvatarUrl"]);

// 点击跳转到个人资料设置页面
const navigateToEdit = () => {
  console.log(avatarUrl)
  uni.navigateTo({
    url: "/pages/me/profile/index",
  });
};
</script>

<style lang="scss" scoped>
.profile-container {
  padding: 3vw 3vw 0;
  background-color: #f8f9fa;

  .profile-card {
    width: 100%;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(7, 193, 96, 0.12);
    overflow: hidden;
    margin-bottom: 3vw;
    position: relative;

    // 添加装饰元素
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 47%;
      background: linear-gradient(90deg, #07c160, #39e28c);
    }

    .card-header {
      display: flex;
      align-items: center;
      padding: 5vw 4vw 4vw;
      position: relative;

      .avatar-wrapper {
        position: relative;
        margin-right: 3vw;

        .user-avatar {
          width: 16vw;
          height: 16vw;
          border-radius: 50%;
          border: 0.4vw solid #e8f7ef;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .level-badge {
          position: absolute;
          bottom: 0;
          right: 0;
          background: linear-gradient(135deg, #ff9500, #ffba30);
          color: #fff;
          font-size: 2.2vw;
          padding: 0.6vw 1.2vw;
          border-radius: 4vw;
          font-weight: bold;
          border: 0.3vw solid #fff;
          box-shadow: 0 2px 4px rgba(255, 149, 0, 0.3);
        }
      }

      .user-info {
        flex: 1;

        .user-name {
          font-size: 4.8vw;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 1vw;
          display: block;
        }

        .user-bio {
          font-size: 3.2vw;
          color: #7f8c8d;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.4;
          background: linear-gradient(90deg, #2c3e50, #7f8c8d);
          -webkit-background-clip: text;
          color: transparent;
        }
      }

      .edit-icon {
        width: 8vw;
        height: 8vw;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #07c160;
        background-color: rgba(7, 193, 96, 0.08);
        border-radius: 50%;
        transition: all 0.2s ease;

        .iconfont {
          font-size: 5vw;
        }
      }
    }

    .section-divider {
      height: 1px;
      background: linear-gradient(90deg,
          transparent,
          rgba(7, 193, 96, 0.2),
          transparent);
      margin: 0 4vw;
    }

    .school-info-section {
      padding: 3vw 4vw 4vw;
      background-color: #fafafa;

      .school-info-row {
        display: flex;
        align-items: center;
        margin-top: 3vw;
        padding-bottom: 1vw;
        border-bottom: 1px dashed rgba(7, 193, 96, 0.1);

        &:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .info-icon {
          font-family: "iconfont";
          font-size: 4vw;
          color: #fff;
          margin-right: 3vw;
          width: 6vw;
          height: 6vw;
          border-radius: 50%;
          background: linear-gradient(135deg, #07c160, #39e28c);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(7, 193, 96, 0.2);
        }

        .info-label {
          font-size: 3.2vw;
          color: #95a5a6;
          width: 10vw;
          font-weight: 500;
        }

        .info-value {
          font-size: 3.2vw;
          color: #34495e;
          flex: 1;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
