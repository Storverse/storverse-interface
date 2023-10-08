

<template>
    <div class="sugBox">


        <el-input v-model="searchInfo" class="search" placeholder="Coming soon..." disabled="true">
            <template #prefix>
                <img src="@/assets/images/search.svg" alt="">
            </template>
        </el-input>

        <div class="suggestion">
            <div class="sug-head flx-justify-between">
                <h2>{{ $t('suggestion.suggestion') }}</h2>
                <img @click="reloadSug" src="@/assets/images/reload.svg" alt="" :class="isReload ? 'trans' : ''">
            </div>
            <div v-loading="loading" element-loading-background="#292929" style="width: 100%;min-height: 400px;">
                <ul class="sug-list" v-if="sugList.length > 0 && !loading">
                    <li v-for="(item, index) in sugList" :key="index" class="single-sug flx-justify-between">
                        <div class="sug-userInfo flx-justify-between cursor-s" @click="onToUser(item)">
                            <el-avatar style="border: 1px solid rgba(71, 71, 71, 1);" :size="50" :src="item.avatar"
                                v-if="item.avatar" />
                            <img style="width: 50px;height: 50px;" v-else src="@/assets/images/avatar.png" alt="" />
                            <div class="flx-c-star infos">
                                <span class="username">{{ decodeURIComponent(item.username) }}</span>
                                <span class="userDesc">@{{ item.id.substring(0, 13) }}</span>

                            </div>
                        </div>
                        <div v-if="userInfo.id != item.id">
                            <el-button type="primary" round color="#fff" class="followed-status" :loading="item.loading"
                                v-show="item.isFollowing" @click="onFollow(item)">
                                {{ $t('suggestion.Unfollow') }}</el-button>

                            <el-button type="primary" round color="#fff" class="unFollow-status" :loading="item.loading"
                                v-show="!item.isFollowing" @click="onFollow(item)">
                                {{ $t('suggestion.Follow') }}</el-button>

                        </div>
                    </li>
                </ul>

                <div v-else class="no-data">
                    <img src="@/assets/images/empty.svg" alt="">
                    <span style="color: #555555;margin-top: 10px;">{{ $t('Bookmark.NoData') }}</span>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch, inject } from 'vue';
import { LoginState } from "@/store/modules/login"

import { UserProfileService } from 'storverse-sao-api';
import { downloadFileOfOthers } from "@/libs/file"
import { ElLoading, ElMessage } from 'element-plus'
import { UserState } from "@/store/modules/users"
import { getUserFollowerdList, initService, deleteUserFollowing, saveUserFollowing } from "@/libs/followApi"
import local from "@/utils/local";
import { useRouter } from 'vue-router'
const router = useRouter()

const loginState = LoginState();
const userInfo = computed(() => UserState().getUserInfo)
const keplrAddress = computed(() => loginState.keplrAddress)
const walletNumber = computed(() => loginState.walletNumber);
let avatarCache: { [key: string]: string } = {};

interface SugList {
    username: string,
    avatar: string,
    desc: string,
    isFollow: boolean,
    hasFollowed: boolean,
    loading: boolean;
}
const isReload = ref(false)
const searchInfo = ref('')
const sugList: any = ref([])
const reloadSug = () => {
    loading.value = true
    isReload.value = true
    SuggestedUsersPage.value = SuggestedUsersPage.value + 4
    sugList.value = []
    fetchSuggestedUsers()
}
const loading = ref(false)


watch(() => sugList.value, (newValue, oldValue) => {
    if (newValue.length > 0) {


        console.log(newValue);
        var followAll = newValue.every((item: any, index: number, callback: void) => {
            return item.isFollowing == true
        })
        console.log(followAll);
        if (followAll == true) {
            reloadSug()
        }
    }
}, {

    deep: true
})
watch(walletNumber, (newValue, oldValue) => {
    sugList.value = []
    loading.value = true
    fetchSuggestedUsers()
});
const onFollow = (follow: any) => {

    if (keplrAddress.value) {
        const provider = local.GET('provider')
        sugList.value.forEach((item: any) => {

            if (item.id == follow.id) {
                item.loading = true
            }
            console.log(item.id == follow.id)
        })


        if (follow.isFollowing) {
            deleteUserFollowing(follow.id, provider.sid).then((res) => {
                sugList.value.forEach((item: any) => {
                    if (item.id == follow.id) {
                        item.loading = false
                        if (res) {
                            item.status = 2
                            item.isFollowing = false
                        }
                    }
                })

            }).catch((res) => {
                sugList.value.forEach((item: any) => {
                    if (item.id == follow.id) {
                        item.loading = false
                        // item.status=2
                    }
                })


            })
        } else if (!follow.isFollowing) {


            const createdAt = new Date().valueOf()
            const { id } = follow
            const status = follow.toPay ? 0 : 1
            const query = { id, following: id, status, createdAt, updatedAt: createdAt, expiredAt: 0, follower: userInfo.value.id }
            saveUserFollowing(query, userInfo.value.did).then(res => {
                sugList.value.forEach((item: any) => {
                    if (item.id == follow.id) {
                        item.loading = false
                        if (res) {
                            item.status = 1
                            item.isFollowing = true
                        }
                    }
                })

            }).catch(res => {
                console.log('error,follow')
            })
        }
    } else {
        loginState.dialogVisible = true
    }

}
const SuggestedUsersPage = ref(0)
const SuggestedUsersLimit = ref(4)
const fetchSuggestedUsers = async () => {


    if (userInfo.value.id) {
        userDataId.value = userInfo.value.id
    } else {
        userDataId.value = ''
    }
    console.log('suggestedUserssuggestedUserssuggestedUserssuggestedUsers');

    // sugList=[]
    try {
        sugList.value = []
        loading.value = true
        const suggestedUsers = await UserProfileService.GetSuggestedUsers(userInfo.value.id, SuggestedUsersLimit.value, SuggestedUsersPage.value);
        console.log('suggestedUserssuggestedUserssuggestedUserssuggestedUsers');

        console.log(suggestedUsers);

        if (suggestedUsers.length > 0) {


            const avatarPromises = suggestedUsers.map(user => {
                if (avatarCache[user.avatar]) {
                    return Promise.resolve(avatarCache[user.avatar]);
                } else {
                    return downloadFileOfOthers(user.avatar, userDataId.value, true)
                        .then(avatarResponse => {

                            let avatar: string = ""
                            if (avatarResponse) {
                                avatar = 'data:image/png;base64,' + avatarResponse;
                                avatarCache[user.avatar] = avatar;
                            }
                            return avatar;
                        })
                        .catch(error => {
                            console.error('Error fetching avatar:', error);
                            // Return a default avatar in case of an error
                            return '';
                        });
                }
            });

            const avatars = await Promise.all(avatarPromises);
            sugList.value = []

            for (let i = 0; i < suggestedUsers.length && i < 4; i++) {
                const user: any = suggestedUsers[i];

                user.avatar = avatars[i]
                user.status = 1
                user.loading = false
                loading.value = false
                isReload.value = false
                sugList.value.push(user);
            }
        } else {
            sugList.value = []
            loading.value = false
        }

    } catch (error) {
        console.log(error);
        sugList.value = []
        loading.value = false
        isReload.value = false
        return
        SuggestedUsersPage.value = 0
        sugList.value.length = 0;
        loading.value = true
        const suggestedUsers = await UserProfileService.GetSuggestedUsers(userInfo.value.id, SuggestedUsersLimit.value, SuggestedUsersPage.value);
        console.log(suggestedUsers);

        if (suggestedUsers.length > 0) {

            const avatarPromises = suggestedUsers.map(user => {
                if (avatarCache[user.avatar]) {
                    return Promise.resolve(avatarCache[user.avatar]);
                } else {
                    return downloadFileOfOthers(user.avatar, userDataId.value, true)
                        .then(avatarResponse => {
                            let avatar: string = ""
                            if (avatarResponse) {
                                avatar = 'data:image/png;base64,' + avatarResponse;
                                avatarCache[user.avatar] = avatar;
                            }
                            return avatar;
                        })
                        .catch(error1 => {
                            console.error('Error fetching avatar:', error1);
                            // Return a default avatar in case of an error
                            return '';
                        });
                }
            });

            const avatars = await Promise.all(avatarPromises);
            sugList.value.length = 0

            for (let i = 0; i < suggestedUsers.length && i < 4; i++) {
                const user: any = suggestedUsers[i];
                user.avatar = avatars[i]
                user.status = 1
                user.loading = false
                loading.value = false
                isReload.value = false
                sugList.value.push(user);
            }
            console.error('Error fetching suggested users:', error);
        } else {
            sugList.value.length = 0;
            loading.value = false
        }
    }

};

const userDataId = ref('')
const Reload = inject('Reload', Function, true)

onMounted(() => {
    sugList.value = []
    // console.log(userInfo);


    fetchSuggestedUsers();
});
const onToUser = (item: any) => {
    console.log(item.id != userInfo.value.id)
    if (keplrAddress.value) {
        if (item.id != userInfo.value.id) {
            // Reload()
            router.push({
                name: 'Verse-UserProfile',
                query: {
                    key: item.id,
                },
            })
            // loginState.walletNumber++;
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

<style scoped lang="scss">
.sugBox {
    width: 350px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    scrollbar-width: none;
}

::-webkit-scrollbar {
    display: none;
}

.search {
    box-sizing: border-box;
    width: 350px;
    height: 60px;
    // background: #292929;
    // border: 1px solid #474747;
    // border-radius: 10px;
    margin-bottom: 14px;

    ::v-deep(.el-input__wrapper) {
        background-color: #292929;

        border: 1px solid #474747;
        box-shadow: none;
        border-radius: 10px;
    }

}

::v-deep(.el-input__wrapper) {
    background: #292929;
    border: 1px solid #474747;
    box-shadow: none;
    border-radius: 10px;
}

::v-deep(.is-focus) {


    box-shadow: 0 0 0 1px #fff;


}

::v-deep(.el-input__inner) {
    &::placeholder {
        color: #909791;
        font-weight: 400;
        font-size: 20px;
    }

    // ::v-deep( .el-input__prefix-inner>:last-child){
    //     margin-right: 12px;
    // }
}

:deep(.el-button) {
    width: 100px;
    height: 36px;
    border: none;
    box-shadow: none
}

.suggestion {
    width: 350px;
    height: 508px;
    background: #292929;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 20px 20px 30px 20px;

    .sug-head {
        margin-bottom: 14px;
        box-sizing: border-box;

        h2 {
            font-style: normal;
            font-weight: 800;
            font-size: 18px;
            line-height: 36px;
        }

        img {
            cursor: pointer;
        }

        .trans {
            animation: rotate 1s linear infinite
        }

        @keyframes rotate {
            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(360deg)
            }
        }
    }

    .sug-list {
        height: 406px;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: flex-start;
    }

    .single-sug {
        width: 312px;
        height: 94px;
        background: #000000;
        border-radius: 10px;
        box-sizing: border-box;
        padding: 22px 20px;
        margin-bottom: 15px;

        .infos {
            margin-left: 10px;

            .username {
                font-weight: 700;
                font-size: 14px;
                line-height: 21px;
                margin-bottom: 6px;
                max-width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .userDesc {
                font-weight: 400;
                font-size: 14px;
                line-height: 17px;
                max-width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
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
    }

    .single-sug:last-child {
        margin-bottom: 0;
    }
    .no-data {
        width: 100%;
        height: 100%;
        min-height: 300px;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
    }
}
</style>