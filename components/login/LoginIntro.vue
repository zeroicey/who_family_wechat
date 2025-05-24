<template>
  <view class="login-intro">
    <view class="intro-title">
      <view class="title-text">欢迎使用“互成一家”</view>
      <view class="title-underline"></view>
    </view>

    <view class="intro-features">
      <view class="feature-item" v-for="(feature, index) in features" :key="index">
        <view class="feature-icon" :class="feature.iconClass">
          <view class="icon-inner">
            <image :src="feature.icon" mode="aspectFit" class="feature-image"></image>
          </view>
        </view>
        <view class="feature-info">
          <view class="feature-title">{{ feature.title }}</view>
          <view class="feature-desc">{{ feature.desc }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

// 功能特性数据
const features = ref([
  {
    title: '学习成长',
    desc: '每日学习打卡、学习计划制定、学习成果展示',
    icon: '/static/images/learn.png',
    iconClass: 'icon-learn'
  },
  {
    title: '交流互动',
    desc: '社区话题讨论、兴趣小组交流、线上活动组织',
    icon: '/static/images/tabbar/community.png',
    iconClass: 'icon-interaction'
  },
  {
    title: '校园服务',
    desc: '快递代拿代寄、校园代购、跑腿服务',
    icon: '/static/images/tabbar/service.png',
    iconClass: 'icon-campus-service'
  },
  {
    title: '招聘招新',
    desc: '社团成员招募、志愿者报名、活动人员招募',
    icon: '/static/images/tabbar/recruit.png',
    iconClass: 'icon-recruit'
  }
]);
</script>

<style lang="scss" scoped>
.login-intro {
  width: 100%;
  padding: 2vw 0;

  .intro-title {
    text-align: center;
    margin-bottom: 3vw;
    position: relative;

    .title-text {
      font-size: 5.5vw;
      font-weight: bold;
      color: #333;
      display: inline-block;
    }

    .title-underline {
      width: 10vw;
      height: 0.8vw;
      background: linear-gradient(90deg, #3498db, #1abc9c);
      border-radius: 0.4vw;
      margin: 2vw auto 0;
    }
  }

  .intro-features {
    width: 100%;

    .feature-item {
      display: flex;
      align-items: center;
      margin-bottom: 6vw;
      position: relative;
      transition: transform 0.3s ease;

      &:active {
        transform: scale(0.98);
      }

      .feature-icon {
        width: 13vw;
        height: 13vw;
        border-radius: 50%;
        margin-right: 4vw;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 0.5vw 2vw rgba(0, 0, 0, 0.05);
        position: relative;
        overflow: hidden;

        .icon-inner {
          width: 8vw;
          height: 8vw;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .feature-image {
          width: 100%;
          height: 100%;
        }

        &.icon-learn {
          background: linear-gradient(135deg, #3498db, #2980b9);
        }

        &.icon-interaction {
          background: linear-gradient(135deg, #9b59b6, #8e44ad);
        }

        &.icon-campus-service {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
        }

        &.icon-recruit {
          background: linear-gradient(135deg, #2ecc71, #27ae60);
        }
      }

      .feature-info {
        flex: 1;

        .feature-title {
          font-size: 4.2vw;
          font-weight: 600;
          color: #333;
          margin-bottom: 1.5vw;
        }

        .feature-desc {
          font-size: 3.2vw;
          color: #666;
          line-height: 1.5;
        }
      }
    }
  }
}
</style>
