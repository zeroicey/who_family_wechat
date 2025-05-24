<template>
    <view class="address-container">
        <view class="address-list" v-if="addressList.length > 0">
            <AddressItem v-for="address in addressList" :key="address.id" :address="address" :selectable="selectable"
                @select="selectAddress" @edit="editAddress" />
        </view>

        <EmptyAddress v-else @add="addNewAddress" />

        <view class="add-address-btn" @tap="addNewAddress">
            <text class="btn-text">新增收货地址</text>
        </view>
    </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
// 引入组件
import AddressItem from '@/components/me/address/AddressItem.vue';
import EmptyAddress from '@/components/me/address/EmptyAddress.vue';

const store = useStore();

// 从 Vuex 中获取地址列表
const addressList = computed(() => store.getters['user/getUserAddresses']);

// 是否可选择地址
// 如果从下单页面跳转来，则可选择
// 如果直接访问地址管理页面，则不可选择
const selectable = ref(false);

// 从 Vuex 中获取地址列表
const fetchAddressList = async () => {
    try {
        await store.dispatch('user/fetchAddressList');
    } catch (error) {
        console.error('获取地址数据失败', error);
        uni.showToast({
            title: '地址数据加载失败',
            icon: 'none'
        });
    }
};

// 选择地址
const selectAddress = (address) => {
    if (selectable.value) {
        // 在选择模式下，选择地址后返回上一页并传递数据
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2];
        if (prevPage && prevPage.$vm) {
            // 设置上一页的地址数据
            prevPage.$vm.setAddress && prevPage.$vm.setAddress(address);
        }
        uni.navigateBack();
    }
};

// 编辑地址
const editAddress = (address) => {
    uni.navigateTo({
        url: `/pages/me/address/edit?id=${address.id}`
    });
};

// 新增地址
const addNewAddress = () => {
    uni.navigateTo({
        url: '/pages/me/address/edit'
    });
};

// 返回上一页
const navigateBack = () => {
    uni.navigateBack();
};

onMounted(() => {
    // 获取路由参数
    const query = uni.getSystemInfoSync().platform === 'devtools'
        ? {}
        : uni.getLaunchOptionsSync().query;

    // 判断是否需要选择地址
    selectable.value = query.select === 'true';

    // 获取地址列表
    fetchAddressList();
});
</script>

<style lang="scss" scoped>
.address-container {
    min-height: 100vh;
    background-color: #f5f5f5;


    .address-list {
        padding: 3vw;
    }

    .add-address-btn {
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