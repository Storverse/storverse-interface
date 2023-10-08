<template>
    <div class="square">
        <el-scrollbar height="100%">
            <div class="square-left">
                <notLogin></notLogin>
                <div class="content">
                    <p v-if="titleType == 0">{{$t('routers.Notification')}}</p>
                    <p v-if="titleType == 1">{{$t('routers.Bookmark')}}</p>

                    <p v-if="titleType == 2">{{$t('routers.Profile')}}</p>

                    <div class="flx-center">
                        <img src="@/assets/notification/notLogin.png" alt="" />
                    </div>
                </div>
            </div>
        </el-scrollbar>

        <div class="square-right">
            <suggestions></suggestions>
        </div>
    </div>
</template>
    
<script setup lang="ts">
import suggestions from "@/components/suggestions.vue";
import notLogin from "@/components/notLogin/herder.vue"
import { ref } from "vue";
import {useRoute}  from "vue-router";
const $router =useRoute()
console.log($router.path);
const titleType = ref(0)
if($router.path == '/notification'){
    titleType.value =0
}else if($router.path == '/bookmark'){
    titleType.value =1

}else{
    titleType.value =2

}
</script>
    
<style scoped lang="scss">
.square {
    width: 1040px;
    height: 100%;
    display: flex;

    .square-left {
        // height: 708px;
        margin-right: 20px;


        .content {
            height: 646px;

            width: 671px;
            background-color: #292929;
            border-radius: 10px;
            margin-top: 15px;
            box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);

            p {
                height: 60px;
                width: 100%;
                line-height: 60px;
                padding-left: 30px;
                box-sizing: border-box;
                border-bottom: 1px solid #474747;
            }

            div {
                height: 646px;

                width: 671px;
            }

            img {
                width: 345px;
                height: 345px;
                mix-blend-mode: lighten;
            }
        }
    }

}</style>