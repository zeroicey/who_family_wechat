<template>
  <view class="helper-workbench">
    <view class="helper-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-row">
        <view class="menu-btn" @tap="onMenuClick">
          <uni-icons type="bars" size="18" color="#182131"></uni-icons>
        </view>
        <view class="header-copy">
          <text class="header-kicker">助手</text>
          <text class="header-title">答答 Novus 智能校园助手</text>
        </view>
        <view class="status-pill">
          <text>{{ isAIReplying ? '思考中' : '在线' }}</text>
        </view>
      </view>

      <view class="header-panel">
        <text class="panel-title">把问答、查询建议和校园帮助放在同一个工作台里</text>
        <view class="panel-tags">
          <text class="panel-tag">校园问答</text>
          <text class="panel-tag">服务建议</text>
          <text class="panel-tag">学习支持</text>
        </view>
      </view>
    </view>

    <scroll-view
      class="chat-content"
      scroll-y="true"
      :scroll-top="scrollTop"
      :scroll-into-view="scrollIntoView"
      scroll-with-animation="true"
    >
      <view class="message-list">
        <template v-for="(message, index) in messageList" :key="index">
          <AiMessage
            v-if="message.type === 'ai'"
            :content="message.content"
            :isTyping="message.isTyping || false"
          />
          <PresetQuestions
            v-if="message.type === 'ai' && message.showPresetQuestions && index === 0"
            :questions="presetQuestions"
            :showQuestions="messageList.length === 1"
            @questionClick="onPresetQuestionClick"
          />
          <UserMessage
            v-else-if="message.type === 'user'"
            :content="message.content"
          />
        </template>
        <view :id="'msg-' + messageList.length" class="scroll-anchor"></view>
      </view>

      <view class="bottom-placeholder"></view>
    </scroll-view>

    <ChatInput
      :value="inputValue"
      @input="onInputChange"
      @send="onSendMessage"
    />
  </view>
</template>

<script setup>
import { ref, nextTick, onMounted, computed } from "vue";
import { useHelperStore } from "@/stores/helper";
import ChatInput from "@/components/helper/ChatInput.vue";
import UserMessage from "@/components/helper/UserMessage.vue";
import AiMessage from "@/components/helper/AIMessage.vue";
import PresetQuestions from "@/components/helper/PresetQuestions.vue";

const helperStore = useHelperStore();
const scrollTop = ref(0);
const scrollIntoView = ref("");
const statusBarHeight = ref(0);

const messageList = computed(() => helperStore.get_message_list);
const inputValue = computed(() => helperStore.get_input_value);
const isAIReplying = computed(() => helperStore.is_ai_replying);
const presetQuestions = computed(() => helperStore.get_preset_questions);

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 0;

  nextTick(() => {
    if (messageList.value.length > 1) {
      scrollToBottom();
    }
  });

  helperStore.check_ai_status();
});

const onInputChange = (value) => {
  helperStore.update_input_value(value);
};

const onSendMessage = async (content) => {
  if (!content.trim()) return;

  try {
    helperStore.update_input_value("");
    await helperStore.send_message(content.trim());
    nextTick(() => {
      scrollToBottom();
    });
  } catch (error) {
    console.error("发送消息失败:", error);
    uni.showToast({
      title: "发送失败，请重试",
      icon: "none"
    });
  }
};

const onPresetQuestionClick = async (question) => {
  try {
    await onSendMessage(question.content);
  } catch (error) {
    console.error("发送预设问题失败:", error);
  }
};

const scrollToBottom = () => {
  scrollIntoView.value = "msg-" + messageList.value.length;
};

const onMenuClick = () => {
  uni.showActionSheet({
    itemList: ["清空聊天记录", "检查AI状态"],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.showModal({
          title: "确认清空",
          content: "确定要清空所有聊天记录吗？",
          success: (modalRes) => {
            if (modalRes.confirm) {
              helperStore.clear_chat_history();
              nextTick(() => {
                scrollToBottom();
              });
            }
          }
        });
      } else if (res.tapIndex === 1) {
        helperStore.check_ai_status().then((status) => {
          uni.showToast({
            title: status.message,
            icon: status.online ? "success" : "none"
          });
        });
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.helper-workbench {
  height: 100vh;
  background: linear-gradient(180deg, #f7f4ff 0%, #f5f7fb 24%, #f5f7fb 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.helper-header {
  padding: 16rpx 24rpx 20rpx;
  flex-shrink: 0;
}

.header-row {
  display: flex;
  align-items: center;
  gap: 18rpx;
  margin-bottom: 20rpx;
}

.menu-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.82);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-soft);
}

.header-copy {
  flex: 1;
  min-width: 0;
}

.header-kicker,
.header-title,
.panel-title,
.panel-tag,
.status-pill text {
  display: block;
}

.header-kicker {
  margin-bottom: 6rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: var(--brand-primary);
}

.header-title {
  font-size: 30rpx;
  line-height: 1.4;
  font-weight: 700;
  color: var(--text-primary);
}

.status-pill {
  padding: 12rpx 18rpx;
  border-radius: 999rpx;
  background: rgba(34, 197, 94, 0.12);
}

.status-pill text {
  font-size: 22rpx;
  font-weight: 600;
  color: #22c55e;
}

.header-panel {
  padding: 24rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, #ffffff 0%, #f1edff 100%);
  box-shadow: var(--shadow-soft);
}

.panel-title {
  margin-bottom: 16rpx;
  font-size: 26rpx;
  line-height: 1.6;
  color: var(--text-primary);
  font-weight: 600;
}

.panel-tags {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.panel-tag {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: rgba(109, 74, 255, 0.1);
  color: var(--brand-primary);
  font-size: 22rpx;
  font-weight: 600;
}

.chat-content {
  flex: 1;
  overflow: hidden;
}

.message-list {
  min-height: 100%;
  padding-top: 8rpx;
  padding-bottom: 20rpx;
}

.scroll-anchor {
  height: 1rpx;
}

.bottom-placeholder {
  height: 180rpx;
}
</style>
