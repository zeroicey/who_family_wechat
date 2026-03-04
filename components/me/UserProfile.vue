<template>
  <view class="profile-container">
    <!-- 个人信息卡片 -->
    <view class="profile-card" @tap="navigateToEdit">
      <view class="card-header">
        <view class="avatar-wrapper">
          <view class="level-badge">Lv.{{ userInfo.level || 0 }}</view>
          <image class="user-avatar" :src="avatarUrl" mode="aspectFill"></image>
          <!-- 用户标签 -->
          <view class="user-brand">
            <text class="brand-text">{{ userBrand }}</text>
          </view>
        </view>
        <view class="user-info">
          <text class="user-name">{{ userInfo.name || "用户" }}</text>
          <view class="user-bio" v-if="userInfo.bio">{{ truncatedBio }}</view>
          <view class="user-bio" v-else>这个用户很懒，还没有填写简介哦~</view>
        </view>
        <view class="edit-icon">
          <image class="edit-icon-img" src="/static/images/profile/name.png" mode="aspectFit"></image>
        </view>
      </view>

      <!-- 学校信息部分 -->
      <view class="school-info-section" v-if="userInfo.school || userInfo.major || userInfo.grade || true">
        <view class="section-divider"></view>
        <view class="school-info-row">
          <image class="info-icon" src="/static/images/profile/school.png" mode="aspectFit"></image>
          <text class="info-label">学校:</text>
          <text class="info-value">{{ userInfo.school || "未填写" }}</text>
        </view>
        <view class="school-info-row">
          <image class="info-icon" src="/static/images/profile/major.png" mode="aspectFit"></image>
          <text class="info-label">专业:</text>
          <text class="info-value">{{ userInfo.major || "未填写" }}</text>
        </view>
        <view class="school-info-row">
          <image class="info-icon" src="/static/images/profile/grade.png" mode="aspectFit"></image>
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
const userInfo = computed(() => store.getters["user/get_user_info"]);
const avatarUrl = computed(() => store.getters["user/get_user_avatar_url"]);

// 用户标签数组
const brandTitles = [
  '卷王', '躺平王', '摸鱼大师', '早八人', '夜猫子', '复习达人',
  '课表杀手', 'DDL战士', '食堂VIP', '图书馆常驻', '运动健将',
  '社团大佬', '宿舍躺王', '外卖达人', '校园百事通', '社交恐怖',
  '萌新', '老油条', '传说', '工具人', '水课王', '干饭人',
  '摸鱼专业户', '起床困难户', '拖延症晚期', '复习困难户'
];

// 根据用户名生成固定的随机标签
const userBrand = computed(() => {
  const name = userInfo.value.name || '用户';

  // 使用用户名的字符代码之和作为种子
  let seed = 0;
  for (let i = 0; i < name.length; i++) {
    seed += name.charCodeAt(i);
  }

  // 根据种子选择标签，确保同一用户每次显示相同的标签
  const index = seed % brandTitles.length;
  return brandTitles[index];
});

const truncatedBio = computed(() => {
  const bio = userInfo.value.bio;
  if (bio && bio.length > 20) {
    return bio.substring(0, 20) + "...";
  }
  return bio;
});

// 点击跳转到个人资料设置页面
const navigateToEdit = () => {
  uni.navigateTo({
    url: "/pages/me/profile/index",
  });
};
</script>

<style lang="scss" scoped>
.profile-container {
  padding: 3vw 3vw 0;
  // background-color: #f8f9fa;

  .profile-card {
    width: 100%;
    background-color: #ffffff;
    border-radius: 12px 12px 0 0;
    overflow: hidden;
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

        .level-badge {
          position: absolute;
          top: 0;
          left: 0;
          background: linear-gradient(135deg, #ff9500, #ffba30);
          color: #fff;
          font-size: 2.2vw;
          padding: 0.6vw 1.2vw;
          border-radius: 4vw;
          font-weight: bold;
          border: 0.3vw solid #fff;
          box-shadow: 0 2px 4px rgba(255, 149, 0, 0.3);
          z-index: 2;
        }

        .user-avatar {
          width: 16vw;
          height: 16vw;
          border-radius: 50%;
          border: 0.4vw solid #e8f7ef;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .user-brand {
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%) rotate(-8deg);
          background-color: #ff9a56;
          padding: 2px 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          z-index: 1;

          .brand-text {
            font-size: 10px;
            color: #fff;
            font-weight: 600;
            line-height: 1;
          }
        }
      }

      .user-info {
        flex: 1;

        .user-name {
          font-size: 5.5vw;
          font-weight: bold;
          color: #ffffff;
          margin-bottom: 1.5vw;
          display: block;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .user-bio {
          font-size: 3.4vw;
          color: rgba(255, 255, 255, 0.95);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.5;
          font-weight: 500;
        }
      }

      .edit-icon {
        width: 8vw;
        height: 8vw;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;

        .edit-icon-img {
          width: 5vw;
          /* Adjust as needed */
          height: 5vw;
          /* Adjust as needed */
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
      padding: 1vw 3vw;

      .school-info-row {
        display: flex;
        align-items: center;
        margin-top: 3vw;
        padding-bottom: 1.5vw;
        border-bottom: 1px dashed rgba(7, 193, 96, 0.15);

        &:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .info-icon {
          font-family: "iconfont"; // This line can be removed if iconfont is no longer used elsewhere for this class
          font-size: 4vw; // This might need adjustment or removal if image size is controlled by width/height
          color: #fff; // This is likely irrelevant for images
          margin-right: 3vw;
          width: 6vw;
          height: 6vw;
          // border-radius: 50%; // May or may not be desired for images
          // background: linear-gradient(135deg, #07c160, #39e28c); // Background for text icons, remove for images
          display: flex;
          align-items: center;
          justify-content: center;
          // box-shadow: 0 2px 4px rgba(7, 193, 96, 0.2); // Shadow for text icons, adjust or remove for images
        }

        .info-label {
          font-size: 3.4vw;
          color: #07c160;
          width: 10vw;
          font-weight: 600;
        }

        .info-value {
          font-size: 3.4vw;
          color: #2c3e50;
          flex: 1;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
