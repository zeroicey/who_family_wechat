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
import { useRecruitStore } from "@/stores/recruit";
const recruitStore = useRecruitStore();

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
    const data = await recruitStore.fetch_recruit_by_id( recruitId.value);
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
      await recruitStore.uncollect_recruit( recruitId.value);
      isCollected.value = false;
      uni.showToast({
        title: '取消收藏成功',
        icon: 'success'
      });
    } else {
      await recruitStore.collect_recruit( recruitId.value);
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
          await recruitStore.delivery_job( recruitId.value);
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
  // 修复iOS兼容性：将 "yyyy-MM-dd HH:mm:ss" 格式转换为 "yyyy/MM/dd HH:mm:ss"
  const iosCompatibleDateStr = dateStr.replace(/-/g, '/');
  const date = new Date(iosCompatibleDateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
</script>

<style lang="scss" scoped>
.recruit-detail {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-bottom: 140rpx;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  padding: 0 32rpx;
  
  .loading-text,
  .error-text {
    font-size: 32rpx;
    color: #666;
    margin-bottom: 40rpx;
    text-align: center;
  }
  
  .retry-btn {
    background-color: #1890ff;
    color: white;
    border: none;
    border-radius: 12rpx;
    padding: 24rpx 48rpx;
    font-size: 28rpx;
  }
}

.detail-content {
  padding: 24rpx 24rpx 40rpx 24rpx;
}

.header-section {
  background: white;
  padding: 32rpx;
  margin-bottom: 16rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  
  .company-info {
    display: flex;
    align-items: center;
    margin-bottom: 32rpx;
    
    .company-logo {
      width: 100rpx;
      height: 100rpx;
      border-radius: 12rpx;
      margin-right: 20rpx;
      background-color: #f5f5f5;
      border: 1rpx solid #eee;
    }
    
    .company-details {
      flex: 1;
      
      .company-name {
        display: block;
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
        line-height: 1.4;
      }
      
      .location {
        font-size: 26rpx;
        color: #666;
        line-height: 1.4;
      }
    }
  }
  
  .position-info {
    .position-name {
      display: block;
      font-size: 36rpx;
      font-weight: 700;
      color: #333;
      margin-bottom: 12rpx;
      line-height: 1.3;
    }
    
    .salary {
      display: block;
      font-size: 32rpx;
      font-weight: 600;
      color: #ff4d4f;
      margin-bottom: 20rpx;
      line-height: 1.3;
    }
    
    .tags {
      display: flex;
      gap: 12rpx;
      flex-wrap: wrap;
      
      .tag {
        padding: 6rpx 12rpx;
        border-radius: 16rpx;
        font-size: 22rpx;
        line-height: 1.2;
        
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
    padding: 32rpx;
    margin-bottom: 16rpx;
    border-radius: 16rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    
    .section-title {
      display: block;
      font-size: 30rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 20rpx;
      line-height: 1.4;
    }
    
    .section-content {
      font-size: 26rpx;
      color: #666;
      line-height: 1.7;
      white-space: pre-line;
      
      &.contact {
        color: #1890ff;
        font-weight: 500;
      }
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20rpx;
      
      .info-item {
        display: flex;
        flex-direction: column;
        padding: 16rpx;
        background-color: #fafafa;
        border-radius: 8rpx;
        
        .info-label {
          font-size: 22rpx;
          color: #999;
          margin-bottom: 6rpx;
          line-height: 1.3;
        }
        
        .info-value {
          font-size: 26rpx;
          color: #333;
          font-weight: 500;
          line-height: 1.3;
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
  padding: 20rpx 24rpx 32rpx 24rpx;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 20rpx;
  border-top: 1rpx solid #f0f0f0;
  
  .action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 12rpx;
    font-size: 28rpx;
    transition: all 0.3s;
    
    &.collect-btn {
      width: 100rpx;
      height: 88rpx;
      background-color: #f8f9fa;
      border: 1rpx solid #e8e8e8;
      
      .action-icon {
        font-size: 28rpx;
        margin-bottom: 2rpx;
      }
      
      .action-text {
        font-size: 22rpx;
        color: #666;
        line-height: 1.2;
      }
      
      &:active {
        background-color: #f0f0f0;
      }
    }
    
    &.apply-btn {
      flex: 1;
      height: 88rpx;
      background: linear-gradient(135deg, #1890ff, #36cfc9);
      color: white;
      font-weight: 600;
      font-size: 30rpx;
      
      &.disabled {
        background: #d9d9d9;
        color: #999;
      }
      
      &:not(.disabled):active {
        transform: scale(0.98);
        opacity: 0.9;
      }
    }
  }
}
</style>