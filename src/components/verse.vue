<template>
    <div class="verse">
        <!-- :style="{borderTop:(props.verseIndex==0?'none':'2px solid #474747')}" -->
        <div class="verse-mask" @click="loginAccount" v-if="loginMask">

        </div>
        <div>
            <div class="verse-head flx-justify-between" v-if="userInfo.id !== props.verseDetails.owner">
                <div class="user-info flx-justify-between cursor-s" @click="onToUser">

                    <el-avatar style="border: 1px solid rgba(71, 71, 71, 1);" :size="40" :src="otherAvatar"
                        v-if="props.verseDetails.ownerAvatar" />
                    <img style="width: 40px;height: 40px;border: 1px solid rgba(71, 71, 71, 1);border-radius: 50%;"
                        src="@/assets/images/avatar.png" alt="" v-else>


                    <div class="flx-c-star infos ">
                        <div class="flx-center">
                            <span class="username sle">{{ decodeURIComponent(props.verseDetails.ownerUsername)
                            }}</span>
                            <span class="userDesc sle">@{{
                                props.verseDetails.owner.substring(0, 13) }}</span>
                        </div>
                        <div class="verse-time">{{ utils.formatTime(props.verseDetails.createdAt) }}</div>

                    </div>
                </div>
                <div class="follow flx-align-center">
                    <el-button type="primary" round color="#fff" class="unFollow-status" :loading="loading"
                        v-if="!props.verseDetails.hasFollowedOwner && !props.verseDetails.payToFollow" @click="onFollow">
                        {{ $t('verse.Follow') }}</el-button>

                    <!-- <div>
                    Follow
                </div> -->
                    <div class="unFollow-status-unpay flx-center"
                        v-if="!props.verseDetails.hasFollowedOwner && props.verseDetails.payToFollow"
                        @click="dialogPayFollow">
                        <img src="@/assets/images/payhand.svg" alt="">
                        <span>{{ $t('verse.PaytoFollow') }}</span>
                    </div>
                    <el-button type="primary" round color="#fff" class="followed-status" :loading="loading"
                        v-if="props.verseDetails.hasFollowedOwner" @click="Unfollow()">
                        {{ $t('verse.Unfollow') }}</el-button>
                    <!-- <div class="followed-status" v-if="props.verseDetails.hasFollowedOwner && props.verseDetails.status != 0"
                    @click="Unfollow">
                    Unfollow
                </div> -->

                </div>
            </div>
            <div class="verse-head flx-justify-between cursor-s" v-else>
                <div class="user-info flx-justify-between cursor-s" @click="onToUser">
                    <el-avatar :size="40" style="border: 1px solid rgba(71, 71, 71, 1);" :src="userInfo.DownAvatar"
                        v-if="props.verseDetails.ownerAvatar" />

                    <img style="width: 40px;height: 40px;border: 1px solid rgba(71, 71, 71, 1);border-radius: 50%;"
                        src="@/assets/images/avatar.png" alt="" v-else>
                    <div class="flx-c-star infos">
                        <div class="flx-center">
                            <span class="username sle">{{ decodeURIComponent(userInfo.username) }}</span>
                            <span class="userDesc sle">@{{
                                userInfo.id.substring(0, 13) }}</span>
                        </div>
                        <div class="verse-time"> {{ utils.formatTime(props.verseDetails.createdAt) }} </div>

                    </div>
                </div>
                <div class="follow flx-align-center">
                    <el-popover :show-arrow="false" placement="bottom-end"
                        popper-style="background-color: #292929;border:1px solid #909791;border-radius: 10px;padding:0;overflow: hidden;">
                        <template #reference>
                            <img class="more-btn" src="@/assets/images/more.svg" alt="">
                        </template>
                        <template #default>
                            <div class="set-box">
                                <p style="" class="flx-justify-between" @click="deleteVerse">
                                <div> <img src="@/assets/images/delVerse.svg" alt=""></div>
                                <span>{{ $t('verse.Delete') }}</span>
                                </p>
                            </div>

                        </template>
                    </el-popover>
                </div>
            </div>
            <div class="verse-status flx-justify-between"
                v-if="props.verseDetails.scope == 4 && props.verseDetails.nftTokenId == '' && userInfo.id == props.verseDetails.owner">
                <cricleLoading></cricleLoading>
                <div class="verse-status-text">
                    {{ $t('verse.paidverseTip') }}
                </div>
            </div>

            <div class="contract-fail flx-justify-between"
                v-if="props.verseDetails.scope == 4 && props.verseDetails.nftTokenId == 'failed' && userInfo.id == props.verseDetails.owner">
                <img src="@/assets/images/contract-fail.svg" alt="">
                <div class="fail-left flx-justify-between">
                    <div class="fail-tips">
                        <p>
                            {{ $t('verse.Contractfailed') }}


                        </p>
                        <p>
                            {{ $t('verse.onlyVisible') }}


                        </p>
                    </div>
                    <div class="retry" @click="retryContract">
                        {{ $t('verse.Retry') }} &gt;
                    </div>
                </div>
            </div>

            <!-- pay-follow-loading -->
            <div class="pay-follow-status flx-justify-between" v-if="showPayStatus">
                <cricleLoadingSmall></cricleLoadingSmall>
                <div class="tips">
                    Processing...Please wait
                </div>

            </div>
            <div class="verse-status-owner" v-if="props.verseDetails.scope == 2 && userInfo.id == props.verseDetails.owner">
                {{ $t('verse.visibleType1') }}
            </div>
            <div class="verse-status-owner" v-if="props.verseDetails.scope == 3 && userInfo.id == props.verseDetails.owner">
                {{ $t('verse.visibleType2') }}

            </div>
            <div class="verse-status-owner" v-if="props.verseDetails.scope == 4 && userInfo.id == props.verseDetails.owner">
                {{ $t('verse.visibleType3') }}

            </div>
            <div class="verse-status-owner" v-if="props.verseDetails.scope == 5 && userInfo.id == props.verseDetails.owner">
                {{ $t('verse.visibleType4') }}

            </div>
            <!-- <div class="verse-content cursor-s" @click="gotoDeatils">
            {{decodeURIComponent(props.verseDetails.digest )}}

        </div> -->
            <div v-if="props.verseDetails.fileIds.length > 0">
                <div class="verse-content-back cursor-s" @click="gotoDeatils">
                    <div :class="isHide ? 'verse-content hide-content' : 'verse-content'" ref="contentHeight">
                        <p class="break-word">{{ decodeURIComponent(props.verseDetails.digest) }}</p>

                    </div>
                    <div class="hide-mask" v-if="isHide">

                    </div>
                </div>
                <div v-if="isHide" class="open-more-btn" @click="gotoDeatils">
                    {{ $t('verse.More') }}
                </div>
            </div>

            <div class="verse-media" v-if="props.verseDetails.fileIds.length > 0">
                <div v-if="props.verseDetails.notInScope == 0">
                    <div v-if="props.verseDetails.fileType == 'image'">
                        <!-- pic1 -->
                        <div class="picOne" v-if="getMediaNum === 1">
                            <div v-if="verseMediaList">
                                <el-image v-for="(v, i) in verseMediaList" :key="i" :src="v" :zoom-rate="1.2"
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
                            <div v-if="verseMediaList" style="width: 100%;" class="flx-justify-between pic-odd">
                                <el-image :style="{ width: picWidth + 'px', height: picWidth + 'px' }"
                                    v-for="(v, i) in verseMediaList" :key="i" :src="v" :zoom-rate="1.2"
                                    :preview-src-list="[v]" :initial-index="4" fit="cover" lazy />
                            </div>
                            <div v-else
                                style=" width: 100%;display: flex;align-items: center;justify-content: space-between;flex-wrap: wrap;">
                                <div class="loading-pic" :style="{ width: picWidth + 'px', height: picWidth + 'px' }"
                                    v-for="(v, i) in getMediaNum" :key="i">
                                    <el-icon>
                                        <Loading />
                                    </el-icon>
                                </div>
                            </div>

                        </div>
                        <div class="pics" v-else>
                            <div v-if="verseMediaList" class="true-pics">
                                <el-image :style="{ width: picWidth + 'px', height: picWidth + 'px' }"
                                    v-for="(v, i) in verseMediaList" :key="i" :src="v" :zoom-rate="1.2"
                                    :preview-src-list="[v]" :initial-index="4" fit="cover" lazy />
                            </div>
                            <div v-else class="loadings"
                                style="display: flex;align-items: center;justify-content: space-between;">
                                <div class="loading-pic" :style="{ width: picWidth + 'px', height: picWidth + 'px' }"
                                    v-for="(v, i) in getMediaNum" :key="i">
                                    <el-icon>
                                        <Loading />
                                    </el-icon>
                                </div>
                            </div>
                        </div>
                    </div>


                    <!-- video -->
                    <div v-if="props.verseDetails.fileType == 'video'">
                        <video :src="verseVideo" style="width: 610px;height: 610px;background-color: #000;margin-bottom: 10px;border-radius: 10px;
                            border: 1px solid rgba(71, 71, 71, 1);
                            
                            " muted controls></video>
                    </div>
                </div>
                <!-- pic-unlock -->
                <div class="pic-unlock"
                    v-if="props.verseDetails.notInScope == 2 && userInfo.id !== props.verseDetails.owner"
                    >
                    <img src="@/assets/images/unpaylock.png" alt="">
                    <span @click="followToSee" v-if="!showPayStatus">{{ $t('verse.Followsee') }}</span>
                </div>
                <div class="pic-unlock"
                    v-if="props.verseDetails.notInScope == 3 && userInfo.id !== props.verseDetails.owner">
                    <img src="@/assets/images/unpaylock.png" alt="">
                    <span>{{ $t('verse.VisibleFollower') }} [{{
                        props.verseDetails.ownerUsername.length > 8 ? decodeURIComponent(
                            props.verseDetails.ownerUsername).substring(0, 8) + "..." :
                        decodeURIComponent(props.verseDetails.ownerUsername) }}]
                        {{ $t('verse.follows') }}.</span>
                </div>
                <!-- pic-unpay -->
                <div class="pic-unpay"
                    v-if="props.verseDetails.notInScope == 4 && userInfo.id !== props.verseDetails.owner">
                    <img src="@/assets/images/unpaylock.png" alt="">
                    <div class="unFollow-status-unpay flx-center" @click="payToSee" v-if="!showPayStatus">
                        <img src="@/assets/images/payhand.svg" alt="">
                        <span>{{ $t('verse.PaytoSee') }}</span>
                    </div>
                </div>
            </div>

            <div v-if="props.verseDetails.fileIds.length == 0">

                <div
                    v-if="props.verseDetails.notInScope == 0 || props.verseDetails.notInScope == 1 || userInfo.id == props.verseDetails.owner">
                    <div class="verse-content-back cursor-s" @click="gotoDeatils">
                        <div :class="isHide ? 'verse-content hide-content' : 'verse-content'" ref="contentHeight">
                            <p class="break-word">{{ decodeURIComponent(props.verseDetails.digest) }}</p>

                        </div>
                        <div class="hide-mask" v-if="isHide">

                        </div>
                    </div>
                    <div v-if="isHide" class="open-more-btn" @click="gotoDeatils">
                        {{ $t('verse.More') }}
                    </div>
                </div>
                <div class="not-files-digest" v-else>
                    <p class="break-word">{{ decodeURIComponent(props.verseDetails.digest) }}</p>



                </div>
            </div>

            <div class="verse-media" v-if="props.verseDetails.fileIds.length == 0 && userInfo">
                <!-- pic-unlock -->

                <div class="pic-unlock"
                    v-if="props.verseDetails.notInScope == 2 && userInfo.id !== props.verseDetails.owner"
                    >
                    <img src="@/assets/images/unpaylock.png" alt="">
                    <span @click="followToSee" v-if="!showPayStatus">{{ $t('verse.Followsee') }}</span>
                </div>
                <div class="pic-unlock"
                    v-if="props.verseDetails.notInScope == 3 && userInfo.id !== props.verseDetails.owner">
                    <img src="@/assets/images/unpaylock.png" alt="">
                    <span>{{ $t('verse.VisibleFollower') }} [{{ props.verseDetails.ownerUsername }}]
                        {{ $t('verse.follows') }}.</span>
                </div>
                <!-- pic-unpay -->
                <div class="pic-unpay"
                    v-if="props.verseDetails.notInScope == 4 && userInfo.id !== props.verseDetails.owner">
                    <img src="@/assets/images/unpaylock.png" alt="">
                    <div class="unFollow-status-unpay flx-center" @click="payToSee"  v-if="!showPayStatus">
                        <img src="@/assets/images/payhand.svg" alt="">
                        <span> {{ $t('verse.PaytoSee') }}</span>
                    </div>
                </div>
            </div>
            <div class="verse-media" v-if="props.verseDetails.fileIds.length == 0 && !userInfo">
                <div class="pic-unlock" v-if="props.verseDetails.scope == 2">
                    <img src="@/assets/images/unpaylock.png" alt="">
                    <span>{{ $t('verse.Followsee') }}</span>
                </div>
                <div class="pic-unlock" v-if="props.verseDetails.scope == 3">
                    <img src="@/assets/images/unpaylock.png" alt="">
                    <span>{{ $t('verse.VisibleFollower') }} [{{ props.verseDetails.ownerUsername }}]
                        {{ $t('verse.follows') }}.</span>
                </div>
                <!-- pic-unpay -->
                <div class="pic-unpay" v-if="props.verseDetails.scope == 4">
                    <img src="@/assets/images/unpaylock.png" alt="">
                    <div class="unFollow-status-unpay flx-center">
                        <img src="@/assets/images/payhand.svg" alt="">
                        <span> {{ $t('verse.PaytoSee') }}</span>
                    </div>
                </div>
            </div>
            <div class="verse-board flx-justify-between">
                <div class="like flx-align-center">
                    <img v-if="props.verseDetails.hasLiked" src="@/assets/images/liked.svg" alt=""
                        @click="likeVerse(false)">
                    <img v-else src="@/assets/images/like.svg" alt="" @click="likeVerse(true)">

                    <span class="number-info">{{ props.verseDetails.likeCount }}</span>
                </div>
                <div class="comment flx-align-center" @click="gotoDeatils">
                    <!-- <img v-if="props.verseDetails.isComment" src="@/assets/images/comment.svg" alt=""> -->
                    <img src="@/assets/images/comment.svg" alt="">
                    <span class="number-info">{{ props.verseDetails.commentCount }}</span>
                </div>
                <div v-if="checkPriceStatus">

                    <el-popover :show-arrow="false" placement="bottom-end"
                        popper-style="background-color: #0F0F0F;border:1px solid #474747;border-radius: 6px;padding:0;width:300px">
                        <template #reference>
                            <img src="@/assets/images/verse-pay.svg" alt="">
                        </template>
                        <template #default>
                            <div class="setPriceBox">

                                <img src="@/assets/images/payhand-price.svg" alt="">
                                <span v-if="props.verseDetails.price > 0">{{ $t('verse.Needpay') }} {{
                                    parseFloat((props.verseDetails.price * Math.pow(10, -18)).toFixed(6)) }} BNB {{
        $t('verse.tosee') }}
                                </span>
                                <span v-else>{{ $t('verse.Needpay') }} {{ parseFloat((props.verseDetails.payToFollow *
                                    Math.pow(10,
                                        -18)).toFixed(6)) }}BNB {{ $t('verse.tosee') }} </span>

                            </div>

                        </template>
                    </el-popover>
                </div>
                <div class="share">
                    <img src="@/assets/images/share.svg" alt="" @click="onShareDialog">
                </div>
                <div class="collect">
                    <img style="width: 24px;height: 24px;" v-if="props.verseDetails.hasBookMarked"
                        src="@/assets/images/collected.svg" alt="" @click="bookMarkVerse(false)">
                    <img style="width: 24px;height: 24px;" v-else src="@/assets/images/collect.svg" alt=""
                        @click="bookMarkVerse(true)">

                </div>
            </div>
        </div>
    </div>
    <dialogAccount v-model:Visible="dialogVisible" @handleClose="onDialog" :titleType="1"></dialogAccount>
    <dialogFollow v-if="dialogVisibleFollow" v-model:Visible="dialogVisibleFollow" @handleClose="onPayFollow"
        :followData="followData">

    </dialogFollow>
    <dialogContinue v-if="dialogVisibleContinue" v-model:Visible="dialogVisibleContinue" @handleClose="onPayVerse"
        :payData='props.verseDetails.price'>
    </dialogContinue>
    <dialogShare v-model:Visible="dialogShareVisible" @handleClose="onShareDialog" :data="shareData" :pageType="1">
    </dialogShare>
    <!-- <Dialog ></Dialog> -->
</template>

<script setup lang="ts">
import utils from '@/utils/utils'
import { FileService } from "storverse-sao-api";
import { getPicWidth } from '@/hooks/usePicSize'
import { computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ref, PropType, watch } from 'vue'
import { UserState } from "@/store/modules/users"
import { updateDataModelPermission } from "@/libs/user"
import local from "@/utils/local";
import { ElMessage, ElLoading } from 'element-plus'
import { formatDistanceToNow } from 'date-fns';
import { initService as initFileService, uploadFileDataModel, createFileDataModel, downloadFile, downloadFileOfOthers, getFileInfoOfOthers } from "@/libs/file"
import { saveUserFollowing, deleteUserFollowing } from "@/libs/followApi"
import dialogAccount from "@/components/dialog/dialogAccount.vue";
import dialogFollow from "@/components/dialog/dialogFollow.vue";
import cricleLoadingSmall from './cricleLoading-small.vue';
import dialogContinue from './dialog/dialogContinue.vue'
import dialogShare from './dialog/dialogShare.vue'
import cricleLoading from './cricleLoading.vue'
import Dialog from "@/components/dialog/dialogLogin.vue";
import i18n from '@/lang/index'

const t = i18n.global.t
import { payBuy, getWalletAddress, mint } from "@/api/web3"
import { LoginState } from "@/store/modules/login"

const loginState = LoginState();
import { number } from 'echarts'
const $store = UserState()
const userInfo = computed(() => {
    return $store.KeplrUserInfo
})
const keplrAddress = computed(() => loginState.keplrAddress)
const router = useRouter()
interface Props {
    userName: string,
    avatar: string,
    desc: string,
    uploadTime: string,
    content: string,
    isFollow: boolean,
    isLike: boolean,
    isComment: boolean,
    isCollect: boolean,
    isPayFollow: boolean,
    isPay: boolean,
    media: any,
    isPayFollowCoin?: number,
    isPayCoin?: number,


    commentCount: number | string | undefined,
    createdAt: string,
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
    hasBookMarked: boolean,
    hasLiked: boolean,
    payToFollow: number,
    ownerNftTokenID: any
}
interface VerseType {
    verseDetails: Props
}
watch(() => props.verseDetails, (oldValue, newValue) => {
    console.log(oldValue);
    console.log(newValue);
    hasMoveStatus.value = true
    hasBookMarkStatus.value = true
}, {
    deep: true
})
// const myEmit = defineEmits(["onFollow"])
// const props = defineProps<VerseType>()
const props = defineProps({
    verseDetails: {
        required: true,
        type: Object as PropType<Props>
    },
    verseIndex: {
        required: false,
        type: Number
    }
})
watch(keplrAddress, (newValue, oldValue) => {
    if (keplrAddress.value) {
        loginMask.value = false
    } else {
        loginMask.value = true

    }
})

const loginMask = ref(true)
const loginAccount = () => {
    loginState.dialogVisible = true
}
const checkPriceStatus = computed(() => {
    // if (props.verseDetails.payToFollow > 0 && props.verseDetails.notInScope == 2) {
    //     return true
    // } else
    if (props.verseDetails.price > 0 && props.verseDetails.notInScope == 4) {
        return true
    } else {
        return false
    }
})

const dialogVisible = ref(false)
const loading = ref(false)
const verseMediaList = ref()
const verseVideo = ref()
let markAddress = ref("")
let dialogVisibleFollow = ref(false)
const followData = ref()
const userDataId = ref('')
const DownLoadVerseMedia = async () => {

    // console.log('userInfo.value.id111111111', userInfo.value);

    if (userInfo.value || props.verseDetails.scope == 1) {

        if (userDataId.value === props.verseDetails.owner) {

            // console.log(props.verseDetails.fileIds);
            if (props.verseDetails.fileType == 'image') {
                verseMediaList.value = await Promise.all(props.verseDetails.fileIds.map(async item => {
                    const res = await downloadFile(item, false, true)

                    return 'data:image/png;base64,' + arrayBufferToBase64(res.data)
                }))
            }
            if (props.verseDetails.fileType == 'video') {
                verseVideo.value = await Promise.all(props.verseDetails.fileIds.map(async item => {
                    const res = await downloadFile(item, false, true)
                    // console.log(res);

                    return URL.createObjectURL(new Blob([res.data], { type: 'audio/wav' }));
                }))
            }
        } else {
            // console.log(userDataId.value);

            const FileInfos = await Promise.all(props.verseDetails.fileIds.map(async item => {
                const res = await getFileInfoOfOthers(item, userDataId.value)
                // console.log(res);
                return res.fileDataId
                console.log(item);

            }))
            // console.log(FileInfos);

            if (props.verseDetails.fileType == 'image') {
                // console.log(userDataId.value);

                verseMediaList.value = await Promise.all(FileInfos.map(async item => {

                    const res = await downloadFileOfOthers(item, userDataId.value, true)

                    return 'data:image/png;base64,' + res
                }))


            }
            if (props.verseDetails.fileType == 'video') {
                verseVideo.value = await Promise.all(FileInfos.map(async item => {
                    const res: any = await downloadFileOfOthers(item, userDataId.value)
                    return URL.createObjectURL(new Blob([res], { type: 'audio/wav' }));
                }))
            }

        }
    }


}
const otherAvatar = ref()
const downLoadAvatar = async () => {
    const res = await downloadFileOfOthers(props.verseDetails.ownerAvatar, userDataId.value, true)
    if (res) {
        otherAvatar.value = 'data:image/png;base64,' + res
    } else {
        otherAvatar.value = null
    }


}
const isHide = ref(true)
onMounted(() => {
    markAddress.value = local.GET("metamaskAddress")
    if (userInfo.value.id) {
        userDataId.value = userInfo.value.id
    } else {
        userDataId.value = ''
    }
    if (keplrAddress.value) {
        loginMask.value = false
    } else {
        loginMask.value = true

    }
    DownLoadVerseMedia()
    downLoadAvatar()
    // console.log(props.verseDetails.digest.length);

    if (props.verseDetails.digest.length > 1200) {
        isHide.value = true
    } else {
        isHide.value = false

    }


})

const { picWidth } = getPicWidth(props.verseDetails.fileIds.length)
const getMediaNum = computed(() => props.verseDetails.fileIds.length)
const arrayBufferToBase64 = (buffer: any) => {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
const gotoDeatils = () => {

    if (!checkPriceStatus.value && checkFollowedStatus.value) {
        router.push({
            name: 'Verse-Details',
            query: {
                verseId: props.verseDetails.id
            },
        })
    }

}

const onDialog = (type: string | number) => {
    console.log(type)
    dialogVisible.value = !dialogVisible.value
    markAddress.value = local.GET("metamaskAddress")
}
const dialogPayFollow = () => {
    // console.log(props.verseDetails)
    if (markAddress.value) {
        followData.value = JSON.parse(JSON.stringify(props.verseDetails))
        followData.value.img = otherAvatar
        followData.value.username = props.verseDetails.ownerUsername
        followData.value.bio = props.verseDetails.ownerBio
        followData.value.toPay = props.verseDetails.payToFollow
        followData.value.handleName = props.verseDetails.owner.substring(0, 13)

        dialogVisibleFollow.value = true
    } else {
        dialogVisible.value = true
    }
}
const dialogVisibleContinue = ref(false)
const payToSee = () => {
    if (markAddress.value) {

        dialogVisibleContinue.value = true
    } else {
        dialogVisible.value = true
    }
}
const onPayVerse = (pay: any) => {
    console.log(pay);
    console.log(props.verseDetails);

    if (pay) {

        const loading = ElLoading.service({
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        const amount = props.verseDetails.price.toString()
        const tokenId = props.verseDetails.nftTokenId
        getWalletAddress().then(val => {
            if (val) {
                payBuy(tokenId, amount, markAddress.value, 1).then(res => {
                    // props.verseDetails.notInScope = 0
                    // DownLoadVerseMedia()
                    if(props.verseDetails.notInScope == 4){
                        showPayStatus.value = true
                    }
                    
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
const onPayFollow = (follow: any) => {
    console.log(props.verseDetails)

    if (follow) {
        const loading = ElLoading.service({
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        const amount = props.verseDetails.payToFollow.toString()
        const tokenId = props.verseDetails.ownerNftTokenID

        // $emits("onFollow", props.verseDetails.id)
        getWalletAddress().then(res => {
            if (res) {
                payBuy(tokenId, amount, markAddress.value, 2).then(res => {
                    onFollow(1)
                    // props.verseDetails.notInScope = 0
                    dialogVisibleFollow.value = false
                    if(props.verseDetails.notInScope == 2){
                        showPayStatus.value = true
                    }
                    DownLoadVerseMedia()
                    loading.close()

                }).catch(res => {
                    console.log(res)

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
        dialogVisibleFollow.value = false
    }
}
const $emits = defineEmits(["deleteVerseNow", 'onFollow', 'hasLike', 'hasBookMark'])
// <{
//     (e: 'deleteVerseNow', textContent: string, textIndex: number | undefined): void,
//     (e: 'onFollow', id: string): void
// }>()
const deleteVerse = () => {
    $emits('deleteVerseNow', props.verseDetails.digest, props.verseIndex)
    // deleteVerseNow()
    // deleteVisible.value = true
    // deleteText.value = props.verseDetails.content
}

const onFollow = (type?: number) => {


    loading.value = true

    // console.log(props.verseDetails)
    const createdAt = new Date().valueOf()
    const { id, owner, payToFollow } = props.verseDetails

    const status = payToFollow ? 0 : 1
    const query = { id, following: owner, status, createdAt, updatedAt: createdAt, expiredAt: 0, follower: userInfo.value.id }
    // if (type) {
    //     query.status = 0
    // }
    saveUserFollowing(query, userInfo.value.did).then(res => {


        // props.verseDetails.hasFollowedOwner = true
        loading.value = false
        if (!res) {
            return
        }
        $emits("onFollow", props.verseDetails.owner, type)

        if (props.verseDetails.notInScope == 2) {
            showPayStatus.value = true
        }
    }).catch(res => {

    })
}

const Unfollow = () => {
    loading.value = true
    const { id, owner, status } = props.verseDetails

    console.log(props.verseDetails)

    const provider = local.GET('provider')
    deleteUserFollowing(owner, provider.sid).then((res) => {
        loading.value = false
        $emits("onFollow", props.verseDetails.owner)

    }).catch((res) => {
        loading.value = false

    })
}

const onToUser = () => {

    if (props.verseDetails.owner != userInfo.value.id) {
        router.push({
            name: 'Verse-UserProfile',
            query: {
                key: props.verseDetails.owner,
            },
        })
    } else {
        router.push({
            name: 'Verse-Profile',
        })
    }

}
const hasMoveStatus = ref(true)
const likeVerse = (val: boolean) => {
    if (hasMoveStatus.value == true) {
        $emits('hasLike', props.verseIndex, val)
        hasMoveStatus.value = false
        return
    } else {
        hasMoveStatus.value = false
        return
    }
    // ElMessage({
    //     dangerouslyUseHTMLString: true,
    //     customClass: 'successMessage',
    //     type: 'success',
    //     message: '<p style="color: #fff;">The operation is successful. Kindly note that data is stored on decentralized network, which may cause some delay. We kindly recommend refreshing the page at a later time. </p>',
    // })
}
const hasBookMarkStatus = ref(true)
const bookMarkVerse = (val: boolean) => {
    if (hasBookMarkStatus.value == true) {
        $emits('hasBookMark', props.verseIndex, val)
        hasBookMarkStatus.value = false
        return
    } else {
        hasBookMarkStatus.value = false
        return
    }



    // ElMessage({
    //     dangerouslyUseHTMLString: true,
    //     customClass: 'successMessage',
    //     type: 'success',
    //     message: '<p style="color: #fff;">The operation is successful. Kindly note that data is stored on decentralized network, which may cause some delay. We kindly recommend refreshing the page at a later time. </p>',
    // })

}
const retryContract = () => {
    console.log(props.verseDetails);
    getWalletAddress().then(AddressVal => {
        console.log(AddressVal);

        if (AddressVal) {
            mint(props.verseDetails.id, props.verseDetails.price, 1, 0, AddressVal).then(res1 => {
                console.log(res1);

                ElMessage({
                    customClass: 'successMessage',
                    type: 'success',
                    message: t('utils.message'),
                })
            }).catch((err) => {
                ElMessage({
                    dangerouslyUseHTMLString: true,
                    customClass: 'successMessage',
                    type: 'error',
                    message: `<p style="color: #fff;">${err.message}</p>`,
                })
            })
        }
    }).catch(AddressVal1 => {
        console.log(AddressVal1);

    })
}
const dialogShareVisible = ref(false)
const shareData = ref()
const onShareDialog = () => {
    // loginState.dialogVisible = true
    // return
    shareData.value = props.verseDetails
    dialogShareVisible.value = !dialogShareVisible.value
}
const checkFollowedStatus = computed(() => {
    if (props.verseDetails.notInScope == 2 && props.verseDetails.hasFollowedOwner !== true) {
        return false

    } else if (props.verseDetails.notInScope == 3 && props.verseDetails.hasFollowedOwner !== true) {
        return false

    } else {
        return true
    }
})
const followToSee = () => {
    if (!props.verseDetails.hasFollowedOwner && !props.verseDetails.payToFollow) {
        onFollow()
    }
    if (!props.verseDetails.hasFollowedOwner && props.verseDetails.payToFollow) {
        dialogPayFollow()
    }

}
const showPayStatus = ref(false)
</script>

<style scoped lang="scss">
::v-deep(.el-image-viewer__wrapper) {
    // height: 94%;
    // width: 95%;
    // border-radius: 10px;
    margin: auto !important;
    box-shadow: none;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(12px);
    border: none;
    overflow: hidden;

    .el-image-viewer__actions {
        display: none;
    }


}

:deep(.el-button) {

    border: none;
    box-shadow: none;

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

.setPriceBox {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    color: #E5D32D;

    img {
        margin-right: 10px;
    }

    // height: 38px;
    // text-align: center;
    // line-height: 40px;
    // border-radius: 0px 0px 9px 9px;

    // padding: 0 20px;



}

.verse {
    width: 100%;
    padding: 20px 27px;
    box-sizing: border-box;
    border-bottom: 2px solid #474747;
    position: relative;
    cursor: pointer;

    .verse-mask {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        // z-index: 9999999999999999;
    }

    .verse-head {
        .user-info {
            // height: 43px;
        }

        .infos {
            margin-left: 10px;

            .username {
                font-weight: 700;
                font-size: 16px;
                max-width: 300px;
                display: inline-block;
                max-width: 150px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                // margin-bottom: 7px;
            }

            .userDesc {
                font-weight: 400;
                font-size: 14px;
                margin-left: 16px;
                display: inline-block;
                max-width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .verse-time {
                font-weight: 400;
                font-size: 14px;

                color: #909791;
                margin-top: 2px;
            }
        }

        .more-btn {
            // position: absolute;
            // top: 9px;
            // right: 8px;
            cursor: pointer;
            z-index: 1;
            margin-left: 12px;
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
    }

    .verse-status {
        width: 100%;
        height: 80px;
        background: #FFD749;
        border-radius: 10px;
        padding: 17px 30px;
        box-sizing: border-box;
        margin-top: 10px;

        .verse-status-text {
            width: 486px;
            color: #7E4C00;
            font-weight: 500;
            font-size: 16px;
        }
    }

    .contract-fail {
        width: 100%;
        height: 80px;
        background: #F25C5C;
        border-radius: 10px;
        padding: 17px 30px;
        box-sizing: border-box;
        margin-top: 10px;

        .fail-left {
            width: 486px;
            color: #fff;
            font-weight: 500;
            font-size: 16px;
        }

        .retry {
            background: #FFFFFF;
            border-radius: 5px;
            width: 68px;
            height: 29px;
            color: #F25C5C;
            font-weight: 600;
            text-align: center;
            line-height: 29px;
            cursor: pointer;
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

    .verse-status-owner {
        width: 100%;
        text-align: center;
        line-height: 24px;
        background: #191919;
        border-radius: 6px;
        color: #21C143;
        font-weight: 600;
        font-size: 13px;
        margin-top: 10px;
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
                width: 100%;
                border-radius: 10px;
                max-height: 616px;
                object-fit: cover;
                border: 1px solid rgba(71, 71, 71, 1);

                // min-height: 610px;
                // min-width: 610px;
                img {
                    width: 100%;
                    border-radius: 10px;
                    max-height: 616px;
                    // object-fit:cover;
                }
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
                flex-wrap: wrap;
            }

            .loading-pic {
                border-radius: 10px;
                margin-bottom: 15px;
                // margin-right: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #000;


            }

            .el-image {
                border-radius: 10px;
                margin-bottom: 15px;
                max-height: 610px;
                border: 1px solid rgba(71, 71, 71, 1);

                img {
                    border-radius: 10px;
                    max-height: 610px;
                    margin-bottom: 15px;
                    // margin-right: 15px;
                    object-fit: cover;
                }
            }

            // box-sizing: border-box;
            img {
                border-radius: 10px;
                max-height: 610px;
                margin-bottom: 15px;
                // margin-right: 15px;
                object-fit: cover;
            }

        }

        .pics {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;

            .loading-pic {
                border-radius: 10px;
                background-color: #000;
                // margin-right: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #000;
            }

            .true-pics {
                width: 100%;
                display: flex;
                justify-content: space-between;

                .el-image {
                    border-radius: 10px;
                    max-height: 610px;
                    margin-bottom: 10px;
                    // margin-right: 15px;
                    object-fit: cover;
                    border: 1px solid rgba(71, 71, 71, 1);

                    img {
                        border-radius: 10px;
                        max-height: 610px;
                        margin-bottom: 10px;
                        // margin-right: 15px;
                        object-fit: cover;
                    }

                }

                img {
                    border-radius: 10px;
                    max-height: 610px;
                    margin-bottom: 10px;
                    // margin-right: 15px;
                    object-fit: cover;
                }
            }

            .loadings {
                margin-bottom: 10px;

                .loading-pic {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

            }
        }

        .loadings :nth-child(3n+2) {
            margin: 0 15px;
            // margin-bottom: 15px;
        }

        .true-pics :nth-child(3n+2) {
            margin: 0 15px;
            margin-bottom: 10px;
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
            cursor: pointer;
            margin-bottom: 12px;

            img {
                width: 79px;
                height: 66px;
            }

            span {
                display: inline-block;

            }
        }

        .pic-unpay {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 304px;
            background: linear-gradient(0deg, #000000, #000000), #000000;
            border-radius: 10px;
            margin-bottom: 12px;
        }

        .not-files-digest {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;

            p {
                width: 100%;

                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                display: inline-block;
            }
        }
    }

    .not-files-digest {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 10px 0;
        display: inline-block;

        p {
            width: 100%;

            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
        }
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

.verse:hover {
    background-color: #222222;
}

// .verse :last-child{
//     border-bottom: none !important;
// }
.unFollow-status {
    display: flex;
    // flex-direction: column;
    // justify-content: center;
    align-items: center;
    padding: 7px 19px;
    width: 86px;
    height: 30px;
    box-sizing: border-box;
    background: #FFFFFF;
    border-radius: 34px;
    color: #000000;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
}

.unFollow-status-unpay {
    background: #E6D32D;
    border-radius: 34px;
    padding: 7px 19px;
    cursor: pointer;
    // margin-top: 10px;

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
}</style>