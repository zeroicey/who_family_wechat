<template>
    <view>
        <view>Hello, this is the community page.</view>
        <button hover-class="button-hover" @click="handleClick">
            click me
        </button>
        <view v-if="posts && posts.length > 0" class="posts-container">
            <view v-for="post in posts" :key="post.cid" class="post-item">
                <view class="post-header">
                    <text class="username">{{ post.username }}</text>
                    <text class="create-time">{{ post.createTime }}</text>
                </view>
                <text class="title">{{ post.title }}</text>
                <text class="content">{{ post.content }}</text>
                <!-- Images can be displayed here if you have a component or logic to handle imgIdList -->
                <view class="post-footer">
                    <text>Likes: {{ post.likeCount }}</text>
                    <text>Comments: {{ post.commentCount }}</text>
                    <text>Views: {{ post.viewCount }}</text>
                </view>
            </view>
        </view>
        <view v-else>
            <text>No posts to display.</text>
        </view>
    </view>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const posts = computed(() => store.getters['community/getPosts']);

const handleClick = async () => {
    await store.dispatch('community/get_first_posts');
}

</script>

<style scoped>
.posts-container {
    margin-top: 20px;
}

.post-item {
    padding: 10px;
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
    /* Added margin for better separation */
}

.post-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    color: #666;
    font-size: 0.9em;
}

.username {
    font-weight: bold;
}

.title {
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 5px;
    display: block;
    /* Ensure title takes full width */
}

.content {
    margin-bottom: 10px;
    display: block;
    /* Ensure content takes full width */
    color: #333;
    line-height: 1.4;
}

.post-footer {
    display: flex;
    justify-content: space-around;
    font-size: 0.9em;
    color: #888;
}
</style>