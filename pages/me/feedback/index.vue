<template>
    <view class="feedback-container">
        <scroll-view class="feedback-scroll" scroll-y>
            <view class="feedback-content">
                <!-- 顶部提示 -->
                <view class="feedback-hint">
                    <image class="hint-icon" src="/static/images/feedback/hint.png" mode="aspectFit"></image>
                    <text class="hint-text">感谢您的反馈，我们会认真对待每一条建议！</text>
                </view>

                <!-- 反馈类型选择 -->
                <FeedbackTypeSelector v-model="selectedType" />

                <!-- 反馈内容输入 -->
                <FeedbackContentInput v-model="feedbackContent" :maxLength="500" />

                <!-- 联系方式输入 -->
                <ContactInput v-model="contactInfo" />

                <!-- 图片上传 -->
                <ImageUploader v-model="uploadedImages" :maxCount="3" />
            </view>
        </scroll-view>

        <!-- 底部操作按钮 -->
        <view class="submit-wrapper">
            <!-- 历史反馈按钮 -->
            <view class="history-btn" @tap="navigateToHistory">
                <image class="history-icon" src="/static/images/feedback/history.png" mode="aspectFit"></image>
                <text class="history-text">查看历史反馈</text>
            </view>
            
            <!-- 提交按钮 -->
            <button class="submit-btn" :class="{ 'disabled': !isFormValid }" :disabled="!isFormValid || submitting"
                @tap="submitFeedback">
                <view class="btn-content">
                    <text class="btn-text" v-if="!submitting">提交反馈</text>
                    <view class="loading-spinner" v-else></view>
                </view>
            </button>
        </view>
    </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
// 导入组件
import FeedbackTypeSelector from '@/components/me/feedback/FeedbackTypeSelector.vue';
import FeedbackContentInput from '@/components/me/feedback/FeedbackContentInput.vue';
import ContactInput from '@/components/me/feedback/ContactInput.vue';
import ImageUploader from '@/components/me/feedback/ImageUploader.vue';

// 初始化store
const store = useStore();

// 选中的反馈类型
const selectedType = ref('');

// 反馈内容
const feedbackContent = ref('');

// 联系方式
const contactInfo = ref('');

// 上传的图片
const uploadedImages = ref([]);

// 提交状态 - 从store获取
const submitting = computed(() => store.getters['feedback/submitting']);

// 表单是否有效
const isFormValid = computed(() => {
    return selectedType.value && feedbackContent.value.trim().length > 0;
});

// 提交反馈
const submitFeedback = async () => {
    if (!isFormValid.value || submitting.value) {
        uni.showToast({
            title: '请填写反馈类型和内容',
            icon: 'none'
        });
        return;
    }

    // 构建提交数据
    const formData = {
        type: selectedType.value,
        content: feedbackContent.value,
        contact: contactInfo.value,
        images: uploadedImages.value,
        submitTime: new Date().toISOString()
    };

    try {
        // 通过store提交反馈
        await store.dispatch('feedback/submitFeedback', formData);
        
        uni.showModal({
            title: '提交成功',
            content: '感谢您的宝贵反馈，我们会尽快处理！',
            showCancel: false,
            success: () => {
                // 重置表单
                selectedType.value = '';
                feedbackContent.value = '';
                contactInfo.value = '';
                uploadedImages.value = [];

                // 返回上一页
                uni.navigateBack();
            }
        });
    } catch (error) {
        uni.showToast({
            title: error.message || '提交失败，请稍后再试',
            icon: 'none',
            duration: 2000
        });
    }
};

// 返回上一页
const navigateBack = () => {
    uni.navigateBack();
};

// 跳转到历史反馈页面
const navigateToHistory = () => {
    uni.navigateTo({
        url: '/pages/me/feedback/history'
    });
};
</script>

<style lang="scss" scoped>
.feedback-container {
    min-height: 100vh;
    background-color: #f7f8fa;
    display: flex;
    flex-direction: column;


    .feedback-scroll {
        flex: 1;
        height: calc(100vh - 24vw);
        /* 减去头部和底部按钮的高度 */
    }

    .feedback-content {
        padding: 5vw;

        .feedback-hint {
            display: flex;
            align-items: center;
            background-color: #f0f9ff;
            padding: 3vw 4vw;
            border-radius: 3vw;
            margin-bottom: 6vw;

            .hint-icon {
                width: 6vw;
                height: 6vw;
                margin-right: 3vw;
            }

            .hint-text {
                font-size: 3.5vw;
                color: #2196f3;
                line-height: 1.5;
            }
        }
    }

    .submit-wrapper {
        padding: 3vw 5vw;
        background-color: #fff;
        box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-direction: column;
        
        // 历史反馈按钮
        .history-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 3vw;
            padding: 2vw 0;
            
            .history-icon {
                width: 5vw;
                height: 5vw;
                margin-right: 2vw;
            }
            
            .history-text {
                font-size: 3.5vw;
                color: #1890ff;
            }
        }

        .submit-btn {
            width: 100%;
            height: 12vw;
            background: linear-gradient(135deg, #07c160, #10ad7a);
            border-radius: 6vw;
            display: flex;
            justify-content: center;
            align-items: center;
            border: none;
            position: relative;
            overflow: hidden;
            box-shadow: 0 3px 8px rgba(7, 193, 96, 0.3);
            transition: all 0.3s ease;

            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(rgba(255, 255, 255, 0.2), transparent);
                clip-path: polygon(0 0, 100% 0, 100% 30%, 0 70%);
            }

            &:active {
                transform: translateY(1px);
                box-shadow: 0 2px 5px rgba(7, 193, 96, 0.2);
            }

            &.disabled {
                background: #c0c0c0;
                box-shadow: none;
                opacity: 0.8;
            }

            .btn-content {
                display: flex;
                justify-content: center;
                align-items: center;

                .btn-text {
                    font-size: 4.2vw;
                    color: #fff;
                    font-weight: 500;
                    letter-spacing: 0.5vw;
                }

                .loading-spinner {
                    width: 5vw;
                    height: 5vw;
                    border: 0.8vw solid rgba(255, 255, 255, 0.3);
                    border-top: 0.8vw solid #fff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }

                    100% {
                        transform: rotate(360deg);
                    }
                }
            }
        }
    }
}
</style>