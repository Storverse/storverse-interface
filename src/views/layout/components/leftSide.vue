<template>
    <div class="left-side flx-c-justify-between">
        <div>

            <div class="connect flx-c-justify-between" v-if="!keplrAddress">
                <img class="sao-pic" src="@/assets/images/sao-tag.svg" alt="">

                <div class="flx-c-center">
                    <h1>{{ $t('layout.Welcome') }}</h1>
                    <h3>{{ $t('layout.welcomeTips') }}</h3>
                </div>

                <div class="connect-btn flx-c-center" @click="onWallet()">{{ $t('layout.Connect') }}</div>
            </div>
            <div class="user-info flx-center" v-else>
                <div class="flx-c-center" style="z-index: 1;">
                    <el-avatar :size="80" :src="decodeURIComponent(userInfo.DownAvatar)" v-if="userInfo.DownAvatar" />
                    <img src="@/assets/images/avatar.png" style="width: 80px;height: 80px;" alt="" v-else>
                    <!-- <el-avatar :size="80" src="@/assets/images/avatar.png" v-else /> -->
                    <h2 class="user-name sle">{{ decodeURIComponent(userInfo.username) }}</h2>
                    <span class="user-desc">@{{ userInfo.handleName.substring(0, 13) + "..." }}</span>
                </div>
                <el-popover :show-arrow="false" placement="right-start"
                    popper-style="background-color: #292929;border:1px solid #909791;border-radius: 10px;padding:0;overflow: hidden;">
                    <template #reference>
                        <img class="more-btn" src="@/assets/images/more.svg" alt="">

                    </template>
                    <template #default>
                        <div class="set-box">
                            <p style="" class="flx-justify-between" @click="gotoPage('/profile')">
                            <div> <img src="@/assets/images/gotoProfile.svg" alt=""></div>
                            <span>
                                {{ $t('layout.Profile') }}
                            </span>
                            </p>
                            <p style="" class="flx-justify-between" @click="gotoPage('/dashboardUser')">
                            <div> <img src="@/assets/images/Dashboard.svg" alt=""></div>
                            <span> {{ $t('layout.Dashboard') }}</span>
                            </p>
                            <p class="flx-justify-between" @click="gotoPage('/settingUser')">
                            <div>

                                <img id="setimgs" src="@/assets/images/seting.svg" alt="" fill="currentColor">
                            </div>
                            <span>{{ $t('layout.Setting') }}</span>
                            </p>
                            <p class="flx-justify-between" @click="onLogout">
                            <div>

                                <img id="setimgs" src="@/assets/images/logOut.svg" alt="" fill="currentColor">
                            </div>
                            <span>{{ $t('layout.Logout') }}</span>
                            </p>
                        </div>

                    </template>
                </el-popover>
                <img class="back-blur" :src="decodeURIComponent(userInfo.DownAvatar)" alt="" v-if="userInfo.DownAvatar">
                <img class="back-blur" src="@/assets/images/avatar.png" alt="" v-else>
            </div>

            <div class="link-list">

                <div class="link-style" @click="gotoPage('/square')"
                    :style="type == '/square' ? 'color: #56E868;background: rgba(0, 0, 0, 0.3)' : ''">
                    <img src="@/assets/images/square.svg" alt="">
                    <span>
                        {{ $t('routers.square') }}
                    </span>
                </div>

                <div class="link-style" @click="gotoPage('/notification')"
                    :style="type == '/notification' ? 'color: #56E868;background: rgba(0, 0, 0, 0.3)' : ''">
                    <img src="@/assets/images/noti.svg" alt="">

                    <span>
                        {{ $t('routers.Notification') }}
                    </span>
                    <span class="msgRed" v-show="totalCount as number > 0"></span>

                </div>

                <!-- <router-link to="/bookmark" active-class="active"> -->
                <div class="link-style" style="" @click="gotoPage('/bookmark')"
                    :style="type == '/bookmark' ? 'color: #56E868;background: rgba(0, 0, 0, 0.3)' : ''">
                    <img src="@/assets/images/bookmark.svg" alt="">


                    <span>
                        {{ $t('routers.Bookmark') }}
                    </span>
                </div>
                <!-- </router-link> -->



                <div class="link-style" @click="gotoPage('/profile')"
                    :style="type == '/profile' ? 'color: #56E868;background: rgba(0, 0, 0, 0.3)' : ''">
                    <img src="@/assets/images/profile.svg" alt="">
                    <span>
                        {{ $t('routers.Profile') }}

                    </span>
                </div>


            </div>
            <div class="chain-info" v-if="keplrAddress"
                :style="showChainMore ? 'padding-bottom:20px' : 'padding-bottom:8px'">
                <div class="flx-justify-between chain-info-head" style="margin-top: 0;">
                    <span class="chain-info-title"> {{ $t('layout.DappInteractionModel') }}</span>

                    <el-popover :show-arrow="false" placement="top-start"
                        popper-style="background-color: #292929;border-radius: 10px;padding:14px 18px;border: 1px solid #474747;box-shadow:0px 2px 24px rgba(0, 0, 0, 0.7)"
                        :width="260">
                        <template #reference>
                            <span class="chain-info-content onchain">{{ $t('layout.OnChain') }}</span>

                        </template>
                        <template #default>
                            <div class="onchainBox">
                                <p>{{ $t('layout.onchainTip') }} </p>
                            </div>

                        </template>
                    </el-popover>
                </div>
                <div v-if="showChainMore">

                    <div class="flx-justify-between chain-info-head">
                        <span class="chain-info-title">{{ $t('layout.AccountBalance') }}</span>
                        <span class="chain-info-content">{{ utils.nFormatter(getStoreKeplrBalance) }} SAO</span>
                    </div>
                    <div class="chain-info-head">
                        <p class="chain-info-title chain-info-head">{{ $t('layout.Payment') }}</p>

                        <div class="select">

                            <el-select v-model="PaymentReminder" class="m-2" :suffix-icon="CaretBottom" placeholder=""
                                :teleported="false" @change="changeToken">
                                <el-option label="Only one reminder" :value="false" />
                                <el-option label="Each time reminds" :value="true" />
                            </el-select>

                        </div>
                    </div>
                    <div class="flx-justify-between chain-info-head">
                        <span class="chain-info-title">{{ $t('layout.StorageData') }}</span>
                        <div class="flx-align-center" @click="viewToOther">
                            <span class="view">{{ $t('layout.View') }}</span>
                            <img src="@/assets/images/toright.svg" alt="">
                        </div>
                    </div>
                    <div class="request-token" @click="requestToken">
                        {{ $t('layout.Request') }}
                    </div>
                </div>
                <div v-else @click="showChainMore = true" class="showChainMore-btn">
                    <img src="@/assets/images/morechain.svg" alt="">
                    <span>Show more detail</span>
                    <img src="@/assets/images/morechain.svg" alt="">

                </div>
            </div>

        </div>

        <div class="post-verse" @click="gotoPage('/upload-verse')" v-if="keplrAddress">
            <img src="@/assets/images/postverse.svg" alt="">
            <span>{{ $t('layout.post') }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue"
import { useRouter, useRoute } from 'vue-router'
import { UserState } from "@/store/modules/users"
import CaretBottom from "@/components/select/icon.vue"
import accountApi from "@/api/AccountApi"
import config from '@/libs/config'
import { initService, getNotifications, saveReadNotifications } from "@/libs/notification";
import utils from '@/utils/utils'
import { LoginState } from "@/store/modules/login"
const loginState = LoginState();
const dialogVisible = computed(() => loginState.dialogVisible)
const keplrAddress = computed(() => loginState.keplrAddress)
import local from '@/utils/local'
import { number } from "echarts"
const $router = useRouter()
const routerQuery = useRoute()
const $store = UserState()

const userInfo = computed(() => {
    return $store.KeplrUserInfo
})
const totalCount = computed(() => {
    return $store.totalCount
})
// const totalCount = ref(0)
const type = ref()
const PaymentReminder = ref<any>(false)
const getPayment = () => {
    if ($store.paymentReminder) {
        PaymentReminder.value = $store.paymentReminder
    } else {
        PaymentReminder.value = false
    }
}
getPayment()
const getStoreKeplrBalance = computed(() => {
    return $store.KeplrBalanceNumber
})

$store.SetKeplrBalanceNumber()
const changeToken = () => {
    $store.setPaymentReminder(PaymentReminder.value)
    location.reload()
}
const viewToOther = () => {
    window.open('https://explorer.sao.network/wallet/metadata')
}
const requestToken = () => {
    window.open(config.networkSaoUrl)


}
const KeplrBalanceNumber = ref(0)
const getKeplrBalance = async () => {
    let keplraddress
    if (window.keplr) {
        keplraddress = await window.keplr.getKey('sao-20230629').then((res: any) => {
            console.log(res);

            return res.bech32Address;
        }).catch((res: any) => {

            return false


        })
    }
    let balances: any = []


    if (keplraddress) {
        const data: any = await accountApi.getKeplrBalance(keplraddress)
        // balances = data.balances.filter((item: any) => item.denom == "sao")
        // if (balances.length == 0 || balances[0].amount <= config.keplrBalance) {
        //   keplrWalletAddress.value = keplraddress
        //   loading.close();
        //   balanceStatus.value = true
        //   return false
        // }
        console.log(balances);
        // console.log(1939*Math.pow(10, 6));
        
        KeplrBalanceNumber.value = data.balances[0].amount.Math

       


    } else {
        return true
    }


}
getKeplrBalance()

watch(() => $router.currentRoute.value, async (toPath) => {

    getKeplrBalance()


    if (toPath.fullPath == "/square") {
        type.value = toPath.fullPath
        return
    }
    const queryType = routerQuery.query.type
    if (queryType) {
        type.value = queryType
    } else {
        type.value = toPath.fullPath
    }

    if (keplrAddress.value) {
        const notifications = await getNotifications("0", userInfo.value.id, 10, 0);
        $store.setTotalCount(notifications.totalCount)
        // totalCount.value = notifications.totalCount
    }

    //   
}, { immediate: true, deep: true })
const gotoPage = (val: string) => {
    // if (val == "/notification") {
    //     $store.setTotalCount(notifications.totalCount)
    // }
    $router.push(val)
    if (val != '/upload-verse') {
        type.value = val
    }
}
const onWallet = () => {
    if (!keplrAddress.value) {
        loginState.dialogVisible = true
    }
}
const showChainMore = ref(false)

const onLogout = () => {

    $router.push("/");

    setTimeout(() => {
        LoginState().removeLogin();
        UserState().removeLogin();
    $router.go(0);

    }, 200)
}
</script>

<style lang="scss" scoped>
.more-board {
    width: 150px;
    height: 160px;
    overflow: hidden;
}

.more-board :nth-child(2) {
    border-top: 1px solid #474747;
    border-bottom: 1px solid #474747;

}

.more-board :nth-child(3) {
    border-bottom: 1px solid #474747;
}

.single-board {
    width: 148px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.single-board:hover {
    background-color: rgba(0, 0, 0, 0.3);

}

.set-box {
    border-radius: 10px;
    cursor: default;



    p {
        height: 38px;
        text-align: center;
        line-height: 40px;
        border-radius: 0px 0px 9px 9px;
        color: #909791;
        padding: 0 20px;
        box-sizing: border-box;

        span {
            display: inline-block;
            width: 80px;
            text-align: left;
        }



        div {
            width: 14px;
            height: 14px;
            fill: #909791;
            text-align: center;
            line-height: 14px;
            overflow: hidden;

            img {
                transform: translateX(30px);
                filter: drop-shadow(#909791 -30px 0px 0px);
            }
        }
    }

    p:hover {
        background: rgba(0, 0, 0, 0.4);
        color: #fff;

        img {
            filter: drop-shadow(#fff -30px 0px 0px);
        }
    }

    p:nth-child(n) {
        border-bottom: 1px solid #474747;
        transform: matrix(1, 0, 0, 1, 0, 0);
        border-radius: 9px 9px 0px 0px;
        cursor: pointer;

    }

    p:last-child {
        border-bottom: none;

    }
}

.onchainBox {
    // padding: 14px 18px;
    // width: 260px;
    color: #909791;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
}

.left-side {
    width: 280px;
    height: 100%;
    margin-right: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;

    .user-info {
        width: 100%;
        height: 200px;
        position: relative;
        overflow: hidden;
        border-radius: 10px;

        background-size: cover;

        .user-name {
            font-weight: 700;
            font-size: 20px;
            line-height: 26px;
            margin-top: 12px;
            width: 200px;
            text-align: center;
        }

        .user-desc {
            font-weight: 400;
            font-size: 14px;
            line-height: 21px;
        }

        .more-btn {
            position: absolute;
            top: 9px;
            right: 8px;
            cursor: pointer;
            z-index: 1;
        }

        .more-btn:hover {
            border-radius: 6px;
            background-color: #000;
        }

        .back-blur {
            width: 280px;
            height: 200px;
            position: absolute;
            object-fit: cover;
            top: 0;
            left: 0;
            border-radius: 10px;
            filter: blur(13px);

        }
    }

    .connect {
        width: 280px;
        height: 324px;
        background: #292929;
        border-radius: 10px;
        padding: 46px 0 50px 0px;
        box-sizing: border-box;

        .sao-pic {
            width: 204px;
            height: 47px;
        }

        h1 {
            font-weight: 700;
            font-size: 20px;
            line-height: 36px;
            color: #FFFFFF;
            margin-bottom: 5px;
        }

        h3 {
            width: 193px;
            height: 48px;
            font-weight: 400;
            font-size: 14px;
            line-height: 24px;
            text-align: center;
            color: #FFFFFF;
        }

        .connect-btn {
            width: 189px;
            height: 40px;
            background: linear-gradient(360deg, #78F876 0%, #CDFF63 100%);
            border-radius: 60px;
            color: #000;
            font-weight: 700;
            font-size: 18px;
            cursor: pointer;
        }
    }

    .link-list {
        box-sizing: border-box;
        width: 280px;
        height: 272px;
        background: #292929;
        border-radius: 10px;
        margin-top: 14px;
        padding: 14px 0;

        .link-style {
            width: 280px;
            display: flex;
            align-items: center;
            height: 60px;
            cursor: pointer;
            text-decoration: none;
            color: #fff;
            font-weight: 600;
            font-size: 18px;
            line-height: 36px;

            // background-color: #21C143;
            img {
                margin: 0 42px 0 27px;
            }

            .msgRed {
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: #f56e6e;
                margin-left: 15px;
                margin-top: -5px;
            }
        }






        // a :hover {
        //     background: rgba(0, 0, 0, 0.3);
        // }


    }

    .link-list div:hover {
        background-color: rgba(0, 0, 0, 0.3);
    }

    .chain-info {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: space-between;
        width: 280px;
        // height: 280px;
        background: #292929;
        border-radius: 10px;
        margin-top: 14px;
        padding: 20px;
        box-sizing: border-box;

        .chain-info-head {
            width: 100%;
            margin-top: 19px;
        }

        .onchain {
            cursor: pointer;
        }

        .onchain:hover {
            
            text-decoration:dashed underline #fff;
        }

        .chain-info-title {
            color: #909791;
            font-weight: 400;
            font-size: 14px;
            line-height: 17px;
        }

        .chain-info-content {
            font-weight: 600;
            font-size: 14px;
            color: #FFFFFF;
        }

        .view {

            font-weight: 600;
            font-size: 14px;
            line-height: 17px;
            color: #56E868;
            margin-right: 5px;
            cursor: pointer;
        }

        .request-token {
            width: 237px;
            height: 36px;
            background: #21C143;
            border-radius: 80px;
            font-weight: 600;
            font-size: 16px;
            line-height: 36px;
            color: #FFFFFF;
            text-align: center;
            cursor: pointer;
            margin-top: 19px;
        }

        .showChainMore-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 260px;
            height: 20px;
            background-color: #161616;
            border-radius: 20px;
            cursor: pointer;
            margin-top: 19px;

            span {
                color: #4E514F;
                font-size: 14px;
                font-weight: 400;
                line-height: 17px;
                padding: 0 14px;
            }
        }
    }
}

::-webkit-scrollbar {
    display: none;
}

.select {
    width: 100%;
    margin-top: 14px;

    :deep(.el-popper) {
        background-color: #292929;
        border-color: #909791;
        border-radius: 10px;

        .el-select-dropdown__item.hover {
            background: rgba(0, 0, 0, 0.3);
            color: #fff;
            box-shadow: none;
        }

        .el-select-dropdown__list {
            margin: 0 !important;
        }

        li {
            height: 43px;
            display: flex;
            align-items: center;
            padding: 0 32px 0 10px;
        }

        li:nth-child(1) {
            border-bottom: 1px solid #909791;
        }

        .el-popper__arrow::before {
            content: none;
            display: none;
        }

        .selected {
            color: #fff;
            font-weight: 400;
            background-color: #161616;
        }

    }

    :deep(.el-select .el-input__wrapper.is-focus) {
        box-shadow: none !important;

    }

    :deep(.el-select .el-input.is-focus .el-input__wrapper) {
        box-shadow: none !important;

    }

    :deep(.el-scrollbar__wrap) {

        border-radius: 10px;
        box-shadow: none !important;

    }

    :deep(.el-input__wrapper) {
        height: 37px;
        width: 240px;
        box-sizing: border-box;
        background-color: #161616;
        border: 1px solid #474747;
        border-radius: 8px;
        box-shadow: none !important;

        .el-input__inner {
            color: #FFFFFF;
            font-size: 14px;
            line-height: 21px;
        }

        .is-focus {
            box-shadow: none;

        }

    }

    :deep(.is-focus) {
        border-color: #909791;
        box-shadow: 0 0 0;
        box-shadow: none;
    }

    :deep(.el-select__caret.is-reverse) {
        transform-origin: center
    }

    :deep(.el-select__caret) {
        transform-origin: center
    }

}

.post-verse {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 280px;
    // height: 60px;
    padding: 18px 0;
    background: #21C143;
    border-radius: 80px;
    box-shadow: 0px 10px 10px rgba(36, 82, 40, 0.8);
    margin: 30px 0;
    box-sizing: border-box;
    cursor: pointer;

    span {
        font-weight: 600;
        font-size: 18px;
        margin-left: 27px;
    }
}

// .post-verse:hover{
//     box-shadow: 0px 10px 10px rgba(36, 82, 40, 0.8);

// }
</style>