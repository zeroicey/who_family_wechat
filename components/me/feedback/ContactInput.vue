<template>
  <view class="contact-input">
    <text class="section-title">联系方式 <text class="optional">(选填)</text></text>
    <view class="input-container">
      <input class="contact-field" :value="modelValue" @input="updateContact" placeholder="请留下您的手机号或邮箱，方便我们反馈"
        type="text" />
    </view>
  </view>
</template>

<script setup>
import { defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const updateContact = (e) => {
  emit('update:modelValue', e.detail.value);
};
</script>

<style lang="scss" scoped>
.contact-input {
  margin-bottom: 5vw;

  .section-title {
    font-size: 4vw;
    color: #333;
    font-weight: 600;
    margin-bottom: 3vw;
    position: relative;
    padding-left: 3vw;

    .optional {
      font-size: 3.2vw;
      color: #999;
      font-weight: 400;
    }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 1vw;
      height: 4vw;
      background-color: #07c160;
      border-radius: 0.5vw;
    }
  }

  .input-container {
    background-color: #f8f8f8;
    border-radius: 3vw;
    padding: 0 4vw;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);

    .contact-field {
      width: 100%;
      height: 11vw;
      font-size: 3.7vw;
      color: #333;
    }
  }
}
</style>
