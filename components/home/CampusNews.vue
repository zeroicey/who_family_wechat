<template>
  <view class="campus-news">
    <view class="section-title">
      <text>校园动态</text>
      <view class="more-link" @tap="navigateToMore">
        <text>查看更多</text>
        <image class="more-icon" src="https://cdn.iconscout.com/icon/free/png-256/free-arrow-right-1438233-1216195.png" mode="aspectFit"></image>
      </view>
    </view>
    
    <!-- 通知列表 -->
    <view class="notice-list">
      <view class="notice-item" v-for="(item, index) in noticeList" :key="index" @tap="navigateToDetail(item)">
        <view class="notice-tag" :class="item.type">{{ getTagText(item.type) }}</view>
        <view class="notice-content">
          <text class="notice-title">{{ item.title }}</text>
          <text class="notice-time">{{ formatTime(item.publishTime) }}</text>
        </view>
      </view>
    </view>
    
    <!-- 活动卡片 -->
    <view class="activity-cards">
      <view class="activity-card" v-for="(item, index) in activityList" :key="index" @tap="navigateToActivity(item)">
        <image class="activity-image" :src="item.imageUrl" mode="aspectFill"></image>
        <view class="activity-info">
          <text class="activity-title">{{ item.title }}</text>
          <view class="activity-meta">
            <view class="activity-time">
              <image class="meta-icon" src="https://cdn.iconscout.com/icon/free/png-256/free-clock-1439-1171540.png" mode="aspectFit"></image>
              <text>{{ item.time }}</text>
            </view>
            <view class="activity-location">
              <image class="meta-icon" src="https://cdn.iconscout.com/icon/free/png-256/free-location-1439-1171552.png" mode="aspectFit"></image>
              <text>{{ item.location }}</text>
            </view>
          </view>
          <view class="activity-status" :class="item.status">
            <text>{{ getStatusText(item.status) }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 通知列表数据
const noticeList = ref([
  {
    id: 1,
    title: '关于2025年五一假期安排的通知',
    type: 'important',
    publishTime: Date.now() - 86400000 // 1天前
  },
  {
    id: 2,
    title: '2025年春季学期期末考试安排',
    type: 'normal',
    publishTime: Date.now() - 86400000 * 2 // 2天前
  },
  {
    id: 3,
    title: '图书馆五一假期开放时间调整',
    type: 'normal',
    publishTime: Date.now() - 86400000 * 3 // 3天前
  }
]);

// 活动列表数据
const activityList = ref([
  {
    id: 1,
    title: '校园文化节开幕式',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
    time: '5月10日 14:00-16:00',
    location: '大学生活动中心',
    status: 'registering'
  },
  {
    id: 2,
    title: '创新创业大赛',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
    time: '5月15日-5月20日',
    location: '科技楼报告厅',
    status: 'upcoming'
  }
]);

// 获取通知列表
const fetchNoticeList = async () => {
  try {
    // 实际项目中这里应该调用API获取通知列表
    // const res = await store.dispatch('home/getNoticeList');
    // if (res) {
    //   noticeList.value = res;
    // }
  } catch (error) {
    console.error('获取通知列表失败', error);
  }
};

// 获取活动列表
const fetchActivityList = async () => {
  try {
    // 实际项目中这里应该调用API获取活动列表
    // const res = await store.dispatch('home/getActivityList');
    // if (res) {
    //   activityList.value = res;
    // }
  } catch (error) {
    console.error('获取活动列表失败', error);
  }
};

// 获取通知类型标签文本
const getTagText = (type) => {
  const typeMap = {
    important: '重要',
    normal: '通知',
    activity: '活动'
  };
  return typeMap[type] || '通知';
};

// 获取活动状态文本
const getStatusText = (status) => {
  const statusMap = {
    registering: '报名中',
    upcoming: '即将开始',
    ongoing: '进行中',
    ended: '已结束'
  };
  return statusMap[status] || '';
};

// 格式化时间
const formatTime = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;
  
  // 一天内
  if (diff < 86400000) {
    return '今天';
  }
  // 两天内
  else if (diff < 86400000 * 2) {
    return '昨天';
  }
  // 三天内
  else if (diff < 86400000 * 3) {
    return '前天';
  }
  // 一周内
  else if (diff < 86400000 * 7) {
    return Math.floor(diff / 86400000) + '天前';
  }
  // 超过一周
  else {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
};

// 跳转到详情页
const navigateToDetail = (item) => {
  uni.navigateTo({
    url: `/pages/notice/detail?id=${item.id}`
  });
};

// 跳转到活动详情页
const navigateToActivity = (item) => {
  uni.navigateTo({
    url: `/pages/activity/detail?id=${item.id}`
  });
};

// 跳转到更多页面
const navigateToMore = () => {
  uni.navigateTo({
    url: '/pages/notice/list'
  });
};

// 组件挂载时获取数据
onMounted(() => {
  fetchNoticeList();
  fetchActivityList();
});
</script>

<style lang="scss" scoped>
.campus-news {
  padding: 4vw 5vw;
  
  .section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3vw;
    
    text {
      font-size: 4.5vw;
      font-weight: 600;
      color: #333;
    }
    
    .more-link {
      display: flex;
      align-items: center;
      
      text {
        font-size: 3.2vw;
        font-weight: normal;
        color: #666;
      }
      
      .more-icon {
        width: 3vw;
        height: 3vw;
        margin-left: 1vw;
      }
    }
  }
  
  .notice-list {
    background-color: #fff;
    border-radius: 3vw;
    padding: 2vw 0;
    margin-bottom: 4vw;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    
    .notice-item {
      display: flex;
      align-items: center;
      padding: 3vw 4vw;
      border-bottom: 1px solid #f5f5f5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .notice-tag {
        padding: 1vw 2vw;
        border-radius: 1vw;
        font-size: 2.8vw;
        margin-right: 3vw;
        
        &.important {
          background-color: rgba(245, 34, 45, 0.1);
          color: #f5222d;
        }
        
        &.normal {
          background-color: rgba(24, 144, 255, 0.1);
          color: #1890ff;
        }
        
        &.activity {
          background-color: rgba(82, 196, 26, 0.1);
          color: #52c41a;
        }
      }
      
      .notice-content {
        flex: 1;
        
        .notice-title {
          font-size: 3.5vw;
          color: #333;
          margin-bottom: 1vw;
          display: block;
        }
        
        .notice-time {
          font-size: 3vw;
          color: #999;
          display: block;
        }
      }
    }
  }
  
  .activity-cards {
    display: flex;
    flex-direction: column;
    gap: 3vw;
    
    .activity-card {
      background-color: #fff;
      border-radius: 3vw;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      
      .activity-image {
        width: 100%;
        height: 40vw;
      }
      
      .activity-info {
        padding: 3vw 4vw;
        
        .activity-title {
          font-size: 4vw;
          font-weight: 500;
          color: #333;
          margin-bottom: 2vw;
          display: block;
        }
        
        .activity-meta {
          display: flex;
          margin-bottom: 3vw;
          
          .activity-time, .activity-location {
            display: flex;
            align-items: center;
            margin-right: 4vw;
            
            .meta-icon {
              width: 3.5vw;
              height: 3.5vw;
              margin-right: 1vw;
            }
            
            text {
              font-size: 3vw;
              color: #666;
            }
          }
        }
        
        .activity-status {
          display: inline-block;
          padding: 1vw 2vw;
          border-radius: 1vw;
          
          &.registering {
            background-color: rgba(82, 196, 26, 0.1);
            
            text {
              color: #52c41a;
            }
          }
          
          &.upcoming {
            background-color: rgba(24, 144, 255, 0.1);
            
            text {
              color: #1890ff;
            }
          }
          
          &.ongoing {
            background-color: rgba(250, 140, 22, 0.1);
            
            text {
              color: #fa8c16;
            }
          }
          
          &.ended {
            background-color: rgba(0, 0, 0, 0.1);
            
            text {
              color: #999;
            }
          }
          
          text {
            font-size: 2.8vw;
          }
        }
      }
    }
  }
}
</style>
