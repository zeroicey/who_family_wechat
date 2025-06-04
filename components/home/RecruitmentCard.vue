<template>
    <view class="recruitment-container">
        <view class="section-header">
            <text class="title">近期招聘</text>
            <text class="more" @click="navigateToMore">查看更多</text>
        </view>

        <view class="recruitment-list">
            <!-- 没有数据时显示空状态 -->
            <view class="empty-state" v-if="!loading && recruitmentList.length === 0">
                <text class="empty-text">暂无招聘信息</text>
            </view>
            
            <!-- 加载中状态 -->
            <view class="loading-state" v-else-if="loading">
                <view class="loading-animation"></view>
                <text class="loading-text">正在加载...</text>
            </view>
            
            <!-- 招聘列表 -->
            <view class="recruitment-item" v-for="(item, index) in recruitmentList" :key="index"
                @click="viewDetail(item)" v-else>
                <view class="recruitment-info">
                    <view class="recruitment-title">{{ item.title }}</view>
                    <view class="recruitment-tags">
                        <text class="tag" :class="item.typeClass">{{ item.type }}</text>
                        <text class="deadline">截止: {{ item.deadline }}</text>
                    </view>
                    <view class="recruitment-org">{{ item.organization }}</view>
                </view>
                <view class="recruitment-right">
                    <text class="status" :class="{ 'status-urgent': item.isUrgent }">{{ item.status }}</text>
                    <text class="arrow">›</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// 加载状态
const loading = ref(false);

// 招聘数据
const recruitmentList = ref([]);

// 获取招聘数据
const fetchRecruitmentData = async () => {
  try {
    loading.value = true;
    
    // 从 Vuex 中获取社团活动数据
    await store.dispatch('home/fetchClubList');
    const clubData = store.getters['home/getClubList'];
    
    if (clubData && clubData.length > 0) {
      // 只展示前3个数据
      recruitmentList.value = clubData.slice(0, 3).map(item => {
        // 判断类型
        let typeInfo = getTypeInfo(item.organizer || '');
        
        // 格式化截止日期
        const formatDeadline = date => {
          if (!date) return '--';
          const d = new Date(date);
          return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        };
        
        // 判断是否急招
        const isUrgent = () => {
          if (!item.time) return false;
          const now = new Date().getTime();
          const deadline = new Date(item.time).getTime();
          // 如果距离截止日期小于3天，则为急招
          return (deadline - now) < 3 * 24 * 60 * 60 * 1000;
        };
        
        return {
          id: item.id,
          title: item.title,
          type: typeInfo.type,
          typeClass: typeInfo.typeClass,
          organization: item.organizer || '学校组织',
          deadline: formatDeadline(item.time),
          status: isUrgent() ? '急招' : '招募中',
          isUrgent: isUrgent()
        };
      });
    }
  } catch (error) {
    console.error('获取招聘数据失败', error);
  } finally {
    loading.value = false;
  }
};

// 根据组织返回类型信息
const getTypeInfo = (organization) => {
  if (organization.includes('学生会') || organization.includes('教务') || organization.includes('学院')) {
    return { type: '校园招聘', typeClass: 'type-campus' };
  } else if (organization.includes('志愿者') || organization.includes('社会实践')) {
    return { type: '志愿活动', typeClass: 'type-volunteer' };
  } else {
    return { type: '社团招新', typeClass: 'type-club' };
  }
};

onMounted(() => {
  fetchRecruitmentData();
});

// 查看更多
const navigateToMore = () => {
    uni.switchTab({
        url: '/pages/recruit/index'
    });
};

// 查看详情
const viewDetail = (item) => {
    uni.navigateTo({
        url: `/pages/recruit/detail?id=${item.id}`
    });
};
</script>

<style lang="scss" scoped>
.recruitment-container {
    margin: 3vw;
    padding: 4vw;
    background-color: #ffffff;
    border-radius: 4vw;
    box-shadow: 0 1vw 3vw rgba(0, 0, 0, 0.06);

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4vw;
        position: relative;
        padding-left: 3vw;
        
        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 1vw;
            height: 5vw;
            background: linear-gradient(to bottom, #1890ff, #36a6ff);
            border-radius: 0.6vw;
        }

        .title {
            font-size: 4.2vw;
            font-weight: 600;
            color: #333;
            letter-spacing: 0.2vw;
        }

        .more {
            font-size: 3.2vw;
            color: #1890ff;
            padding: 1vw 2vw;
            background-color: rgba(24, 144, 255, 0.08);
            border-radius: 5vw;
            transition: all 0.3s;
            
            &:active {
                background-color: rgba(24, 144, 255, 0.15);
            }
        }
    }

    .recruitment-list {
        // 空状态样式
        .empty-state {
            padding: 10vw 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            
            .empty-text {
                font-size: 3.5vw;
                color: #aaa;
                margin-top: 3vw;
            }
        }
        
        // 加载中状态
        .loading-state {
            padding: 6vw 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            
            .loading-animation {
                width: 6vw;
                height: 6vw;
                border: 0.5vw solid #f0f0f0;
                border-top: 0.5vw solid #1890ff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            .loading-text {
                font-size: 3.2vw;
                color: #999;
                margin-top: 2vw;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        }
        
        .recruitment-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 3.5vw 2vw;
            border-bottom: 1px dashed #f0f0f0;
            margin-bottom: 1vw;
            border-radius: 2vw;
            transition: all 0.3s;
            
            &:active {
                background-color: #f9fafc;
                transform: scale(0.98);
            }

            &:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }

            .recruitment-info {
                flex: 1;

                .recruitment-title {
                    font-size: 4vw;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 2vw;
                    line-height: 1.4;
                }

                .recruitment-tags {
                    display: flex;
                    align-items: center;
                    margin-bottom: 2vw;

                    .tag {
                        font-size: 2.8vw;
                        padding: 0.8vw 2vw;
                        border-radius: 3vw;
                        margin-right: 3vw;
                        font-weight: 500;
                    }

                    .type-campus {
                        background-color: #e6f7ff;
                        color: #1890ff;
                    }

                    .type-volunteer {
                        background-color: #f6ffed;
                        color: #52c41a;
                    }

                    .type-club {
                        background-color: #f9f0ff;
                        color: #722ed1;
                    }

                    .deadline {
                        font-size: 2.8vw;
                        color: #fa8c16;
                        font-weight: 500;
                    }
                }

                .recruitment-org {
                    font-size: 3vw;
                    color: #666;
                    background-color: #f5f7fa;
                    display: inline-block;
                    padding: 0.5vw 2vw;
                    border-radius: 3vw;
                }
            }

            .recruitment-right {
                display: flex;
                align-items: center;

                .status {
                    font-size: 3vw;
                    color: #52c41a;
                    margin-right: 2vw;
                    font-weight: 500;
                    background-color: rgba(82, 196, 26, 0.1);
                    padding: 0.8vw 2vw;
                    border-radius: 3vw;
                }

                .status-urgent {
                    color: #f5222d;
                    background-color: rgba(245, 34, 45, 0.1);
                }

                .arrow {
                    font-size: 5vw;
                    color: #bfbfbf;
                    width: 6vw;
                    height: 6vw;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background-color: #f5f7fa;
                }
            }
        }
    }
}
</style>