<template>
    <view class="task-container">
        <!-- 顶部区域 -->
        <view class="top-section">
            <!-- 添加任务区域 -->
            <view class="add-task-section top-add-task">
                <view class="input-container">
                    <input v-model="newTaskTitle" class="task-input" placeholder="输入新任务，回车即可添加" @confirm="addNewTask"
                        confirm-type="done" maxlength="50" />
                    <view class="add-btn" @click="addNewTask">
                        <text class="add-icon">+</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 激励语 -->
        <view class="motivation-section">
            <text class="subtitle">{{ randomMotivation }}</text>
        </view>

        <!-- 任务列表 -->
        <scroll-view scroll-y class="task-list" :style="{ height: scrollHeight }">
            <!-- 空状态 -->
            <view v-if="tasks.length === 0" class="empty-state">
                <image class="empty-image" src="/static/images/community/no-data.png" mode="aspectFit"></image>
                <text class="empty-text">还没有任务哦，快添加一个吧！</text>
            </view>

            <!-- 任务项 -->
                        <view v-for="task in tasks" :key="task.id" class="task-item" :class="{ 'completed-item': task.status === '已完成' }" @click="showTaskDetail(task)">
                <view class="task-content">
                    <!-- 状态图标 -->
                    <view class="status-icon" :class="{ 'completed': task.status === '已完成' }"
                        @click.stop="toggleTaskStatus(task)">
                        <text v-if="task.status === '已完成'" class="check-icon">✓</text>
                    </view>

                    <!-- 任务标题 -->
                    <text class="task-title" :class="{ 'completed': task.status === '已完成' }">
                        {{ task.title }}
                    </text>
                </view>

                <!-- 删除按钮 -->
                <view class="delete-btn" @click.stop="deleteTask(task.id)">
                    <text class="delete-icon">×</text> <!-- 使用更简洁的删除图标 -->
                </view>
            </view>
        </scroll-view>

        <!-- 任务详情模态框 -->
        <view v-if="isModalVisible" class="modal-overlay" @click="closeModal">
            <view class="modal-content" @click.stop>
                <view class="modal-header">
                    <text class="modal-title">任务详情</text>
                    <text class="close-btn" @click="closeModal">×</text>
                </view>
                <view class="modal-body">
                    <view class="detail-item">
                        <text class="detail-label">内容:</text>
                        <text class="detail-value">{{ selectedTask.title }}</text>
                    </view>
                    <view class="detail-item">
                        <text class="detail-label">状态:</text>
                        <text class="detail-value">{{ selectedTask.status }}</text>
                    </view>
                    <view class="detail-item">
                        <text class="detail-label">创建时间:</text>
                        <text class="detail-value">{{ selectedTask.createTime }}</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTaskStore } from "@/stores/task";
const taskStore = useTaskStore();

const tasks = computed(() => taskStore.get_tasks);
const newTaskTitle = ref('');
const scrollHeight = ref('calc(100vh - 280rpx)'); // 重新调整高度，考虑激励语区域
const isModalVisible = ref(false);
const selectedTask = ref(null);

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
// 显示任务详情
const showTaskDetail = (task) => {
    selectedTask.value = task;
    isModalVisible.value = true;
};

// 关闭模态框
const closeModal = () => {
    isModalVisible.value = false;
    selectedTask.value = null;
};

const randomMotivation = computed(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    return motivationalQuotes[randomIndex];
});

// 切换任务状态
const toggleTaskStatus = async (task) => {
    try {
        if (task.status === '已完成') {
            await taskStore.mark_task_todo( task.id);
            uni.showToast({
                title: '已标记为待完成',
                icon: 'none'
            });
        } else {
            await taskStore.mark_task_done( task.id);
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
                    await taskStore.delete_task( taskId);
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
    const trimmedTitle = newTaskTitle.value.trim();
    if (!trimmedTitle) {
        uni.showToast({
            title: '请输入任务内容',
            icon: 'none'
        });
        return;
    }

    if (trimmedTitle.length > 50) {
        uni.showToast({
            title: '任务内容不能超过50个字',
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

        await taskStore.add_task( newTask);
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
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background-color: #fff;
    padding: 40rpx;
    border-radius: 20rpx;
    width: 80%;
    max-width: 600rpx;
    box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    padding-bottom: 20rpx;
    border-bottom: 1px solid #f0f0f0;
}

.modal-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
}

.close-btn {
    font-size: 50rpx; // 增大图标
    color: #999;
    cursor: pointer;
    padding: 10rpx; // 增大点击区域
}

.modal-body {
    font-size: 30rpx;
}

.detail-item {
    display: flex;
    margin-bottom: 20rpx;
}

.detail-label {
    font-weight: bold;
    color: #555;
    width: 150rpx;
}

.detail-value {
    color: #333;
    flex: 1;
    word-break: break-all;
}
.task-container {
    height: 100vh;
    background-color: #f4f6f8; // 更柔和的背景色
    display: flex;
    flex-direction: column;
}

.top-section {
    background-color: #f4f6f8; // 顶部区域统一背景色
    padding: 20rpx 30rpx; // 调整内边距
}

.header {
    // padding: 25rpx 30rpx 20rpx; // 移除独立内边距，由top-section控制
    background-color: #f4f6f8; // 与容器背景色一致
    text-align: center; // 标题居中
    // margin-bottom: 20rpx; // 移除，因为激励语现在独立了

    .title {
        font-size: 40rpx; // 增大标题字号
        font-weight: bold;
        color: #2c3e50; // 更深的标题颜色
        display: block;
        margin-bottom: 10rpx;
    }

    .subtitle {
        font-size: 28rpx; // 增大副标题字号
        color: #7f8c8d; // 更柔和的副标题颜色
    }
}

.motivation-section {
    padding: 20rpx 30rpx;
    text-align: center;
    background-color: #f4f6f8; // 与页面背景一致
    .subtitle {
        font-size: 28rpx;
        color: #7f8c8d;
    }
}

.add-task-section.top-add-task {
    background-color: transparent; // 输入区域背景透明，融入top-section
    padding: 0; // 移除独立内边距

    .input-container {
        display: flex;
        align-items: center;
        background-color: #ffffff; // 输入框容器使用白色背景
        border-radius: 40rpx; // 更圆润的边角
        padding: 10rpx 15rpx; // 调整内边距
        box-shadow: 0 3rpx 10rpx rgba(0, 0, 0, 0.07); // 给输入框容器更明显的阴影

        .task-input {
            flex: 1;
            padding: 18rpx 25rpx;
            font-size: 28rpx; // 调整字体大小
            color: #333;
            background-color: transparent;
            border: none;
            outline: none;
            &::placeholder {
                color: #adb5bd;
            }
        }

        .add-btn {
            width: 60rpx; // 调整按钮大小
            height: 60rpx;
            background: linear-gradient(135deg, #007bff, #0056b3); // 更专业的蓝色渐变
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s ease;

            &:active {
                background: linear-gradient(135deg, #0056b3, #003d80);
            }

            .add-icon {
                color: #ffffff;
                font-size: 32rpx;
                font-weight: bold;
            }
        }
    }
}

.task-list {
    flex: 1;
    padding: 0 0 20rpx; // 移除左右内边距，由task-item的margin控制
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 100rpx; // 调整上边距
    text-align: center;

    .empty-image {
        width: 280rpx;
        height: 280rpx;
        margin-bottom: 30rpx;
    }

    .empty-text {
        font-size: 30rpx;
        color: #7f8c8d;
    }
}

.task-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    padding: 30rpx 25rpx; // 统一内边距
    margin: 0 20rpx 20rpx; // 上0，左右20rpx，下20rpx的外边距
    border-radius: 16rpx; // 统一圆角大小
    box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.07); // 调整阴影使其更柔和
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;

    &:active {
        transform: translateY(2rpx);
        box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.06);
    }
    
    &.completed-item {
        background-color: #f8f9fa; // 已完成任务的背景色
        box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.04);
    }

    .task-content {
        display: flex;
        align-items: center;
        flex: 1;
        overflow: hidden; // 防止内容溢出

        .status-icon {
            width: 50rpx; // 增大点击区域
            height: 50rpx;
            border: 2rpx solid #ced4da; // 调整边框颜色
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 25rpx; // 调整右边距
            transition: all 0.3s ease;
            flex-shrink: 0; // 防止图标被压缩

            &.completed {
                background-color: #28a745; // 更鲜明的完成状态颜色
                border-color: #28a745;

                .check-icon {
                    color: #ffffff;
                    font-size: 30rpx; // 增大图标
                    font-weight: bold;
                }
            }
        }

        .task-title {
            font-size: 30rpx; // 调整字体大小
            color: #343a40; // 更深的文字颜色
            flex: 1;
            transition: color 0.3s ease, text-decoration-color 0.3s ease;
            white-space: nowrap; // 防止标题换行
            overflow: hidden;
            text-overflow: ellipsis; // 标题过长时显示省略号

            &.completed {
                color: #adb5bd; // 更浅的已完成文字颜色
                text-decoration: line-through;
                text-decoration-color: #adb5bd; // 使删除线颜色一致
            }
        }
    }

    .delete-btn {
        padding: 15rpx; // 增大点击区域
        margin-left: 15rpx; // 增加左边距
        border-radius: 50%;
        transition: background-color 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;

        &:active {
            background-color: #e9ecef;
        }

        .delete-icon {
            font-size: 40rpx; // 增大图标
            color: #dc3545; // 醒目的删除图标颜色
            font-weight: bold;
        }
    }
}
</style>