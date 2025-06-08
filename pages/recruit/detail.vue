<template>
  <view class="recruit-detail">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 详情内容 -->
    <view v-else-if="recruitDetail" class="detail-content">
      <!-- 头部信息 -->
      <view class="header-section">
        <view class="company-info">
          <image 
            class="company-logo" 
            :src="recruitDetail.logoUrl" 
            mode="aspectFit"
          />
          <view class="company-details">
            <text class="company-name">{{ recruitDetail.organizationName }}</text>
            <text class="location">📍 {{ recruitDetail.location }}</text>
          </view>
        </view>
        
        <view class="position-info">
          <text class="position-name">{{ recruitDetail.name }}</text>
          <text class="salary">{{ recruitDetail.salary }}</text>
          <view class="tags">
            <text class="tag type-tag">{{ recruitDetail.type }}</text>
            <text v-if="recruitDetail.isHot === 'true'" class="tag hot-tag">🔥 热门</text>
            <text v-if="recruitDetail.isRecommended === 'true'" class="tag recommend-tag">⭐ 推荐</text>
          </view>
        </view>
      </view>

      <!-- 职位详情 -->
      <view class="detail-section">
        <view class="section-item">
          <text class="section-title">📋 职位描述</text>
          <text class="section-content">{{ formatText(recruitDetail.description) }}</text>
        </view>

        <view class="section-item">
          <text class="section-title">✅ 任职要求</text>
          <text class="section-content">{{ formatText(recruitDetail.requirements) }}</text>
        </view>

        <view class="section-item">
          <text class="section-title">🎁 福利待遇</text>
          <text class="section-content">{{ formatText(recruitDetail.benefits) }}</text>
        </view>

        <view class="section-item">
          <text class="section-title">📞 联系方式</text>
          <text class="section-content contact">{{ recruitDetail.contact }}</text>
        </view>

        <view class="section-item">
          <text class="section-title">📊 招聘信息</text>
          <view class="info-grid">
            <view class="info-item">
              <text class="info-label">招聘人数</text>
              <text class="info-value">{{ recruitDetail.positions }}人</text>
            </view>
            <view class="info-item">
              <text class="info-label">投递人数</text>
              <text class="info-value">{{ recruitDetail.deliverCount }}人</text>
            </view>
            <view class="info-item">
              <text class="info-label">截止时间</text>
              <text class="info-value">{{ formatDate(recruitDetail.endTime) }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">发布时间</text>
              <text class="info-value">{{ formatDate(recruitDetail.createTime) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 错误状态 -->
    <view v-else class="error-container">
      <text class="error-text">加载失败，请重试</text>
      <button class="retry-btn" @click="loadRecruitDetail">重新加载</button>
    </view>

    <!-- 底部操作栏 -->
    <view v-if="recruitDetail" class="bottom-actions">
      <view class="action-btn collect-btn" @click="toggleCollect">
        <text class="action-icon">{{ isCollected ? '❤️' : '🤍' }}</text>
        <text class="action-text">{{ isCollected ? '已收藏' : '收藏' }}</text>
      </view>
      
      <view 
        class="action-btn apply-btn" 
        :class="{ 'disabled': isDelivered }"
        @click="handleApply"
      >
        <text class="action-text">
          {{ isDelivered ? '已投递' : '立即申请' }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// 响应式数据
const loading = ref(true);
const recruitDetail = ref(null);
const recruitId = ref(null);
const isCollected = ref(false);
const isDelivered = ref(false);

// 页面加载时获取参数
onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  recruitId.value = currentPage.options.id;
  
  if (recruitId.value) {
    loadRecruitDetail();
  } else {
    loading.value = false;
  }
});

// 加载招聘详情
const loadRecruitDetail = async () => {
  try {
    loading.value = true;
    const data = await store.dispatch('recruit/fetch_recruit_by_id', recruitId.value);
    recruitDetail.value = data;
    
    // 设置收藏和投递状态
    isCollected.value = data.isCollect === 1;
    isDelivered.value = data.isDeliver === 1;
    
  } catch (error) {
    console.error('获取招聘详情失败:', error);
    uni.showToast({
      title: '获取详情失败',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

// 切换收藏状态
const toggleCollect = async () => {
  try {
    if (isCollected.value) {
      await store.dispatch('recruit/uncollect_recruit', recruitId.value);
      isCollected.value = false;
      uni.showToast({
        title: '取消收藏成功',
        icon: 'success'
      });
    } else {
      await store.dispatch('recruit/collect_recruit', recruitId.value);
      isCollected.value = true;
      uni.showToast({
        title: '收藏成功',
        icon: 'success'
      });
    }
  } catch (error) {
    console.error('收藏操作失败:', error);
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    });
  }
};

// 处理申请
const handleApply = () => {
  if (isDelivered.value) {
    uni.showToast({
      title: '您已投递过该职位',
      icon: 'none'
    });
    return;
  }
  
  uni.showModal({
    title: '确认投递',
    content: '确定要投递该职位吗？投递后无法撤销。',
    success: async (res) => {
      if (res.confirm) {
        try {
          await store.dispatch('recruit/delivery_job', recruitId.value);
          isDelivered.value = true;
          
          // 更新投递人数
          if (recruitDetail.value) {
            recruitDetail.value.deliverCount += 1;
          }
          
          uni.showToast({
            title: '投递成功',
            icon: 'success'
          });
        } catch (error) {
          console.error('投递失败:', error);
          uni.showToast({
            title: '投递失败',
            icon: 'none'
          });
        }
      }
    }
  });
};

// 格式化文本（处理换行符）
const formatText = (text) => {
  if (!text) return '';
  return text.replace(/↵/g, '\n');
};

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
</script>

<style lang="scss" scoped>
.recruit-detail {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  
  .loading-text,
  .error-text {
    font-size: 32rpx;
    color: #666;
    margin-bottom: 40rpx;
  }
  
  .retry-btn {
    background-color: #1890ff;
    color: white;
    border: none;
    border-radius: 8rpx;
    padding: 20rpx 40rpx;
    font-size: 28rpx;
  }
}

.detail-content {
  padding: 0 0 40rpx 0;
}

.header-section {
  background: white;
  padding: 40rpx;
  margin-bottom: 20rpx;
  
  .company-info {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
    
    .company-logo {
      width: 120rpx;
      height: 120rpx;
      border-radius: 16rpx;
      margin-right: 24rpx;
      background-color: #f5f5f5;
    }
    
    .company-details {
      flex: 1;
      
      .company-name {
        display: block;
        font-size: 36rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 12rpx;
      }
      
      .location {
        font-size: 28rpx;
        color: #666;
      }
    }
  }
  
  .position-info {
    .position-name {
      display: block;
      font-size: 40rpx;
      font-weight: 700;
      color: #333;
      margin-bottom: 16rpx;
    }
    
    .salary {
      display: block;
      font-size: 36rpx;
      font-weight: 600;
      color: #ff4d4f;
      margin-bottom: 24rpx;
    }
    
    .tags {
      display: flex;
      gap: 16rpx;
      
      .tag {
        padding: 8rpx 16rpx;
        border-radius: 20rpx;
        font-size: 24rpx;
        
        &.type-tag {
          background-color: #e6f7ff;
          color: #1890ff;
        }
        
        &.hot-tag {
          background-color: #fff2e8;
          color: #fa8c16;
        }
        
        &.recommend-tag {
          background-color: #f6ffed;
          color: #52c41a;
        }
      }
    }
  }
}

.detail-section {
  .section-item {
    background: white;
    padding: 40rpx;
    margin-bottom: 20rpx;
    
    .section-title {
      display: block;
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 24rpx;
    }
    
    .section-content {
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
      white-space: pre-line;
      
      &.contact {
        color: #1890ff;
        font-weight: 500;
      }
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24rpx;
      
      .info-item {
        display: flex;
        flex-direction: column;
        
        .info-label {
          font-size: 24rpx;
          color: #999;
          margin-bottom: 8rpx;
        }
        
        .info-value {
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
        }
      }
    }
  }
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 24rpx 40rpx;
  box-shadow: 0 -2rpx 16rpx rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 24rpx;
  
  .action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 12rpx;
    font-size: 28rpx;
    transition: all 0.3s;
    
    &.collect-btn {
      width: 120rpx;
      height: 80rpx;
      background-color: #f5f5f5;
      
      .action-icon {
        font-size: 32rpx;
        margin-bottom: 4rpx;
      }
      
      .action-text {
        font-size: 24rpx;
        color: #666;
      }
    }
    
    &.apply-btn {
      flex: 1;
      height: 80rpx;
      background: linear-gradient(135deg, #1890ff, #36cfc9);
      color: white;
      font-weight: 600;
      
      &.disabled {
        background: #d9d9d9;
        color: #999;
      }
      
      &:not(.disabled):active {
        transform: scale(0.98);
      }
    }
  }
}
</style>