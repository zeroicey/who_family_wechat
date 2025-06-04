<template>
  <view class="campus-notifications">
    <view class="section-header">
      <text class="section-title">校园动态</text>
      <view class="view-more" @tap="navigateTo('/pages/community/index')">
        <text>查看更多</text>
        <text class="arrow-icon">〉</text>
      </view>
    </view>
    
    <view class="notification-list">
      <scroll-view class="notification-scroll" scroll-y>
        <view 
          class="notification-item" 
          v-for="(item, index) in notifications" 
          :key="index"
          @tap="viewNotification(item)"
        >
          <view class="tag-container">
            <view class="notification-tag" :style="{ backgroundColor: getTagColor(item.type) }">
              {{ item.typeText }}
            </view>
          </view>
          <view class="notification-content">
            <view class="notification-title">{{ item.title }}</view>
            <view class="notification-desc">{{ item.description }}</view>
            <view class="notification-footer">
              <view class="notification-sender" v-if="item.sender">发布人：{{ item.sender }}</view>
              <view class="notification-info">
                <text class="notification-time">{{ item.time }}</text>
                <text class="notification-readers" v-if="item.readers">{{ item.readers }}人已读</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// 校园通知数据
const notifications = ref([
  {
    id: 1,
    type: 'important',
    typeText: '重要',
    title: '关于2025年春季学期期末考试安排的通知',
    description: '各位同学，2025年春季学期期末考试将于6月15日至6月25日进行，请查看具体安排并做好准备。',
    time: '2小时前',
    sender: '教务处',
    readers: 1253
  },
  {
    id: 2,
    type: 'activity',
    typeText: '活动',
    title: '校园才艺大赛报名开始',
    description: '第十二届校园才艺大赛现已开始报名，欢迎各位同学积极参与，展示你的才华！',
    time: '4小时前',
    sender: '学生会',
    readers: 865
  },
  {
    id: 3,
    type: 'lecture',
    typeText: '讲座',
    title: '人工智能与未来职业发展讲座',
    description: '著名AI研究员张教授将于下周三在主教学楼进行讲座，探讨AI如何改变未来就业格局。',
    time: '昨天',
    sender: '计算机学院',
    readers: 743
  },
  {
    id: 4,
    type: 'notice',
    typeText: '通知',
    title: '图书馆开放时间调整',
    description: '因维修工程，图书馆自5月1日起将调整开放时间，周一至周五8:00-21:00，周末9:00-18:00。',
    time: '昨天',
    sender: '图书馆',
    readers: 1028
  },
  {
    id: 5,
    type: 'scholarship',
    typeText: '奖学金',
    title: '2025年国家奖学金申请开始',
    description: '2025年国家奖学金申请已开始，请符合条件的同学于5月15日前提交申请材料。',
    time: '2天前',
    sender: '学生处',
    readers: 1536
  },
  {
    id: 6,
    type: 'career',
    typeText: '就业',
    title: '腾讯2025校园招聘宣讲会',
    description: '腾讯公司将于5月10日在主会场举办校园招聘宣讲会，欢迎应届毕业生参加。',
    time: '3天前',
    sender: '就业指导中心',
    readers: 1892
  },
  {
    id: 7,
    type: 'club',
    typeText: '社团',
    title: '摄影协会春季采风活动',
    description: '摄影协会将于本周六组织春季采风活动，地点为城市植物园，感兴趣的同学请报名参加。',
    time: '3天前',
    sender: '摄影协会',
    readers: 456
  }
]);

// 获取标签颜色
const getTagColor = (type) => {
  const colors = {
    important: '#ff4d4f',
    activity: '#1890ff',
    lecture: '#722ed1',
    notice: '#faad14',
    scholarship: '#52c41a',
    career: '#fa8c16',
    club: '#13c2c2'
  };
  return colors[type] || '#1890ff';
};

// 查看通知详情
const viewNotification = (item) => {
  uni.navigateTo({
    url: `/pages/notification/detail?id=${item.id}`
  });
};

// 跳转到页面
const navigateTo = (url) => {
  // 如果是TabBar页面，使用switchTab，否则使用navigateTo
  if (url.includes('/pages/community/index')) {
    uni.switchTab({ url });
  } else {
    uni.navigateTo({ url });
  }
};

// 加载状态
const loading = ref(false);

// 获取校园通知数据
const fetchNotifications = async () => {
  try {
    loading.value = true;
    
    // 调用Vuex获取通知数据
    await store.dispatch('home/getNoticeList');
    const noticeData = store.getters['home/getNoticeList'];
    
    if (noticeData && noticeData.length > 0) {
      // 将返回的数据格式化为组件需要的结构
      notifications.value = noticeData.map(notice => {
        // 根据类型设置显示文本
        const typeTextMap = {
          'important': '重要',
          'normal': '通知',
          'activity': '活动',
          'lecture': '讲座',
          'scholarship': '奖学金',
          'career': '就业',
          'club': '社团'
        };
        
        // 格式化时间
        const timeAgo = (timestamp) => {
          const now = new Date().getTime();
          const diff = now - timestamp;
          const minute = 60 * 1000;
          const hour = minute * 60;
          const day = hour * 24;
          
          if (diff < hour) {
            const minutes = Math.floor(diff / minute);
            return `${minutes}分钟前`;
          } else if (diff < day) {
            const hours = Math.floor(diff / hour);
            return `${hours}小时前`;
          } else if (diff < day * 2) {
            return '昨天';
          } else if (diff < day * 3) {
            return '2天前';
          } else if (diff < day * 4) {
            return '3天前';
          } else {
            const date = new Date(timestamp);
            return `${date.getMonth() + 1}月${date.getDate()}日`;
          }
        };
        
        return {
          id: notice.id,
          type: notice.type || 'normal',
          typeText: typeTextMap[notice.type] || '通知',
          title: notice.title,
          description: notice.description || notice.content,
          time: timeAgo(notice.publishTime),
          sender: notice.publisher || notice.sender || '学校',
          readers: notice.readCount || notice.readers || Math.floor(Math.random() * 1000 + 500)
        };
      });
    }
  } catch (error) {
    console.error('获取校园通知失败', error);
    uni.showToast({
      title: '加载通知失败，请重试',
      icon: 'none',
      duration: 2000
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchNotifications();
});
</script>

<style lang="scss" scoped>
.campus-notifications {
  background-color: #fff;
  border-radius: 4vw;
  padding: 4vw 5vw;
  margin: 3vw 5vw;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3vw;
    
    .section-title {
      font-size: 4.5vw;
      font-weight: 600;
      color: #333;
    }
    
    .view-more {
      display: flex;
      align-items: center;
      
      text {
        font-size: 3.2vw;
        color: #666;
      }
      
      .arrow-icon {
        margin-left: 1vw;
        font-size: 3vw;
      }
    }
  }
  
  .notification-list {
    .notification-scroll {
      height: 65vw;
      
      .notification-item {
        display: flex;
        padding: 3vw 0;
        border-bottom: 1px solid #f0f0f0;
        
        &:last-child {
          border-bottom: none;
        }
        
        .tag-container {
          margin-right: 3vw;
          
          .notification-tag {
            padding: 1vw 2.5vw;
            border-radius: 0.5vw;
            font-size: 2.8vw;
            color: white;
            font-weight: 500;
            white-space: nowrap;
            text-align: center;
          }
        }
        
        .notification-content {
          flex: 1;
          
          .notification-title {
            font-size: 3.6vw;
            font-weight: 600;
            color: #333;
            margin-bottom: 1.5vw;
            line-height: 1.3;
          }
          
          .notification-desc {
            font-size: 3.2vw;
            color: #666;
            line-height: 1.3;
            margin-bottom: 1.5vw;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .notification-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .notification-sender {
              font-size: 3vw;
              color: #666;
            }
            
            .notification-info {
              display: flex;
              align-items: center;
              
              .notification-time {
                font-size: 3vw;
                color: #999;
                margin-right: 2vw;
              }
              
              .notification-readers {
                font-size: 3vw;
                color: #999;
              }
            }
          }
        }
      }
    }
  }
}
</style>
