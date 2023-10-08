<template>
    <div class="square" v-if="keplrAddress">
        <!-- <el-scrollbar height="100%" @scroll="load"> -->

        <div class="scroll" ref="infiniteSquare" infinite-scroll-distance="10" @scroll="scrollSquare"
            v-infinite-scroll="load" style="overflow:auto;height: 100%;overflow-y: auto;overflow-x: hidden;">


            <div class="square-left">

                <div class="userImg" style="">
                    <div class="back">
                        <img :src="decodeURIComponent(userInfo.backImg)" alt="" v-if="userInfo.backImg">

                        <img src="@/assets/images/backImage.png" alt="" v-else>
                    </div>
                    <div class="cover">
                        <img :src="decodeURIComponent(userInfo.DownAvatar)" alt="" v-if="userInfo.DownAvatar">

                        <img src="@/assets/images/avatar.png" alt="" v-else>
                    </div>
                    <div class="DID flx-justify-between cursor-s">
                        <span>{{ $t('profile.DID') }}</span>
                        <span>{{ filterSub(userInfo.did, 6, 6) }}</span>
                        <img @click="copyId(userInfo.did)" src="@/assets/images/Vector.svg" alt="">
                    </div>
                    <div class="toback" @click="goBack">
                        <img src="@/assets/images/goback.svg" alt="">
                    </div>
                </div>
                <!-- <div class="" style="display: flex;align-items: center;justify-content: end;height: 43px;">


                </div> -->
                <div class="" style="display: flex;align-items: center;justify-content: end;height: 43px;">
                    <div class="setBut" style="margin-right: 20px;">
                        <div class="flx-center"  @click="onShareDialog">
                            <img style="cursor: pointer;" src="@/assets/images/share1.svg" alt="">
                        </div>
                    </div>
                   
                        

                </div>
                <div class="user-info">
                    <div class="user-name">
                        <p class="sle">{{ decodeURIComponent(userInfo.username) || "" }}</p>
                        <p v-if="userInfo.handleName">@{{ userInfo.handleName || "" }}</p>
                        <img style="cursor: pointer;margin-left: 5px;" @click="copyId(userInfo.handleName)" src="@/assets/images/Vector.svg" alt="">
                    </div>
                    <div class="user-introduce">
                        <p :class="showMoreBio ? 'show-bio' : 'user-bio'">
                            {{ decodeURIComponent(userInfo.bio) }}

                        </p>
                        <span v-if="showMoreBio" @click="clickMoreBio" class="more-btn">MORE</span>
                    </div>
                    <!-- <div class="user-introduce">{{ decodeURIComponent(userInfo.bio) }}</div> -->
                    <div class="user-Following">
                        <p @click="onDialog(2)">
                            <span>{{ ccnum(followingCount) }}</span>
                            <span>{{ $t('profile.Following') }}</span>
                        </p>
                        <p @click="onDialog(3)">
                            <span>{{ ccnum(followersCount) }}</span>
                            <span>{{ $t('profile.Followers') }}</span>
                        </p>
                    </div>
                    <div class="user-exchange">
                        <div v-for="(item, index) in exchangeList" :key="index" class="cursor-s">
                            <div class="exchange cursor-s" style="cursor: pointer;" v-if="item.title.length > 0"
                                @click="onToUrl(item)">
                                <img src="@/assets/images/share8.svg" alt="" v-if="item.type == 1">
                                <img src="@/assets/images/share7.svg" alt="" v-if="item.type == 2">
                                <span class="sle">{{ decodeURIComponent(item.title) }}</span>
                            </div>
                            <div class="exchange cursor-s" v-else>
                                <img src="@/assets/images/twitter-gray.svg" alt="" v-if="item.type == 1">
                                <img src="@/assets/images/youtobe-gray.svg" alt="" v-if="item.type == 2">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="user-tab">
                    <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
                        <el-tab-pane label="Verse" name="Verse" v-loading="loading" style="min-height: 300px;"
                            element-loading-background="#292929">

                            <div>
                                <div v-for="(item, index) in verseList" :key="index">
                                    <verse :verseDetails="item" :verseIndex="index" @deleteVerseNow="deleteVerseNow"
                                        @has-like="likeMyVerse" @onFollow="onVerseFollow" @has-book-mark="bookmarkMyVerse">
                                    </verse>

                                </div>
                                <div style="width: 100%;height: 60px;display: flex;align-items: center;justify-content: center;"
                                    element-loading-background="#292929" v-show="loadingMore" v-loading="loadingMore">

                                </div>
                            </div>

                            <div class="infinite-list follow-empty" v-if="verseList.length <= 0 && !loading">
                                <img src="@/assets/images/empty.svg" alt="">
                                <span style="color: #555555;margin-top: 10px;">{{ $t('Bookmark.NoData') }}</span>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="Media" name="Media" v-loading="loadingMedia" style="min-height: 300px;"
                            element-loading-background="#292929">


                            <div class="infinite-list follow-empty" v-if="profileMediaList.length <= 0 && !loadingMedia">
                                <img src="@/assets/images/empty.svg" alt="">
                                <span style="color: #555555;margin-top: 10px;">{{ $t('Bookmark.NoData') }}</span>
                            </div>
                            <div v-else>
                                <mediaList :mediaLists="profileMediaList" v-if="profileMediaList.length>0"></mediaList>
                                <!-- <div style="width: 100%;height: 60px;display: flex;align-items: center;justify-content: center;"
                                    element-loading-background="#292929" v-show="true" v-loading="true"> -->
                                <!-- </div> -->

                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="Likes" name="Likes" v-loading="loadingliked" style="min-height: 300px;"
                            element-loading-background="#292929">
                            <div>
                                <div v-for="(item, index) in likedVerseList" :key="index">
                                    <verse :verseDetails="item" @onFollow="onFollow" :verseIndex="index"
                                        @has-like="likeVerse" @has-book-mark="bookmarkVerse">
                                    </verse>
                                    

                                </div>
                                <div style="width: 100%;height: 60px;display: flex;align-items: center;justify-content: center;"
                                        element-loading-background="#292929" v-show="loadingLikedMore"
                                        v-loading="loadingLikedMore">
                                    </div>
                            </div>
                            <div class="infinite-list follow-empty" v-if="likedVerseList.length <= 0 && !loadingliked">
                                <img src="@/assets/images/empty.svg" alt="">
                                <span style="color: #555555;margin-top: 10px;">{{ $t('Bookmark.NoData') }}</span>
                            </div>
                        </el-tab-pane>

                    </el-tabs>
                </div>





            </div>
        </div>
        <!-- </el-scrollbar> -->


        <div class="square-right">
            <suggestions></suggestions>
            <backTop @backScrollTop="scrollTop" v-show="showBackTop"></backTop>
        </div>
        <div v-if="dialogStatus == 1">
            <dialogShare v-model:Visible="dialogShareVisible" @handleClose="onShareDialog" :data="shareData"  :pageType="2"></dialogShare>
        </div>
        <div v-if="dialogStatus == 2">
            <dialogFollowing v-model:Visible="dialogVisible" @handleClose="onDialog" :data="userInfo"></dialogFollowing>

        </div>
        <div v-if="dialogStatus == 3">
            <dialogFollowers v-model:Visible="dialogVisible" @handleClose="onDialog" :data="userInfo"></dialogFollowers>

        </div>

    </div>
    <notNotification v-else></notNotification>
    <dialogText :Visible="deleteVisible" :data="deleteText" @handleClose="handleDelete"></dialogText>
</template>

<script setup lang="ts">
import { initService as initVerseService, deleteVerse, getVersesByOwner, GetBookMark, getLikedVerses, saveVerseLike, deleteVerseLike, addVerseIdToBookMark, removeVerseIdFromBookMark } from "@/libs/verse"
import type { TabsPaneContext } from 'element-plus'
import { onMounted, computed, reactive, ref, watch, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import suggestions from '@/components/suggestions.vue';
import { UserState } from "@/store/modules/users"
import { require } from '@/utils/require';
import dialogShare from "@/components/dialog/dialogShare.vue";
import dialogFollowing from "@/components/dialog/dialogFollowing.vue";
import dialogFollowers from "@/components/dialog/dialogFollowers.vue";
import notNotification from "@/components/notLogin/content.vue";
import backTop from '@/components/backTop.vue';
import verse from '@/components/verse.vue';
import mediaList from '../components/media-list.vue';
import dialogText from '@/components/dialog/dialogText.vue';
import local from "@/utils/local";
import { LoginState } from "@/store/modules/login";
import { getUserProfile, GetUserProfileOfOthers } from "@/libs/user"
import { downloadFile, downloadFileOfOthers, getProfileFileInfos } from "@/libs/file"
import { getUserFollowerdList, getUserFollowing, GetUserFollowers } from "@/libs/followApi"
import {getNotifications } from "@/libs/notification";
// import { NotificationService } from 'storverse-sao-api';
const loginState = LoginState();
const keplrAddress = computed(() => loginState.keplrAddress);
const walletNumber = computed(() => loginState.walletNumber);
const $store = UserState()
import { ElMessage } from 'element-plus'
interface exchangeListProps {
    icon: any,
    title: string,
    type: number
}
interface KeplrUser {
    bio: string;
    did: string;
    id: string;
    twitter: string;
    username: string;
    youtube: string;
    avatar: string;
    DownAvatar: string;
    followingCount: number;
    followercount: number;
}

const router = useRouter()
const $router = useRoute()
const data = {
    name: 'NANA',
    eth: 0.005,
    days: 365,
    avatar: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202105%2F19%2F20210519212438_ced7e.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1683878438&t=1085f9f739087bc4b30973fde4cf1359"
}
const userDataId = ref("")
const loading = ref(true)
let verseList: any = reactive([])
const loadingMore = ref(false)
let likedVerseList: any = reactive([])
const followingCount = ref(0)
const followersCount = ref(0)
const userId = ref()
let userInfo: any = ref({
    username: "",
    handleName: '',
    bio: ''
})
const myUserInfo = computed(() => {
    return $store.KeplrUserInfo
})
// const toGetVersesByOwner = () => {

//     loading.value = true
//     getVersesByOwner(userId.value, userDataId.value).then(res => {
//         console.log(...res);
//         verseList.push(...res)
//         // verseList.push(res[0])
//         loading.value = false
//     }).catch(err => {
//         console.error(err)
//         loading.value = false
//     })
// }
onMounted(async () => {
    console.log('mounted fist????????');

    // const id = $router.query.key

    // userId.value = id
    console.log('userId.value====>', userId.value);

    if ($store.KeplrUserInfo.id) {
        userDataId.value = $store.KeplrUserInfo.id
    }
    getUserInfo()
    await init()
    getFollowCount()
    if (keplrAddress.value) {
        const notifications = await getNotifications("0", userDataId.value, 10, 0);
        $store.setTotalCount(notifications.totalCount)
        console.log(notifications);
    }
   
})
watch(
    () => $router,
    async (newRouterName: any, oldRouterName: any) => {

        if (newRouterName.query.key) {

            userId.value = ''
            userId.value = newRouterName.query.key
            console.log('userId.value====>', userId.value);

            if ($store.KeplrUserInfo.id) {
                userDataId.value = $store.KeplrUserInfo.id
                if (userId.value == userDataId.value ) {
                    router.push('/profile')
                }
            }

            loading.value = true
            loadingMore.value = false
            activeName.value = "Verse"
            versePage.value = 0
            getUserInfo()
            verseList = []
            likedVersePage.value = 0
            loadingMedia.value = true
            likedVerseList = []
            loadingliked.value = true
            MediaPage.value = 0
            profileMediaList = []
            await init()
            getFollowCount()
        }
        
    },
    { immediate: true, deep: true }
)
watch(walletNumber,async (old,newval)=>{
    if (keplrAddress.value) {
        const notifications = await getNotifications("0", userDataId.value, 10, 0);
        $store.setTotalCount(notifications.totalCount)
        console.log(notifications);
    }
},{immediate: true})


const infiniteSquare = ref()
const scrollTop = () => {
    // infiniteSquare.value.scrollTop = 0
    infiniteSquare.value.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

const showBackTop = ref(false)
const scrollSquare = (val: any) => {
    if (val.target.scrollTop > 1000) {
        showBackTop.value = true
    } else {
        showBackTop.value = false

    }

}
const dialogVisible = ref(false)
const dialogStatus = ref(0)
const exchangeList: Array<exchangeListProps> = reactive([{
    icon: require("@/assets/images/share8.svg"),
    title: '',
    type: 1,
    noIcon: require("@/assets/images/twitter-gray.svg")
}, {
    icon: require("@/assets/images/share7.svg"),
    title: '',
    type: 2,
    noIcon: require("@/assets/images/youtobe-gray.svg")

}])
const userState = UserState();
const activeName = ref("Verse")





const deleteText = ref('')
const deleteVisible = ref(false)
const deleteIndex = ref()
const versePage = ref(0)
const verseLimit = ref(10)
const deleteVerseNow = (text: string, index: number | undefined) => {

    deleteVisible.value = true
    deleteText.value = text
    deleteIndex.value = index
}
const handleDelete = (type: Number) => {

    deleteVisible.value = false
    if (type == 1) {
        deleteVerse(verseList[deleteIndex.value].id).then(res => {
            if (res) {
                verseList.splice(deleteIndex.value, 1)
            }

        }).catch(err => {
            console.error(err);
        })
    }


}
const onRouter = (url: string) => {
    router.push(url)
}


const getUserInfo = () => {
    console.log('getinfo---------------------------', userId.value);

    GetUserProfileOfOthers(userId.value).then(async (res1: any) => {
        console.log(res1.id)


        exchangeList[0].title = res1.twitter
        exchangeList[1].title = res1.youtube
        if (decodeURIComponent(res1.bio).length > 170) {
            showMoreBio.value = true
        } else {
            showMoreBio.value = false

        }
        if (res1.avatar || res1.banner) {
            userInfo.value = res1
            toDownloadFile(res1)
        } else {
            userInfo.value = res1



            // UserState().SetUserInfo(res1)
            // LoginState().SetkeplrAddress(res1)
        }
        userInfo.value.handleName = res1.id;
      
    }).catch(res => {
        ElMessage({
            dangerouslyUseHTMLString: true,
            customClass: 'successMessage',
            type: 'error',
            message: `<p style="color: #fff;">${res} </p>`,
        })
    })
}

const toDownloadFile = (user: any) => {
    let userdetails = { ...user }

    const dataId = userState.KeplrUserInfo.id
    if (user.avatar) {
        downloadFileOfOthers(user.avatar, dataId, true).then(res => {

            userInfo.value.DownAvatar = 'data:image/png;base64,' + res;

            // UserState().SetUserInfo(userdetails)

            // LoginState().SetkeplrAddress(userdetails)
        }).catch(Response => {
            userInfo.value.DownAvatar = ""



        })
    }
    if (user.banner) {
        downloadFileOfOthers(user.banner, dataId, true).then(res => {

            userInfo.value.backImg = 'data:image/png;base64,' + res;
        }).catch(Response => {

            userInfo.value.backImg = ''

            console.log(Response);

        })
    }
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

const getFollowCount = async () => {
    getUserFollowerdList(userId.value, false, userState.KeplrUserInfo.id).then(async res => {

        followingCount.value = res.count
        
    }).catch(res => {
        console.log(res)
    })

    GetUserFollowers(userId.value).then(res => {
        followersCount.value = res.count
    }).catch(res => {
        console.log(res, "=====")
    })
}
const handleClick = (tab: TabsPaneContext, event: Event) => {
    if (activeName.value == 'Likes') {
        if (likedVerseList.length == 0) {
            initLikedVerse()

        }
    }
    if (activeName.value == 'Media') {
        if (profileMediaList.length == 0) {

            initMedia()

        }
    }
    if (activeName.value == 'Verse') {
        console.log(88888)
        if (verseList.length == 0) {
            // loadingMore.value = true
            // versePage.value = versePage.value + 10
            init()
        }
    }

}

const load = (e: any) => {
    if (activeName.value == 'Likes') {
        if (likedVerseList.length > 3) {
            // loadingMore.value = true
            loadingLikedMore.value = true
            likedVersePage.value = likedVersePage.value + 10
            initLikedVerse()
        }
    }
    if (activeName.value == 'Media' && hasMoreMedia.value == true) {
        MediaPage.value = MediaPage.value + 10
        initMedia()
    }
    if (activeName.value == 'Verse') {

        if (verseList.length > 3) {

            loadingMore.value = true

            versePage.value = versePage.value + 10
            init()
        }

    }




}
const shareData = ref()
const onDialog = (status: number) => {
    dialogStatus.value = status
    dialogVisible.value = !dialogVisible.value
}
const dialogShareVisible = ref(false)
const onShareDialog = () => {
    dialogStatus.value = 1
    shareData.value = userInfo.value
    dialogShareVisible.value = !dialogShareVisible.value
}
const bookedMark = ref()

const initBookMark = () => {
    const provider = local.GET('provider')
    GetBookMark(provider.sid).then(res => {
        console.log(res);
        bookedMark.value = res
    }).catch(res => {
        bookedMark.value = undefined
    })
}

initBookMark()
const init = async () => {

    getVersesByOwner(userId.value, userState.KeplrUserInfo.id, bookedMark.value, verseLimit.value, versePage.value).then( res1 => {
        console.log(res1)

        console.log(versePage.value);

        if (versePage.value == 0) {
            verseList = res1
        } else {
            verseList.push(...res1)
        }
        // verseList.push(...res1)
        

        loading.value = false
        loadingMore.value = false
    }).catch(res => {
        loadingMore.value = false
        loading.value = false

    })

}
const likedVersePage = ref(0)
const likedVerseLimit = ref(10)
const loadingliked = ref(true)
const loadingLikedMore = ref(false)
const initLikedVerse = () => {
    getLikedVerses(userId.value, likedVerseLimit.value, likedVersePage.value, bookedMark.value, userState.KeplrUserInfo.id).then(res => {
        console.log(res);
        if (res.length > 0) {
            likedVerseList.push(...res)
        }
        loadingliked.value = false
        loadingLikedMore.value = false
    }).catch(Response => {
        loadingliked.value = false
        loadingLikedMore.value = false
    })
}
const MediaPage = ref(0)
const MediaLimit = ref(10)
const loadingMedia = ref(true)
let profileMediaList: any = reactive([])
const hasMoreMedia = ref(false)
const initMedia = () => {
    console.log(MediaPage.value);
    console.log(MediaLimit.value);
    console.log(userId.value);
    console.log(userState.KeplrUserInfo.id);
    
    getProfileFileInfos(userId.value, MediaLimit.value, MediaPage.value, userState.KeplrUserInfo.id).then(async (res: any) => {
        console.log(res);
        hasMoreMedia.value = res.hasMore
        const list = await Promise.all(res.fileInfos.map(async (item: any) => {

            if (item.contentType.includes('image')) {

                const res1 = await downloadFileOfOthers(item.fileDataId, userState.KeplrUserInfo.id, true)

                item.downloadFile = 'data:image/png;base64,' + res1

                return item
            } else {
                const res2 = await downloadFileOfOthers(item.fileDataId, userState.KeplrUserInfo.id, false)
                console.log(res2)
                item.downloadFile = URL.createObjectURL(new Blob([res2], { type: 'audio/wav' }));

                return item

            }

        }))
        console.log(list);
        profileMediaList.push(...list)

        // if (profileMediaList.length == 0) {
        //     // profileMediaList.length = 0
        //     // profileMediaList.push(...list)
        //     profileMediaList = list
        // } else {
        //     profileMediaList.push(...list)

        // }

        loadingMedia.value = false

        // if (props.verseDetails.fileType == 'video') {
        //     verseVideo.value = await Promise.all(props.verseDetails.fileIds.map(async item => {
        //         const res = await downloadFile(item, false, true)
        //         // console.log(res);

        //         return URL.createObjectURL(new Blob([res.data], { type: 'audio/wav' }));
        //     }))
        // }




    }).catch(Response => {
        loadingMedia.value = false

    })
}
const onFollow = (id: string) => {
    console.log(id)
    likedVerseList.forEach((element: any) => {
        if (element.id == id) {
            element.hasFollowedOwner = !element.hasFollowedOwner
        }
    });
}
const likeVerse = (index: string, type: boolean) => {
    console.log();
    console.log(type);
    let verseLike = {
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        verseId: likedVerseList[index].id,
        status: 0,
        owner: userState.KeplrUserInfo.id
    }
    if (type == true) {
        console.log('like');
        verseLike.status = 1
        saveVerseLike(verseLike, userState.KeplrUserInfo.did).then(res => {
            likedVerseList[index].CountKey = 0
            if (!res.includes('Error')) {

                likedVerseList[index].likeCount++
                likedVerseList[index].hasLiked = type
            }
            console.log(res);

        })
        // like
    } else {
        // cancel like

        deleteVerseLike(likedVerseList[index].id, userState.KeplrUserInfo.did).then(res => {
            console.log(res);
            likedVerseList[index].CountKey = 1
            if (!res.includes('Error')) {

                likedVerseList[index].likeCount--
    
                likedVerseList[index].hasLiked = type
            }

        }).catch(res => {
            console.log(res);

        })
    }

}
const likeMyVerse = (index: string, type: boolean) => {

    let verseLike = {
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        verseId: verseList[index].id,
        status: 0,
        owner: userState.KeplrUserInfo.id
    }
    if (type == true) {
        console.log('like');
        verseLike.status = 1
        saveVerseLike(verseLike, userState.KeplrUserInfo.did).then(res => {
            console.log(res);
            verseList[index].CountKey = 0
            if (!res.includes('Error')) {

                verseList[index].likeCount++
                
                verseList[index].hasLiked = type
            }


        })
        // like
    } else {
        // cancel like

        deleteVerseLike(verseList[index].id, userState.KeplrUserInfo.did).then(res => {
            console.log(res);
            verseList[index].CountKey = 1
            if (!res.includes('Error')) {

                verseList[index].likeCount--
    
                verseList[index].hasLiked = type
            }

        }).catch(res => {
            console.log(res);

        })
    }

}

const bookmarkVerse = (index: string, type: boolean) => {
    // console.log(verseList[index]);
    // console.log(type);
    if (type == true) {
        // console.log('b');

        addVerseIdToBookMark(likedVerseList[index].id, userState.KeplrUserInfo.did).then(res => {
            console.log(res);
            likedVerseList[index].CountKey = 2

            if (!res.includes('Error')) {

                likedVerseList[index].hasBookMarked = type
            }

        })
    } else {
        console.log('r-b');
        removeVerseIdFromBookMark(likedVerseList[index].id, userState.KeplrUserInfo.did).then(res => {
            console.log(res);
            likedVerseList[index].CountKey = 3

            if (!res.includes('Error')) {

                likedVerseList[index].hasBookMarked = type
            }

        })
    }

}
const bookmarkMyVerse = (index: string, type: boolean) => {
    // console.log(verseList[index]);
    // console.log(type);
    if (type == true) {
        // console.log('b');

        addVerseIdToBookMark(verseList[index].id, userState.KeplrUserInfo.did).then(res => {
            console.log(res);
            verseList[index].CountKey = 2
            if (!res.includes('Error')) {

                verseList[index].hasBookMarked = type
            }

        })
    } else {
        console.log('r-b');
        removeVerseIdFromBookMark(verseList[index].id, userState.KeplrUserInfo.did).then(res => {
            console.log(res);
            verseList[index].CountKey = 3

            if (!res.includes('Error')) {

                verseList[index].hasBookMarked = type
            }

        })
    }

}

function filterSub(str: string = '', frontLen: number, endLen: number) {

    if (str == "") {
        return "";
    } else {
        var xing = "";
        for (var i = 0; i < 3; i++) {
            xing += ".";
        }
        return (
            str.substring(0, frontLen) + xing + str.substring(str.length - endLen)
        );
    }
}

function copyId(text: string) {
    let input = document.createElement('input')
    input.value = text
    input.id = 'creatDom'
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    ElMessage({
        dangerouslyUseHTMLString: true,
        customClass: 'successMessage',
        type: 'success',
        message: `<p style="color: #fff;">Copied! </p>`,
    })

}
function ccnum(str: string | number) {

    if (str) {
        return Number(str).toLocaleString()
    } else {
        return 0
    }

}
const goBack = async () => {

    await history.back()
    // setTimeout(() => {
    //     loginState.walletNumber++;
    // }, 200)
}
const onToUrl = (item: exchangeListProps) => {
    if (item.type == 1) {
        window.open(`https://twitter.com/${item.title}`)
    } else if (item.type == 2) {
        window.open(`https://www.youtube.com/@${item.title}`)
    }
}
const onVerseFollow = (follow: any) => {
    verseList.forEach((element: any) => {
        if (element.id == follow.id) {
            element.hasFollowedOwner = !element.hasFollowedOwner
        }
    });
}
const showMoreBio = ref(false)
const clickMoreBio = () => {
    showMoreBio.value = false
}
</script>

<style scoped lang="scss">
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

    p:nth-child(1) {
        border-bottom: 1px solid #474747;
        transform: matrix(1, 0, 0, 1, 0, 0);
        border-radius: 9px 9px 0px 0px;

    }
}

.user-tab {
    margin-top: 20px;

    :deep(.el-tabs__nav-wrap::after) {
        height: 1px;
        background-color: #474747;
    }

    :deep(.el-tabs__header) {
        margin: 0 0 1px;
    }

    :deep(.el-tabs__nav-scroll) {
        .el-tabs__nav {
            width: 670px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 30px;
            box-sizing: border-box;

            .el-tabs__item {
                color: #909791;
            }

            .is-active {
                color: #fff;
            }

            .el-tabs__active-bar {
                display: none;
            }


        }
    }

    .follow-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 500px;

        span {
            margin-top: 10px;
        }
    }

}

.square {

    height: 100%;
    display: flex;

    .scroll::-webkit-scrollbar-track {
        background-color: #0F0F0F;
        // border-radius: 5px;
        padding: 0px 2px;
        border-radius: 20px;

    }

    .scroll::-webkit-scrollbar-thumb {
        background-color: #333333;
        border-radius: 20px;

    }


    .square-left {
        width: 670px;
        min-height: 708px;

        background: #292929;
        border-radius: 10px;

        // overflow: auto;
        .userImg {
            width: 100%;
            height: 140px;
            border-radius: 10px 10px 0px 0px;
            position: relative;

            >.toback {
                position: absolute;
                top: 10px;
                left: 20px;
                width: 25px;
                height: 25px;
                border-radius: 50%;
                border: 2px solid #000000;
                text-align: center;
                line-height: 25px;
                cursor: pointer;
            }

            .back {
                width: 100%;
                height: 140px;
                border-radius: 10px 10px 0px 0px;
                // border-bottom: 1px solid rgba(229, 229, 229, 0.2);

                img {
                    width: 100%;
                    height: 140px;
                    border-radius: 10px 10px 0px 0px;
                    object-fit: cover
                }
            }

            .cover {
                border: 4px solid #292929;
                width: 100px;
                height: 100px;
                border-radius: 50%;
                position: absolute;
                top: 60px;
                left: 30px;
                z-index: 99;

                img {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    object-fit: cover;
                }
            }

            .DID {
                width: 200px;
                height: 31px;
                background: rgba(22, 22, 22, 0.6);
                backdrop-filter: blur(40px);
                border-radius: 38px;
                font-weight: 400;
                font-size: 14px;
                line-height: 21px;
                color: #fff;
                mix-blend-mode: normal;
                padding: 0 10px;
                box-sizing: border-box;
                position: absolute;
                top: 12px;
                right: 12px;

                span:nth-child(2) {
                    color: #56E868;
                }

                img {
                    width: 12px;
                    height: 14px;
                }
            }
        }

        .setBut {
            // background-color: #292929;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-top: 10px;
            margin-right: 30px;
            position: relative;

            div {
                width: 24px;
                height: 30px;
                border-radius: 6px;

            }

        }

        .setHover {
            div:hover {
                background: rgba(0, 0, 0, 0.4);

            }
        }

        .user-info {
            padding: 0 30px;
            box-sizing: border-box;

            .user-name {
                display: flex;
                align-items: center;
                margin-bottom: 10px;

                p:nth-child(1) {
                    max-width: 400px;
                    font-weight: 700;
                    font-size: 20px;
                    line-height: 26px;
                    color: #FFFFFF;
                    margin-right: 15px;
                }

                p:nth-child(2) {
                    font-size: 14px;
                    line-height: 21px;
                    color: #909791;
                    mix-blend-mode: normal;
                }
            }

            .user-introduce {
                font-weight: 400;
                font-size: 14px;
                line-height: 22px;
                color: #FFFFFF;
                mix-blend-mode: normal;

                .show-bio {
                    line-height: 22px;
                    max-height: 44px;
                    font-weight: 400;
                    font-size: 14px;
                    overflow: hidden;
                    word-break: break-all;
                    word-wrap: break-word;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                }

                .user-bio {
                    word-break: break-all;
                    word-wrap: break-word;
                    line-height: 22px;
                    font-weight: 400;
                    font-size: 14px;
                }

                .more-btn {
                    position: absolute;
                    right: 0;
                    bottom: 3px;
                    text-decoration-line: underline;
                    color: #56E868;
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 17px;
                    background-color: #292929;
                    cursor: pointer;
                }
            }

            .user-Following {
                display: flex;
                align-items: center;
                margin-top: 10px;

                p {
                    margin-right: 42px;
                    font-size: 14px;
                    line-height: 17px;
                    cursor: pointer;

                    span:nth-child(1) {
                        font-weight: 600;
                        margin-right: 5px;
                    }

                    span:nth-child(2) {
                        font-weight: 500;
                        color: #909791;
                    }
                }
            }

            .user-exchange {
                display: flex;
                align-items: center;
                margin-top: 12px;

                .exchange {
                    padding: 3px 12px;
                    display: flex;
                    align-items: center;
                    // width: 111px;
                    height: 24px;
                    background: #000000;
                    border-radius: 30px;
                    font-size: 12px;
                    line-height: 18px;
                    margin-right: 10px;
                    box-sizing: border-box;
                    cursor: default;

                    span {
                        display: inline-block;
                        max-width: 100px;
                        margin-left: 5px;
                    }
                }
            }
        }
    }

    .square-right {
        position: relative;
        margin-left: 20px;
        // padding-left: 20px;
    }

}
</style>