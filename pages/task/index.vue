<template>
    <view class="task-container">
        <!-- 头部标题 -->
        <view class="header">
            <text class="title">共 {{ tasks.length }} 个任务</text>
            <text class="subtitle">{{ randomMotivation }}</text>
        </view>

        <!-- 任务列表 -->
        <scroll-view scroll-y class="task-list" :style="{ height: scrollHeight }">
            <!-- 空状态 -->
            <view v-if="tasks.length === 0" class="empty-state">
                <text class="empty-icon">📝</text>
                <text class="empty-text">暂无任务</text>
                <text class="empty-desc">点击下方按钮添加第一个任务吧</text>
            </view>

            <!-- 任务项 -->
            <view v-for="task in tasks" :key="task.id" class="task-item">
                <view class="task-content">
                    <!-- 状态图标 -->
                    <view class="status-icon" :class="{ 'completed': task.status === '已完成' }"
                        @click="toggleTaskStatus(task)">
                        <text v-if="task.status === '已完成'" class="check-icon">✓</text>
                    </view>

                    <!-- 任务标题 -->
                    <text class="task-title" :class="{ 'completed': task.status === '已完成' }">
                        {{ task.title }}
                    </text>
                </view>

                <!-- 删除按钮 -->
                <view class="delete-btn" @click="deleteTask(task.id)">
                    <text class="delete-icon">🗑️</text>
                </view>
            </view>
        </scroll-view>

        <!-- 底部添加任务 -->
        <view class="add-task-section">
            <view class="input-container">
                <input v-model="newTaskTitle" class="task-input" placeholder="输入新任务..." @confirm="addNewTask"
                    confirm-type="done" />
                <view class="add-btn" @click="addNewTask">
                    <text class="add-icon">+</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const tasks = computed(() => store.getters['task/get_tasks']);
const newTaskTitle = ref('');
const scrollHeight = ref('calc(100vh - 200rpx)');

// 激励语句数组
const motivationalQuotes = [
    '每完成一个任务，都是向目标迈进的一步 💪',
    '今天的努力，是明天成功的基石 ✨',
    '坚持不懈，成功就在前方 🌟',
    '每一个小目标的达成，都值得庆祝 🎉',
    '行动是治愈恐惧的良药 🚀',
    '专注当下，成就未来 🎯',
    '进步不在于速度，而在于方向 🧭',
    '今天比昨天更好一点点 📈',
    '相信自己，你比想象中更强大 💎',
    '每一次努力都不会白费 🌱',
    '成功源于日复一日的坚持 ⭐',
    '梦想不会逃跑，逃跑的永远是自己 🏃‍♂️',
    '优秀是一种习惯，坚持是一种品格 🏆',
    '今天的汗水，是明天的收获 🌾',
    '做最好的自己，成就最美的人生 🌈'
];

// 随机激励语句
const randomMotivation = computed(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    return motivationalQuotes[randomIndex];
});


// 切换任务状态
const toggleTaskStatus = async (task) => {
    try {
        if (task.status === '已完成') {
            await store.dispatch('task/mark_task_todo', task.id);
            uni.showToast({
                title: '已标记为待完成',
                icon: 'none'
            });
        } else {
            await store.dispatch('task/mark_task_done', task.id);
            uni.showToast({
                title: '任务已完成！',
                icon: 'success'
            });
        }
    } catch (error) {
        uni.showToast({
            title: '操作失败',
            icon: 'none'
        });
    }
};

// 删除任务
const deleteTask = async (taskId) => {
    uni.showModal({
        title: '确认删除',
        content: '确定要删除这个任务吗？',
        success: async (res) => {
            if (res.confirm) {
                try {
                    await store.dispatch('task/delete_task', taskId);
                    uni.showToast({
                        title: '删除成功',
                        icon: 'success'
                    });
                } catch (error) {
                    uni.showToast({
                        title: '删除失败',
                        icon: 'none'
                    });
                }
            }
        }
    });
};

// 添加新任务
const addNewTask = async () => {
    if (!newTaskTitle.value.trim()) {
        uni.showToast({
            title: '请输入任务内容',
            icon: 'none'
        });
        return;
    }

    try {
        const newTask = {
            id: Date.now(), // 临时ID，实际应该由后端生成
            title: newTaskTitle.value.trim(),
            status: '待完成'
        };

        await store.dispatch('task/add_task', newTask);
        newTaskTitle.value = '';

        uni.showToast({
            title: '添加成功',
            icon: 'success'
        });
    } catch (error) {
        uni.showToast({
            title: '添加失败',
            icon: 'none'
        });
    }
};
</script>

<style lang="scss" scoped>
.task-container {
    height: 100vh;
    background-color: #f5f7fa;
    display: flex;
    flex-direction: column;
}

.header {
    padding: 40rpx 30rpx 20rpx;
    background-color: #ffffff;
    border-bottom: 1px solid #f0f0f0;

    .title {
        font-size: 44rpx;
        font-weight: bold;
        color: #333;
        display: block;
        margin-bottom: 10rpx;
    }

    .subtitle {
        font-size: 28rpx;
        color: #666;
    }
}

.task-list {
    flex: 1;
    padding: 20rpx;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 40rpx;

    .empty-icon {
        font-size: 80rpx;
        margin-bottom: 20rpx;
    }

    .empty-text {
        font-size: 32rpx;
        color: #666;
        margin-bottom: 10rpx;
    }

    .empty-desc {
        font-size: 26rpx;
        color: #999;
    }
}

.task-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    padding: 30rpx 25rpx;
    margin-bottom: 20rpx;
    border-radius: 16rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);

    .task-content {
        display: flex;
        align-items: center;
        flex: 1;

        .status-icon {
            width: 44rpx;
            height: 44rpx;
            border: 3rpx solid #ddd;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 20rpx;
            transition: all 0.3s;

            &.completed {
                background-color: #52c41a;
                border-color: #52c41a;

                .check-icon {
                    color: #ffffff;
                    font-size: 24rpx;
                    font-weight: bold;
                }
            }
        }

        .task-title {
            font-size: 32rpx;
            color: #333;
            flex: 1;
            transition: all 0.3s;

            &.completed {
                color: #999;
                text-decoration: line-through;
            }
        }
    }

    .delete-btn {
        padding: 10rpx;

        .delete-icon {
            font-size: 32rpx;
        }
    }
}

.add-task-section {
    background-color: #ffffff;
    padding: 30rpx;
    border-top: 1px solid #f0f0f0;

    .input-container {
        display: flex;
        align-items: center;
        background-color: #f8f9fa;
        border-radius: 50rpx;
        padding: 8rpx;

        .task-input {
            flex: 1;
            padding: 20rpx 30rpx;
            font-size: 30rpx;
            background-color: transparent;
            border: none;
            outline: none;
        }

        .add-btn {
            width: 70rpx;
            height: 70rpx;
            background: linear-gradient(135deg, #1890ff, #36a6ff);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;

            .add-icon {
                color: #ffffff;
                font-size: 36rpx;
                font-weight: bold;
            }
        }
    }
}
</style>