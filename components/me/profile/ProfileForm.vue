<template>
  <view class="profile-form">
    <view class="form-group">
      <view class="form-item">
        <text class="label">昵称</text>
        <input class="input" v-model="formData.nickname" placeholder="请输入昵称" />
      </view>
      
      <view class="form-item">
        <text class="label">性别</text>
        <picker class="picker" mode="selector" :value="formData.gender" :range="genderOptions" @change="onGenderChange">
          <view class="picker-text">
            <text>{{ genderOptions[formData.gender] }}</text>
            <text class="arrow">&#xe605;</text>
          </view>
        </picker>
      </view>
      
      <view class="form-item">
        <text class="label">手机号</text>
        <view class="phone-wrapper">
          <text class="phone-text">{{ maskPhone(formData.phone) }}</text>
          <view class="change-btn" @click="changePhone">
            <text class="btn-text">更换</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 学校信息表单组 -->
    <view class="form-group">
      <view class="form-item">
        <text class="label">学校</text>
        <input class="input" v-model="formData.school" placeholder="请输入学校名称" />
      </view>
      
      <view class="form-item">
        <text class="label">专业</text>
        <input class="input" v-model="formData.major" placeholder="请输入专业名称" />
      </view>
      
      <view class="form-item">
        <text class="label">年级</text>
        <input class="input" v-model="formData.grade" placeholder="请输入年级" />
      </view>
    </view>
    
    <view class="form-group">
      <view class="form-item">
        <text class="label">个人简介</text>
        <textarea 
          class="textarea" 
          v-model="formData.bio" 
          placeholder="请输入个人简介" 
          :maxlength="100"
          auto-height
        ></textarea>
        <text class="word-count">{{ formData.bio.length }}/100</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, defineProps, defineEmits, computed, watch } from 'vue';

const props = defineProps({
  userInfo: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:userInfo', 'changePhone']);

// 性别选项
const genderOptions = ['男', '女', '保密'];

// 表单数据
const formData = reactive({
  nickname: '',
  gender: 2, // 默认保密
  phone: '',
  bio: '',
  school: '',
  major: '',
  grade: ''
});

// 监听 props 变化
// 监听 userInfo 变化并更新表单数据
watch(() => props.userInfo, (newUserInfo) => {
  if (newUserInfo) {
    formData.nickname = newUserInfo.name || '';
    formData.gender = newUserInfo.gender !== undefined ? newUserInfo.gender : 2;
    formData.phone = newUserInfo.phone || '';
    formData.bio = newUserInfo.bio || '';
    formData.school = newUserInfo.school || '';
    formData.major = newUserInfo.major || '';
    formData.grade = newUserInfo.grade || '';
    console.log('从 props 更新表单数据:', formData);
  }
}, { immediate: true, deep: true });

// 监听表单变化并同步到父组件
const updateFormData = () => {
  emit('update:userInfo', {
    ...props.userInfo,
    nickname: formData.nickname,
    gender: formData.gender,
    bio: formData.bio,
    school: formData.school,
    major: formData.major,
    grade: formData.grade
  });
};

// 监听性别选择变化
const onGenderChange = (e) => {
  formData.gender = parseInt(e.detail.value);
  updateFormData();
};

// 手机号码脱敏显示
const maskPhone = (phone) => {
  if (!phone || phone.length !== 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

// 更换手机号
const changePhone = () => {
  emit('changePhone');
};

// 监听表单数据变化
watch(() => formData.nickname, updateFormData);
watch(() => formData.bio, updateFormData);
watch(() => formData.school, updateFormData);
watch(() => formData.major, updateFormData);
watch(() => formData.grade, updateFormData);
</script>

<style lang="scss" scoped>
.profile-form {
  .form-group {
    background-color: #fff;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 3vw;
    
    .form-item {
      position: relative;
      padding: 4vw;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f5f5f5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .label {
        width: 20vw;
        font-size: 3.8vw;
        color: #333;
        font-weight: 500;
      }
      
      .input {
        flex: 1;
        height: 8vw;
        font-size: 3.5vw;
        color: #333;
      }
      
      .picker {
        flex: 1;
        
        .picker-text {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 3.5vw;
          color: #333;
          
          .arrow {
            font-size: 3vw;
            color: #ccc;
          }
        }
      }
      
      .phone-wrapper {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .phone-text {
          font-size: 3.5vw;
          color: #333;
        }
        
        .change-btn {
          padding: 1vw 3vw;
          background-color: #f5f5f5;
          border-radius: 3vw;
          
          .btn-text {
            font-size: 3vw;
            color: #666;
          }
        }
      }
      
      .textarea {
        flex: 1;
        width: 100%;
        min-height: 20vw;
        font-size: 3.5vw;
        color: #333;
        line-height: 1.6;
      }
      
      .word-count {
        position: absolute;
        right: 4vw;
        bottom: 4vw;
        font-size: 3vw;
        color: #999;
      }
    }
  }
}
</style>
