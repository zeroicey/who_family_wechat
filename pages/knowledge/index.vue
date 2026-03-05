<template>
  <view class="knowledge-page">
    <view class="tabs-container">
      <v-tabs
        v-model="activeTab"
        :tabs="knowledgeTabs"
        :pills="true"
        line-height="0"
        active-color="#fff"
        pills-color="#2979ff"
        pills-border-radius="20rpx"
        color="#2979ff"
        font-size="28rpx"
        height="80rpx"
        padding-item="0 20rpx"
        bg-color="#f5f5f5"
        @change="changeTab"
      ></v-tabs>
    </view>

    <scroll-view class="knowledge-list" scroll-y="true">
      <view class="list-container">
        <view
          v-for="item in currentKnowledgeList"
          :key="item.id"
          class="knowledge-card"
          @click="viewDetail(item)"
        >
          <view class="card-header">
            <text class="card-title">{{ item.title }}</text>
            <view class="card-tag" :class="getLevelClass(item.level)">
              <text class="tag-text">{{ item.level }}</text>
            </view>
          </view>
          <text class="card-desc">{{ item.description }}</text>
          <view class="card-footer">
            <view class="card-tags">
              <text
                v-for="(tag, index) in item.tags"
                :key="index"
                class="mini-tag"
              >{{ tag }}</text>
            </view>
            <text class="card-time">{{ item.readTime }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';

onShareAppMessage(() => {
  return {
    title: '互成一家小程序',
    path: '/pages/home/index',
    imageUrl: '/static/images/logo.png'
  }
})

onShareTimeline(() => ({
  title: '互成一家小程序',
  imageUrl: '/static/images/logo.png'
}))

const activeTab = ref(0);
const knowledgeTabs = ['前端', '后端', '数据库', '算法', '设计模式', '运维'];

const knowledgeData = {
  0: [
    {
      id: 1,
      title: 'Vue3 响应式原理',
      description: '深入理解 Vue3 的 Proxy 响应式系统，掌握 Composition API 的核心思想',
      level: '高级',
      tags: ['Vue3', '响应式', 'Proxy'],
      readTime: '15分钟'
    },
    {
      id: 2,
      title: 'React Hooks 最佳实践',
      description: '掌握 useState、useEffect 等 Hooks 的正确使用方式，避免常见陷阱',
      level: '中级',
      tags: ['React', 'Hooks', '状态管理'],
      readTime: '12分钟'
    },
    {
      id: 3,
      title: 'Webpack 打包优化',
      description: '学习 Webpack 性能优化技巧，提升构建速度和减小包体积',
      level: '高级',
      tags: ['Webpack', '性能优化', '构建工具'],
      readTime: '20分钟'
    },
    {
      id: 4,
      title: '小程序开发要点',
      description: 'uni-app 跨平台开发实战，微信小程序 API 使用技巧',
      level: '初级',
      tags: ['小程序', 'uni-app', '跨平台'],
      readTime: '10分钟'
    }
  ],
  1: [
    {
      id: 5,
      title: 'Spring Boot 实战',
      description: '从零搭建 Spring Boot 项目，RESTful API 设计与实现',
      level: '中级',
      tags: ['Spring Boot', 'Java', 'RESTful'],
      readTime: '18分钟'
    },
    {
      id: 6,
      title: 'Node.js 异步编程',
      description: '深入理解 Event Loop，掌握 Promise、async/await 的使用',
      level: '中级',
      tags: ['Node.js', '异步', 'Event Loop'],
      readTime: '14分钟'
    },
    {
      id: 7,
      title: '微服务架构设计',
      description: '微服务拆分原则，服务间通信，分布式事务处理',
      level: '高级',
      tags: ['微服务', '分布式', '架构'],
      readTime: '25分钟'
    }
  ],
  2: [
    {
      id: 8,
      title: 'MySQL 索引优化',
      description: '深入理解 B+ 树索引结构，掌握索引优化技巧',
      level: '中级',
      tags: ['MySQL', '索引', '性能优化'],
      readTime: '16分钟'
    },
    {
      id: 9,
      title: 'Redis 缓存设计',
      description: 'Redis 数据类型选择，缓存策略，防止缓存穿透和雪崩',
      level: '高级',
      tags: ['Redis', '缓存', '分布式'],
      readTime: '20分钟'
    },
    {
      id: 10,
      title: 'MongoDB 最佳实践',
      description: 'NoSQL 数据库设计模式，聚合查询优化',
      level: '中级',
      tags: ['MongoDB', 'NoSQL', '文档数据库'],
      readTime: '15分钟'
    }
  ],
  3: [
    {
      id: 11,
      title: '动态规划经典题',
      description: '掌握动态规划思想，刷透 LeetCode 经典 DP 问题',
      level: '高级',
      tags: ['动态规划', 'LeetCode', '算法'],
      readTime: '30分钟'
    },
    {
      id: 12,
      title: '二叉树遍历',
      description: '前序、中序、后序遍历的递归与非递归实现',
      level: '初级',
      tags: ['二叉树', '遍历', '递归'],
      readTime: '12分钟'
    },
    {
      id: 13,
      title: '图论算法入门',
      description: 'BFS 和 DFS 算法，最短路径问题解决方案',
      level: '中级',
      tags: ['图论', 'BFS', 'DFS'],
      readTime: '22分钟'
    }
  ],
  4: [
    {
      id: 14,
      title: '单例模式的多种实现',
      description: '饿汉式、懒汉式、双重检查锁等单例模式实现方式',
      level: '初级',
      tags: ['单例模式', '创建型', '设计模式'],
      readTime: '10分钟'
    },
    {
      id: 15,
      title: '观察者模式应用',
      description: '发布-订阅模式在 Vue 和 React 中的实际应用',
      level: '中级',
      tags: ['观察者模式', '行为型', '响应式'],
      readTime: '15分钟'
    },
    {
      id: 16,
      title: '工厂模式实战',
      description: '简单工厂、工厂方法、抽象工厂的使用场景',
      level: '中级',
      tags: ['工厂模式', '创建型', 'OOP'],
      readTime: '18分钟'
    }
  ],
  5: [
    {
      id: 17,
      title: 'Docker 容器化部署',
      description: 'Docker 基础命令，Dockerfile 编写，容器编排',
      level: '中级',
      tags: ['Docker', '容器化', 'DevOps'],
      readTime: '20分钟'
    },
    {
      id: 18,
      title: 'Linux 常用命令',
      description: '文件操作、进程管理、网络排查等必备命令',
      level: '初级',
      tags: ['Linux', 'Shell', '命令行'],
      readTime: '15分钟'
    },
    {
      id: 19,
      title: 'Nginx 配置优化',
      description: '反向代理、负载均衡、缓存配置与性能优化',
      level: '高级',
      tags: ['Nginx', 'Web服务器', '负载均衡'],
      readTime: '25分钟'
    }
  ]
};

const currentKnowledgeList = computed(() => {
  return knowledgeData[activeTab.value] || [];
});

const getLevelClass = (level) => {
  const levelMap = {
    '初级': 'tag-beginner',
    '中级': 'tag-intermediate',
    '高级': 'tag-advanced'
  };
  return levelMap[level] || 'tag-beginner';
};

const changeTab = (index) => {
  console.log('切换到分类:', knowledgeTabs[index]);
  activeTab.value = index;
};

const viewDetail = (item) => {
  uni.showToast({
    title: `查看：${item.title}`,
    icon: 'none',
    duration: 2000
  });
};
</script>

<style scoped>
.knowledge-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.tabs-container {
  background-color: #fff;
  border-bottom: 1rpx solid #e5e5e5;
  padding: 0 10rpx;
}

.knowledge-list {
  flex: 1;
  height: 0;
}

.list-container {
  padding: 20rpx;
}

.knowledge-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.card-tag {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.tag-beginner {
  background-color: #e8f5e3;
  color: #4caf50;
}

.tag-intermediate {
  background-color: #fff3e0;
  color: #ff9800;
}

.tag-advanced {
  background-color: #ffebee;
  color: #f44336;
}

.tag-text {
  font-size: 24rpx;
}

.card-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-tags {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.mini-tag {
  background-color: #f0f0f0;
  color: #666;
  font-size: 24rpx;
  padding: 6rpx 12rpx;
  border-radius: 6rpx;
}

.card-time {
  font-size: 24rpx;
  color: #999;
}
</style>
