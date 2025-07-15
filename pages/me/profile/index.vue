<template>
  <view class="profile-container">
    <!-- 头像上传区域 -->
    <view class="avatar-section">
      <view class="section-title">头像</view>
      <view class="avatar-wrapper" @click="chooseAvatar">
        <image class="avatar" :src="avatarUrl" mode="aspectFill"></image>
        <view class="upload-icon">
          <text class="icon-text">更换</text>
        </view>
      </view>
    </view>

    <!-- 基本信息表单 -->
    <view class="form-group">
      <view class="form-item">
        <text class="label">昵称</text>
        <input class="input" v-model="userProfile.name" placeholder="请输入昵称" maxlength="15" />
        <image class="form-item-icon" src="/static/images/profile/name.png"></image>
      </view>

      <view class="form-item">
        <text class="label">性别</text>
        <picker class="picker" mode="selector" :value="userProfile.gender" :range="genderOptions"
          @change="onGenderChange">
          <view class="picker-text">
            <text>{{ userProfile.gender }}</text>
          </view>
        </picker>
        <image class="form-item-icon" src="/static/images/profile/gender.png"></image>
      </view>
    </view>

    <!-- 学校信息表单组 -->
    <view class="form-group">
      <view class="form-item">
        <text class="label">学校</text>
        <input class="input" v-model="userProfile.school" placeholder="请输入学校名称" />
        <image class="form-item-icon" src="/static/images/profile/school.png"></image>
      </view>

      <view class="form-item">
        <text class="label">专业</text>
        <input class="input" v-model="userProfile.major" placeholder="请输入专业名称" />
        <image class="form-item-icon" src="/static/images/profile/major.png"></image>
      </view>

      <view class="form-item">
        <text class="label">年级</text>
        <picker class="picker" mode="selector" :value="gradeIndex" :range="gradeOptions" @change="onGradeChange">
          <view class="picker-text">
            <text>{{ userProfile.grade }}</text>
          </view>
        </picker>
        <image class="form-item-icon" src="/static/images/profile/grade.png"></image>
      </view>
    </view>

    <!-- 个人简介 -->
    <view class="form-group">
      <view class="form-item">
        <text class="label">个人简介</text>
        <textarea class="textarea" v-model="userProfile.bio" placeholder="请输入个人简介" :maxlength="100"
          auto-height></textarea>
        <text class="word-count">{{ userProfile.bio.length }}/100</text>
        <image class="form-item-icon" src="/static/images/profile/bio.png"></image>
      </view>
    </view>

    <view class="save-btn" @click="saveProfile">
      <text class="btn-text">保存修改</text>
    </view>
  </view>
</template>

<script setup>
import { reactive, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const userInfo = computed(() => store.getters["user/get_user_info"]);
const avatarUrl = computed(() => store.getters["user/get_user_avatar_url"]);

// 性别选项
const genderOptions = ["男", "女"];

// 年级选项
const gradeOptions = ["大一", "大二", "大三", "大四"];

// 用户资料
const userProfile = reactive({
  ...userInfo.value,
  phone: userInfo.value.phone || "",
  bio: userInfo.value.bio || "",
  grade: gradeOptions.includes(userInfo.value.grade) ? userInfo.value.grade : '大一',
});

const gradeIndex = computed(() => {
  const index = gradeOptions.indexOf(userProfile.grade);
  return index === -1 ? 0 : index;
});

// 选择头像
const chooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0];
      uni.getFileSystemManager().readFile({
        filePath: tempFilePath,
        encoding: "base64",
        success: async (res) => {
          const base64Data = res.data;
          await store.dispatch("user/update_user_avatar", base64Data);
          await store.dispatch("community/fetch_first_posts");
          await store.dispatch("user/fetch_first_posts");
          uni.showToast({
            title: '头像更新成功',
            icon: 'success',
            mask: true
          })
        },
        fail: (err) => {
          console.error("读取文件失败:", err);
        },
      });
    },
  });
};

// 性别选择变化
const onGenderChange = (e) => {
  const selectedIndex = parseInt(e.detail.value, 10);
  userProfile.gender = genderOptions[selectedIndex];
};

// 年级选择变化
const onGradeChange = (e) => {
  const selectedIndex = parseInt(e.detail.value, 10);
  userProfile.grade = gradeOptions[selectedIndex];
};

// 保存用户资料
const saveProfile = async () => {
  if (userProfile.name.length > 15) {
    uni.showToast({
      title: '昵称不能超过15个字',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  if (userProfile.bio.length > 100) {
    uni.showToast({
      title: '个人简介不能超过100个字',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  uni.showLoading({
    title: "保存中...",
  });

  try {
    await store.dispatch("user/update_user_info", userProfile);
    await store.dispatch("community/fetch_first_posts");
    await store.dispatch("user/fetch_first_posts");

    uni.hideLoading();

    uni.showToast({
      title: "保存成功",
      icon: "success",
      duration: 1700,
    });

    uni.switchTab({
      url: '/pages/me/index'
    });
  } catch (error) {
    uni.hideLoading();
    uni.showToast({
      title: "保存失败，请稍后再试",
      icon: "none",
      duration: 2000,
    });
  }
};
</script>

<style lang="scss" scoped>
.profile-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 3vw;
  padding-bottom: 20vw;

  .avatar-section {
    padding: 4vw;
    background-color: #fff;
    margin-bottom: 3vw;
    border-radius: 3vw;

    .section-title {
      font-size: 3.8vw;
      color: #333;
      font-weight: 500;
      margin-bottom: 4vw;
    }

    .avatar-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;

      .avatar {
        width: 25vw;
        height: 25vw;
        border-radius: 50%;
        background-color: #f0f0f0;
      }

      .upload-icon {
        position: absolute;
        bottom: 0;
        right: 32.5vw;
        width: 10vw;
        height: 6vw;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 3vw;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon-text {
          color: #fff;
          font-size: 3vw;
        }
      }
    }
  }

  .form-group {
    background-color: #fff;
    border-radius: 3vw;
    overflow: hidden;
    margin-bottom: 3vw;

    .form-item {
      position: relative;
      padding: 4vw;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .label {
        width: 20vw;
        font-size: 3.8vw;
        color: #333;
        font-weight: 500;
      }

      .input {
        flex: 1;
        height: 8vw;
        font-size: 3.5vw;
        color: #333;
      }

      .form-item-icon {
        width: 5vw;
        height: 5vw;
        margin-left: 2vw;
      }

      .picker {
        flex: 1;

        .picker-text {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 3.5vw;
          color: #333;
        }
      }

      .textarea {
        flex: 1;
        width: 100%;
        min-height: 20vw;
        font-size: 3.5vw;
        color: #333;
        line-height: 1.6;
      }

      .word-count {
        position: absolute;
        right: 4vw;
        bottom: 4vw;
        font-size: 3vw;
        color: #999;
      }
    }
  }

  .save-btn {
    position: fixed;
    bottom: 5vw;
    left: 5vw;
    right: 5vw;
    height: 12vw;
    background-color: #07c160;
    border-radius: 6vw;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 10px rgba(7, 193, 96, 0.3);

    .btn-text {
      font-size: 4vw;
      color: #fff;
      font-weight: 500;
    }
  }
}
</style>
