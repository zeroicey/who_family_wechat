<template>
    <view class="profile-container">
        <!-- 头像上传区域 -->
        <view class="avatar-section">
            <view class="section-title">头像</view>
            <view class="avatar-wrapper" @click="chooseAvatar">
                <image class="avatar" :src="avatarUrl" mode="aspectFill"></image>
                <view class="upload-icon">
                    <text class="icon-text">更换</text>
                </view>
            </view>
        </view>

        <!-- 基本信息表单 -->
        <view class="form-group">
            <view class="form-item">
                <text class="label">昵称</text>
                <input class="input" v-model="userInfo.name" placeholder="请输入昵称" />
            </view>

            <view class="form-item">
                <text class="label">性别</text>
                <picker class="picker" mode="selector" :value="userProfile.gender" :range="genderOptions"
                    @change="onGenderChange">
                    <view class="picker-text">
                        <text>{{ genderOptions[userProfile.gender] }}</text>
                        <text class="arrow">&#xe605;</text>
                    </view>
                </picker>
            </view>

            <view class="form-item">
                <text class="label">手机号</text>
                <view class="phone-wrapper">
                    <text class="phone-text">{{ maskPhone(userProfile.phone) }}</text>
                    <view class="change-btn" @click="navigateToChangePhone">
                        <text class="btn-text">更换</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 个人简介 -->
        <view class="form-group">
            <view class="form-item">
                <text class="label">个人简介</text>
                <textarea class="textarea" v-model="userProfile.bio" placeholder="请输入个人简介" :maxlength="100"
                    auto-height></textarea>
                <text class="word-count">{{ userProfile.bio.length }}/100</text>
            </view>
        </view>

        <view class="save-btn" @click="saveProfile">
            <text class="btn-text">保存修改</text>
        </view>
    </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// 性别选项
const genderOptions = ['男', '女', '保密'];

// 用户资料
const userProfile = reactive({
    avatar: '',
    nickname: '',
    gender: 1,
    phone: '',
    bio: ''
});

// 计算头像URL，处理默认头像情况
const userInfo = computed(() => store.getters["user/getUserInfo"]);
const avatarUrl = computed(() => store.getters["user/getUserAvatarUrl"]);

// 确保Vuex中有用户数据
const initUserStore = () => {
    if (!store.state.user.userInfo) {
        const { userInfo: mockUserInfo } = require('@/mock/user');
        console.log('从mock初始化用户数据:', mockUserInfo);
        store.commit('user/SET_USER_INFO', mockUserInfo);
    }
};

// 获取用户信息
const fetchUserInfo = () => {
    const userInfo = store.state.user.userInfo;
    if (userInfo) {
        console.log('从Vuex读取用户信息:', userInfo);
        userProfile.avatar = userInfo.avatar || '/static/images/avatar.png';
        userProfile.nickname = userInfo.name || '';
        userProfile.gender = userInfo.gender !== undefined ? userInfo.gender : 2;
        userProfile.phone = userInfo.phone || '';
        userProfile.bio = userInfo.bio || '';

        console.log('初始化表单数据完成:', userProfile);
    }
};

// 选择头像
const chooseAvatar = () => {
    uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
            const tempFilePath = res.tempFilePaths[0];

            // 裁剪头像
            uni.navigateTo({
                url: `/pages/me/profile/crop?src=${encodeURIComponent(tempFilePath)}`,
                events: {
                    // 接收裁剪后的头像
                    cropSuccess: (avatar) => {
                        userProfile.avatar = avatar;
                        console.log('头像已更新:', avatar);
                    }
                }
            });
        }
    });
};

// 性别选择变化
const onGenderChange = (e) => {
    userProfile.gender = parseInt(e.detail.value);
    console.log('性别已更新:', userProfile.gender);
};

// 手机号脱敏显示
const maskPhone = (phone) => {
    if (!phone || phone.length !== 11) return phone;
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

// 跳转到更换手机号页面
const navigateToChangePhone = () => {
    uni.navigateTo({
        url: '/pages/me/profile/phone'
    });
};

// 保存用户资料
const saveProfile = () => {
    if (!userProfile.nickname.trim()) {
        uni.showToast({
            title: '请输入昵称',
            icon: 'none'
        });
        return;
    }

    console.log('准备保存用户数据:', userProfile);

    uni.showLoading({
        title: '保存中...'
    });

    // 构造更新后的用户数据
    const updatedUserInfo = {
        ...store.state.user.userInfo,
        avatar: userProfile.avatar,
        name: userProfile.nickname,
        gender: userProfile.gender,
        phone: userProfile.phone,
        bio: userProfile.bio
    };

    setTimeout(() => {
        // 保存到Vuex
        store.commit('user/SET_USER_INFO', updatedUserInfo);
        console.log('保存成功，更新后的用户信息:', updatedUserInfo);

        uni.hideLoading();
        uni.showToast({
            title: '保存成功',
            icon: 'success',
            success: () => {
                setTimeout(() => {
                    uni.navigateBack();
                }, 1500);
            }
        });
    }, 1000);
};

onMounted(() => {
    console.log('页面挂载，初始化用户数据');
    initUserStore();
    fetchUserInfo();
});
</script>

<style lang="scss" scoped>
.profile-container {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 3vw;
    padding-bottom: 20vw;

    .avatar-section {
        padding: 4vw;
        background-color: #fff;
        margin-bottom: 3vw;
        border-radius: 3vw;

        .section-title {
            font-size: 3.8vw;
            color: #333;
            font-weight: 500;
            margin-bottom: 4vw;
        }

        .avatar-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;

            .avatar {
                width: 25vw;
                height: 25vw;
                border-radius: 50%;
                background-color: #f0f0f0;
            }

            .upload-icon {
                position: absolute;
                bottom: 0;
                right: 32.5vw;
                width: 10vw;
                height: 6vw;
                background-color: rgba(0, 0, 0, 0.6);
                border-radius: 3vw;
                display: flex;
                justify-content: center;
                align-items: center;

                .icon-text {
                    color: #fff;
                    font-size: 3vw;
                }
            }
        }
    }

    .form-group {
        background-color: #fff;
        border-radius: 3vw;
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

    .save-btn {
        position: fixed;
        bottom: 5vw;
        left: 5vw;
        right: 5vw;
        height: 12vw;
        background-color: #07c160;
        border-radius: 6vw;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 2px 10px rgba(7, 193, 96, 0.3);

        .btn-text {
            font-size: 4vw;
            color: #fff;
            font-weight: 500;
        }
    }
}
</style>