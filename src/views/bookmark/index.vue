<template>
    <div class="square" v-if="keplrAddress">
        <!-- <el-scrollbar height="100%"> -->
        <div ref="infiniteSquare" @scroll="scrollSquare" v-infinite-scroll="load" style="overflow:auto; height: 100%;"
            class="scroll">
            <div class="square-left">
                <div class="square-verses">
                    <div class="tabs flx-justify-between ">
                        <div>
                            {{ $t('routers.Bookmark') }}
                        </div>
                        <div class="flx-center">
                            <div :class="tabValue === 0 ? 'tab-home tab-active' : 'tab-home'" @click="changeTab(0)">
                                {{ $t('Bookmark.All') }}
                            </div>
                            <div style="width: 1px;height: 18px;background-color: #474747;margin: 0 20px;">

                            </div>
                            <div :class="tabValue === 1 ? 'tab-home tab-active' : 'tab-home'" @click="changeTab(1)">
                                {{ $t('Bookmark.Followed') }}
                            </div>


                        </div>

                    </div>
                    <div style="width: 100%;min-height: 500px;" v-loading="verseLoading"
                        element-loading-background="#292929">
                        <div v-for="(item, index) in verseList" :key="index">

                            <verse :verseDetails="item" :verse-index="index" @onFollow="onFollow" @has-like="likeVerse"
                                @has-book-mark="bookmarkVerse"></verse>

                        </div>
                        <div v-if="verseList.length == 0">
                            <div class="verse-empty">
                                <img src="@/assets/images/empty.svg" alt="">
                                <span style="color: #555555;margin-top: 10px;">{{ $t('Bookmark.NoData') }}</span>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
        <!-- </el-scrollbar> -->


        <div class="square-right">
            <bookedMedia></bookedMedia>
            <backTop @backScrollTop="scrollTop" v-show="showBackTop"></backTop>
        </div>
    </div>
    <notNotification v-else></notNotification>
</template>

<script setup lang="ts">
import verse from '@/components/verse.vue';
import bookedMedia from '@/components/bookedMedia.vue';
import notLogin from "@/components/notLogin/herder.vue"
import backTop from '@/components/backTop.vue';
import local from '@/utils/local';
import { ref, reactive, computed, onMounted, watch } from 'vue'
import notNotification from "@/components/notLogin/content.vue";
import { LoginState } from "@/store/modules/login";
import { UserState } from "@/store/modules/users"

import { getMyBookMarkVerses, GetBookMark, saveVerseLike, deleteVerseLike, addVerseIdToBookMark, removeVerseIdFromBookMark } from "@/libs/verse"

const loginState = LoginState();
const keplrAddress = computed(() => loginState.keplrAddress);
const walletNumber = computed(() => loginState.walletNumber);

const userState = UserState()
const userInfo = computed(() => {
    return userState.KeplrUserInfo
})
watch(walletNumber, (newValue, oldValue) => {
    init(false)
});
const tabValue = ref(0)
const changeTab = (val: number) => {
    verseList = []
    verseLoading.value = true
    if (val === 0) {
        init(false)
    } else {
        init(true)
    }
    tabValue.value = val
}
const load = () => {


}
const infiniteSquare = ref()
const scrollTop = () => {
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
let verseList: any = reactive([])
const verseLoading = ref(true)
const init = (isFollow: boolean) => {
    const provider = local.GET('provider')
    console.log(isFollow);

    GetBookMark(provider.sid).then(res => {
        console.log(res);
        getMyBookMarkVerses(res, isFollow, userInfo.value.id).then(res1 => {
            console.log(res1)
            // verseList=res[0]
            verseList.push(...res1)
            verseLoading.value = false
        }).catch(Response => {
            verseLoading.value = false

        })
    }).catch(res => {
        verseLoading.value = false
    })
}

onMounted(() => {
    init(false)
})

const onFollow = (id: string) => {
    console.log(id)
    verseList.forEach((element: any) => {
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

                verseList[index].likeCount++
                verseList[index].hasLiked = type
            }
        })
        // like
    } else {
        // cancel like
        console.log('cancel like');
        console.log(verseList[index].id);
        console.log(userState.KeplrUserInfo.did);

        deleteVerseLike(verseList[index].id, userState.KeplrUserInfo.did).then(res => {
            console.log(res);
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

        addVerseIdToBookMark(verseList[index].id, userState.KeplrUserInfo.did).then(res => {
            verseList[index].CountKey=2
            if (!res.includes('Error')) {
                verseList[index].hasBookMarked = type
            }
            console.log(res);
           

        })
    } else {
        console.log('r-b');
        removeVerseIdFromBookMark(verseList[index].id, userState.KeplrUserInfo.did).then(res => {
            console.log(res);
            verseList[index].CountKey=3
            if (!res.includes('Error')) {

                verseList[index].hasBookMarked = type
            }

        })
    }

}
</script>

<style scoped lang="scss">
.square {
    // width: 1040px;
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

    ::v-deep(.el-loading-mask) {
        border-radius: 10px;
    }

    .square-left {
        width: 670px;
        // min-height: 708px;
        // margin-right: 20px;

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

                .tab-home {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #909791;
                    cursor: pointer;
                }

                .tab-active {
                    // border-bottom: 3px solid #56e868;
                    color: #ffffff;
                    // transform: translateX(120px) 1s;
                }

                .tab-btm {
                    width: 120px;
                    height: 3px;
                    background-color: #56e868;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    transition: left 0.5s;
                }

                .tab-left {
                    bottom: 0;
                    left: 0;
                }

                .tab-right {
                    bottom: 0;
                    left: 120px;
                }
            }

            .verse-empty {
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
    }

    .square-right {
        margin-left: 20px;
        position: relative;
        // width: 350px;
        // height: 600px;
        // background-color: #ccc;
    }
}
</style>