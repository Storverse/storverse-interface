<template>
    <div class="flx-center layout">
        <leftSide></leftSide>
        <rightSide></rightSide>
    </div>
</template>

<script setup lang="ts">
import leftSide from './components/leftSide.vue';
import rightSide from './components/rightSide.vue';
</script>

<style scoped>
.layout{
    width: 100%;
    height: 100%;
    padding-top: 30px;
    box-sizing: border-box;
}
</style>