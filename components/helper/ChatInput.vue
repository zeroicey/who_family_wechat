<template>
  <view class="chat-input-container">
    <view class="input-wrapper">
      <input
        class="message-input"
        type="text"
        :value="inputValue"
        @input="onInput"
        placeholder="输入你的校园问题..."
        :adjust-position="true"
        :hold-keyboard="true"
      />
      <view class="send-btn" @tap="onSend">
        <uni-icons type="paperplane-filled" size="18" color="#FFFFFF"></uni-icons>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  value: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(["input", "send"]);
const inputValue = ref(props.value);

watch(() => props.value, (newVal) => {
  inputValue.value = newVal;
});

const onInput = (e) => {
  inputValue.value = e.detail.value;
  emit("input", e.detail.value);
};

const onSend = () => {
  if (inputValue.value.trim()) {
    emit("send", inputValue.value.trim());
    inputValue.value = "";
    emit("input", "");
  }
};
</script>

<style lang="scss" scoped>
.chat-input-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  padding: 16rpx 20rpx 18rpx;
  background: rgba(245, 247, 251, 0.95);
  backdrop-filter: blur(12px);
}

.input-wrapper {
  display: flex;
  align-items: center;
  padding: 14rpx;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: var(--shadow-soft);
}

.message-input {
  flex: 1;
  min-height: 60rpx;
  padding: 10rpx 18rpx;
  background: transparent;
  border: none;
  outline: none;
  font-size: 26rpx;
  color: var(--text-primary);
}

.send-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #6d4aff, #8d6bff);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
