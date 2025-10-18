<template>
  <view class="helper-container">
    <!-- 自定义标题栏 -->
    <view class="custom-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-left">
        <view class="menu-btn" @tap="onMenuClick">
          <uni-icons type="bars" size="20" color="#333"></uni-icons>
        </view>
      </view>
      <view class="header-center">
        <text class="header-title">校园AI助手</text>
      </view>
      <view class="header-right">
        <!-- 占位，保持居中 -->
      </view>
    </view>
    
    <!-- 聊天记录区域 -->
    <scroll-view 
      class="chat-content" 
      scroll-y="true" 
      :scroll-top="scrollTop"
      :scroll-into-view="scrollIntoView"
      scroll-with-animation="true"
    >
      <view class="message-list">
        <template v-for="(message, index) in messageList" :key="index">
          <!-- AI消息 -->
          <AiMessage 
            v-if="message.type === 'ai'" 
            :content="message.content"
          />
          <!-- 用户消息 -->
          <UserMessage 
            v-else-if="message.type === 'user'" 
            :content="message.content"
          />
        </template>
        <!-- 用于滚动定位的锚点 -->
        <view :id="'msg-' + messageList.length" class="scroll-anchor"></view>
      </view>
      
      <!-- 底部占位，避免被输入框遮挡 -->
      <view class="bottom-placeholder"></view>
    </scroll-view>
    
    <!-- 悬浮输入框 -->
    <ChatInput 
      :value="inputValue"
      @input="onInputChange"
      @send="onSendMessage"
    />
  </view>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import ChatInput from '@/components/helper/ChatInput.vue'
import UserMessage from '@/components/helper/UserMessage.vue'
import AiMessage from '@/components/helper/AiMessage.vue'

// 响应式数据
const inputValue = ref('')
const scrollTop = ref(0)
const scrollIntoView = ref('')
const statusBarHeight = ref(0)

// Mock聊天数据
const messageList = ref([
  { type: 'ai', content: '我是校助手，有什么问题？' },
  { type: 'user', content: '图书馆开放时间？' },
  { type: 'ai', content: '夏季8:00-22:00，冬季8:30-21:30' }
])

// 页面加载
onMounted(() => {
  // 获取系统信息，设置状态栏高度
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
  
  // 页面加载时滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
})

// 方法
const onInputChange = (value) => {
  inputValue.value = value
}

const onSendMessage = (content) => {
  // 添加用户消息
  messageList.value.push({
    type: 'user',
    content: content
  })
  
  // 清空输入框
  inputValue.value = ''
  
  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
  
  // 模拟AI回复（延迟1秒）
  setTimeout(() => {
    simulateAiReply(content)
  }, 1000)
}

const simulateAiReply = (userMessage) => {
  // 简单的模拟回复逻辑
  let aiReply = '我正在为您查询相关信息，请稍等...'
  
  if (userMessage.includes('图书馆')) {
    aiReply = '图书馆开放时间：周一至周日 8:00-22:00，节假日可能有调整。'
  } else if (userMessage.includes('食堂') || userMessage.includes('餐厅')) {
    aiReply = '学校共有3个食堂：东食堂、西食堂、中心食堂，营业时间6:30-21:00。'
  } else if (userMessage.includes('课表') || userMessage.includes('课程')) {
    aiReply = '您可以在教务系统查看个人课表，或者告诉我您的学号，我帮您查询。'
  } else if (userMessage.includes('天气')) {
    aiReply = '今天天气晴朗，温度18-25℃，适合户外活动。'
  }
  
  // 添加AI回复
  messageList.value.push({
    type: 'ai',
    content: aiReply
  })
  
  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
}

const scrollToBottom = () => {
  scrollIntoView.value = 'msg-' + messageList.value.length
}

const onMenuClick = () => {
  // 菜单按钮点击事件，暂时留空
  console.log('菜单按钮被点击')
}
</script>

<style lang="scss" scoped>
.helper-container {
  height: 100vh;
  background: #F5F5F7;
  display: flex;
  flex-direction: column;
  
  .custom-header {
    background: #F5F5F7;
    padding: 20rpx 30rpx;
    border-bottom: 1rpx solid #E5E5E7;
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .header-left {
      width: 80rpx;
      display: flex;
      justify-content: flex-start;
      
      .menu-btn {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        
        &:active {
          background: rgba(255, 255, 255, 0.6);
          transform: scale(0.95);
        }
      }
    }
    
    .header-center {
      flex: 1;
      display: flex;
      justify-content: center;
      
      .header-title {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
      }
    }
    
    .header-right {
      width: 80rpx;
      /* 占位，保持标题居中 */
    }
  }
  
  .chat-content {
    flex: 1;
    background: #F5F5F7;
    
    .message-list {
      min-height: 100%;
      padding-top: 20rpx;
    }
    
    .scroll-anchor {
      height: 1rpx;
    }
    
    .bottom-placeholder {
      height: 120rpx; // 为输入框留出空间
    }
  }
}

/* 全局页面样式 */
page {
  background: #F5F5F7;
  height: 100%;
}
</style>