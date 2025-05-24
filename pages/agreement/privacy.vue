<template>
    <view class="privacy-container">
        <!-- 内容区域 -->
        <scroll-view class="content" scroll-y>
            <view class="section">
                <view class="section-title">引言</view>
                <view class="section-content">
                    <text
                        class="paragraph">欢迎使用"互成一家"小程序（以下简称"本小程序"）。本小程序由【运营方名称】（以下简称"我们"）提供。我们非常重视您的个人信息和隐私保护。本隐私政策旨在向您说明我们如何收集、使用、存储、共享和保护您的个人信息，以及您享有的相关权利。</text>
                    <text class="paragraph">请您在使用本小程序前，仔细阅读并了解本隐私政策的全部内容。如您对本隐私政策有任何疑问，可通过本隐私政策中的联系方式与我们联系。</text>
                </view>
            </view>

            <view class="section">
                <view class="section-title">我们收集的信息</view>
                <view class="section-content">
                    <text class="paragraph">为了向您提供校园互助与成长平台服务，我们可能会收集以下信息：</text>
                    <view class="list-item">1. <text class="bold">账号信息：</text>当您注册和使用本小程序时，我们会收集您的微信账号信息，包括微信昵称、头像等。
                    </view>
                    <view class="list-item">2. <text class="bold">个人资料：</text>您在使用本小程序过程中主动提供的个人资料，如学校、专业、年级等信息。</view>
                    <view class="list-item">3. <text class="bold">使用记录：</text>您使用本小程序的操作记录、浏览历史、搜索记录等信息。</view>
                    <view class="list-item">4. <text class="bold">设备信息：</text>设备型号、操作系统版本、设备识别码、IP地址等信息。</view>
                    <view class="list-item">5. <text class="bold">位置信息：</text>经您授权后，我们可能会收集您的位置信息，以便为您提供基于位置的服务。</view>
                </view>
            </view>

            <view class="section">
                <view class="section-title">信息的使用</view>
                <view class="section-content">
                    <text class="paragraph">我们使用收集的信息用于以下目的：</text>
                    <view class="list-item">1. 提供、维护和改进本小程序的服务；</view>
                    <view class="list-item">2. 验证您的身份，防止欺诈和提高安全性；</view>
                    <view class="list-item">3. 处理您在本小程序中的请求和交易；</view>
                    <view class="list-item">4. 向您推送可能感兴趣的内容和活动；</view>
                    <view class="list-item">5. 分析用户行为，优化用户体验；</view>
                    <view class="list-item">6. 遵守法律法规的要求。</view>
                </view>
            </view>

            <view class="section">
                <view class="section-title">信息的共享</view>
                <view class="section-content">
                    <text class="paragraph">除以下情况外，我们不会与任何第三方共享您的个人信息：</text>
                    <view class="list-item">1. 获得您的明确同意；</view>
                    <view class="list-item">2. 为完成合并、收购或资产转让而必须转移的；</view>
                    <view class="list-item">3. 为遵守适用的法律法规、法律程序或政府强制性要求；</view>
                    <view class="list-item">4. 为维护我们或其他用户的合法权益。</view>
                </view>
            </view>

            <view class="section">
                <view class="section-title">联系我们</view>
                <view class="section-content">
                    <text class="paragraph">如果您对本隐私政策有任何疑问、意见或建议，请通过以下方式与我们联系：</text>
                    <view class="contact-info">
                        <view>电子邮件：privacy@whofamily.com</view>
                        <view>联系电话：17727316901</view>
                        <view>联系地址：佛山市南海区信息大道中互成一家传媒公司</view>
                    </view>
                </view>
            </view>

            <view class="footer">
                <text>本隐私政策更新日期：2025年4月22日</text>
                <br />
                <text>生效日期：2025年4月22日</text>
            </view>
        </scroll-view>
    </view>
</template>

<script setup>
const handleBack = () => {
    uni.navigateBack();
};
</script>

<style lang="scss" scoped>
.privacy-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f8f9fa;
}

.nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 12vw;
    padding: 0 4vw;
    background-color: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    position: relative;
    z-index: 10;

    .back-icon {
        width: 8vw;
        height: 8vw;
        display: flex;
        align-items: center;
        justify-content: center;

        .iconfont {
            font-size: 5vw;
            color: #333;
        }
    }

    .title {
        font-size: 4.5vw;
        font-weight: 500;
        color: #333;
    }

    .placeholder {
        width: 8vw;
    }
}

.content {
    flex: 1;
    padding: 4vw;
    box-sizing: border-box;
}

.section {
    margin-bottom: 6vw;
    background-color: #fff;
    border-radius: 3vw;
    padding: 4vw;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    .section-title {
        font-size: 4.5vw;
        font-weight: 600;
        color: #333;
        margin-bottom: 3vw;
        position: relative;
        padding-left: 3vw;

        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 1vw;
            height: 4vw;
            background-color: #3498db;
            border-radius: 0.5vw;
        }
    }

    .section-content {
        color: #666;
        font-size: 3.8vw;
        line-height: 1.6;
    }

    .paragraph {
        display: block;
        margin-bottom: 2vw;
    }

    .list-item {
        margin-bottom: 2vw;
        padding-left: 2vw;
    }

    .bold {
        font-weight: 600;
        color: #333;
    }

    .contact-info {
        margin-top: 2vw;
        padding: 3vw;
        background-color: #f8f9fa;
        border-radius: 2vw;
        font-size: 3.6vw;
        line-height: 1.8;
    }
}

.footer {
    text-align: center;
    padding: 4vw 0;
    color: #999;
    font-size: 3.2vw;
    line-height: 1.6;
}
</style>