<template>
  <view class="phone-change-container">
    <view class="form-content">
      <!-- 验证原手机号 -->
      <view class="form-section" v-if="step === 1">
        <view class="section-title">验证原手机号</view>
        <view class="form-item">
          <text class="label">原手机号</text>
          <text class="old-phone">{{ maskPhone(oldPhone) }}</text>
        </view>
        <view class="form-item">
          <text class="label">验证码</text>
          <input class="input" type="number" maxlength="6" v-model="form.oldVerifyCode" placeholder="请输入验证码" />
          <view class="verify-btn" :class="{ disabled: oldCountdown > 0 }" @tap="sendVerifyCode('old')">
            <text class="btn-text">{{ oldCountdown > 0 ? `${oldCountdown}s` : '获取验证码' }}</text>
          </view>
        </view>

        <view class="next-btn" :class="{ disabled: !form.oldVerifyCode }" @tap="verifyOldPhone">
          <text class="btn-text">下一步</text>
        </view>
      </view>

      <!-- 绑定新手机号 -->
      <view class="form-section" v-if="step === 2">
        <view class="section-title">绑定新手机号</view>
        <view class="form-item">
          <text class="label">新手机号</text>
          <input class="input" type="number" maxlength="11" v-model="form.newPhone" placeholder="请输入新手机号" />
        </view>
        <view class="form-item">
          <text class="label">验证码</text>
          <input class="input" type="number" maxlength="6" v-model="form.newVerifyCode" placeholder="请输入验证码" />
          <view class="verify-btn" :class="{ disabled: newCountdown > 0 || !isValidPhone(form.newPhone) }"
            @tap="sendVerifyCode('new')">
            <text class="btn-text">{{ newCountdown > 0 ? `${newCountdown}s` : '获取验证码' }}</text>
          </view>
        </view>

        <view class="next-btn"
          :class="{ disabled: !form.newPhone || !form.newVerifyCode || !isValidPhone(form.newPhone) }"
          @tap="submitNewPhone">
          <text class="btn-text">提交</text>
        </view>
      </view>

      <!-- 绑定成功 -->
      <view class="success-section" v-if="step === 3">
        <image class="success-icon" src="/static/images/success.png" mode="aspectFit"></image>
        <text class="success-text">手机号绑定成功</text>
        <view class="done-btn" @tap="done">
          <text class="btn-text">完成</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// 步骤控制：1-验证原手机号, 2-绑定新手机号, 3-绑定成功
const step = ref(1);

// 倒计时
const oldCountdown = ref(0);
const newCountdown = ref(0);

// 原手机号
const oldPhone = ref('');

// 表单数据
const form = reactive({
  oldVerifyCode: '',
  newPhone: '',
  newVerifyCode: ''
});

// 手机号码脱敏显示
const maskPhone = (phone) => {
  if (!phone || phone.length !== 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

// 验证手机号格式
const isValidPhone = (phone) => {
  return /^1[3-9]\d{9}$/.test(phone);
};

// 发送验证码
const sendVerifyCode = (type) => {
  if (type === 'old' && oldCountdown.value > 0) return;
  if (type === 'new' && (newCountdown.value > 0 || !isValidPhone(form.newPhone))) return;

  // 显示加载提示
  uni.showLoading({
    title: '发送中...'
  });

  // 模拟发送验证码
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({
      title: '验证码已发送',
      icon: 'success'
    });

    // 开始倒计时
    if (type === 'old') {
      startOldCountdown();
    } else {
      startNewCountdown();
    }
  }, 1000);
};

// 开始原手机验证码倒计时
const startOldCountdown = () => {
  oldCountdown.value = 60;
  const timer = setInterval(() => {
    oldCountdown.value--;
    if (oldCountdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

// 开始新手机验证码倒计时
const startNewCountdown = () => {
  newCountdown.value = 60;
  const timer = setInterval(() => {
    newCountdown.value--;
    if (newCountdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

// 验证原手机号
const verifyOldPhone = () => {
  if (!form.oldVerifyCode) {
    uni.showToast({
      title: '请输入验证码',
      icon: 'none'
    });
    return;
  }

  uni.showLoading({
    title: '验证中...'
  });

  // 模拟验证过程
  setTimeout(() => {
    uni.hideLoading();

    // 模拟验证成功
    if (form.oldVerifyCode.length === 6) {
      step.value = 2; // 进入下一步
    } else {
      uni.showToast({
        title: '验证码错误，请重试',
        icon: 'none'
      });
    }
  }, 1500);
};

// 提交新手机号
const submitNewPhone = () => {
  if (!isValidPhone(form.newPhone)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    });
    return;
  }

  if (!form.newVerifyCode) {
    uni.showToast({
      title: '请输入验证码',
      icon: 'none'
    });
    return;
  }

  uni.showLoading({
    title: '提交中...'
  });

  // 模拟提交过程
  setTimeout(() => {
    uni.hideLoading();

    // 模拟提交成功
    if (form.newVerifyCode.length === 6) {
      // 更新 Vuex 中的用户手机号
      store.commit('user/UPDATE_USER_PHONE', form.newPhone);
      step.value = 3; // 进入成功页面
    } else {
      uni.showToast({
        title: '验证码错误，请重试',
        icon: 'none'
      });
    }
  }, 1500);
};

// 完成
const done = () => {
  uni.navigateBack({
    delta: 1
  });
};

// 返回上一页
const navigateBack = () => {
  if (step.value > 1) {
    step.value--;
  } else {
    uni.navigateBack();
  }
};

// 初始化
onMounted(() => {
  // 从 store 中获取用户信息
  const userInfo = store.state.user.userInfo;
  if (userInfo && userInfo.phone) {
    oldPhone.value = userInfo.phone;
  } else {
    // 如果没有用户信息，使用模拟数据
    const { userInfo: mockUserInfo } = require('@/mock/user');
    oldPhone.value = mockUserInfo.phone || '13800138000';
  }
});
</script>

<style lang="scss" scoped>
.phone-change-container {
  min-height: 100vh;
  background-color: #f5f5f5;


  .form-content {
    padding: 3vw;

    .form-section,
    .success-section {
      background-color: #fff;
      border-radius: 4px;
      overflow: hidden;
      padding: 4vw;

      .section-title {
        font-size: 4vw;
        font-weight: 500;
        color: #333;
        margin-bottom: 6vw;
      }

      .form-item {
        display: flex;
        align-items: center;
        margin-bottom: 5vw;
        height: 12vw;

        .label {
          width: 20vw;
          font-size: 3.8vw;
          color: #333;
        }

        .old-phone {
          flex: 1;
          font-size: 3.8vw;
          color: #333;
        }

        .input {
          flex: 1;
          height: 10vw;
          padding: 0 3vw;
          font-size: 3.8vw;
          color: #333;
          border: 1px solid #eee;
          border-radius: 2vw;
        }

        .verify-btn {
          width: 25vw;
          height: 10vw;
          margin-left: 3vw;
          background-color: #07c160;
          border-radius: 2vw;
          display: flex;
          justify-content: center;
          align-items: center;

          &.disabled {
            background-color: #ccc;
          }

          .btn-text {
            font-size: 3.2vw;
            color: #fff;
          }
        }
      }

      .next-btn,
      .done-btn {
        height: 12vw;
        background-color: #07c160;
        border-radius: 6vw;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 8vw;
        box-shadow: 0 2px 10px rgba(7, 193, 96, 0.3);

        &.disabled {
          background-color: #ccc;
          box-shadow: none;
        }

        .btn-text {
          font-size: 4vw;
          color: #fff;
          font-weight: 500;
        }
      }
    }

    .success-section {
      padding: 10vw 4vw;
      display: flex;
      flex-direction: column;
      align-items: center;

      .success-icon {
        width: 20vw;
        height: 20vw;
        margin-bottom: 5vw;
      }

      .success-text {
        font-size: 4.5vw;
        font-weight: 500;
        color: #333;
        margin-bottom: 8vw;
      }
    }
  }
}
</style>
