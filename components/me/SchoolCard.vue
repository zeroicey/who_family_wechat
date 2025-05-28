<template>
  <view class="school-card">
    <view class="card-header">
      <text class="title">学校信息</text>
      <view class="edit-btn" @tap="navigateToEditSchool">
        <text>编辑</text>
        <text class="arrow">></text>
      </view>
    </view>

    <view class="school-info">
      <view class="info-row">
        <text class="label">学校</text>
        <text class="value">{{ userInfo.school || '未设置' }}</text>
      </view>
      <view class="info-row">
        <text class="label">专业</text>
        <text class="value">{{ userInfo.major || '未设置' }}</text>
      </view>
      <view class="info-row">
        <text class="label">年级</text>
        <text class="value">{{ userInfo.grade || '未设置' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const userInfo = computed(() => store.getters['user/get_user_info'] || {});

// 导航到编辑学校信息页面
const navigateToEditSchool = () => {
  uni.navigateTo({
    url: '/pages/me/edit-school/index'
  });
};
</script>

<style lang="scss" scoped>
.school-card {
  width: 95%;
  background-color: #fff;
  margin: 3vw auto;
  border-radius: 12px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
  overflow: hidden;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4vw 5vw 2vw;

    .title {
      font-size: 4vw;
      font-weight: 600;
      color: #333;
    }

    .edit-btn {
      display: flex;
      align-items: center;
      color: #07c160;
      font-size: 3vw;

      .arrow {
        margin-left: 1vw;
      }
    }
  }

  .school-info {
    padding: 0 5vw 4vw;

    .info-row {
      display: flex;
      padding: 2vw 0;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        width: 16vw;
        font-size: 3.5vw;
        color: #999;
      }

      .value {
        flex: 1;
        font-size: 3.5vw;
        color: #333;
      }
    }
  }
}
</style>
