<template>
	<div class="icons" @click="handleScrollTop">

		<img src="@/assets/images/backtop.svg" alt="">

	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
const $emit = defineEmits(["backScrollTop"])
const handleScrollTop = () => {
	$emit('backScrollTop')
}

</script>

<style scoped lang="scss">
.icons {
	position: absolute;
	width: 49px;
	height: 49px;
	left: -40px;
	top: 60%;
	// right: 32vw;
	// bottom: 10vh;
	cursor: pointer;
}
</style>