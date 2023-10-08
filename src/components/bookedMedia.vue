<template>
    <div class="bookedBox">


        <el-input v-model="searchInfo" class="search" placeholder="Coming soon..." disabled="true">
            <template #prefix>
                <img src="@/assets/images/search.svg" alt="">
            </template>
        </el-input>

        <div class="suggestion">
            <div class="sug-head flx-justify-between">
                <h2>{{ $t('bookedMedia.Recentmedia') }}</h2>

            </div>
            <div v-loading="verseLoading" element-loading-background="#292929" style="width: 100%;min-height: 400px;">
                <div class="sug-list" v-if="!verseLoading && mediaList.length > 0">
                    <div v-for="(item, index) in mediaList" :key="index" class="single-media">

                        <img class="single-sug" v-if="item.contentType.includes('image')" style="cursor: pointer;"
                            :src="item.downloadFile" alt="" @click="gotodetails(item)">
                        <div class="media-video" v-else>
                            <video :src="item.downloadFile"></video>
                            <div class="media-time">
                                <!-- {{item.extendInfo}} -->
                                {{ formateTime(item.extendInfo) }}

                            </div>
                            <div class="video-play">
                                <img src="@/assets/images/video-play.svg" alt="">
                            </div>
                        </div>
                    </div>
                    <!-- <img class="single-sug" v-for="(item, index) in mediaList" :key="index" :src="item.downloadFile"
                    alt="item.verseId" @click="gotodetails(item)"> -->
                </div>
                <div v-else class="no-data">
                    <img src="@/assets/images/empty.svg" alt="">
                    <span style="color: #555555;margin-top: 10px;">{{ $t('Bookmark.NoData') }}</span>
                </div>
            </div>


        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { getBookMark } from '@/libs/verse';
import { FileInfo } from '@/libs/file';
import { UserState } from "@/store/modules/users";
import { FileService } from 'storverse-sao-api';
import { downloadFileOfOthers } from "@/libs/file"
import { useRouter } from 'vue-router'
const router = useRouter()

const mediaList: Array<any> = reactive([
]);
const formateTime = (time: any) => {
    if (time) {

        const h = Math.floor(time / 3600)
        const minute = Math.floor(time / 60 % 60)
        const second = Math.ceil(time % 60)

        const hours:any = h < 10 ? '0' + h : h
        const formatSecond = second > 59 ? 59 : second
        return `${hours > 0 ? `${hours}:` : ''}${minute < 10 ? '0' + minute : minute}:${formatSecond < 10 ? '0' + formatSecond : formatSecond}`
    }

}
const verseLoading = ref(true)
const userInfo = UserState().getUserInfo;
const arrayBufferToBase64 = (buffer: any) => {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
//todo get image by fileInfos, render info in UI
const loadMediaList = () => {
    // const bookMark = await getBookMark(userInfo.did);
    // console.log(bookMark);
    getBookMark(userInfo.did).then(async res => {
        // console.log(res.verseIds);
        // console.log(FileService.GetFileInfosByVerseIds);

        // FileService.GetFileInfosByVerseIds(res.verseIds, userInfo.id).then(res1=>{
        //     console.log(res1);

        // }).catch(Response1=>{
        //     console.log(Response1);

        // })
        // return
        try {
            const fileInfos = await FileService.GetFileInfosByVerseIds(res.verseIds, userInfo.id);
            console.log(fileInfos);


            const downloadFiles = await Promise.all(fileInfos.map(async (item: any) => {
                if (item.contentType.includes('image')) {
                    const res1 = await downloadFileOfOthers(item.fileDataId, userInfo.id, true)
                    // console.log(res1);

                    item.downloadFile = 'data:image/png;base64,' + res1
                    return item

                } else {
                    const res1: any = await downloadFileOfOthers(item.fileDataId, userInfo.id)
                    item.downloadFile = URL.createObjectURL(new Blob([res1], { type: 'audio/wav' }));
                    return item
                }
            }))

            // console.log(downloadFiles);

            mediaList.splice(0, mediaList.length, ...downloadFiles);


            verseLoading.value = false
        } catch (error) {
            verseLoading.value = false

            console.error('Error loading fileinfos:', error);
        }

    }).catch(Response => {
        verseLoading.value = false
        console.log(Response);

    })



};
const gotodetails = (val: any) => {

    router.push({
        name: 'Verse-Details',
        query: {
            verseId: val.verseId
        },
    })
}
const isReload = ref(false)
const searchInfo = ref('')
const reloadSug = () => {
    isReload.value = !isReload.value
    loadMediaList();
}
onMounted(() => {
    console.log(6666);
    loadMediaList();
    console.log(mediaList);
});
</script>

<style scoped lang="scss">
.bookedBox {
    width: 350px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
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
    border-radius: 10px;
    margin-bottom: 14px;
    background-color: #292929;

    ::v-deep(.el-input__wrapper) {
        background-color: #292929;

        border: 1px solid #474747;
        box-shadow: none;
        border-radius: 10px;
    }
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

.suggestion {
    width: 350px;
    // height: 508px;
    background: #292929;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 20px 19px 30px 19px;

    .sug-head {
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
        width: 100%;
        // height: 406px;
        box-sizing: border-box;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        flex-wrap: wrap;

        img {
            // margin-bottom: 20px;
            object-fit: cover;
            margin-top: 14px;
        }

        .media-video {
            position: relative;
            cursor: pointer;

            video {
                width: 94px;
                height: 94px;
                object-fit: cover;
            }

            .media-time {
                position: absolute;
                bottom: 8px;
                left: 8px;
                font-weight: 400;
                font-size: 14px;
                line-height: 21px;
            }

            .video-play {
                width: 35px;
                height: 35px;
                background: rgba(0, 0, 0, 0.8);
                border-radius: 50%;
                position: absolute;
                bottom: 10px;
                right: 10px;
                display: flex;
                align-items: center;
                justify-content: center;

                img {
                    width: 12px;
                    height: 12px;
                }
            }
        }

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

    .sug-list :nth-child(3n+2) {
        margin: 0 15px;
    }

    .single-sug {
        width: 94px;
        height: 94px;
        background: #000000;
        border-radius: 10px;
        box-sizing: border-box;
        cursor: pointer;

    }

}
</style>