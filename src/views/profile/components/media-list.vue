<template>
    <div class="media-list">
        <div v-for="(item, index) in props.mediaLists" :key="index" class="single-media">
           
            <img v-if="item.contentType.includes('image')" style="cursor: pointer;" :src="item.downloadFile" alt=""
                @click="gotodetails(item)">
            <div class="media-video" v-else @click="gotodetails(item)">
                <video :src="item.downloadFile"></video>
                <div class="media-time" >
                    <!-- {{item.extendInfo}} -->
                    {{formateTime(item.extendInfo)}}
                   
                </div>
                <div class="video-play">
                    <img src="@/assets/images/video-play.svg" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { number } from 'echarts'
const router = useRouter()
interface MediaType {
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
    downloadFile: any,
    owner: string,
    id: string,
    verseId: string,
    duration: 0,
    contentType:string,
    extendInfo:number | string
}
interface MediaListType {
    mediaLists: Array<MediaType>
}
const props = defineProps<MediaListType>()
console.log(props.mediaLists);
const gotodetails = (val: MediaType) => {
   
    router.push({
        name: 'Verse-Details',
        query: {
            verseId: val.verseId,
        },
    })
}
const formateTime=(time:any)=> {
    if(time){

      const h = parseInt(time / 3600)
      const minute = parseInt(time / 60 % 60)
      const second = Math.ceil(time % 60)    
 
      const hours = h < 10 ? '0' + h : h
      const formatSecond = second > 59 ? 59 : second
      return `${hours > 0 ? `${hours}:` : ''}${minute < 10 ? '0' + minute : minute}:${formatSecond < 10 ? '0' + formatSecond : formatSecond}`
    }

    }

// const getTime = (val:any) => {
//     console.log(val);
//     var audioElement = new Audio(val)
//     var duration;
//     audioElement.addEventListener("loadedmetadata", function (_event) {
//         console.log(audioElement.duration);

//         duration = audioElement.duration;
//         console.log(duration);
        

//     });
//     return duration
// }
// const getTime = computed(() =>  (val: any) => {
//     var audioElement = new Audio(val)
//     var duration;
//      audioElement.addEventListener("loadedmetadata", () => {
//         duration = audioElement.duration;
//         console.log(duration);
//     });
//     console.log(duration);
//     return duration
// })


</script>

<style scoped lang="scss">
.media-list {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 20px 12px 0px 12px;
    box-sizing: border-box;

    .single-media {
        box-sizing: border-box;
        width: 154px;
        height: 154px;
        border: 1px solid #474747;
        border-radius: 10px;
        margin-right: 10px;
        margin-bottom: 10px;
        overflow: hidden;

        img {
            width: 152px;
            height: 152px;
            object-fit: cover;
        }

        .media-video {
            position: relative;
            cursor: pointer;

            video {
                width: 154px;
                height: 154px;
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
            .video-play{
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
                img{
                    width: 12px;
                    height: 12px;
                }
            }
        }
    }
}

.media-list :nth-child(4n) {
    margin-right: 0;
}
</style>