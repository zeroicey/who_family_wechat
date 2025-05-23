<template>
    Hello, this is the login page.
    <button @click="login">sss</button>
</template>

<script setup>
import { useStore } from 'vuex'

const store = useStore()
const login = async () => {
    const userInfo = await store.dispatch('user/wechatLogin');
}

</script>
