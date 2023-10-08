<template>
    <!-- <div class="right-side"> -->
<!-- <transition appear name="fade-transform" mode="out-in"> -->
<router-view ></router-view>
<!-- </transition> -->
    <!-- </div> -->
</template>

<script setup lang="ts">
// import { nextTick, provide, ref } from 'vue';

// const isReload = ref(true)
// const reload = ()=>{
//     isReload.value = false
//     nextTick(()=>{
//     isReload.value = true

//     })
// }
// provide('Reload',reload)
</script>

<style scoped>
/* .right-side{
    width: 1040px;
    height: 100%;
    background-color: #292929;
} */
</style>