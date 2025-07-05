<template>
    <view class="feedback-page">
        <view class="header-bg">
            <view class="circle1"></view>
            <view class="circle2"></view>
            <view class="circle3"></view>
        </view>
        <view class="header">
            <text class="title">倾听您的声音</text>
            <text class="subtitle">您的每一个建议，都是我们成长的动力</text>
        </view>

        <view class="form-card">
            <view class="form-item">
                <view class="label-container">
                    <uni-icons type="compose" size="20" color="#007aff"></uni-icons>
                    <text class="label required">反馈类型</text>
                </view>
                <view class="feedback-types">
                    <text v-for="(type, index) in feedbackTypes" :key="index"
                        :class="['type-tag', { active: feedbackForm.type === type }]"
                        @click="feedbackForm.type = type">{{ type }}</text>
                </view>
            </view>

            <view class="form-item">
                <view class="label-container">
                    <uni-icons type="chat-filled" size="20" color="#007aff"></uni-icons>
                    <text class="label required">反馈内容</text>
                </view>
                <textarea class="textarea-field" v-model="feedbackForm.content" placeholder="请详细描述您遇到的问题或建议..."
                    maxlength="500"></textarea>
                <text class="char-counter">{{ feedbackForm.content.length }}/500</text>
            </view>

            <view class="form-item">
                <view class="label-container">
                    <uni-icons type="camera-filled" size="20" color="#007aff"></uni-icons>
                    <text class="label">截图凭证</text>
                </view>
                <uni-file-picker limit="3" title="最多选择3张图片" v-model="feedbackForm.images"></uni-file-picker>
            </view>

            <view class="form-item">
                <view class="label-container">
                    <uni-icons type="person-filled" size="20" color="#007aff"></uni-icons>
                    <text class="label">联系方式</text>
                </view>
                <input class="input-field" v-model="feedbackForm.contact" placeholder="选填，便于我们与您联系（手机/QQ/微信）" />
            </view>
        </view>

        <view class="faq-card">
            <view class="label-container">
                <uni-icons type="help-filled" size="20" color="#007aff"></uni-icons>
                <text class="label">常见问题</text>
            </view>
            <view class="faq-item">Q: 为什么我的订单一直没人接？</view>
            <view class="faq-item">Q: 如何申请成为骑手？</view>
            <view class="faq-item">Q: 优惠券如何使用？</view>
        </view>

        <view class="action-bar">
            <button class="submit-button" @click="submitFeedback">提交反馈</button>
        </view>
    </view>
</template>

<script setup>
import { ref, reactive } from 'vue';

const feedbackTypes = ['功能建议', '界面优化', '程序BUG', '其他问题'];

const feedbackForm = reactive({
    type: '功能建议',
    content: '',
    images: [],
    contact: ''
});

const submitFeedback = () => {
    if (!feedbackForm.content) {
        uni.showToast({
            title: '反馈内容不能为空哦',
            icon: 'none'
        });
        return;
    }

    uni.showLoading({
        title: '正在提交...'
    });

    // 模拟提交
    setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
            title: '感谢您的反馈！',
            icon: 'success',
            duration: 2000
        });

        // 提交成功后返回上一页
        setTimeout(() => {
            uni.navigateBack();
        }, 2000);
    }, 1500);
};
</script>

<style lang="scss" scoped>
.feedback-page {
    background-color: #f8f9fa;
    min-height: 100vh;
    padding: 40rpx 30rpx 160rpx;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;

    .header-bg {
        position: absolute;
        top: -150rpx;
        left: -100rpx;
        width: 200%;
        height: 400rpx;
        z-index: 0;

        .circle1,
        .circle2,
        .circle3 {
            position: absolute;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(0, 122, 255, 0.1), rgba(0, 198, 255, 0.1));
            animation: float 6s ease-in-out infinite;
        }

        .circle1 {
            width: 300rpx;
            height: 300rpx;
            top: 50rpx;
            left: 10%;
            animation-delay: 0s;
        }

        .circle2 {
            width: 200rpx;
            height: 200rpx;
            top: 150rpx;
            left: 40%;
            animation-delay: 2s;
        }

        .circle3 {
            width: 150rpx;
            height: 150rpx;
            top: 80rpx;
            left: 70%;
            animation-delay: 4s;
        }
    }

    .header {
        display: flex;
        flex-direction: column;
        margin-bottom: 40rpx;
        position: relative;
        z-index: 1;

        .title {
            font-size: 52rpx;
            font-weight: bold;
            color: #333;
        }

        .subtitle {
            font-size: 28rpx;
            color: #666;
            margin-top: 15rpx;
        }
    }

    .form-card,
    .faq-card {
        background-color: #ffffff;
        border-radius: 24rpx;
        padding: 20rpx 30rpx;
        box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.06);
        position: relative;
        z-index: 1;
        margin-bottom: 50rpx;
    }

    .form-item {
        padding: 30rpx 0;
        border-bottom: 1rpx solid #f0f0f0;

        &:last-child {
            border-bottom: none;
        }
    }

    .label-container {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;

        .uni-icons {
            margin-right: 12rpx;
        }

        .label {
            font-size: 30rpx;
            color: #333;
            font-weight: 500;

            &.required::after {
                content: '*';
                color: #fa3534;
                margin-left: 8rpx;
            }
        }
    }

    .feedback-types {
        display: flex;
        flex-wrap: wrap;
        gap: 20rpx;

        .type-tag {
            background-color: #f0f0f0;
            color: #555;
            padding: 12rpx 24rpx;
            border-radius: 30rpx;
            font-size: 26rpx;
            transition: all 0.3s ease;

            &.active {
                background-color: #007aff;
                color: #ffffff;
                font-weight: bold;
            }
        }
    }

    .textarea-field {
        width: 100%;
        height: 240rpx;
        background-color: #f8f8f8;
        border-radius: 10rpx;
        padding: 20rpx;
        font-size: 28rpx;
        box-sizing: border-box;
        color: #333;
    }

    .char-counter {
        text-align: right;
        font-size: 24rpx;
        color: #999;
        margin-top: 10rpx;
    }

    .input-field {
        width: 100%;
        height: 80rpx;
        background-color: #f8f8f8;
        border-radius: 10rpx;
        padding: 0 20rpx;
        font-size: 28rpx;
        box-sizing: border-box;
        color: #333;
    }
}

.faq-card {
    .faq-item {
        font-size: 28rpx;
        color: #555;
        padding: 15rpx 0;
        border-bottom: 1rpx solid #f5f5f5;

        &:last-child {
            border-bottom: none;
        }
    }
}

.action-bar {
    padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    z-index: 100;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #ffffff;
    padding: 20rpx 30rpx;
    padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);

    .submit-button {
        width: 100%;
        height: 88rpx;
        line-height: 88rpx;
        background: linear-gradient(90deg, #007aff, #00c6ff);
        color: #ffffff;
        border-radius: 44rpx;
        font-size: 32rpx;
        text-align: center;
        box-shadow: 0 8rpx 20rpx rgba(0, 122, 255, 0.3);
        border: none;

        &::after {
            border: none;
        }
    }
}

@keyframes float {
    0% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-20px);
    }

    100% {
        transform: translateY(0px);
    }
}
</style>