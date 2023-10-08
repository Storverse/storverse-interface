<template>
    <div id="box">
        <el-dialog v-model="props.Visible" title="Followers" :before-close="handleClose">
            <div class="header">
                <span :style="tabStatus == 1 ? 'color:#fff' : 'color:#909791'" @click="tabStatus = 1"
                    v-if="data.id != $UserState.KeplrUserInfo.id">{{ $t('dialogFollowers.All') }}</span>
                <span v-if="data.id != $UserState.KeplrUserInfo.id">|</span>
                <span :style="tabStatus == 2 ? 'color:#fff' : 'color:#909791'" @click="tabStatus = 2"
                    v-if="data.id != $UserState.KeplrUserInfo.id">{{ $t('dialogFollowers.MutualFollowers') }}</span>
            </div>
            <div class="content-box" v-loading="loading" element-loading-background="rgba(22, 22, 22, 0.8)">
                <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto"
                    v-if="followList.length > 0 && !loading">
                    <li v-for="(item, i) in followList" :key="i" class="infinite-list-item cursor-s">
                        <el-avatar :size="50" :src="item.img" v-if="item.img" @click="onToUser(item)" />
                        <img style="width: 50px;height: 50px;" v-else src="@/assets/images/avatar.png" alt=""
                            @click="onToUser(item)" />
                        <p @click="onToUser(item)">
                            <span class="sle users" style="max-width: 100px;">{{ decodeURIComponent(item.username) }}</span>
                            <span class="sle users" style="max-width: 100px;">@{{ item.follower.substring(0, 13) }}</span>
                        </p>
                        <div v-if="item.follower != $UserState.KeplrUserInfo.id">

                            <el-button type="primary" round color="#fff" class="followed-status" :loading="item.loading"
                                v-if="item.hasFollowed" @click="onFollow(item)">
                                {{ $t('dialogFollowers.Unfollow') }}</el-button>

                            <el-button type="primary" round color="#fff" class="unFollow-status" :loading="item.loading"
                                v-if="!item.hasFollowed && !item.toPay" @click="onFollow(item)">
                                {{ $t('dialogFollowers.Follow') }}</el-button>
                            <div class="Pay-status" v-if="!item.hasFollowed && item.toPay" @click="dialogPayFollow(item)">
                                {{ $t('dialogFollowers.PayFollow') }}
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="infinite-list follow-empty" v-if="followList.length <= 0 && !loading">
                    <img src="@/assets/images/empty.svg" alt="">
                    <span style="color: #555555;margin-top: 10px;">{{ $t('Bookmark.NoData') }}</span>
                </div>
            </div>

        </el-dialog>
        <dialogAccount v-model:Visible="dialogVisible" @handleClose="onDialog" :titleType="1"></dialogAccount>
        <dialogFollow v-if="dialogVisibleFollow" v-model:Visible="dialogVisibleFollow" @handleClose="onPayFollow"
            :followData="followData">
        </dialogFollow>
    </div>
</template>
<script  setup lang="ts">
import { onMounted, reactive, ref, watch, computed } from "vue";
import { ElLoading, ElMessage } from 'element-plus'
import { getUserFollowerdList, deleteUserFollowing, GetUserFollowers, saveUserFollowing } from "@/libs/followApi"
import dialogAccount from "@/components/dialog/dialogAccount.vue";
import dialogFollow from "@/components/dialog/dialogFollow.vue";
import { payBuy, getWalletAddress } from "@/api/web3"
import local from "@/utils/local";
import { UserState } from "@/store/modules/users"
import { downloadFile, downloadFileOfOthers, } from "@/libs/file"
import { LoginState } from "@/store/modules/login"

import { useRouter } from 'vue-router'
import i18n from '@/lang/index'

const t = i18n.global.t
const router = useRouter()
const loginState = LoginState();
const keplrAddress = computed(() => loginState.keplrAddress)
const $UserState = UserState()
const myEmit = defineEmits(["handleClose"]);
interface DialogFileProps {
    Visible: boolean;
    data: any

}
const tabStatus = ref(1)
const pages = ref(0)
const loading = ref(true)
let markAddress = ref("")
let dialogVisible = ref(false)
let dialogVisibleFollow = ref(false)
const followData = ref()
onMounted(() => {
    markAddress.value = local.GET("metamaskAddress")

    pages.value = 0
    init()
});
watch(tabStatus, (newValue, oldValue) => {
    followList.value = []
    loading.value = true
    pages.value = 0
    init()

});

const props = withDefaults(defineProps<DialogFileProps>(), {
    Visible: false,
    data: {}

});
let followList: any = ref([])
const load = () => {
    // count.value += 2
    pages.value++
    init()
}
const handleClose = () => {
    myEmit("handleClose");
};
const init = async () => {
    const mutualwithId = tabStatus.value == 1 ? '' : $UserState.KeplrUserInfo.id
    const offset = pages.value * 10
    const data = await GetUserFollowers(props.data.id, mutualwithId, $UserState.KeplrUserInfo.id, 10, offset)
    const list = await Promise.all(data.followings.map(async (item: any) => {
        if (item.avatar) {
            const res = await downloadFileOfOthers(item.avatar, $UserState.KeplrUserInfo.id, true)
            item.loading = false
            item.img = 'data:image/png;base64,' + res

        } else {
            item.loading = false
            item.img = ''
        }
        return item
    }))
    followList.value.push(...list)

    loading.value = false
    // followList.value.push(...list)
    // loading.value = false

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
const onFollow = (follow: any) => {
    const provider = local.GET('provider')
    followList.value.forEach((item: any) => {
        if (item.id == follow.id) {
            item.loading = true

        }
    })
    if (follow.hasFollowed) {
        deleteUserFollowing(follow.following, provider.sid).then((res) => {
            followList.value.forEach((item: any) => {
                if (item.id == follow.id) {
                    item.loading = false
                    if (res) {
                        item.status = 2
                        item.hasFollowed = false
                    }
                }
            })
        }).catch((res) => {
            followList.value.forEach((item: any) => {
                if (item.id == follow.id) {
                    item.loading = false
                    // item.status=2
                }
            })

        })
    } else if (!follow.hasFollowed && follow.status == 1) {
        const createdAt = new Date().valueOf()
        const { id, follower } = follow
        const status = follow.toPay ? 0 : 1
        const query = { id, following: follower, status, createdAt, updatedAt: createdAt, expiredAt: 0, follower: $UserState.KeplrUserInfo.id }
        saveUserFollowing(query, $UserState.KeplrUserInfo.did).then(res => {
            console.log(res, "====")
            followList.value.forEach((item: any) => {
                if (item.id == follow.id) {
                    item.loading = false
                    if (res) {
                        item.status = 2
                        item.hasFollowed = true
                    }
                }
            })


        }).catch(res => {
            console.log(res)
        })
    }
}

const onDialog = (type: string | number) => {

    dialogVisible.value = !dialogVisible.value
    markAddress.value = local.GET("metamaskAddress")
}
const dialogPayFollow = (item: any) => {
    if (markAddress.value) {
        followData.value = item

        dialogVisibleFollow.value = true
    } else {
        dialogVisible.value = true
    }
}
const onPayFollow = (follow?: any) => {
    dialogVisibleFollow.value = false

    if (follow) {
        const loading = ElLoading.service({
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        const amount = follow.toPay
        const tokenId = follow.nftTokenID

        getWalletAddress().then(res => {
            if (res) {
                payBuy(tokenId, amount, markAddress.value, 2).then(res => {
                    console.log(res)
                    onFollow(follow)

                    loading.close()
                    ElMessage({
                        dangerouslyUseHTMLString: true,
                        customClass: 'successMessage',
                        type: 'success',
                        message: t('utils.message'),
                    })
                }).catch(res => {
                    console.log(res)
                    ElMessage({
                        dangerouslyUseHTMLString: true,
                        customClass: 'successMessage',
                        type: 'error',
                        message: `<p style="color: #fff;">${res.message} </p>`,
                    })
                    loading.close()
                })
            } else {
                loading.close()
                // dialogVisibleFollow.value = false
            }
        }).catch(res => {
            ElMessage({
                dangerouslyUseHTMLString: true,
                customClass: 'successMessage',
                type: 'error',
                message: `<p style="color: #fff;">${res.message} </p>`,
            })
            loading.close()
        })

    } else {
        dialogVisibleFollow.value = false
    }
}
const onToUser = async (item: any) => {

    if (keplrAddress.value) {

        if (item.follower != $UserState.KeplrUserInfo.id) {
            console.log(item, $UserState.KeplrUserInfo.id)


            await router.push({
                name: 'Verse-UserProfile',
                query: {
                    key: item.follower,
                },
            })
            handleClose()
            loginState.walletNumber++;
        } else {
            handleClose()
            router.push({
                name: 'Verse-Profile',
            })
        }
    } else {

        loginState.dialogVisible = true
    }

}
</script>
<style scoped lang="scss">
.users {
    display: inline-block;
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

#box {
    :deep(.el-overlay) {
        backdrop-filter: blur(11px);
    }

    :deep(.el-dialog) {
        // height: 477px;
        width: 500px;
        background-color: #292929;
        position: relative;
        border-radius: 9px;
        border: 1px solid #909791;

        .el-dialog__header {
            height: 40px;
            background-color: #161616;
            margin-right: 0;
            border-radius: 9px 9px 0px 0px;
            box-sizing: border-box;
            padding: 0;
            line-height: 40px;
            padding-left: 20px;

            .el-dialog__title {
                color: #fff;
                font-weight: 500;
                font-size: 16px;
                line-height: 28px;
            }

            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .el-dialog__headerbtn {
            width: 12px;
            height: 12px;
            margin-right: 20px;

            display: flex;
            align-items: center;
            justify-content: center;
            position: static;

        }

        .el-dialog__body {
            padding: 0;
            box-sizing: border-box;
        }
    }

    :deep(.el-button) {
        width: 100px;
        height: 36px;
        border: none;
        box-shadow: none
    }
}

.header {
    padding: 8px 20px;
    padding-top: 0;
    box-sizing: border-box;
    background-color: #161616;

    span {
        margin-right: 18px;
        font-weight: 400;
        font-size: 14px;
        line-height: 17px;
        color: #909791;
        cursor: default;
    }
}

.content-box {

    width: 498px;
    height: 400px;

    .infinite-list::-webkit-scrollbar-track {
        background-color: #0F0F0F;
        border-radius: 5px;
        padding: 0px 2px;
        border-radius: 20px;

    }

    .infinite-list::-webkit-scrollbar-thumb {
        background-color: #333333;
        border-radius: 20px;
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

    .infinite-list {
        height: 400px;
        background-color: #292929;
        border-radius: 0 0 15px 15px;

        .infinite-list-item {
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-left: 30px;
            padding-right: 20px;

            >p {
                display: flex;
                flex: 1;
                flex-direction: column;
                margin-left: 10px;
                font-weight: 700;
                font-size: 14px;
                line-height: 21px;
                color: #FFFFFF;

                span:nth-child(2) {
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 17px;
                    margin-top: 8px;
                }
            }

            .unFollow-status {
                text-align: center;
                width: 86px;
                height: 30px;
                box-sizing: border-box;
                background: #FFFFFF;
                border-radius: 34px;
                color: #000000;
                font-weight: 600;
                font-size: 14px;
                line-height: 30px;
                cursor: pointer;
            }

            .followed-status {
                text-align: center;
                width: 86px;
                height: 30px;
                background: #1C1C1C;
                border-radius: 34px;
                font-weight: 500;
                font-size: 14px;
                line-height: 30px;
                color: #8B8B8B;
                box-sizing: border-box;
                cursor: pointer;
            }

            .Pay-status {
                width: 178px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                font-weight: 700;
                font-size: 14px;
                color: #000000;
                padding: 0 10px;
                box-sizing: border-box;
                background: #E6D32D;
                border-radius: 34px;
                cursor: pointer;
            }
        }

        .infinite-list-item:nth-child(even) {
            background-color: #161616;
        }
    }


}
</style>