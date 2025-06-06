<template>
  <view class="home-header">
    <!-- 欢迎语 -->
    <view class="welcome-section">
      <view class="welcome-text">
        <text class="greeting">{{ greeting }}，</text>
        <text class="username">{{ username }}</text>
      </view>
      <view class="date-info">
        <text class="date">{{ dateText }}</text>
      </view>
    </view>

    <!-- 轮播图 -->
    <view class="banner-container">
      <swiper class="banner-swiper" circular :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500"
        :indicator-color="'rgba(255, 255, 255, 0.5)'" :indicator-active-color="'#ffffff'">
        <swiper-item v-for="(item, index) in bannerList" :key="index">
          <view class="banner-item">
            <image class="banner-image" :src="item.imageUrl" mode="aspectFill"></image>
            <view class="banner-text">
              <text class="banner-title">{{ item.title }}</text>
              <text class="banner-desc" v-if="item.description">{{ item.description }}</text>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

// 初始化 store
const store = useStore();

// 用户名
const username = computed(() => {
  const userInfo = store.getters['user/get_user_info'];
  return userInfo?.name || '同学';
});

// 问候语
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 6) return '凌晨好';
  if (hour < 9) return '早上好';
  if (hour < 12) return '上午好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  if (hour < 22) return '晚上好';
  return '夜深了';
});

// 日期文本
const dateText = computed(() => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDay = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
  return `${month}月${day}日 · 星期${weekDay}`;
});

// 轮播图数据
const bannerList = ref([
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
    linkUrl: '/pages/community/index',
    title: '校园社区动态',
    description: '了解最新校园活动与社区资讯'
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop',
    linkUrl: '/pages/club/index',
    title: '社团活动招新',
    description: '丰富多彩的社团等你加入'
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop',
    linkUrl: '/pages/service/index',
    title: '校园互助服务',
    description: '便捷的校园生活服务平台'
  },
  {
    id: 4,
    imageUrl: '/static/images/banner.jpg',
    linkUrl: '/pages/learning/index',
    title: '学习资源共享',
    description: '优质学习资源一站获取'
  }
]);
</script>

<style lang="scss" scoped>
.home-header {
  width: 100%;

  .welcome-section {
    padding: 0 5vw 4vw;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .welcome-text {
      .greeting {
        font-size: 5vw;
        font-weight: 500;
        color: #333;
        letter-spacing: 0.05em;
      }

      .username {
        font-size: 5vw;
        font-weight: 600;
        color: #07c160;
        letter-spacing: 0.05em;
        position: relative;
        text-shadow: 0 1px 2px rgba(7, 193, 96, 0.2);
      }
    }

    .date-info {
      .date {
        font-size: 3.2vw;
        color: #666;
        background-color: #f5f5f5;
        padding: 1vw 3vw;
        border-radius: 4vw;
        letter-spacing: 0.5px;
      }
    }
  }

  .banner-container {
    padding: 0 5vw;
    margin-bottom: 4vw;

    .banner-swiper {
      width: 100%;
      height: 45vw;
      border-radius: 4vw;
      overflow: hidden;
      box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);

      .banner-item {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .banner-image {
          width: 100%;
          height: 100%;
          transition: transform 0.3s;

          &:hover {
            transform: scale(1.05);
          }
        }

        .banner-text {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 4vw;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));

          .banner-title {
            font-size: 4.5vw;
            font-weight: 600;
            color: #fff;
            display: block;
            margin-bottom: 1vw;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          }

          .banner-desc {
            font-size: 3.2vw;
            color: rgba(255, 255, 255, 0.9);
            display: block;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          }
        }
      }
    }
  }
}
</style>
