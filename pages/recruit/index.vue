<template>
    Hello, this is the recruit page.
    <button @click="handleClick">
        aaa
    </button>
</template>
<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const handleClick = () => {
    console.log('Button clicked');
};
</script>