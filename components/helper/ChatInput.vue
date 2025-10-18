<template>
  <view class="chat-input-container">
    <view class="input-wrapper">
      <input 
        class="message-input" 
        type="text" 
        :value="inputValue"
        @input="onInput"
        placeholder="请输入消息..."
        :adjust-position="true"
        :hold-keyboard="true"
      />
      <view class="send-btn" @tap="onSend">
        <uni-icons type="paperplane-filled" size="20" color="#4A8BFF"></uni-icons>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ChatInput',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      inputValue: this.value
    }
  },
  watch: {
    value(newVal) {
      this.inputValue = newVal
    }
  },
  methods: {
    onInput(e) {
      this.inputValue = e.detail.value
      this.$emit('input', e.detail.value)
    },
    onSend() {
      if (this.inputValue.trim()) {
        this.$emit('send', this.inputValue.trim())
        this.inputValue = ''
        this.$emit('input', '')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-input-container {
  position: fixed;
  bottom: 10px;
  left: 15px;
  right: 15px;
  z-index: 999;
  
  .input-wrapper {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 8px;
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    padding: 15rpx;
    
    .message-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      font-size: 26rpx;
      color: #333;
      padding: 10rpx 15rpx;
      min-height: 60rpx;
      
      &::placeholder {
        color: #999;
      }
    }
    
    .send-btn {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      background: #f0f2f5;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 15rpx;
      transition: all 0.2s ease;
      
      &:active {
        background: #e6e8eb;
        transform: scale(0.95);
      }
    }
  }
}

/* 键盘弹出时的适配 */
.chat-input-container.keyboard-show {
  bottom: 0;
}
</style>