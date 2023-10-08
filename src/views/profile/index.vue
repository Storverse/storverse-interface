<template>
    <div class="square" v-if="keplrAddress || userInfo.did">
        <!-- <el-scrollbar height="100%" @scroll="load"> -->

        <div class="scroll" ref="infiniteSquare" infinite-scroll-distance="10" @scroll="scrollSquare"
            v-infinite-scroll="load" style="overflow:auto;height: 100%;overflow-y: auto;overflow-x: hidden;">


            <div class="square-left">
                <div class="userImg" style="">
                    <div class="back">
                        <img :src="userInfo.backImg" alt="" v-if="userInfo.backImg">
                        <img src="@/assets/images/backImage.png" alt="111" v-else>
                    </div>
                    <div class="cover">
                        <img :src="userInfo.DownAvatar"  alt=""
                            v-if="userInfo.DownAvatar">
                        <img src="@/assets/images/avatar.png" alt="" v-else>
                    </div>
                    <div class="DID flx-justify-between cursor-s">
                        <span>{{ $t('profile.DID') }}</span>
                        <span>{{ filterSub(userInfo.did, 6, 6) }}</span>
                        <img style="cursor: pointer;" @click="copyId(userInfo.did)" src="@/assets/images/Vector.svg" alt="">
                    </div>
                </div>

                <div class="" style="display: flex;align-items: center;justify-content: end;height: 43px;">
                    <div class="setBut" style="margin-right: 0;">
                        <div class="flx-center" @click="onDialog(1)">
                            <img style="cursor: pointer;" src="@/assets/images/share1.svg" alt="">
                        </div>
                    </div>
                    <el-popover placement="bottom-end" trigger="hover" :show-arrow="false"
                        popper-style=" background-color: #292929;border-color: #909791;padding:0;height:80px; border-radius: 10px;"
                        :width="148">
                        <template #default>
                            <div class="set-box">
                                <p style="cursor: pointer;" class="flx-justify-between" @click="onRouter('/dashboardUser')">
                                <div> <img src="@/assets/images/Dashboard.svg" alt=""></div>
                                <span>{{ $t('profile.Dashboard') }}</span>
                                </p>
                                <p style="cursor: pointer;" class="flx-justify-between" @click="onRouter('/settingUser')">
                                <div>
                                    <img id="setmgs" src="@/assets/images/seting.svg" alt="" fill="currentColor">
                                </div>
                                <span>{{ $t('profile.Setting') }}</span>
                                </p>
                            </div>
                        </template>
                        <template #reference>
                            <div class="setBut setHover">
                                <!-- <div class="flx-center">
                                        <img src="@/assets/images/share1.svg" alt="">
                                    </div> -->
                                <div class="flx-center" style="cursor: pointer;">
                                    <img src="@/assets/images/more1.svg" alt="">

                                </div>

                            </div>
                        </template>
                    </el-popover>

                </div>
                <div class="user-info">
                    <div class="user-name">
                        <p class="sle">{{ decodeURIComponent(userInfo.username) }}</p>
                        <p>@{{ userInfo.handleName }}</p>
                        <img style="cursor: pointer;margin-left: 5px;" @click="copyId(userInfo.handleName)" src="@/assets/images/Vector.svg" alt="">
                    </div>
                    <!-- <div class="user-introduce">{{ userInfo.bio }}</div> -->
                    <div class="user-introduce">
                        <p :class="showMoreBio ? 'show-bio' : 'user-bio'">
                            {{ decodeURIComponent(userInfo.bio) }}

                        </p>
                        <span v-if="showMoreBio" @click="clickMoreBio" class="more-btn">MORE</span>
                    </div>

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
                        <div v-for="(item, index) in exchangeList" :key="index">
                            <div class="exchange cursor-s" style="cursor: pointer;" v-if="item.title.length > 0"
                                @click="onToUrl(item)">
                                <img src="@/assets/images/share8.svg" alt="" v-if="item.type == 1">
                                <img src="@/assets/images/share7.svg" alt="" v-if="item.type == 2">
                                <span class="sle">{{ decodeURIComponent(item.title) }}</span>
                            </div>
                            <div class="exchange cursor-s" v-else >
                                <img src="@/assets/images/twitter-gray.svg" alt="" v-if="item.type == 1">
                                <img src="@/assets/images/youtobe-gray.svg" alt="" v-if="item.type == 2">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="user-tab">
                    <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
                        <el-tab-pane :label="$t('profile.Verse')" name="Verse" v-loading="loading"
                            style="min-height: 300px;" element-loading-background="#292929">

                            <div>
                                <div v-for="(item, index) in verseList" :key="index">
                                    <verse :verseDetails="item" :verseIndex="index" @deleteVerseNow="deleteVerseNow"
                                        @has-like="likeMyVerse" @has-book-mark="bookmarkMyVerse">
                                    </verse>

                                </div>
                                <div style="width: 100%;height: 60px;display: flex;align-items: center;justify-content: center;"
                                    element-loading-background="#292929" v-loading="loadingMore" v-show="loadingMore">

                                </div>
                            </div>

                            <div class="infinite-list follow-empty" v-if="verseList.length <= 0 && !loading">
                                <img src="@/assets/images/empty.svg" alt="">
                                <span style="color: #555555;margin-top: 10px;">{{ $t('Bookmark.NoData') }}</span>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="$t('profile.Media')" name="Media" v-loading="loadingMedia"
                            style="min-height: 300px;" element-loading-background="#292929">


                            <div class="infinite-list follow-empty" v-if="profileMediaList.length <= 0 && !loadingMedia">
                                <img src="@/assets/images/empty.svg" alt="">
                                <span style="color: #555555;margin-top: 10px;">{{ $t('Bookmark.NoData') }}</span>
                            </div>
                            <div v-else>
                                
                                <mediaList :mediaLists="profileMediaList"></mediaList>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="$t('profile.Likes')" name="Likes" v-loading="loadingliked"
                            style="min-height: 300px;" element-loading-background="#292929">
                            <div>
                                <div v-for="(item, index) in likedVerseList" :key="index">
                                    <verse :verseDetails="item" :verseIndex="index" @onFollow="onFollow"
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
            <dialogShare v-model:Visible="dialogVisible" @handleClose="onDialog" :data="data"></dialogShare>
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
import { onMounted, computed, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router'
import suggestions from '@/components/suggestions.vue';
import { UserState } from "@/store/modules/users"
import { require } from '@/utils/require';
import dialogShare from "@/components/dialog/dialogShare.vue";
import dialogFollowing from "@/components/dialog/dialogFollowing.vue";
import dialogFollowers from "@/components/dialog/dialogFollowers.vue";
import notNotification from "@/components/notLogin/content.vue";
import backTop from '@/components/backTop.vue';
import verse from '@/components/verse.vue';
import mediaList from './components/media-list.vue';
import dialogText from '@/components/dialog/dialogText.vue';
import local from "@/utils/local";
import { LoginState } from "@/store/modules/login";
import { getUserProfile, } from "@/libs/user"
import { downloadFile, getProfileFileInfos, getFileInfo } from "@/libs/file"
import { getUserFollowerdList, getUserFollowing, GetUserFollowers } from "@/libs/followApi"
import { ElMessage } from 'element-plus'
import { number } from "echarts";
const loginState = LoginState();
let keplrAddress = computed(() => {
    console.log(loginState.keplrAddress, "===")
    return loginState.keplrAddress
});
const walletNumber = computed(() => loginState.walletNumber);
const $store = UserState()
const userInfo = computed(() => {
    return $store.KeplrUserInfo
})
// const paymentStatus = computed(() => {
//     return $store.paymentReminder
// })
interface exchangeListProps {
    icon: any,
    title: string
    type: number
}


const router = useRouter()
const data = {
    name: '',
    eth: 0.005,
    days: 365,
    avatar: ""
}
const loading = ref(true)
const loadingMore = ref(false)
let verseList: any = reactive([])
const likedVerseList: any = reactive([])
const followingCount = ref(0)
const followersCount = ref(0)
const toGetVersesByOwner = () => {
    console.log('toGetVersesByOwner');
    loading.value = true
    getVersesByOwner(userInfo.value.id).then(res => {
        console.log(...res);
        verseList.push(...res)
        // verseList.push(res[0])
        loading.value = false
    }).catch(err => {
        console.error(err)
        loading.value = false
    })
}
const versePage = ref(0)
const verseLimit = ref(10)
const load = (e: any) => {
    // loadingMore.value = true
    if (activeName.value == 'Likes') {
        if (likedVerseList.length > 3) {
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

    getVersesByOwner(userInfo.value.id, userInfo.value.id, bookedMark.value, verseLimit.value, versePage.value).then(res1 => {
        console.log(res1);

        if (res1.length > 0) {
            verseList.push(...res1)

        }
        loadingMore.value = false
        loading.value = false
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
    getLikedVerses(userInfo.value.id, likedVerseLimit.value, likedVersePage.value, bookedMark.value, userState.KeplrUserInfo.id).then(res => {
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
    console.log(MediaLimit.value, MediaPage.value)
    getProfileFileInfos(userInfo.value.id, MediaLimit.value, MediaPage.value, userInfo.value.id).then(async (res: any) => {
        console.log(res);
        hasMoreMedia.value = res.hasMore
        const list = await Promise.all(res.fileInfos.map(async (item: any) => {
            let useLibp2p = false;
            if (item.fileCategory === "libp2p") {
                useLibp2p = true;
            }
            if (item.contentType.includes('image')) {

                const res1 = await downloadFile(item.fileDataId, useLibp2p, false)
                item.downloadFile = 'data:image/png;base64,' + arrayBufferToBase64(res1.data)
                return item
            } else {
                const res2 = await downloadFile(item.fileDataId, useLibp2p, false)
                item.downloadFile = URL.createObjectURL(new Blob([res2.data], { type: 'audio/wav' }));

                return item

            }


        }))
        profileMediaList.push(...list)
        loadingMedia.value = false

        //     if(list.length>0){


        //     if (likedVersePage.value == 0) {
        //         // profileMediaList.length = 0
        //         // profileMediaList.push(...list)
        //         profileMediaList = list
        //     } else {
        //         profileMediaList.push(...list)
        //     }
        // }


    }).catch(Response => {
        loadingMedia.value = false

    })
}
onMounted(async () => {
    getUserInfo()
    // toGetVersesByOwner()
    await init()
    getFollowCount()


})
watch(walletNumber, (newValue, oldValue) => {
    getUserInfo()
    verseLimit.value = 10
    versePage.value = 0
    verseList = []
    init()

    // toGetVersesByOwner()
    getFollowCount()

});
watch(keplrAddress, () => {
    getUserInfo()
    verseLimit.value = 10
    versePage.value = 0
    verseList = []
    init()

    // toGetVersesByOwner()
    getFollowCount()

})
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
const userState = UserState();



const exchangeList: Array<exchangeListProps> = reactive([{
    icon: require("@/assets/images/share8.svg"),
    title: '',
    type: 1
}, {
    icon: require("@/assets/images/share7.svg"),
    title: '',
    type: 2
},
    // {
    //     icon: require("@/assets/images/share6.svg"),
    //     title: userinfo.twitter
    // }, {
    //     icon: require("@/assets/images/share9.svg"),
    //     title:userinfo.twitter
    // }
]);
const activeName = ref("Verse")




const deleteText = ref('')
const deleteVisible = ref(false)
const deleteIndex = ref()
const onToUrl = (item: exchangeListProps) => {
    if (item.type == 1) {
        window.open(`https://twitter.com/${item.title}`)
    } else if (item.type == 2) {
        window.open(`https://www.youtube.com/@${item.title}`)
    }
}
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
            console.log(err);
        })
    }

}
const onRouter = (url: string) => {
    router.push(url)
}


const getUserInfo = () => {
    getUserProfile().then(res1 => {
        console.log(decodeURIComponent(res1.bio).length);
        exchangeList[0].title = res1.twitter
        exchangeList[1].title = res1.youtube
        if (decodeURIComponent(res1.bio).length > 170) {
            showMoreBio.value = true
        } else {
            showMoreBio.value = false

        }

        if (res1.avatar || res1.banner) {
            toDownloadFile(res1)
        } else {
            UserState().SetUserInfo(res1)
            LoginState().SetkeplrAddress(res1)
        }


    })
}

const toDownloadFile = async (user: any) => {
    let userdetails = { ...user }

    if (user.avatar) {
        console.log(user.avatar)
        await downloadFile(user.avatar, false, false, true).then(res => {
            userdetails.DownAvatar = 'data:image/png;base64,' + res.data;
        }).catch(Response => {


            console.log(Response);

        })
    }
    if (user.banner) {
        console.log(user.banner)
        await downloadFile(user.banner, false, false, true).then(res => {
            userdetails.backImg = 'data:image/png;base64,' + res.data;
            UserState().setUserBackImg(userdetails.backImg)

        }).catch(Response => {


            console.log(Response);

        })

    }
    UserState().SetUserInfo(userdetails)

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
    getUserFollowerdList(userState.KeplrUserInfo.id, false,).then(res => {

        followingCount.value = res.count

    }).catch(res => {
        console.log(res)
    })

    GetUserFollowers(userState.KeplrUserInfo.id).then(res => {
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
        if (verseList.length == 0) {

            init()
        }

    }

}



const onDialog = (status: number) => {
    dialogStatus.value = status
    dialogVisible.value = !dialogVisible.value
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
            console.log(res);
            likedVerseList[index].CountKey=0
            if (!res.includes('Error')) {
                likedVerseList[index].hasLiked = type

                likedVerseList[index].likeCount++
            }

        })
        // like
    } else {
        verseLike.status = 2
        // cancel like

        deleteVerseLike(likedVerseList[index].id, userState.KeplrUserInfo.did).then(res => {
            console.log(res);
            likedVerseList[index].CountKey=1
            if (!res.includes('Error')) {
                console.log('yuhyuhyuhyuhuyuh');

                likedVerseList[index].likeCount--
                likedVerseList[index].hasLiked = type
            }else{
                console.log('wtf????????');
                
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
            verseList[index].CountKey=1
            if (!res.includes('Error')) {

                verseList[index].hasLiked = type
                verseList[index].likeCount++
            }

        })
        // like
    } else {
        // cancel like

        deleteVerseLike(verseList[index].id, userState.KeplrUserInfo.did).then(res => {
            console.log(res);
            verseLike.status = 2
            verseList[index].CountKey=0
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
            likedVerseList[index].CountKey=2
            if (!res.includes('Error')) {

                console.log(res);
                likedVerseList[index].hasBookMarked = type
            }

        })
    } else {
        console.log('r-b');
        removeVerseIdFromBookMark(likedVerseList[index].id, userState.KeplrUserInfo.did).then(res => {
            likedVerseList[index].CountKey=3

            if (!res.includes('Error')) {

                console.log(res);
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
            likedVerseList[index].CountKey=2

            if (!res.includes('Error')) {

                likedVerseList[index].hasBookMarked = type
            }
            console.log(res);

        })
    } else {
        console.log('r-b');
        removeVerseIdFromBookMark(verseList[index].id, userState.KeplrUserInfo.did).then(res => {
            likedVerseList[index].CountKey=3

            console.log(res);
            if (!res.includes('Error')) {

                likedVerseList[index].hasBookMarked = type
            }

        })
    }

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
                color: #FFFFFF;
                mix-blend-mode: normal;
                position: relative;

                .show-bio {
                    line-height: 22px;
                    max-height: 44px;
                    font-weight: 400;
                    font-size: 14px;
                    word-break: break-all;
                    word-wrap: break-word;
                    overflow: hidden;
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