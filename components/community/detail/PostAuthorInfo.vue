<template>
  <view class="post-author-info-card">
    <view class="author-avatar">
      <!-- 修改 src 绑定到 fetchedAvatarUrl -->
      <image :src="fetchedAvatarUrl" class="avatar-image" />
    </view>
    <view class="author-details">
      <text class="username">{{ post.username }}</text>
      <text class="post-time">{{ formattedTime }}</text>
    </view>
    <!-- 可以添加关注按钮等 -->
    <!-- <button class="follow-btn" size="mini">关注</button> -->
  </view>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue"; // 引入 ref, onMounted, watch
import { formatRelativeTime } from "@/utils/timeFormat.js";
// import { getRandomAvatarUrl } from "@/utils/randomData.js"; // 如果不再使用随机头像，可以移除
import { useStore } from "vuex"; // 引入 useStore

const store = useStore(); // 初始化 store

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const formattedTime = computed(() => {
  return formatRelativeTime(props.post.createTime);
});

// 创建一个 ref 来存储头像 URL
const fetchedAvatarUrl = ref(''); // 初始可以设置一个默认头像或空字符串

// 异步获取头像的函数
const fetchAvatar = async () => {
  // 确保 post 对象和必要的属性存在
  if (props.post && props.post.avaterId && props.post.username) { 
    try {
      const url = await store.dispatch("community/fetch_post_user_avatar", {
        avatarId: props.post.avaterId,
        name: props.post.username,
      });
      fetchedAvatarUrl.value = url; // 更新 ref
    } catch (error) {
      console.error("Failed to fetch avatar in PostAuthorInfo:", error);
      // fetchedAvatarUrl.value = '/static/images/default-avatar.png'; // 加载失败可以设置一个默认头像
    }
  }
};

// 组件挂载时获取头像
onMounted(() => {
  fetchAvatar();
});

// 监听 post prop 的变化，如果 avaterId 或 username 变了，重新获取头像
watch(() => [props.post.avaterId, props.post.username], () => {
  fetchAvatar();
}, { deep: true }); // deep: true 确保内部属性变化也能触发

</script>

<style lang="scss" scoped>
.post-author-info-card {
  display: flex;
  align-items: center;
  padding: 0;
  margin-bottom: 24rpx;
}

.author-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20rpx;
  overflow: hidden;

  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-text {
    color: white;
    font-size: 36rpx;
    font-weight: bold;
  }
}

.author-details {
  flex: 1;
  display: flex;
  flex-direction: column;

  .username {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 4rpx;
  }

  .post-time {
    font-size: 24rpx;
    color: #999;
  }
}

.follow-btn {
  background-color: #f0f0f0;
  color: #666;
  border-radius: 30rpx;
  padding: 0 24rpx;
  font-size: 24rpx;
  height: 50rpx;
  line-height: 50rpx;
  margin-left: auto; // 按钮靠右
  border: 1px solid #e0e0e0;
}
</style>
