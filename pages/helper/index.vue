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
import { ref, nextTick, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import ChatInput from '@/components/helper/ChatInput.vue'
import UserMessage from '@/components/helper/UserMessage.vue'
import AiMessage from '@/components/helper/AiMessage.vue'

// 使用Vuex store
const store = useStore()

// 响应式数据
const scrollTop = ref(0)
const scrollIntoView = ref('')
const statusBarHeight = ref(0)

// 从store获取数据
const messageList = computed(() => store.getters['helper/get_message_list'])
const inputValue = computed(() => store.getters['helper/get_input_value'])
const isAIReplying = computed(() => store.getters['helper/is_ai_replying'])

// 页面加载
onMounted(() => {
  // 获取系统信息，设置状态栏高度
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
  
  // 页面加载时滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
  
  // 检查AI服务状态
  store.dispatch('helper/check_ai_status')
})

// 方法
const onInputChange = (value) => {
  store.dispatch('helper/update_input_value', value)
}

const onSendMessage = async (content) => {
  if (!content.trim()) return
  
  try {
    // 通过store发送消息
    await store.dispatch('helper/send_message', content.trim())
    
    // 滚动到底部
    nextTick(() => {
      scrollToBottom()
    })
  } catch (error) {
    console.error('发送消息失败:', error)
    uni.showToast({
      title: '发送失败，请重试',
      icon: 'none'
    })
  }
}

const scrollToBottom = () => {
  scrollIntoView.value = 'msg-' + messageList.value.length
}

const onMenuClick = () => {
  // 菜单按钮点击事件，可以添加清空聊天记录等功能
  uni.showActionSheet({
    itemList: ['清空聊天记录', '检查AI状态'],
    success: (res) => {
      if (res.tapIndex === 0) {
        // 清空聊天记录
        uni.showModal({
          title: '确认清空',
          content: '确定要清空所有聊天记录吗？',
          success: (modalRes) => {
            if (modalRes.confirm) {
              store.dispatch('helper/clear_chat_history')
              nextTick(() => {
                scrollToBottom()
              })
            }
          }
        })
      } else if (res.tapIndex === 1) {
        // 检查AI状态
        store.dispatch('helper/check_ai_status').then((status) => {
          uni.showToast({
            title: status.message,
            icon: status.online ? 'success' : 'none'
          })
        })
      }
    }
  })
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