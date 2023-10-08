<template>
    <div id="box">
        <el-dialog v-model="props.Visible" title="Following" :before-close="handleClose">
            <div class="header">
                <span :style="tabStatus == 1 ? 'color:#fff' : 'color:#909791'" @click="tabStatus = 1">
                    {{ $t('dialogFollowing.Followed') }}</span>
                <span>|</span>
                <span :style="tabStatus == 2 ? 'color:#fff' : 'color:#909791'" @click="tabStatus = 2">{{
                    $t('dialogFollowing.Expired') }}</span>
            </div>
            <div class="content-box" v-loading="loading" element-loading-background="rgba(22, 22, 22, 0.8)">
                <ul v-infinite-scroll="load" class="infinite-list" infinite-scroll-immediate="false" style="overflow: auto"
                    v-if="followList.length > 0 && !loading">
                    <li v-for="(item, i) in followList" :key="i" class="infinite-list-item cursor-s">
                        <el-avatar :size="50" :src="item.img" v-if="item.img" @click="onToUser(item)" />
                        <img style="width: 50px;height: 50px;" v-else src="@/assets/images/avatar.png" alt=""
                            @click="onToUser(item)" />
                        <p @click="onToUser(item)">
                            <span class="sle users" style="max-width: 100px;">{{ decodeURIComponent(item.username) }}</span>
                            <span class="sle users" style="max-width: 100px;">@{{ item.following.substring(0, 13) }}</span>
                        </p>
                        <div v-if="item.following != $UserState.KeplrUserInfo.id">
                            <el-button type="primary" round color="#fff" class="followed-status" :loading="item.loading"
                                v-if="item.hasFollowed" @click="onFollow(item)">
                                {{ $t('dialogFollowing.Unfollow') }}</el-button>

                            <el-button type="primary" round color="#fff" class="unFollow-status" :loading="item.loading"
                                v-if="!item.hasFollowed" @click="onFollow(item)">
                                {{ $t('dialogFollowing.Follow') }}</el-button>

                        </div>
                    </li>
                </ul>
                <div class="infinite-list follow-empty" v-if="followList.length <= 0 && !loading">
                    <img src="@/assets/images/empty.svg" alt="">
                    <span style="color: #555555;margin-top: 10px;">{{ $t('Bookmark.NoData') }}</span>
                </div>

            </div>

        </el-dialog>
    </div>
</template>
<script  setup lang="ts">
import { onMounted, reactive, ref, watch, computed } from "vue";
import { ElLoading, ElMessage } from 'element-plus'
import { UserState } from "@/store/modules/users"
import { getUserFollowerdList, initService, deleteUserFollowing, saveUserFollowing } from "@/libs/followApi"
import local from "@/utils/local";
import { downloadFile, downloadFileOfOthers } from "@/libs/file"
const $UserState = UserState()
import { LoginState } from "@/store/modules/login"
import { useRouter } from 'vue-router'
const router = useRouter()
const loginState = LoginState();
const keplrAddress = computed(() => loginState.keplrAddress)
const myEmit = defineEmits(["handleClose"]);
interface DialogFileProps {
    Visible: boolean;
    data: any

}


onMounted(async () => {
    // const modelManager = local.GET('modelManager')
    // await initService(modelManager)
    init()
});


const props = withDefaults(defineProps<DialogFileProps>(), {
    Visible: false,
    data: {}

});
const tabStatus = ref(1)
let followList: any = ref([])
const pages = ref(0)
const loading = ref(true)
watch(tabStatus, (newValue, oldValue) => {
    followList.value = []
    loading.value = true
    init()

});
const load = () => {
    pages.value++
    init()
}
const handleClose = () => {
    myEmit("handleClose");
};




const init = async () => {
    const isExpired = tabStatus.value == 1 ? false : true
    const offset = pages.value * 10

    const data = await getUserFollowerdList(props.data.id, isExpired, $UserState.KeplrUserInfo.id, 10, offset)


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
            console.log(res)
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
    } else if (!follow.hasFollowed) {
        // loading.value = true

        const createdAt = new Date().valueOf()
        const { id, owner, status } = follow
        const query = { id, following: owner, status: 1, createdAt, updatedAt: createdAt, expiredAt: 0, follower: $UserState.KeplrUserInfo.id }
        saveUserFollowing(query, $UserState.KeplrUserInfo.did).then(res => {

            followList.value.forEach((item: any) => {

                if (item.id == follow.id) {
                    item.loading = false
                    if (res) {
                        item.status = 1
                        item.hasFollowed = true
                    }

                }
            })

            // props.verseDetails.hasFollowedOwner = true



        })
    }
}
const onToUser = async (item: any) => {

    if (keplrAddress.value) {

        if (item.following != $UserState.KeplrUserInfo.id) {
            await router.push({
                name: 'Verse-UserProfile',
                query: {
                    key: item.following,
                },
            })
            handleClose()
            loginState.walletNumber++;
        } else {
            router.push({
                name: 'Verse-Profile',
            })
        }
    } else {

        loginState.dialogVisible = true
    }

}
</script>
<style>
.example-showcase .el-loading-mask {
    z-index: 9;
}
</style>
<style scoped lang="scss">
.users {
    display: inline-block;
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

    .follow-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        span {
            margin-top: 10px;
        }
    }

    .infinite-list::-webkit-scrollbar-track {
        background-color: #0F0F0F;
        // border-radius: 5px;
        padding: 0px 2px;
        border-radius: 20px;

    }

    .infinite-list::-webkit-scrollbar-thumb {
        background-color: #333333;
        border-radius: 20px;
    }

    .infinite-list {
        height: 400px;
        background-color: #292929;
        border-radius: 0 0 15px 15px;
        padding-right: 1px;

        .infinite-list-item {
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-left: 30px;
            padding-right: 20px;
            box-sizing: border-box;

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
                box-shadow: none
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
                box-shadow: none
            }

            .unFollow-status:hover {
                border: none;
                box-shadow: none
            }

            .followed-status:hover {
                border: none;
                box-shadow: none
            }
        }

        .infinite-list-item:nth-child(even) {
            background-color: #161616;
        }
    }


}
</style>