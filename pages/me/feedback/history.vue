<template>
  <view class="feedback-history">
    <!-- 顶部标题 -->
    <view class="header">
      <view class="back-btn" @tap="navigateBack">
        <text class="icon">&#xe60e;</text>
      </view>
      <text class="title">反馈历史</text>
      <view class="placeholder"></view>
    </view>
    
    <!-- 内容区域 -->
    <scroll-view class="content" scroll-y @scrolltolower="loadMoreHistory" :refresher-triggered="refreshing" refresher-enabled @refresherrefresh="onRefresh">
      <!-- 加载中状态 -->
      <view class="loading-container" v-if="loading && !refreshing && !feedbackList.length">
        <view class="loading-spinner"></view>
        <text class="loading-text">加载中...</text>
      </view>
      
      <!-- 反馈列表 -->
      <view class="feedback-list" v-else-if="feedbackList.length">
        <view 
          v-for="(item, index) in feedbackList" 
          :key="item.id" 
          class="feedback-item"
          :class="{ 'replied': item.status === 'replied' }"
        >
          <view class="feedback-header">
            <view class="type-tag" :class="'type-' + item.type">{{ item.typeName }}</view>
            <text class="time">{{ formatTime(item.submitTime) }}</text>
            <view class="status-tag" :class="'status-' + item.status">
              {{ getStatusText(item.status) }}
            </view>
          </view>
          
          <view class="feedback-content">
            <text class="content-text">{{ item.content }}</text>
            
            <!-- 图片预览 -->
            <view class="image-preview" v-if="item.images && item.images.length">
              <image 
                v-for="(img, imgIndex) in item.images" 
                :key="imgIndex" 
                :src="img" 
                class="preview-img" 
                mode="aspectFill"
                @tap="previewImage(item.images, imgIndex)"
              ></image>
            </view>
          </view>
          
          <!-- 客服回复 -->
          <view class="reply-container" v-if="item.reply">
            <view class="reply-header">
              <text class="reply-title">客服回复</text>
              <text class="reply-time">{{ formatTime(item.reply.time) }}</text>
            </view>
            <text class="reply-content">{{ item.reply.content }}</text>
          </view>
        </view>
        
        <!-- 加载更多 -->
        <view class="load-more" v-if="hasMoreData">
          <text class="load-more-text" v-if="loadingMore">加载更多...</text>
          <text class="load-more-text" @tap="loadMoreHistory" v-else>点击加载更多</text>
        </view>
        
        <!-- 已加载全部 -->
        <view class="no-more" v-else>
          <text class="no-more-text">已显示全部内容</text>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view class="empty-container" v-else>
        <image class="empty-icon" src="/static/images/feedback/empty.png" mode="aspectFit"></image>
        <text class="empty-text">暂无反馈记录</text>
        <button class="create-btn" @tap="navigateToFeedback">去反馈</button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// 反馈列表
const feedbackList = ref([]);

// 页面状态
const loading = ref(true);
const refreshing = ref(false);
const loadingMore = ref(false);
const currentPage = ref(1);
const hasMoreData = ref(true);

// 初始化数据
const initData = async () => {
  try {
    loading.value = true;
    await fetchFeedbackHistory();
  } catch (error) {
    uni.showToast({
      title: '获取反馈记录失败',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

// 获取反馈历史记录
const fetchFeedbackHistory = async (page = 1) => {
  try {
    if (page === 1) {
      loadingMore.value = false;
    } else {
      loadingMore.value = true;
    }
    
    const params = {
      page,
      pageSize: 10
    };
    
    const result = await store.dispatch('feedback/getFeedbackHistory', params);
    
    if (page === 1) {
      feedbackList.value = result.list || [];
    } else {
      feedbackList.value = [...feedbackList.value, ...(result.list || [])];
    }
    
    // 判断是否还有更多数据
    hasMoreData.value = feedbackList.value.length < result.total;
    currentPage.value = page;
  } catch (error) {
    console.error('获取反馈历史记录失败', error);
    uni.showToast({
      title: '获取失败，请重试',
      icon: 'none'
    });
  } finally {
    loadingMore.value = false;
  }
};

// 加载更多
const loadMoreHistory = () => {
  if (loadingMore.value || !hasMoreData.value) {
    return;
  }
  fetchFeedbackHistory(currentPage.value + 1);
};

// 下拉刷新
const onRefresh = async () => {
  refreshing.value = true;
  try {
    await fetchFeedbackHistory(1);
  } finally {
    setTimeout(() => {
      refreshing.value = false;
    }, 500);
  }
};

// 预览图片
const previewImage = (images, current) => {
  uni.previewImage({
    urls: images,
    current
  });
};

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hour}:${minute}`;
};

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'pending': '待处理',
    'processing': '处理中',
    'replied': '已回复'
  };
  return statusMap[status] || '未知状态';
};

// 返回上一页
const navigateBack = () => {
  uni.navigateBack();
};

// 跳转到反馈页面
const navigateToFeedback = () => {
  uni.navigateTo({
    url: '/pages/me/feedback/index'
  });
};

// 页面加载
onMounted(() => {
  initData();
});
</script>

<style lang="scss" scoped>
.feedback-history {
  min-height: 100vh;
  background-color: #f7f8fa;
  display: flex;
  flex-direction: column;
  
  .header {
    height: 12vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4vw;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    position: relative;
    
    .back-btn {
      width: 8vw;
      height: 8vw;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .icon {
        font-family: "iconfont";
        font-size: 5vw;
        color: #333;
      }
    }
    
    .title {
      font-size: 4.5vw;
      font-weight: 600;
      color: #333;
    }
    
    .placeholder {
      width: 8vw;
    }
  }
  
  .content {
    flex: 1;
    height: calc(100vh - 12vw);
    padding: 3vw;
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 40vh;
      
      .loading-spinner {
        width: 8vw;
        height: 8vw;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #07c160;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 3vw;
      }
      
      .loading-text {
        font-size: 3.5vw;
        color: #999;
      }
    }
    
    .feedback-list {
      .feedback-item {
        background-color: #fff;
        border-radius: 3vw;
        padding: 4vw;
        margin-bottom: 3vw;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
        position: relative;
        
        &.replied:before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 1vw;
          background-color: #07c160;
          border-top-left-radius: 3vw;
          border-bottom-left-radius: 3vw;
        }
        
        .feedback-header {
          display: flex;
          align-items: center;
          margin-bottom: 3vw;
          
          .type-tag {
            padding: 1vw 2vw;
            font-size: 3vw;
            border-radius: 3vw;
            margin-right: 2vw;
            
            &.type-function {
              background-color: #e6f7ff;
              color: #1890ff;
            }
            
            &.type-experience {
              background-color: #f6ffed;
              color: #52c41a;
            }
            
            &.type-content {
              background-color: #fff7e6;
              color: #fa8c16;
            }
            
            &.type-others {
              background-color: #f9f0ff;
              color: #722ed1;
            }
          }
          
          .time {
            font-size: 3vw;
            color: #999;
            flex: 1;
          }
          
          .status-tag {
            padding: 1vw 2vw;
            font-size: 3vw;
            border-radius: 3vw;
            
            &.status-pending {
              background-color: #f5f5f5;
              color: #999;
            }
            
            &.status-processing {
              background-color: #e6f7ff;
              color: #1890ff;
            }
            
            &.status-replied {
              background-color: #f6ffed;
              color: #52c41a;
            }
          }
        }
        
        .feedback-content {
          margin-bottom: 3vw;
          
          .content-text {
            font-size: 3.8vw;
            color: #333;
            line-height: 1.6;
            display: block;
            margin-bottom: 3vw;
          }
          
          .image-preview {
            display: flex;
            flex-wrap: wrap;
            margin: 0 -1vw;
            
            .preview-img {
              width: 22vw;
              height: 22vw;
              margin: 1vw;
              border-radius: 2vw;
              background-color: #f0f0f0;
            }
          }
        }
        
        .reply-container {
          background-color: #f8f8f8;
          border-radius: 2vw;
          padding: 3vw;
          
          .reply-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2vw;
            
            .reply-title {
              font-size: 3.5vw;
              color: #333;
              font-weight: 600;
            }
            
            .reply-time {
              font-size: 3vw;
              color: #999;
            }
          }
          
          .reply-content {
            font-size: 3.5vw;
            color: #666;
            line-height: 1.6;
          }
        }
      }
      
      .load-more {
        text-align: center;
        padding: 4vw 0;
        
        .load-more-text {
          font-size: 3.5vw;
          color: #07c160;
        }
      }
      
      .no-more {
        text-align: center;
        padding: 4vw 0;
        
        .no-more-text {
          font-size: 3.5vw;
          color: #999;
        }
      }
    }
    
    .empty-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 70vh;
      
      .empty-icon {
        width: 30vw;
        height: 30vw;
        margin-bottom: 5vw;
      }
      
      .empty-text {
        font-size: 4vw;
        color: #999;
        margin-bottom: 5vw;
      }
      
      .create-btn {
        width: 40vw;
        height: 10vw;
        line-height: 10vw;
        background: linear-gradient(135deg, #07c160, #10ad7a);
        color: #fff;
        font-size: 3.8vw;
        border-radius: 5vw;
        border: none;
      }
    }
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
