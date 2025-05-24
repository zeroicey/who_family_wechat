<template>
    <view class="settings-container">
        <view class="settings-content">
            <SettingGroup title="账号设置">
                <SettingItem label="账号安全" showArrow @tap="navigateTo('/pages/me/settings/security')" />
                <SettingItem label="隐私设置" showArrow @tap="navigateTo('/pages/me/settings/privacy')" />
            </SettingGroup>

            <SettingGroup title="通知设置">
                <SettingItem label="推送通知" type="switch" :checked="notificationSettings.push"
                    @switch-change="togglePushNotification" />
                <SettingItem label="新消息通知" type="switch" :checked="notificationSettings.message"
                    @switch-change="toggleMessageNotification" />
                <SettingItem label="营销活动提醒" type="switch" :checked="notificationSettings.marketing"
                    @switch-change="toggleMarketingNotification" />
            </SettingGroup>

            <SettingGroup title="通用">
                <SettingItem label="清除缓存" :value="cacheSize" showArrow @tap="clearCache" />
                <SettingItem label="检查更新" :value="`当前版本 ${appVersion}`" showArrow @tap="checkUpdate" />
                <SettingItem label="关于我们" showArrow @tap="navigateTo('/pages/me/settings/about')" />
                <SettingItem label="用户协议" showArrow @tap="navigateTo('/pages/me/settings/agreement')" />
                <SettingItem label="隐私政策" showArrow @tap="navigateTo('/pages/me/settings/privacy-policy')" />
            </SettingGroup>

            <view class="logout-btn" @tap="logout">
                <text class="btn-text">退出登录</text>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useStore } from 'vuex';
// 引入组件
import SettingGroup from '@/components/me/settings/SettingGroup.vue';
import SettingItem from '@/components/me/settings/SettingItem.vue';

const store = useStore();

// 应用版本
const appVersion = ref('1.0.0');

// 缓存大小
const cacheSize = ref('0MB');

// 通知设置
const notificationSettings = reactive({
    push: true,
    message: true,
    marketing: false
});

// 切换推送通知
const togglePushNotification = (value) => {
    notificationSettings.push = value;
    saveNotificationSettings();
};

// 切换消息通知
const toggleMessageNotification = (value) => {
    notificationSettings.message = value;
    saveNotificationSettings();
};

// 切换营销通知
const toggleMarketingNotification = (value) => {
    notificationSettings.marketing = value;
    saveNotificationSettings();
};

// 保存通知设置
const saveNotificationSettings = () => {
    try {
        uni.setStorageSync('notificationSettings', JSON.stringify(notificationSettings));
        uni.showToast({
            title: '设置已保存',
            icon: 'success'
        });
    } catch (e) {
        console.error('保存设置失败', e);
    }
};

// 清除缓存
const clearCache = () => {
    uni.showModal({
        title: '提示',
        content: '确定要清除缓存吗？',
        success: (res) => {
            if (res.confirm) {
                // 模拟清除缓存
                uni.showLoading({
                    title: '清除中...'
                });

                setTimeout(() => {
                    uni.hideLoading();
                    cacheSize.value = '0MB';
                    uni.showToast({
                        title: '清除成功',
                        icon: 'success'
                    });
                }, 1000);
            }
        }
    });
};

// 检查更新
const checkUpdate = () => {
    uni.showLoading({
        title: '检查中...'
    });

    setTimeout(() => {
        uni.hideLoading();
        uni.showModal({
            title: '检查更新',
            content: '当前已是最新版本',
            showCancel: false
        });
    }, 1000);
};

// 退出登录
const logout = () => {
    uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
            if (res.confirm) {
                // 清除用户信息并跳转到登录页
                store.dispatch('user/logout').then(() => {
                    uni.reLaunch({
                        url: '/pages/login/index'
                    });
                });
            }
        }
    });
};

// 跳转到指定页面
const navigateTo = (url) => {
    uni.navigateTo({ url });
};

// 返回上一页
const navigateBack = () => {
    uni.navigateBack();
};

onMounted(() => {
    // 模拟获取缓存大小
    setTimeout(() => {
        cacheSize.value = '28.5MB';
    }, 500);

    // 从本地缓存读取通知设置
    try {
        const savedSettings = uni.getStorageSync('notificationSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            Object.assign(notificationSettings, settings);
        }
    } catch (e) {
        console.error('读取设置失败', e);
    }
});
</script>

<style lang="scss" scoped>
.settings-container {
    min-height: 100vh;
    background-color: #f5f5f5;

    .settings-content {
        padding: 3vw;
    }

    .logout-btn {
        margin: 10vw 0;
        height: 12vw;
        background-color: #ff6b6b;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;

        .btn-text {
            font-size: 4vw;
            color: #fff;
            font-weight: 500;
        }
    }
}
</style>