<template>
    <div class="circle-all">
        <div class="circle">
			<p></p>
			<p></p>
			<p></p>
			<p></p>
		</div>
		<div class="circle">
			<p></p>
			<p></p>
			<p></p>
			<p></p>
		</div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
	/* *{
				margin: 0;
				padding: 0;
			} */
			.circle-all{
                position: relative;
                width: 20px;
				height: 20px;
            }
			.circle{
				position: absolute;
				width: 20px;
				height: 20px;
				/* margin: 100px; */
			}
			.circle p{
				position: absolute;
				width: 6px;
				height: 6px;
				border-radius: 50%;
				background-color: #fff;
				animation: move 1.5s infinite linear;
			}
			.circle p:nth-of-type(1){left: 0;top: 0;}
			.circle p:nth-of-type(2){right: 0;top: 0;}
			.circle p:nth-of-type(3){left: 0;bottom: 0;}
			.circle p:nth-of-type(4){right: 0;bottom: 0;}
		.circle:nth-of-type(2){transform: rotate(45deg);}
		.circle:nth-of-type(1) p:nth-of-type(1){animation-delay: -0.1s;}
		.circle:nth-of-type(2) p:nth-of-type(1){animation-delay: -0.3s;}
		.circle:nth-of-type(1) p:nth-of-type(2){animation-delay: -0.5s;}
		.circle:nth-of-type(2) p:nth-of-type(2){animation-delay: -0.7s;}
		.circle:nth-of-type(1) p:nth-of-type(4){animation-delay: -0.9s;}
		.circle:nth-of-type(2) p:nth-of-type(4){animation-delay: -1.1s;}
		.circle:nth-of-type(1) p:nth-of-type(3){animation-delay: -1.3s;}
		.circle:nth-of-type(2) p:nth-of-type(3){animation-delay: -1.5s;}
		
		
		@keyframes move{
			0%{transform: scale(0);}
			50%{transform: scale(1);}
			100%{transform: scale(0);}
		}
</style>