<template>
    <view class="login-container">
        <!-- 背景组件 -->
        <login-background startColor="#3498db" endColor="#1abc9c" height="50vh" />

        <!-- 顶部标题组件 -->
        <login-header logoSrc="/static/images/logo.png" appName="互成一家" appSlogan="校园互助与成长平台" />

        <!-- 加载动画组件 -->
        <login-loading v-if="isLoading" loadingText="正在加载中..." />

        <!-- 登录内容区 -->
        <view class="content-container" v-else>
            <!-- 项目介绍组件 -->
            <login-intro />

            <!-- 登录表单组件 -->
            <login-form @wechat-login="handleWechatLogin" @agreement="handleUserAgreement"
                @privacy="handlePrivacyPolicy" />
        </view>

        <!-- 底部版权信息组件 -->
        <login-footer copyright="© 2025 互成一家 - 校园互助与成长平台" />
    </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';

// 导入组件
import LoginBackground from '../components/login/LoginBackground.vue';
import LoginHeader from '../components/login/LoginHeader.vue';
import LoginLoading from '../components/login/LoginLoading.vue';
import LoginForm from '../components/login/LoginForm.vue';
import LoginIntro from '../components/login/LoginIntro.vue';
import LoginFooter from '../components/login/LoginFooter.vue';

const store = useStore()

// 加载状态
const isLoading = ref(true);

// 登录加载状态
const loginLoading = computed(() => store.getters['user/loginLoading']);

// 页面加载时模拟加载过程
onMounted(() => {
    // 模拟加载过程，1.5秒后显示登录表单
    setTimeout(() => {
        isLoading.value = false;
    }, 1500);
});

// 处理微信登录
const handleWechatLogin = async () => {
    try {
        await store.dispatch('user/wechatLogin');

        // 登录成功提示
        uni.showToast({
            title: '登录成功',
            icon: 'success',
            mask: true,
            duration: 1000 // 设置较长时间，登录成功后会被关闭
        });

        // 跳转到首页
        uni.reLaunch({
            url: '/pages/home/index'
        });

    } catch (error) {
        // 登录失败提示
        uni.showToast({
            title: error.message || '微信登录失败，请稍后再试',
            icon: 'none'
        });
        console.error('微信登录失败', error);
    }
};

// 处理用户协议点击
const handleUserAgreement = () => {
    uni.navigateTo({
        url: '/pages/agreement/user'
    });
};

// 处理隐私政策点击
const handlePrivacyPolicy = () => {
    uni.navigateTo({
        url: '/pages/agreement/privacy'
    });
};</script>

<style lang="scss">
.login-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 0 5vw;
    box-sizing: border-box;
    background-color: #f8f9fa;
}

.content-container {
    position: relative;
    width: 90vw;
    background-color: #fff;
    border-radius: 4vw;
    padding: 6vw;
    margin-top: 5vw;
    box-shadow: 0 1vw 3vw rgba(0, 0, 0, 0.05);
    z-index: 2;
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10vw);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>