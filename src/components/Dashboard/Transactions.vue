<template>
    <div class="assets" v-loading="loading" element-loading-background="rgba(22, 22, 22, 0.8)">

        <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto" v-if="dataList.length > 0 && !loading">
            <li class="infinite-list-item" v-for="(item, index) in dataList" :key="index">
                <!-- <p v-if="item.time">{{ item.time }}</p> -->
                <div>
                    <img src="@/assets/images/assetsIcon.svg" alt="">
                    <p v-if="item.Type == 5">
                        <span>{{ $t('Transactions.Youpaid') }}</span>
                        <span>{{ new Date(item.Time).toLocaleDateString() }}</span>
                    </p>
                    <p v-if="item.Type == 2">
                        <span> {{ decodeURIComponent(item.UserName) }} {{ $t('Transactions.paid') }} {{ (item.Price *
                            Math.pow(10,
                                -18)).toFixed(6) }} {{ $t('Transactions.paidFollow') }} </span>
                        <span>{{ new Date(item.Time).toLocaleDateString() }}</span>
                    </p>
                    <p v-if="item.Type == 3">
                        <span>{{ $t('Transactions.withdraw') }}</span>
                        <span>{{ new Date(item.Time).toLocaleDateString() }}</span>
                    </p>
                    <p v-if="item.Type == 4">
                        <span>{{ $t('Transactions.Youfollowed') }} {{ decodeURIComponent(item.UserName) }}</span>
                        <span>{{ new Date(item.Time).toLocaleDateString() }}</span>
                    </p>
                    <p v-if="item.Type == 1">
                        <span> {{ decodeURIComponent(item.UserName) }} {{ $t('Transactions.paidto') }}</span>
                        <span>{{ new Date(item.Time).toLocaleDateString() }}</span>
                    </p>
                    <!-- <p>
                        <span v-if="item.type == 1">Followed {{ item.BuyerDataID }}</span>
                        <span v-if="item.type == 1">withdraw</span>
                        <span v-if="item.type == 2">Followed you </span>
                        <span v-if="item.type == 3"> your Verse</span>
                    </p> -->
                    <span v-if="item.Type >= 3">- {{ (item.Price * Math.pow(10, -18)).toFixed(6) }} BNB</span>
                    <span v-if="item.Type < 3" style="color:#E6D32D">+ {{ (item.Price * Math.pow(10, -18)).toFixed(6) }}
                        BNB</span>
                </div>

            </li>

        </ul>
        <div class="infinite-list follow-empty" v-if="dataList.length <= 0 && !loading">
            <img src="@/assets/images/empty.svg" alt="">
            <span style="color: #555555;margin-top: 10px;"> {{ $t('Bookmark.NoData') }}</span>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { GetPurchaseOrders, GetCoinPrice } from "@/libs/user"
import { UserState } from "@/store/modules/users"
import { downloadFile, downloadFileOfOthers } from "@/libs/file"
const userState = UserState();
const count = ref(1)
let dataList: any = reactive([])
const pages = ref(0)
const balance = ref(0)
const load = () => {
    pages.value++
    init()
}
const loading = ref(false)
onMounted(() => {
    loading.value = true
    pages.value = 0
    // dataList = []
    init()
    GetCoinPrice("BNBUSDT").then((res1: any) => {
        console.log(res1)
        balance.value = res1
    }).catch(res1 => {

        balance.value = 0
    })
})
const init = () => {
    const offset = pages.value * 10
    GetPurchaseOrders(userState.KeplrUserInfo.id, undefined, 10, offset).then(async res => {


        loading.value = false
        dataList.push(...res)
    }).catch(res => {

    })


}
const arrayBufferToBase64 = (buffer: any) => {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
</script>
<style scoped lang="scss">
.assets {
    height: 646.7px;

    .infinite-list {
        height: 646.7px;
        padding: 0;
        margin: 0;
        list-style: none;
        // background-color: #000000;
    }

    .infinite-list::-webkit-scrollbar-track {
        background-color: #0F0F0F;
        // border-radius: 5px;
        padding: 0px 2px;
        width: 10px;

    }

    .infinite-list::-webkit-scrollbar-thumb {
        background-color: #333333;
        border-radius: 20px;
        margin-left: 5px;
    }

    .infinite-list-item {
        // height: 80px;
        // background-color: #ff0000;
        border-bottom: 1px solid #474747;
        padding: 15px 30px;

        >p {
            margin-bottom: 20px;

            font-size: 14px;
            line-height: 17px;
            color: #909791;
            margin-top: 15px;
        }

        div {
            display: flex;
            align-items: center;
            justify-content: space-between;

            p {
                display: flex;
                flex-direction: column;
                flex: 1;
                margin-bottom: 0;

                span {

                    font-size: 16px;
                    line-height: 19px;
                    color: #FFFFFF;
                }

                span:nth-child(2) {
                    font-weight: 400;
                    font-size: 14px;
                    margin-top: 8px;
                }
            }

            img {
                width: 50px;
                height: 50px;
                margin-right: 20px;
                border-radius: 50%;
            }

            >span {
                font-weight: 700;
                font-size: 16px;
                line-height: 19px;
                text-align: right;
                color: #FFFFFF;
            }
        }
    }

    .follow-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        span {
            margin-top: 10px;
        }
    }
}
</style>