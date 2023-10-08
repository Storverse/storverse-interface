<template>
    <div class="setting">
        <div class="square-left">
            <div class="header">
                {{$t('profile.Setting')}}
            </div>
            <div class="flx-center">
                <ul class="tablist ">
                    <li v-for="(item, index) in tabList " @click="onSetTbas(index)"
                        :class="index == tabsIndex ? 'tabStatus cursor-s' : 'cursor-s'" :key="index">{{ item }}
                    </li>
                </ul>
                <div class="setBox" v-if="tabsIndex != 2">
                    <Profile v-if="tabsIndex == 0"></Profile>
                    <Account v-if="tabsIndex == 1"></Account>
                </div>
                <div class="setBox" style=" padding: 30px 0px;" v-if="tabsIndex == 2">
                    <Subscription v-if="tabsIndex == 2"></Subscription>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue"
import Profile from "@/components/setting/profile.vue";
import Account from "@/components/setting/account.vue";
import Subscription from "@/components/setting/subscription.vue";
import i18n from '@/lang/index'

const t = i18n.global.t

const tabList = reactive([
t('routers.Profile'), t('profile.Account'),t('profile.Subscription')
])
const tabsIndex = ref(0)
const onSetTbas = (index: number) => {
    tabsIndex.value = index
}
</script>
<style scoped lang="scss">
.setting {
    width: 1040px;
    height: 100%;
    display: flex;



    .square-left {
        width: 1043px;
        height: 708px;
        margin-right: 20px;
        background: #292929;
        border-radius: 10px;

        .header {
            height: 60px;
            width: 100%;
            line-height: 60px;
            padding-left: 30px;
            box-sizing: border-box;
            font-weight: 600;
            font-size: 18px;

            color: #fff;
            border-bottom: 1px solid #474747;
        }

        .tablist {
            width: 279px;
            height: 648px;
            border-right: 1px solid #474747;

            li {
                height: 60px;
                font-weight: 600;
                font-size: 16px;
                line-height: 60px;
                padding-left: 30px;
                box-sizing: border-box;
                color: #909791;
                cursor: pointer;
            }

            .tabStatus {
                background: rgba(0, 0, 0, 0.3);
                color: #fff;
                transition: all 0.5s linear;
            }
        }

        .setBox {
            flex: 1;
            width: 1043px;
            height: 648px;
            padding: 30px 40px;
            box-sizing: border-box;
        }
    }
}
</style>