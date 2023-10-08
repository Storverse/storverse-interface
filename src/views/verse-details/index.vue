<template>
    <div class="square">
        <div v-infinite-scroll="load" class="scroll" style="overflow:auto;height: 100%;overflow-x: hidden;"
            infinite-scroll-distance="1">
            <div class="square-left">
                <div class="square-verses">
                    <div class="tabs flx-justify-between ">
                        <div>
                            <img src="@/assets/images/goback.svg" alt="" @click="goBack" style="cursor: pointer;">
                            <span class="tabs-title">{{ $t('VerseDetails.Verse') }}</span>

                        </div>
                    </div>
                    <div class="verse" v-loading="verseLoading" element-loading-background="#292929">
                        <div class="verse-head flx-justify-between">
                            <div class="user-info flx-justify-between cursor-s" @click="onToUser">
                                <el-avatar :size="40" style="border: 1px solid rgba(71, 71, 71, 1);"
                                    :src="otherProfile.avatar" v-if="otherProfile.avatar" />
                                <img style="width: 40px;height: 40px;" src="@/assets/images/avatar.png" alt="" v-else>
                                <div class="flx-c-star infos">
                                    <div class="flx-center">
                                        <span class="username sle">{{ decodeURIComponent(otherProfile.username) }}</span>
                                        <span class="userDesc sle" v-if="verseContent.verseDetails.owner">@{{
                                            verseContent.verseDetails.owner.substring(0, 13)

                                        }}</span>
                                    </div>
                                    <div class="verse-time">
                                        {{ utils.formatTime(verseContent.verseDetails.createdAt) }}
                                        <!-- {{
                                        
                                        formatDistanceToNow(verseContent.verseDetails.createdAt) }} ago -->
                                    </div>
                                </div>
                            </div>
                            <div class="follow flx-align-center" v-if="otherProfile.id !== userInfo.id">

                                <el-button type="primary" round color="#fff" class="followed-status" :loading="butLoading"
                                    v-if="verseContent.verseDetails.hasFollowedOwner && verseContent.verseDetails.payToFollow == ''"
                                    @click="onFollow(verseContent.verseDetails)">
                                    {{ $t('VerseDetails.Unfollow') }}</el-button>
                                <!-- <div class="followed-status" v-if="i >= 4">
                                Unfollow
                            </div> -->
                                <el-button type="primary" round color="#fff" class="unFollow-status" :loading="butLoading"
                                    v-if="!verseContent.verseDetails.hasFollowedOwner && verseContent.verseDetails.payToFollow == ''"
                                    @click="onFollow(verseContent.verseDetails)">
                                    {{ $t('VerseDetails.Follow') }}</el-button>
                                <!-- <div class="unFollow-status" >
                                Follow
                            </div> -->
                                <!-- <div class="unFollow-status" v-if="!otherProfile.isPayFollow && !otherProfile.isFollow">
                                    Follow
                                </div> -->
                                <div class="unFollow-status-unpay flx-center" style="margin-top: 0;"
                                    @click="dialogPayFollow"
                                    v-if="!verseContent.verseDetails.hasFollowedOwner && verseContent.verseDetails.payToFollow != ''">
                                    <img src="@/assets/images/payhand.svg" alt="">
                                    <span>{{ $t('VerseDetails.PayToFollow') }}</span>
                                </div>
                                <!-- <img class="mote" src="@/assets/images/more.svg" alt=""> -->
                            </div>
                        </div>
                        <!-- pay-follow-loading -->
                        <div class="pay-follow-status flx-justify-between" v-if="showPayStatus">
                            <cricleLoadingSmall></cricleLoadingSmall>
                            <div class="tips">
                                Processing...Please wait
                            </div>

                        </div>
                        <div class="verse-content-back">
                            <div :class="isHide ? 'verse-content hide-content' : 'verse-content'" ref="contentHeight">
                                <p class="break-word"> {{ decodeURIComponent(verseContent.verseDetails.digest) }}
                                </p>

                            </div>
                            <div class="hide-mask" v-if="isHide">

                            </div>
                        </div>
                        <div v-if="isHide" @click="openMore" class="open-more-btn">
                            {{ $t('VerseDetails.LoadMore') }}
                        </div>

                        <div class="verse-media"
                            v-if="verseContent.verseDetails.notInScope == 0 || verseContent.verseDetails.notInScope == 1">
                            <div v-if="verseContent.verseDetails.fileType == 'image'">
                                <!-- pic1 -->
                                <div class="picOne" v-if="getMediaNum === 1">
                                    <div v-if="verseMediaList">
                                        <el-image v-for="( v, i ) in  verseMediaList " :key="i" :src="v" :zoom-rate="1.2"
                                            :preview-src-list="[v]" :initial-index="4" fit="cover" lazy />
                                    </div>

                                    <div v-else
                                        style="width: 610px;height: 610px;background-color: rgba(0, 0, 0, 0.3);display: flex;align-items: center;justify-content: center;border-radius: 10px;">
                                        <el-icon>
                                            <Loading />
                                        </el-icon>
                                    </div>

                                </div>
                                <div class="pic" v-else-if="getMediaNum === 2 || getMediaNum === 4">
                                    <div v-if="verseMediaList" class="pic-odd">
                                        <el-image :style="{ width: picWidth + 'px', height: picWidth + 'px' }"
                                            v-for="( v, i ) in  verseMediaList " :key="i" :src="v" :zoom-rate="1.2"
                                            :preview-src-list="[v]" :initial-index="4" fit="cover" lazy />
                                    </div>
                                    <div v-else
                                        style="display: flex;align-items: center;justify-content: space-between;flex-wrap: wrap;width: 100%;">
                                        <div class="loading-pic" :style="{ width: 298 + 'px', height: 298 + 'px' }"
                                            v-for="( v, i ) in  getMediaNum " :key="i">
                                            <el-icon>
                                                <Loading />
                                            </el-icon>
                                        </div>
                                    </div>

                                </div>
                                <div class="pics" v-else>
                                    <div v-if="verseMediaList" class="true-pics">
                                        <el-image :style="{ width: 192 + 'px', height: 192 + 'px' }"
                                            v-for="( v, i ) in  verseMediaList " :key="i" :src="v" :zoom-rate="1.2"
                                            :preview-src-list="[v]" :initial-index="4" fit="cover" lazy />
                                    </div>
                                    <div v-else class="loadings"
                                        style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 15px;">
                                        <div class="loading-pic" :style="{ width: 192 + 'px', height: 192 + 'px' }"
                                            v-for="( v, i ) in  getMediaNum " :key="i">
                                            <el-icon>
                                                <Loading />
                                            </el-icon>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <!-- video -->
                            <div v-if="verseContent.verseDetails.fileType == 'video'">
                                <video v-if="verseVideo" :src="verseVideo"
                                    style="width: 610px;height: 610px;background-color: #000;margin-bottom: 10px;border-radius: 10px;border: 1px solid rgba(71, 71, 71, 1);"
                                    muted controls></video>
                            </div>

                        </div>
                        <!-- need pay or follow -->
                        <div
                            v-if="verseContent.verseDetails.notInScope == 2 || verseContent.verseDetails.notInScope == 3 || verseContent.verseDetails.notInScope == 4">
                            <div class="not-allow">
                                <img src="@/assets/images/unpaylock.png" alt="">
                                <span
                                    v-if="verseContent.verseDetails.notInScope == 3 && userInfo.id !== verseContent.verseDetails.owner && !showPayStatus">{{
                                        $t('VerseDetails.verseTips2') }}</span>

                                <span
                                    v-if="verseContent.verseDetails.notInScope == 2 && userInfo.id !== verseContent.verseDetails.owner && !showPayStatus">{{
                                        $t('VerseDetails.verseTips2') }}</span>
                                <span
                                    v-if="verseContent.verseDetails.notInScope == 4 && userInfo.id !== verseContent.verseDetails.owner && !showPayStatus">{{
                                        $t('VerseDetails.verseTips1') }}</span>
                                <el-button class="continue-btn" @click="continueBtn"
                                    v-if="!showPayStatus">Continue</el-button>
                                <el-button class="gotoSquare" @click="gotoSquare">Go to Square</el-button>

                            </div>

                        </div>

                        <div class="pay-info"
                            v-if="verseContent.verseDetails.price > 0 && otherProfile.id !== userInfo.id && verseContent.verseDetails.notInScope == 0">
                            {{ $t('VerseDetails.paid') }} {{ (verseContent.verseDetails.price * Math.pow(10,
                                -18)).toFixed(6)
                            }} {{ $t('VerseDetails.PaidETHAt') }}

                            {{ utils.formatTime(verseContent.verseDetails.paidTime) }}
                        </div>
                        <div class="id-info flx-justify-between" v-if="verseContent.verseDetails.notInScope == 0">
                            <div class="author-cid flx-c-star">
                                <div class="author-cid-title flx-justify-between">
                                    <span class="cid-title">{{ $t('VerseDetails.AUTHORDID') }}</span>
                                    <img src="@/assets/images/verse-share.svg" alt="">
                                </div>
                                <div class="did">
                                    {{ otherProfile.did }}
                                </div>

                            </div>
                            <div class="verse-cid flx-c-star" @click="onDialog">
                                <div class="verse-cid-title flx-star">
                                    <span class="cid-title">{{ $t('VerseDetails.VERSECID') }}</span>
                                    <span class="verse-cid-num">{{ cidData.length + 1 }}</span>
                                </div>
                                <div class="did">
                                    {{ cidVerse }}
                                </div>
                            </div>
                        </div>
                        <div class="verse-board flx-justify-between">
                            <div class="like flx-align-center">
                                <img v-if="verseContent.verseDetails.hasLiked" src="@/assets/images/liked.svg" alt=""
                                    @click="likeVerse(false)">
                                <img v-else src="@/assets/images/like.svg" alt="" @click="likeVerse(true)">

                                <span class="number-info">{{ verseContent.verseDetails.likeCount }}</span>
                            </div>
                            <div class="comment flx-align-center">
                                <!-- <img v-if="verseDetails.isComment" src="@/assets/images/comment.svg" alt=""> -->
                                <img src="@/assets/images/comment.svg" alt="">
                                <span class="number-info">{{ Number(verseContent.verseDetails.commentCount) }}</span>
                            </div>
                            <div class="share">
                                <img src="@/assets/images/share.svg" alt="" @click="onShareDialog">
                            </div>
                            <div class="collect">
                                <img style="width: 24px;height: 24px;" v-if="verseContent.verseDetails.hasBookMarked"
                                    src="@/assets/images/collected.svg" alt="" @click="bookmarkVerse(false)">
                                <img style="width: 24px;height: 24px;" v-else src="@/assets/images/collect.svg" alt=""
                                    @click="bookmarkVerse(true)">

                            </div>
                        </div>
                    </div>
                    <div class="verse-comment"
                        v-if="verseContent.verseDetails.notInScope == 0 || verseContent.verseDetails.notInScope == 1">
                        <reply :replayTo="otherProfile.username" @reply-posted="addComment"></reply>
                        <comment :replayTo="otherProfile.username" :commentList="commentList" @reply-posted="addComment">
                        </comment>
                    </div>
                    <div style="width: 100%;height: 60px;display: flex;align-items: center;justify-content: center;"
                        element-loading-background="#292929" v-show="showMoreLoading" v-loading="true">
                        <!-- <el-icon>
                                        <Loading />
                                    </el-icon> -->
                    </div>



                </div>
            </div>
        </div>




        <div class="square-right">
            <suggestions></suggestions>
        </div>
    </div>
    <dialogAccount v-model:Visible="dialogVisibleAccount" @handleClose="onDialogAccout" :titleType="1"></dialogAccount>
    <dialogCid v-model:Visible="dialogVisible" @handleClose="onDialog" :cidData="cidData" :cidType="cidType"
        :cidVerse="cidVerse"></dialogCid>
    <dialogFollow v-if="dialogVisibleFollow" v-model:Visible="dialogVisibleFollow" @handleClose="onPayFollow"
        :followData="followData">
    </dialogFollow>
    <dialogShare v-model:Visible="dialogShareVisible" @handleClose="onShareDialog" :data="shareData" :pageType="1">
    </dialogShare>
    <dialogContinue v-if="dialogVisibleContinue" v-model:Visible="dialogVisibleContinue" @handleClose="onPayVerse"
        :payData='verseContent.verseDetails.price'>
    </dialogContinue>
</template>

<script setup lang="ts">
import utils from '@/utils/utils'
import reply from './components/reply.vue';
import comment from './components/comment.vue';
import suggestions from '@/components/suggestions.vue';
import { getPicWidth } from '@/hooks/usePicSize'
import dialogCid from '@/components/dialog/dialogCid.vue';
import { LoginState } from "@/store/modules/login"
import dialogAccount from "@/components/dialog/dialogAccount.vue";
import dialogShare from '@/components/dialog/dialogShare.vue'
import dialogContinue from '@/components/dialog/dialogContinue.vue'
import cricleLoadingSmall from '@/components/cricleLoading-small.vue';

import dialogFollow from "@/components/dialog/dialogFollow.vue";
import { ref, reactive, computed, onMounted, onBeforeUpdate, watch } from 'vue'
import { UserState } from "@/store/modules/users"
import { ElLoading, ElMessage } from 'element-plus'
import { getNotifications } from "@/libs/notification";

import { initService as initVerseService, saveVerse, getVerse, deleteVerse, getVerseOfOthers, getVersesByOwner, GetBookMark, addVerseIdToBookMark, removeVerseIdFromBookMark, deleteVerseLike, saveVerseLike } from "@/libs/verse"
import { initService as initFileService, uploadFileDataModel, createFileDataModel, downloadFile, downloadFileOfOthers, getFileInfoOfOthers } from "@/libs/file"
import { getUserFollowerdList, initService, deleteUserFollowing, saveUserFollowing } from "@/libs/followApi"
import { getUserProfile } from "@/libs/user"
import { payBuy, getWalletAddress } from "@/api/web3"
import local from "@/utils/local";
import { useRouter } from 'vue-router'
const router = useRouter()
import { formatDistanceToNow } from 'date-fns';

import { useRoute } from 'vue-router'
import { getVerseCommentsByVerseId } from '@/libs/verseComment';

const route = useRoute()
const { verseId, verseOwner } = JSON.parse(JSON.stringify(route.query))
const loginState = LoginState();
const walletNumber = computed(() => loginState.walletNumber);

const tabValue = ref(0)
// const reply = ref('')
const dialogVisible = ref(false)

const commentList = ref<Comment[]>([]);

const addComment = (newComment:any) => {
    // Add the new comment to the start of the comment list
    commentList.value.unshift(newComment);
    verseContent.verseDetails.commentCount = Number(verseContent.verseDetails.commentCount) + 1

};

// const showEmoji = ref(false)
const changeTab = (val: number) => {
    tabValue.value = val
}
const verseLoading = ref(true)
const $store = UserState()
const userInfo = computed(() => {
    return $store.KeplrUserInfo
})
const versePage = ref(0)
const verseLimit = ref(10)
const getVerseComment = async () => {
    try {
        console.log(verseId);
        console.log(userInfo.value.id);

        const comments = await getVerseCommentsByVerseId(verseId, userInfo.value.id, verseLimit.value, versePage.value);
        console.log(comments);

        // Start loading avatars for comments and their parents
        const avatarPromises = comments.flatMap(comment => [
            downLoadAvatar(comment.ownerAvatar),
            comment.parent ? downLoadAvatar(comment.parent.ownerAvatar) : Promise.resolve('')
        ]);
        const avatars = await Promise.all(avatarPromises);

        // Map the data in the format you need for your commentList
        let commentNow = comments.map((comment, i) => {
            let Pcomment = '';
            let Pavatar = '';
            let PuserName = '';
            let Powner = ' '
            // Check if parent comment exists
            if (comment.parent) {
                Pcomment = comment.parent.comment;
                Pavatar = avatars[i * 2 + 1];
                PuserName = comment.parent.ownerUsername;
                Powner = comment.parent.owner
            }

            return {
                commentId: comment.id,
                avatar: avatars[i * 2],
                userName: comment.ownerUsername,
                desc: comment.ownerBio,
                uploadTime: comment.createdAt,
                comment: decodeURIComponent(comment.comment),
                likeCount: comment.likeCount,
                hasLiked: comment.hasLiked,
                Pcomment: decodeURIComponent(Pcomment),
                Pavatar: Pavatar,
                PuserName: PuserName,
                Powner: Powner,
                showReply: false,
                owner: comment.owner
            };
        });

        commentList.value.push(...commentNow)
        showMoreLoading.value = false
        if (commentNow.length == 0) {
            loadStatus.value = false
        }
    } catch (error) {
        showMoreLoading.value = false
        console.error(error);
    }
}

watch(walletNumber, async (newValue, oldValue) => {

    markAddress.value = local.GET("metamaskAddress")
    getVerseDetails()
    console.log(contentHeight.value.clientHeight);
    getVerseComment()

});
const showMoreLoading = ref(false)
const loadStatus = ref(true)
const load = () => {
    if (commentList.value.length > 0 && loadStatus.value == true) {
        showMoreLoading.value = true
        versePage.value = versePage.value + 10
        getVerseComment()
    }

}
// const contentHeight = ref(100)
const contentHeight: any = ref(null)
const isHide = ref(true)


interface ProfileType {
    id?: never | string | undefined;
    createdAt: number
    updatedAt: number
    did: string
    ethAddr: string
    avatar: string
    username: string
    followingCount: string
    twitter: string
    youtube: string
    bio: string
    banner: string
    followingDataId: string,
    status: number | string,
    hasFollowedOwner: boolean,
    payToFollow: number | string,
    owner: string,
    nftTokenId: string,
    notInScope: number | string,
}
interface VerseType {
    commentCount: number | string | undefined,
    createdAt: number,
    digest: string,
    fileIds: Array<any>,
    id: string,
    isPaid: boolean,
    likeCount: number | undefined,
    nftTokenId: string,
    notInScope: number | undefined,
    owner: string,
    price: number,
    scope: number,
    status: number,
    fileType: string
    hasFollowedOwner: boolean,
    ownerAvatar: string,
    ownerUsername: string,
    ownerBio: string,
    hasLiked: boolean,
    hasBookMarked: boolean,


}
const verseContent: any = reactive({
    verseDetails: reactive({
        createdAt: 0
    })
})

// let otherProfile: ProfileType = reactive({
//     id: '',
//     createdAt: 0,
//     updatedAt: 0,
//     did: '',
//     ethAddr: 'string',
//     avatar: '',
//     username: '',
//     followingCount: '',
//     twitter: '',
//     youtube: '',
//     bio: '',
//     banner: '',
//     followingDataId: '',
//     status: '',
//     hasFollowedOwner: false,
//     payToFollow: '',
//     owner: '',
//     nftTokenId: '',
//     notInScope: '',
// })
const otherProfile = ref({

    id: '',
    createdAt: 0,
    updatedAt: 0,
    did: '',
    ethAddr: 'string',
    avatar: '',
    username: '',
    followingCount: '',
    twitter: '',
    youtube: '',
    bio: '',
    banner: '',
    followingDataId: '',
    status: '',
    hasFollowedOwner: false,
    payToFollow: '',
    owner: '',
    nftTokenId: '',
    notInScope: '',

})
const verseMediaList = ref()
const verseVideo = ref()

const picWidth: any = ref(1)
const getMediaNum = ref(1)
const butLoading = ref(false)
let cidData: any = reactive([])
const cidType = ref()
let markAddress = ref("")

let dialogVisibleFollow = ref(false)
let dialogVisibleAccount = ref(false)
const followData = ref()
const cidVerse = ref()
const getVerseDetails = () => {
    console.log(verseId);
    const provider = local.GET('provider')
    GetBookMark(provider.sid).then(val => {
        getVerseOfOthers(verseId, userInfo.value.id, val).then(async res => {
            console.log(res);
            DownLoadVerseMedia(res)
            cidData = res.fileIds
            cidVerse.value = res.id

            cidType.value = res.fileType
            verseContent.verseDetails = res
            console.log(res.digest.length);

            if (res.digest.length > 1200) {
                isHide.value = true
            } else {
                isHide.value = false

            }
            getMediaNum.value = res.fileIds.length
            picWidth.value = getPicWidth(res.fileIds.length).picWidth
            console.log(res.owner, "---");
            getUserProfile(res.owner).then(async res1 => {
                console.log(res1
                );
                verseLoading.value = false

                if (res1) {
                    otherProfile.value = res1
                    if (res1.avatar) {
                        otherProfile.value.avatar = await downLoadAvatar(res1.avatar)

                    }
                }
            }).catch(Response => {
                console.log(Response);

            })
            if (keplrAddress.value) {
                console.log('++++++++++++++++++++++++++')

                const notifications = await getNotifications("0", userInfo.value.id, 10, 0);
                console.log('-----------------------');
                console.log(notifications)

                $store.setTotalCount(notifications.totalCount)
                console.log('-----------------------');

            }
        }).catch(err => {
            console.error(err);
        })
    }).catch(res => {
        getVerseOfOthers(verseId, userInfo.value.id).then(async res => {
            console.log(res);

            DownLoadVerseMedia(res)
            cidData = res.fileIds
            cidVerse.value = res.id
            cidType.value = res.fileType

            verseContent.verseDetails = res
            if (res.digest.length > 1200) {
                isHide.value = true
            } else {
                isHide.value = false

            }

            getMediaNum.value = res.fileIds.length
            picWidth.value = getPicWidth(res.fileIds.length).picWidth
            getUserProfile(res.owner).then(async res1 => {
                console.log(res1);

                if (res1) {
                    verseLoading.value = false
                    otherProfile.value = res1

                    otherProfile.value.avatar = await downLoadAvatar(res1.avatar)


                }

            }).catch(Response => {
                console.log(Response);

            })
            if (keplrAddress.value) {
                console.log('++++++++++++++++++++++++++')

                const notifications = await getNotifications("0", userInfo.value.id, 10, 0);
                console.log('-----------------------');
                console.log(notifications)

                $store.setTotalCount(notifications.totalCount)
                console.log('-----------------------');

            }
        }).catch(err => {
            console.error(err);
        })
    })

}
const downLoadAvatar = async (val: any) => {

    const res = await downloadFileOfOthers(val, userInfo.value.id, true)

    if (res) {
        return 'data:image/png;base64,' + res

    } else {
        return ''
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
const DownLoadVerseMedia = async (res: any) => {
    console.log(res);

    const FileInfos = await Promise.all(res.fileIds.map(async (item: any) => {
        const res = await getFileInfoOfOthers(item, userInfo.value.id)
        return res.fileDataId
    }))
    if (res.fileType == 'image') {
        verseMediaList.value = await Promise.all(FileInfos.map(async item => {
            const value = await downloadFileOfOthers(item, userInfo.value.id, true)

            return 'data:image/png;base64,' + value
        }))
        console.log(verseMediaList.value);

    }
    if (res.fileType == 'video') {
        verseVideo.value = await Promise.all(FileInfos.map(async item => {
            const value: any = await downloadFileOfOthers(item, userInfo.value.id)
            console.log(value);

            return URL.createObjectURL(new Blob([value], { type: 'audio/wav' }));
        }))
        console.log(verseVideo.value);

    }
    console.log(verseMediaList.value);

}



onBeforeUpdate(() => {
    console.log(contentHeight.value.clientHeight);
    // if (contentHeight.value.clientHeight > 390) {
    //     isHide.value = true
    // }else{
    //     isHide.value = false

    // }

})
const keplrAddress = computed(() => LoginState().keplrAddress)
onMounted(() => {
    markAddress.value = local.GET("metamaskAddress")
    getVerseDetails()
    getVerseComment()

    const hideHeight = 390

    console.log(contentHeight.value.clientHeight);

    // try {
    //     const comments = await getVerseCommentsByVerseId(verseId, userInfo.id);

    //     // Start loading avatars for comments and their parents
    //     const avatarPromises = comments.flatMap(comment => [
    //         downLoadAvatar(comment.ownerAvatar),
    //         comment.parent ? downLoadAvatar(comment.parent.ownerAvatar) : Promise.resolve('')
    //     ]);
    //     const avatars = await Promise.all(avatarPromises);
    //     console.log(avatars);

    //     // Map the data in the format you need for your commentList
    //     commentList.value = comments.map((comment, i) => {
    //         let Pcomment = '';
    //         let Pavatar = '';
    //         let PuserName = '';

    //         // Check if parent comment exists
    //         if (comment.parent) {
    //             Pcomment = comment.parent.comment;
    //             Pavatar = avatars[i * 2 + 1];
    //             PuserName = comment.parent.ownerUsername;
    //         }

    //         return {
    //             commentId: comment.id,
    //             avatar: avatars[i * 2],
    //             userName: comment.ownerUsername,
    //             desc: comment.ownerBio,
    //             uploadTime: formatDistanceToNow(comment.createdAt) + ' ago',
    //             comment: decodeURIComponent(comment.comment),
    //             likeCount: comment.likeCount,
    //             hasLiked: comment.hasLiked,
    //             Pcomment: decodeURIComponent(Pcomment),
    //             Pavatar: Pavatar,
    //             PuserName: PuserName,
    //             showReply: false,
    //             owner: comment.owner
    //         };
    //     });
    // } catch (error) {
    //     console.error(error);
    // }
})

const openMore = () => {
    isHide.value = false
}



const onDialog = () => {
    dialogVisible.value = !dialogVisible.value
}


const goBack = () => {
    history.back()
}

const bookmarkVerse = (val: boolean) => {
    if (val == true) {
        addVerseIdToBookMark(verseContent.verseDetails.id, userInfo.value.did).then(res => {
            console.log(res);
            if (!res.includes('Error')) {
                verseContent.verseDetails.hasBookMarked = val

            }

        })
    } else {
        console.log('r-b');
        removeVerseIdFromBookMark(verseContent.verseDetails.id, userInfo.value.did).then(res => {
            console.log(res);
            if (!res.includes('Error')) {

                verseContent.verseDetails.hasBookMarked = val
            }

        })
    }
}
const likeVerseStatus = ref(true)
const likeVerse = (val: boolean) => {
    if (likeVerseStatus.value == true) {
        likeVerseStatus.value = false

        console.log(verseContent.verseDetails.likeCount);
        console.log(verseContent.verseDetails.hasLiked);
        let verseLike = {
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
            verseId: verseContent.verseDetails.id,
            status: 0,
            owner: $store.KeplrUserInfo.id
        }

        if (val) {
            verseLike.status = 1
            saveVerseLike(verseLike, $store.KeplrUserInfo.did).then(res => {
                if (!res.includes('Error')) {

                    verseContent.verseDetails.likeCount++

                    verseContent.verseDetails.hasLiked = val
                    likeVerseStatus.value = true
                }
                console.log(res);
            })
        } else {
            deleteVerseLike(verseContent.verseDetails.id, $store.KeplrUserInfo.did).then(res => {
                console.log(res);
                if (!res.includes('Error')) {

                    verseContent.verseDetails.likeCount--
                    verseContent.verseDetails.hasLiked = val
                    likeVerseStatus.value = true
                }


            }).catch(res => {
                console.log(res);

            })

        }
    } else {
        likeVerseStatus.value = false
        return
    }

}

const onFollow = (follow: any) => {

    const provider = local.GET('provider')
    butLoading.value = true

    if (follow.hasFollowedOwner) {
        deleteUserFollowing(follow.owner, provider.sid).then((res) => {
            console.log(res);
            if (res) {
                verseContent.verseDetails.hasFollowedOwner = false

                butLoading.value = false
            } else {
                butLoading.value = false

            }

        }).catch((res) => {
            ElMessage.error('Oops, this is a error message.')
            butLoading.value = false
        })
    } else if (!follow.hasFollowedOwner) {
        const createdAt = new Date().valueOf()
        const { id, owner } = follow
        const status = follow.payToFollow ? 0 : 1
        const query = { id, following: owner, status, createdAt, updatedAt: createdAt, expiredAt: 0, follower: userInfo.value.id }

        saveUserFollowing(query, userInfo.value.did).then(res => {
            console.log(res);
            if (res) {
                verseContent.verseDetails.hasFollowedOwner = true
                butLoading.value = false
            } else {
                butLoading.value = false

            }
            if (verseContent.verseDetails.notInScope == 2 || verseContent.verseDetails.notInScope == 3) {
                showPayStatus.value = true
            }
        }).catch(res => {
            ElMessage.error('Oops, this is a error message.')
            butLoading.value = false
        })
    }
}

const onDialogAccout = (type: string | number) => {
    console.log(type)
    dialogVisible.value = !dialogVisible.value
    markAddress.value = local.GET("metamaskAddress")
}
const dialogPayFollow = () => {
    if (markAddress.value) {
        followData.value = JSON.parse(JSON.stringify(otherProfile.value))
        followData.value.img = otherProfile.value.avatar
        followData.value.toPay = otherProfile.value.payToFollow
        dialogVisibleFollow.value = true
    } else {
        dialogVisibleAccount.value = true
    }
}
const onPayFollow = (follow: any) => {


    if (follow) {
        const loading = ElLoading.service({
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        const amount = otherProfile.value.payToFollow.toString()
        const tokenId = otherProfile.value.nftTokenId


        getWalletAddress().then(res => {
            if (res) {
                payBuy(tokenId, amount, markAddress.value, 2).then(res => {
                    onFollow(follow)
                    dialogVisibleFollow.value = false
                    loading.close()
                    if (verseContent.verseDetails.notInScope == 2 || verseContent.verseDetails.notInScope == 3) {
                        showPayStatus.value = true
                    }
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
const onToUser = () => {
    console.log(otherProfile.value)
    if (verseContent.verseDetails.owner != userInfo.value.id) {
        router.push({
            name: 'Verse-UserProfile',
            query: {
                key: verseContent.verseDetails.owner,
            },
        })
    } else {
        router.push({
            name: 'Verse-Profile',
        })
    }

}
const dialogShareVisible = ref(false)
const shareData = ref()
const onShareDialog = () => {
    // loginState.dialogVisible = true
    // return
    shareData.value = verseContent.verseDetails
    dialogShareVisible.value = !dialogShareVisible.value
}
const dialogVisibleContinue = ref(false)
const continueBtn = () => {
    console.log('continueBtn');
    console.log('continueBtn', verseContent.verseDetails.notInScope);
    if (verseContent.verseDetails.notInScope === 4) {
        console.log('need pay');
        if (markAddress.value) {

            dialogVisibleContinue.value = true
        } else {
            dialogVisible.value = true
        }
    } else {
        if (!verseContent.verseDetails.hasFollowedOwner && verseContent.verseDetails.payToFollow != '') {
            dialogPayFollow()
        } else {
            onFollow(verseContent.verseDetails)
        }
        console.log('need follow');

    }

}
const onPayVerse = (pay: any) => {

    if (pay) {

        const loading = ElLoading.service({
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        const amount = verseContent.verseDetails.price.toString()
        const tokenId = verseContent.verseDetails.nftTokenId
        getWalletAddress().then(val => {
            if (val) {
                payBuy(tokenId, amount, markAddress.value, 1).then(res => {
                    showPayStatus.value = true
                    // DownLoadVerseMedia()
                    dialogVisibleContinue.value = false
                    loading.close()

                }).catch(res => {
                    console.log(res.message)
                    ElMessage({
                        dangerouslyUseHTMLString: true,
                        customClass: 'successMessage',
                        type: 'error',
                        message: `<p style="color: #fff;">${res.message} </p>`,
                    })
                    loading.close()
                })
            }
        }).catch(Response => {
            ElMessage({
                dangerouslyUseHTMLString: true,
                customClass: 'successMessage',
                type: 'error',
                message: `<p style="color: #fff;">${Response.message} </p>`,
            })
            loading.close()
        })
    } else {
        dialogVisibleContinue.value = false

    }
}

const gotoSquare = () => {
    router.push('/square')
}
const showPayStatus = ref(false)
</script>

<style scoped lang="scss">
.square {
    // width: 1040px;
    height: 100%;
    display: flex;

    :deep(.el-button) {
        width: 100px;
        height: 36px;
        border: none;
        box-shadow: none
    }

    .scroll {
        scrollbar-width: none;
    }

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
        // margin-right: 20px;

        .verse {
            width: 100%;
            padding: 20px 30px;
            box-sizing: border-box;

            .verse-head {
                .infos {
                    margin-left: 10px;

                    .username {
                        font-weight: 700;
                        font-size: 16px;
                        max-width: 200px;
                        display: inline-block;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }

                    .userDesc {
                        font-weight: 400;
                        font-size: 14px;
                        margin-left: 16px;
                        max-width: 100px;
                        display: inline-block;
                    }

                    .verse-time {
                        font-weight: 400;
                        font-size: 14px;

                        color: #909791;
                    }
                }
            }

            .pay-follow-status {
                justify-content: center;
                width: 615px;
                height: 50px;
                background: #21C143;
                margin-top: 10px;

                border-radius: 10px;

                .tips {
                    font-size: 16px;
                    font-weight: 500;
                    margin-left: 15px;
                }

            }

            .verse-content-back {
                position: relative;

                .hide-mask {
                    width: 615px;
                    height: 83px;
                    background: linear-gradient(180deg, rgba(41, 41, 41, 0) 0%, #292929 100%);
                    position: absolute;
                    left: 0;
                    bottom: 0;
                }
            }

            .verse-content {
                font-weight: 400;
                font-size: 16px;
                line-height: 26px;
                margin: 10px 0;

            }

            .hide-content {
                height: 280px;
                overflow: hidden;

            }

            .open-more-btn {
                width: 611px;
                height: 24px;
                background: #343434;
                border: 1px solid #474747;
                box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
                border-radius: 40px;
                box-sizing: border-box;
                text-align: center;
                line-height: 24px;
                color: #909791;
                cursor: pointer;
                margin-bottom: 30px;
                font-size: 14px;
            }

            .verse-media {
                width: 100%;

                // margin-bottom: 14px;
                .picOne {
                    width: 100%;
                    margin-bottom: 14px;

                    .el-image {
                        border-radius: 10px;
                        width: 100%;
                        border-radius: 10px;
                        max-height: 610px;
                        border: 1px solid rgba(71, 71, 71, 1);

                    }

                    img {
                        width: 100%;
                        border-radius: 10px;
                        max-height: 610px;
                    }
                }

                .pic {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;

                    .pic-odd {
                        width: 100%;

                        display: flex;
                        align-items: center;
                        flex-wrap: wrap;
                        justify-content: space-between;
                    }

                    // box-sizing: border-box;
                    img {
                        border-radius: 10px;
                        max-height: 610px;
                        margin-bottom: 15px;
                        // margin-right: 15px;
                        object-fit: cover;

                    }

                    .el-image {
                        border-radius: 10px;
                        max-height: 610px;
                        margin-bottom: 15px;
                        // margin-right: 15px;
                        object-fit: cover;
                        width: 298px;
                        height: 298px;
                        border: 1px solid rgba(71, 71, 71, 1);

                    }

                    .loading-pic {
                        background: #000000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 10px;
                        margin-bottom: 15px;
                    }
                }

                .pics {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: flex-start;

                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: flex-start;

                    .true-pics {
                        width: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        justify-content: flex-start;

                        img {
                            border-radius: 10px;
                            max-height: 610px;
                            margin-bottom: 15px;
                            // margin-right: 15px;
                            object-fit: cover;
                        }

                        .el-image {
                            border-radius: 10px;
                            max-height: 610px;
                            margin-bottom: 15px;
                            // margin-right: 15px;
                            object-fit: cover;
                            border: 1px solid rgba(71, 71, 71, 1);

                        }
                    }

                    .loading-pic {
                        background: #000000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 10px;

                    }
                }

                .pics :nth-child(3n+2) {
                    margin: 0 15px;
                }

                .pic-unlock {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 611px;
                    height: 108px;
                    background: linear-gradient(0deg, #000000, #000000), #000000;
                    border-radius: 10px;
                    color: #21C143;
                    font-weight: 600;
                    font-size: 18px;
                    margin-bottom: 12px;

                    img {
                        width: 79px;
                        height: 66px;
                    }
                }

                .pic-unpay {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 611px;
                    height: 304px;
                    background: linear-gradient(0deg, #000000, #000000), #000000;
                    border-radius: 10px;
                    margin-bottom: 12px;
                }
            }

            .not-allow {
                width: 100%;
                height: 397px;
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;
                box-sizing: border-box;
                background-color: #000000;

                border-radius: 10px;
                margin-bottom: 10px;

                .continue-btn {
                    width: 213px;
                    height: 30px;

                    padding: 7px 19px 7px 19px;
                    border-radius: 34px;
                    gap: 10px;
                    background: #56E868;
                    color: #000000;
                    font-weight: 700;
                    font-size: 14px;
                    margin: 24px 0 18px 0;
                }

                .gotoSquare {
                    width: 213px;
                    height: 30px;

                    padding: 7px 19px 7px 19px;
                    border-radius: 34px;
                    gap: 10px;
                    color: #000000;
                    font-weight: 700;
                    font-size: 14px;
                    margin-left: 0;
                }
            }

            .pay-info {
                // min-width: 250px;
                display: inline-block;
                padding: 0 20px;
                height: 36px;
                background: #434130;
                border-radius: 20px;
                margin-bottom: 16px;
                text-align: center;
                font-weight: 400;
                font-size: 14px;
                color: #E6D32D;
                line-height: 36px;
            }

            .id-info {
                width: 100%;
                margin-bottom: 14px;

                .author-cid {
                    width: 298px;
                    height: 81px;
                    background: #191919;

                    border: 1px solid #474747;
                    border-radius: 10px;
                    padding: 14px;
                    box-sizing: border-box;

                    .author-cid-title {
                        width: 100%;
                    }
                }

                .verse-cid {
                    width: 298px;
                    height: 81px;
                    background: #191919;

                    border: 1px solid #474747;
                    border-radius: 10px;
                    padding: 14px;
                    box-sizing: border-box;
                    cursor: pointer;

                    .verse-cid-num {
                        width: 36px;
                        height: 20px;
                        background: #434130;
                        border-radius: 20px;
                        font-weight: 400;
                        font-size: 14px;
                        line-height: 20px;
                        color: #E6D32D;
                        text-align: center;
                        margin-left: 8px;
                    }

                }

                .cid-title {
                    font-weight: 600;
                    font-size: 14px;
                    line-height: 17px;

                    color: #909791;
                }

                .did {
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 26px;
                    display: inline-block;
                    max-width: 270px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }

            .verse-board {
                // margin-bottom: 20px;
            }

            .verse-board div {
                cursor: pointer;

                .number-info {
                    margin-left: 8px;
                    font-weight: 400;
                    font-size: 14px;
                }
            }



        }

        .verse-comment {
            box-sizing: border-box;
            border-top: 2px solid #474747;

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

        .unFollow-status-unpay {
            background: #E6D32D;
            border-radius: 34px;
            padding: 7px 19px;
            cursor: pointer;
            margin-top: 10px;

            span {
                font-weight: 700;
                font-size: 14px;
                line-height: 17px;
                color: #000000;
                margin-left: 10px;
            }
        }

        .mote {
            cursor: pointer;
            margin-left: 12px;
        }

        .square-verses {
            background: #292929;
            box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            min-height: 500px;

            .tabs {
                width: 100%;
                height: 60px;
                border-bottom: 1px solid #474747;
                box-sizing: border-box;
                position: relative;
                padding: 0 30px;

                .tabs-title {
                    font-weight: 600;
                    font-size: 18px;
                    line-height: 28px;
                    margin-left: 30px;
                }
            }
        }
    }

    .square-right {
        margin-left: 20px;
        // width: 350px;
        // height: 600px;
        // background-color: #ccc;
    }
}</style>