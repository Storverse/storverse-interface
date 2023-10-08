<template>
    <div class="square">
        <!-- <el-scrollbar height="100%" ref="scrollbar" @scroll="verseScroll"> -->

        <div ref="infiniteSquare" v-infinite-scroll="load" infinite-scroll-distance="10" style="overflow:auto; "
            @scroll="scrollSquare" class="scroll">


            <div class="square-left" style="overflow:auto">
                <notLogin v-if="!keplrAddress" style="margin-bottom: 15px;"></notLogin>
                <!-- <el-button @click="show">+++</el-button> -->
                <div class="square-verses">
                    <div class="tabs flx-align-center">
                        <div :class="tabValue === 0 ? 'tab-home tab-active' : 'tab-home'" @click="changeTab(0)">
                            {{ $t('square.Home') }}
                        </div>
                        <div :class="tabValue === 1 ? 'tab-home tab-active' : 'tab-home'" @click="changeTab(1)"
                            v-if="keplrAddress">
                            {{ $t('square.Subscriptions') }}
                        </div>
                        <div class="" :class="tabValue === 0 ? 'tab-btm tab-left' : 'tab-btm tab-right'">

                        </div>
                    </div>
                    <!-- Home -->
                    <div v-if="tabValue === 0">
                        <div v-loading="verseLoading" element-loading-background="#292929"
                            style="width: 100%;min-height: 500px;">
                            <div v-if="verseList.length > 0 && !verseLoading">
                                <div v-for="(item, index) in verseList" :key="index">

                                    <verse :verseDetails="item" :verse-index="index" @deleteVerseNow="deleteVerseNow"
                                        @onFollow="onFollow" @has-like="likeVerse" @has-book-mark="bookmarkVerse"></verse>

                                </div>
                            </div>

                            <div v-else>
                                <div class="verse-empty">
                                    <img src="@/assets/images/empty.svg" alt="">
                                    <span style="color: #555555;margin-top: 10px;">{{ $t('Bookmark.NoData') }}</span>
                                </div>
                            </div>
                        </div>

                        <div style="width: 100%;height: 60px;" element-loading-background="#292929" v-loading="loadingMore">

                        </div>
                    </div>
                    <div v-if="tabValue === 1">
                        <div v-loading="subverseLoading" element-loading-background="#292929"
                            style="width: 100%;min-height: 500px;">
                            <div v-if="SubVerseList.length > 0 && !subverseLoading">
                                <div v-for="(item, index) in SubVerseList" :key="index">
                                    <verse :verseDetails="item" :verse-index="index" @deleteVerseNow="deleteVerseNow"
                                        @onFollow="onFollow" @has-like="likeVerse" @has-book-mark="bookmarkVerse"
                                      ></verse>

                                </div>
                            </div>

                            <div v-else>
                                <div class="verse-empty">
                                    <img src="@/assets/images/empty.svg" alt="">
                                    <span style="color: #555555;margin-top: 10px;">{{ $t('Bookmark.NoData') }}</span>
                                </div>
                            </div>
                        </div>

                        <div style="width: 100%;height: 60px;" element-loading-background="#292929" v-loading="loadingMore">

                        </div>
                    </div>
                </div>

            </div>

        </div>
        <!-- </el-scrollbar> -->


        <div class="square-right">
            <suggestions></suggestions>
            <backTop @backScrollTop="scrollTop" v-show="showBackTop"></backTop>
        </div>
    </div>
    <dialogText :Visible="deleteVisible" :data="deleteText" @handleClose="handleDelete"></dialogText>
</template>

<script setup lang="ts">
import verse from '@/components/verse.vue';
import suggestions from '@/components/suggestions.vue';
import notLogin from "@/components/notLogin/herder.vue"
import { ref, reactive, onMounted, computed, watch, nextTick } from 'vue'
import backTop from '@/components/backTop.vue';
import { LoginState } from "@/store/modules/login"
import { UserState } from "@/store/modules/users"
import { GetHomeVerses, GetBookMark, saveVerseLike, deleteVerseLike, addVerseIdToBookMark, removeVerseIdFromBookMark, deleteVerse, getSubscribedVerses } from "@/libs/verse"
// import { getHomeVerses } from "@/libs/notLogin"
import dialogText from '@/components/dialog/dialogText.vue';
// import { useI18n } from 'vue-i18n'
// const { locale } = useI18n()
import local from "@/utils/local";

const tabValue = ref(0)

const changeTab = (val: number) => {
    loadingMore.value = false
    if (val == 1) {
        subverseLoading.value = true

        subversePage.value = 0
        subverseLimit.value = 10
        SubVerseList.value = []
        // getSubscribedVerses
        // verseLoading.value = true
        // loadingMore.value = false
        // versePage.value = 0
        // verseLimit.value = 10
        // verseList = []
        initSubscript()
    } else {
        verseLoading.value = true

        // home
        versePage.value = 0
        verseLimit.value = 10
        verseList.value = []
        init()

    }
    tabValue.value = val
}
const loginState = LoginState();
const userState = UserState()
const keplrAddress = computed(() => loginState.keplrAddress)
const walletNumber = computed(() => loginState.walletNumber);

const show = () => {
    // console.log(LoginState().modelManager);

}
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
const verseList: any = ref([])
const scrollbar = ref(null)
const verseScroll = (val: any) => {
    console.log(val.scrollTop);
}
const verseLoading = ref(true)
const subverseLoading = ref(true)
const loadingMore = ref(false)
onMounted(async () => {
    await init()

})
watch(walletNumber, (newValue, oldValue) => {
    loadingMore.value = false
    verseLoading.value = true
    verseList.value.length = 0
    versePage.value = 0
    verseLimit.value = 10
    SubVerseList.value.length = 0
    subversePage.value = 0
    subverseLoading.value = true
    init()
});

const versePage = ref(0)
const verseLimit = ref(10)

const subversePage = ref(0)
const subverseLimit = ref(10)

const allowAddPage = ref(true)
const allowSubPage = ref(true)
const load = () => {

    if (tabValue.value == 0) {
        if (verseList.value.length > 5) {
            loadingMore.value = true
            // loadingMore.value = true

            if (allowAddPage.value) {
                versePage.value = versePage.value + 10
                init()
            }
        }
        allowAddPage.value = false
    } else {
        if (SubVerseList.value.length > 5) {
            loadingMore.value = true
            if (allowSubPage.value) {
                subversePage.value = subversePage.value + 10
                initSubscript()
            }

        }
        allowSubPage.value = false
    }
}

const init = async () => {
    console.log(versePage.value);

    let id = ''

    if (keplrAddress.value) {
        id = userState.KeplrUserInfo.id
        const provider = local.GET('provider')
        // const BookMark = await GetBookMark(provider.sid)
        // console.log(BookMark)
        GetBookMark(provider.sid).then(res => {
            console.log(res);
            GetHomeVerses(id, verseLimit.value, versePage.value, res).then(res => {
                console.log(res)
                if (res.length > 0) {

                    if (versePage.value == 0) {
                        verseList.value = res
                    } else {
                        verseList.value.push(...res)
                    }
                    allowAddPage.value = true
                } else {
                    allowAddPage.value = false
                }


                verseLoading.value = false
                loadingMore.value = false
                // verseList=res[0]

            })
        }).catch(res => {
            GetHomeVerses(id, verseLimit.value, versePage.value).then(res => {
                console.log(res)
                // verseList=res[0]
                if (res.length > 0) {

                    if (versePage.value == 0) {
                        verseList.value = res
                    } else {
                        verseList.value.push(...res)
                    }
                    allowAddPage.value = true
                } else {
                    allowAddPage.value = false
                }


                verseLoading.value = false
                loadingMore.value = false
            })
        })

    } else {

        GetHomeVerses('', verseLimit.value, versePage.value).then(res => {
            console.log(res)
            // verseList=res[0]
            if (res.length > 0) {

                if (versePage.value == 0) {
                    verseList.value = res
                } else {
                    verseList.value.push(...res)
                }
                allowAddPage.value = true
                verseLoading.value = false
                loadingMore.value = false
            } else {
                loadingMore.value = false
                allowAddPage.value = false
            }
        })
    }


}
const SubVerseList: any = ref([])
const initSubscript = () => {
    let id = ''

    if (keplrAddress.value) {
        id = userState.KeplrUserInfo.id
        const provider = local.GET('provider')
        // const BookMark = await GetBookMark(provider.sid)
        // console.log(BookMark)
        console.log('loading----------------------sub');

        GetBookMark(provider.sid).then(res => {
            console.log(res);
            getSubscribedVerses(id, subverseLimit.value, subversePage.value, res).then(res => {
                console.log(res)
                if (res.length > 0) {

                    if (subversePage.value == 0) {
                        SubVerseList.value = res
                    } else {
                        SubVerseList.value.push(...res)
                    }


                    subverseLoading.value = false
                    loadingMore.value = false
                    allowSubPage.value = true
                } else {
                    allowSubPage.value = false

                    subverseLoading.value = false
                    loadingMore.value = false

                }
                // verseList=res[0]

            }).catch(fail => {
                SubVerseList.value = []
                subverseLoading.value = false
                loadingMore.value = false
                allowSubPage.value = false
                console.log(fail);

            })
        }).catch(res => {
            console.log('?????????????????????');

            getSubscribedVerses(id, subverseLimit.value, subversePage.value).then(res1 => {
                console.log(res1);

                if (res1.length > 0) {

                    if (subversePage.value == 0) {
                        SubVerseList.value = res1
                    } else {
                        SubVerseList.value.push(...res1)
                    }

                    subverseLoading.value = false
                    loadingMore.value = false
                    allowSubPage.value = true
                } else {
                    subverseLoading.value = false
                    loadingMore.value = false
                    allowSubPage.value = false


                }
            })
        })

    } else {
        GetHomeVerses().then(res => {
            console.log(res)
            // verseList=res[0]
            verseList.value.push(...res)
            verseLoading.value = false
            loadingMore.value = false
        })
    }
}

const onFollow = (id: string, status: number) => {
    if (tabValue.value == 0) {
        console.log(verseList);
        verseList.value.forEach((element: any) => {
            console.log(element, "===")
            if (element.owner == id) {
                console.log(element);

                element.hasFollowedOwner = !element.hasFollowedOwner
                if (element.notInScope == 3) {
                    element.notInScope = 0
                }
                // if (status) {
                //     element.status = status
                // }
            }
        });

        console.log(verseList);

    } else {
        SubVerseList.value.forEach((element: any) => {
            console.log(element, "===")
            if (element.owner == id) {
                element.hasFollowedOwner = !element.hasFollowedOwner
                if (element.notInScope == 3) {
                    element.notInScope = 0
                }
                // if (status) {
                //     element.status = status
                // }
            }
        });
    }

}

const likeVerse = (index: string, type: boolean) => {
    if (tabValue.value == 0) {
        console.log(verseList[index]);

        let verseLike = {
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
            verseId: verseList.value[index].id,
            status: 0,
            owner: userState.KeplrUserInfo.id
        }

        if (type == true) {
            verseLike.status = 1
            saveVerseLike(verseLike, userState.KeplrUserInfo.did).then(res => {
                console.log(res);
                verseList.value[index].CountKey = 1

                if (!res.includes('Error')) {

                    verseList.value[index].likeCount++
                    verseList.value[index].hasLiked = type

                }


            }).catch(Response => {
                console.log(Response);

            })
            // like
        } else {

            // cancel like
            verseLike.status = 2
            console.log(verseLike);
            deleteVerseLike(verseList.value[index].id, userState.KeplrUserInfo.did).then(res => {
                console.log(res);
                verseList.value[index].CountKey = 0
                if (!res.includes('Error')) {

                    verseList.value[index].likeCount--

                    verseList.value[index].hasLiked = type
                }

            }).catch(Response => {
                console.log(Response);

            })

        }
    } else {
        console.log(SubVerseList.value[index]);

        let verseLike = {
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
            verseId: SubVerseList.value[index].id,
            status: 0,
            owner: userState.KeplrUserInfo.id
        }
        if (type == true) {
            console.log(verseLike);
            verseLike.status = 1
            saveVerseLike(verseLike, userState.KeplrUserInfo.did).then(res => {
                console.log(res);
                SubVerseList.value[index].CountKey = 1

                if (!res.includes('Error')) {

                    SubVerseList.value[index].likeCount++
                    SubVerseList.value[index].hasLiked = type
                    

                }

            }).catch(Response => {
                console.log(Response);

            })
            // like
        } else {

            // cancel like
            verseLike.status = 2
            deleteVerseLike(SubVerseList.value[index].id, userState.KeplrUserInfo.did).then(res => {
                console.log(res);
                SubVerseList.value[index].CountKey = 0
                if (!res.includes('Error')) {

                    
                    SubVerseList.value[index].likeCount--

                    SubVerseList.value[index].hasLiked = type
                }

            }).catch(res => {
                console.log(res);

            })

        }
    }

}
const bookmarkVerse = (index: string, type: boolean) => {
    if (tabValue.value == 0) {

        if (type == true) {

            addVerseIdToBookMark(verseList.value[index].id, userState.KeplrUserInfo.did).then(res => {
                console.log(res);
                verseList.value[index].CountKey = 1

                if (!res.includes('Error')) {
                    verseList.value[index].hasBookMarked = type
                }

            }).catch(Response => {
                console.log(Response);

            })
        } else {
            console.log('r-b');
            removeVerseIdFromBookMark(verseList.value[index].id, userState.KeplrUserInfo.did).then(res => {
                console.log(res);
                verseList.value[index].CountKey = 0
                if (!res.includes('Error')) {
                    verseList.value[index].hasBookMarked = type
                }
            }).catch(Response => {
                console.log(Response);
            })
        }
    } else {
        if (type == true) {
            addVerseIdToBookMark(SubVerseList.value[index].id, userState.KeplrUserInfo.did).then(res => {
                console.log(res);
                SubVerseList.value[index].CountKey = 1
                if (!res.includes('Error')) {

                    SubVerseList.value[index].hasBookMarked = type
                }

            })
        } else {
            console.log('r-b');
            removeVerseIdFromBookMark(SubVerseList.value[index].id, userState.KeplrUserInfo.did).then(res => {
                SubVerseList.value[index].CountKey = 0

                if (!res.includes('Error')) {

                    SubVerseList.value[index].hasBookMarked = type
                }
            })
        }
    }


}
const deleteText = ref('')
const deleteVisible = ref(false)
const deleteIndex = ref()
const deleteVerseNow = (text: string, index: number | undefined) => {
    console.log(text);
    console.log(index);
    deleteVisible.value = true
    deleteText.value = text
    deleteIndex.value = index
}
const handleDelete = (type: Number) => {
    deleteVisible.value = false
    if (type == 1) {

        deleteVerse(verseList.value[deleteIndex.value].id).then(res => {

            if (res) {
                verseList.value.splice(deleteIndex.value, 1)
            }

        }).catch(err => {
            console.error(err);
        })
    }

}
</script>

<style scoped lang="scss">
.square {
    // width: 1040px;
    height: 100%;
    display: flex;

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
        // min-height: 708px;
        position: relative;

        .square-verses {
            // width: 670px;
            // margin-top: 15px;
            background: #292929;
            box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            // min-height: 500px;

            .tabs {
                width: 100%;
                height: 60px;
                border-bottom: 1px solid #474747;
                box-sizing: border-box;
                position: relative;

                .tab-home {
                    height: 56px;
                    width: 120px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #909791;
                    cursor: pointer;
                }

                .tab-active {
                    // border-bottom: 3px solid #56e868;
                    color: #56e868;
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
                align-items: center;
                justify-content: center;
                flex-direction: column;
                min-height: 500px;
            }
        }
    }

    .square-right {
        // height: 100%;
        // overflow-x:hidden;
        // overflow-y: scroll;
        position: relative;
        margin-left: 20px;

        // width: 350px;
        // height: 600px;
        // background-color: #ccc;
    }

    // ::-webkit-scrollbar {
    //         display: none;
    //     }
}
</style>