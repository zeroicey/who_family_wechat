<template>
  <view class="service-recommend">
    <view class="section-title">
      <text>推荐服务</text>
    </view>

    <!-- 推荐服务卡片 -->
    <view class="service-cards">
      <scroll-view class="service-scroll" scroll-x show-scrollbar="false">
        <view class="service-scroll-content">
          <view class="service-card" v-for="(item, index) in recommendServices" :key="index"
            @tap="navigateToService(item)">
            <view class="service-image-container">
              <image class="service-image" :src="item.imageUrl" mode="aspectFill"></image>
              <view class="service-tag" v-if="item.price">
                <text>{{ item.price }}</text>
              </view>
            </view>
            <view class="service-info">
              <text class="service-title">{{ item.title }}</text>
              <text class="service-desc">{{ item.description }}</text>
              <view class="service-rating" v-if="item.rating">
                <view class="rating-stars">
                  <text class="rating-value">{{ item.rating }}</text>
                  <view class="star-icon filled" v-for="n in 5" :key="n"></view>
                </view>
                <text class="order-count" v-if="item.orders">{{ item.orders }}人已预约</text>
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

// 加载状态
const loading = ref(false);

// 推荐服务数据
const recommendServices = ref([]);

// 热门服务数据
const hotServices = ref([]);

// 获取推荐服务数据
const fetchRecommendServices = async () => {
  try {
    loading.value = true;

    const serviceData =
      [
        {
          id: 1,
          title: '代拿快递服务',
          description: '校内快递专人代取，省时省力，专注于更重要的事。',
          imageUrl: '/static/images/daina.jpg',
          price: '¥3起',
          rating: 4.8,
          orders: 1580,
          url: '/pages/service/express'
        },
        {
          id: 2,
          title: '远程打印服务',
          description: '宿舍也能轻松打印！手机一键上传，即刻获取文件。',
          imageUrl: 'https://images.unsplash.com/photo-1521587514241-a5b5b0c55a26?q=80&w=800&auto=format&fit=crop',
          price: '¥0.2/页',
          rating: 4.9,
          orders: 2350,
          url: '/pages/service/print'
        },
        {
          id: 3,
          title: '更多服务',
          description: '敬请期待...',
          imageUrl: 'https://images.unsplash.com/photo-1515266591878-72d7c1880b0e?q=80&w=800&auto=format&fit=crop',
          price: '',
          rating: null,
          orders: null,
          url: ''
        }
      ];

    if (serviceData && serviceData.length > 0) {
      // 格式化服务数据以适应组件
      recommendServices.value = serviceData.map(service => {
        return {
          id: service.id,
          title: service.title,
          description: service.description,
          imageUrl: service.imageUrl,
          url: service.url,
          price: service.price || null,
          rating: service.rating ? service.rating.toFixed(1) : null,
          orders: service.orders ? service.orders.toString() : null
        };
      });
    }
  } catch (error) {
    console.error('获取推荐服务失败', error);
    uni.showToast({
      title: '服务数据加载失败',
      icon: 'none',
      duration: 2000
    });
  } finally {
    loading.value = false;
  }
};

// 获取热门服务数据
const fetchHotServices = async () => {
  try {
    // 调用Vuex获取热门服务数据
    await store.dispatch('home/fetchToolList');
    const toolData = store.getters['home/getToolList'];

    if (toolData && toolData.length > 0) {
      // 取前5个工具作为热门服务
      hotServices.value = toolData.slice(0, 5).map(tool => {
        return {
          id: tool.id,
          name: tool.name,
          icon: tool.icon || getServiceColor(tool.id % 5),
          url: tool.url || `/pages/tool/detail?id=${tool.id}`
        };
      });
    }
  } catch (error) {
    console.error('获取热门服务失败', error);
    // 失败时不显示提示，因为这是二级功能
  }
};

// 获取服务图标颜色
// 为每个图标生成不同的颜色
const getServiceColor = (index) => {
  const colors = [
    'linear-gradient(135deg, #1890ff, #36cfc9)',  // 蓝色
    'linear-gradient(135deg, #f5222d, #ff7a45)',  // 红色
    'linear-gradient(135deg, #722ed1, #b37feb)',  // 紫色
    'linear-gradient(135deg, #52c41a, #95de64)',  // 绿色
    'linear-gradient(135deg, #fa8c16, #ffd666)'   // 橙色
  ];
  return colors[index % colors.length];
};

// 跳转到服务页面
const navigateToService = (item) => {
  if (!item.url) return;
  uni.navigateTo({
    url: item.url
  });
};

// 组件挂载时获取数据
onMounted(() => {
  fetchRecommendServices();
  fetchHotServices();
});
</script>

<style lang="scss" scoped>
.service-recommend {
  padding: 1vw 5vw;

  .section-title {
    margin-bottom: 3vw;
    display: flex;
    justify-content: space-between;
    align-items: center;

    text {
      font-size: 4.5vw;
      font-weight: 600;
      color: #333;
    }
  }

  .service-cards {
    .service-scroll {
      width: 100%;
      white-space: nowrap;

      .service-scroll-content {
        display: inline-block;
        padding-bottom: 2vw;

        .service-card {
          display: inline-block;
          width: 70vw;
          background-color: #fff;
          border-radius: 4vw;
          margin-right: 4vw;
          overflow: hidden;
          box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
          transition: transform 0.2s, box-shadow 0.2s;

          &:active {
            transform: translateY(1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          }

          &:last-child {
            margin-right: 0;
          }

          .service-image-container {
            position: relative;
            width: 100%;
            height: 38vw;
            overflow: hidden;

            .service-image {
              width: 100%;
              height: 100%;
              transition: transform 0.3s;

              &:hover {
                transform: scale(1.05);
              }
            }

            .service-tag {
              position: absolute;
              top: 3vw;
              right: 0;
              background: linear-gradient(135deg, #ff4d4f, #ff7a45);
              color: white;
              padding: 1vw 3vw;
              border-radius: 5vw 0 0 5vw;
              font-size: 3vw;
              font-weight: 600;
              z-index: 2;
              box-shadow: 0 2px 8px rgba(255, 77, 79, 0.3);
            }
          }

          .service-info {
            padding: 4vw;

            .service-title {
              font-size: 4.2vw;
              font-weight: 600;
              color: #333;
              margin-bottom: 2vw;
              display: block;
              letter-spacing: 0.02em;
            }

            .service-desc {
              font-size: 3.2vw;
              color: #666;
              white-space: normal;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
              margin-bottom: 2vw;
              line-height: 1.4;
            }

            .service-rating {
              display: flex;
              align-items: center;
              justify-content: space-between;

              .rating-stars {
                display: flex;
                align-items: center;

                .rating-value {
                  font-size: 3.8vw;
                  font-weight: 600;
                  color: #fa8c16;
                  margin-right: 2vw;
                }

                .star-icon {
                  position: relative;
                  width: 3vw;
                  height: 3vw;
                  margin-right: 1vw;

                  &.filled:after {
                    content: '★';
                    position: absolute;
                    top: 0;
                    left: 0;
                    color: #fa8c16;
                    font-size: 3vw;
                  }
                }
              }

              .order-count {
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
