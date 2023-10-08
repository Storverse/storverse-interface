<template>
  <div class="square" v-if="keplrAddress">
    <el-scrollbar height="100%">
      <div class="square-left">
        <div class="header">{{ $t('routers.Notification') }}</div>
        <div class="content">
          <ul class="content-tab ">
            <!-- flx-justify-between -->
            <li :class="item.chex
              ? 'chexTab flx-justify-between'
              : 'flx-justify-between hasHover'
              " v-for="(item, index) in tabList" :key="index" @click="onTabs(index)">
              <span>{{ item.title }}</span>
              <span class="num" v-if="item.number > 0">{{
                item.number >= 99 ? "···" : item.number
              }}</span>
            </li>
          </ul>
          <div style="flex:1" class="content-list" v-if="isMounted" v-loading="loading"
            element-loading-background="rgba(22, 22, 22, 0.8)">
            <ul class="content-list" v-infinite-scroll="load" infinite-scroll-distance="10"
              v-if="newsList.list.length > 0 && !loading">
              <li v-for="item in newsList.list" :key="item.id" class="flx-justify-between ">
                <img :src="item.cover" alt="" @click="toUser(item)" class="cursor-s" v-if="item.cover" />
                <img src="@/assets/images/avatar.png" alt="" class="cursor-s" @click="toUser(item)" v-else>
                <div>
                  <p class="flx-justify-between">
                  <p @click="toUser(item)" class="cursor-s"> <span
                      style="display: inline-block;max-width: 200px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;font-weight: 800;font-size: 16px;margin-bottom: 3px;">{{
                        decodeURIComponent(item.name) }}</span><span class="msgRed" v-if="item.status == '0'"></span></p>
                  <span>{{
                    item.time
                  }}</span>
                  </p>
                  <p v-if="item.messageType == 1">{{ $t('Notification.FollowedYou') }}</p>
                  <p v-if="item.messageType == 3">{{ $t('Notification.PaidTo') }} </p>
                  <p v-if="item.messageType == 2">{{ $t('Notification.PaidVerse') }}: <span class="Verse-class "
                      @click="onVerse(item)">
                      "{{ decodeURIComponent(item.message) }}"
                    </span>
                  </p>
                  <!-- <p v-if="item.messageType == 3"></p> -->
                  <p v-if="item.messageType == 4">{{ $t('Notification.Replied') }}: <span class="Verse-class"
                      @click="onVerse(item)">"{{
                        item.message }}"</span> </p>
                  <p v-if="item.messageType == 5">{{ $t('Notification.LikedVerse') }}: <span class="Verse-class"
                      @click="onVerse(item)"> "{{
                        decodeURIComponent(item.message) }}"</span>

                  </p>
                  <p v-if="item.messageType == 6">{{ $t('Notification.LikedComment') }}:
                    <span class="Verse-class" @click="onVerse(item)"> "{{
                      decodeURIComponent(item.message) }}"</span>
                  </p>
                  <p v-if="item.messageType == 7">{{ $t('Notification.RepliedComment') }}:
                    <span class="Verse-class" @click="onVerse(item)"> "{{
                      decodeURIComponent(item.message) }}"</span>
                  </p>
                </div>
              </li>

            </ul>
            <div class="infinite-list follow-empty" v-if="newsList.list.length <= 0 && !loading">
              <img src="@/assets/images/empty.svg" alt="">
              <span style="color: #555555;margin-top: 10px;">{{ $t('Bookmark.NoData') }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>

    <!-- <div class="square-right">
     
    </div> -->



  </div>
  <notNotification v-else></notNotification>
</template>

<script setup lang="ts">
import notNotification from "@/components/notLogin/content.vue";
import { reactive, computed, onMounted, ref, watch, nextTick } from "vue";
import { LoginState } from "@/store/modules/login";
import { initService, getNotifications, saveReadNotifications } from "@/libs/notification";
import { downloadFile, downloadFileOfOthers } from "@/libs/file"
import { getUserProfile } from "@/libs/user";
import { UserState } from "@/store/modules/users";
import i18n from '@/lang/index'

const t = i18n.global.t
const loginState = LoginState();
const userInfo = UserState().getUserInfo;
const keplrAddress = computed(() => loginState.keplrAddress);
import { useRouter } from 'vue-router'
import axios from 'axios';
import { Console } from "console";
const router = useRouter()
interface TablistProps {
  title: String;
  chex: boolean;
  number: number;
  messageType: string;
}
interface newsListProps {
  name: String;
  cover: string;
  title: String;
  time: String;
  id: string | undefined;
  status: string | number,
  baseDataID: string
}
const isMounted = ref(false);
const tabList: Array<TablistProps> = reactive([
  {
    title: t('Notification.Like'),
    chex: true,
    number: 0,
    messageType: "5",
  },
  {
    title: t('Notification.Followed'),
    chex: false,
    number: 0,
    messageType: "1",
  },
  {
    title: t('Notification.Paid'),
    chex: false,
    number: 0,
    messageType: "2",
  },
  {
    title: t('Notification.Reply'),
    chex: false,
    number: 0,
    messageType: "4",
  },
]);
const loading = ref(false)
const pages = ref(0)
const typeIndex = ref(0)
const walletNumber = computed(() => loginState.walletNumber);
const newsList: any = reactive({
  list: Array<newsListProps>
});

watch(walletNumber, (newValue, oldValue) => {
  loading.value = true
  newsList.list.length = 0;
  fetchUnreadCounts();
  onTabs(0);
  pages.value = 0

});
const onTabs = (index: number) => {
  let totalCount = 0
  loading.value = true
  tabList.forEach((item, i) => {
    item.chex = false;


    if (index == i) {
      item.chex = true;
      item.number = 0
    }
    totalCount += item.number
    UserState().setTotalCount(totalCount)
  });

  newsList.list = [];
  pages.value = 0
  typeIndex.value = index
  fetchNewsList(tabList[index].messageType);
};

const load = () => {

  if (newsList.list.length > 0) {
    pages.value++
    const index = typeIndex.value
    fetchNewsList(tabList[index].messageType);
  }

};
let globalIndex1 = ref(0);

const fetchNewsList = async (messageType: string) => {
  const offset = pages.value * 10

  const curIndex = ++globalIndex1.value;
  const notifications = await getNotifications(messageType, userInfo.id, 10, offset);


  const list: any = await Promise.all(notifications.items.map(async (notification: any) => {


    const dataItem = await getUserProfile(notification.fromUser).catch(err => {
      return false
    })


    if (dataItem) {
      if (dataItem.avatar) {
        const image = await downloadFileOfOthers(dataItem.avatar, userInfo.id, true)
        dataItem.cover = 'data:image/png;base64,' + image

      } else {
        dataItem.cover = ''
      }
      dataItem.id = notification.baseDataID;
      dataItem.name = decodeURIComponent(dataItem.username);
      dataItem.time = new Date(notification.createdAt).toLocaleDateString();
      dataItem.messageType = notification.messageType
      dataItem.baseDataId = notification.baseDataID
      dataItem.fromUser = notification.fromUser
      dataItem.status = notification.status
      dataItem.message = notification.message;
      // switch (messageType) {
      //   case "1":
      //     dataItem.title = "Followed you";
      //     break;
      //   case "2":
      //     dataItem.title = "Paid your Verse " + Number(notification.message) * Math.pow(10, -18) + 'BNB';
      //     break;
      //   case "4":
      //     dataItem.title = `Replied your verse`;
      //     break;
      //   case "5":
      //     dataItem.title = "Liked your Verse";
      //     break;
      //   default:
      //    
      // }
    }

    return dataItem

  }))

  const listArry = list.filter((item: any) => item)
  // if (newsList.list.length <= 0) {
  //   loading.value = false
  // } 
  if (globalIndex1.value == curIndex) {
    if (pages.value == 0) {
      newsList.list = [...listArry]
    } else {
      newsList.list.push(...listArry)
    }
    await nextTick()
    loading.value = false
  }





  let unreadCount = 0;
  // Search for the messageType in unreadCounts
  for (const unreadCountInfo of notifications.unreadCounts) {
    if (unreadCountInfo.MessageType === messageType) {
      unreadCount = unreadCountInfo.UnreadCount;
      break;
    }
  }
};
async function fetchUnreadCounts() {
  const notificationsInfo = await getNotifications("5", userInfo.id);

  const unreadCounts = notificationsInfo.unreadCounts;
  tabList.forEach((tab) => {
    const unreadCountInfo = unreadCounts.find(
      (info) => info.MessageType === tab.messageType
    );
    if (unreadCountInfo) {

      tab.number = unreadCountInfo.UnreadCount;
    }



  });
}

onMounted(async () => {
  isMounted.value = true;
  newsList.list = [];
  loading.value = true
  await fetchUnreadCounts();
  typeIndex.value = 0
  onTabs(0);
});
const onVerse = (item: any) => {


  if (item.messageType == 2 || item.messageType == 4 || item.messageType == 5 || item.messageType == 6 || item.messageType == 7) {
    router.push({
      name: 'Verse-Details',
      query: {
        verseId: item.baseDataId,
      },
    })
  }

  // else {
  //   
  // }
  return

}
const toUser = (item: any) => {
  router.push({
    name: 'Verse-UserProfile',
    query: {
      key: item.fromUser,
    },
  })
}


</script>

<style scoped lang="scss">
.square {
  width: 1040px;
  height: 100%;
  display: flex;
  box-sizing: border-box;

  // overflow-x: hidden;
  .square-left {
    width: 1040px;
    height: 708px;
    margin-right: 20px;
    background-color: #292929;
    border-radius: 10px;
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);

    .header {
      height: 60px;
      border-bottom: 1px solid #474747;
      width: 100%;
      line-height: 60px;
      padding-left: 30px;
      font-family: "Inter";
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      box-sizing: border-box;
    }

    .content {
      height: 646px;
      display: flex;
      overflow-x: hidden;

      .content-tab {
        width: 280px;
        border-right: 1px solid #474747;
        height: 100%;

        li {
          height: 60px;
          padding: 0 30px;
          box-sizing: border-box;
          color: #909791;
          font-weight: 600;
          font-size: 16px;

          .num {
            display: inline-block;
            width: 38px;
            height: 20px;
            line-height: 20px;
            background: #f56e6e;
            border-radius: 30px;
            text-align: center;
            color: #fff;
            font-size: 13px;
          }
        }

        .chexTab {
          background: rgba(0, 0, 0, 0.3);
          color: #fff;
          transition: all 0.5s linear;
        cursor: pointer;

        }
        .hasHover{
        cursor: pointer;
          
          background-color: #292929;
        }
        .hasHover:hover{
          background-color: rgba(0, 0, 0, 0.3);
        }
      }

      .content-list::-webkit-scrollbar-thumb {

        background-color: #333333;
        border-radius: 20px;
      }

      // .content-list::-webkit-scrollbar-track {
      //   background-color: #0F0F0F;
      //   border-radius: 5px;
      //   padding: 0px 2px;
      //   border-radius: 20px;

      // }

      .content-list {
        flex: 1;
        width: 100%;
        // height: 100px;
        height: 646px;
        overflow: auto;

        .msgRed {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #f56e6e;
          margin-left: 15px;
          margin-top: 5px;
        }

        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 1px solid #484848;
        }

        div {
          flex: 1;
          margin-left: 20px;
          font-weight: 400;
          font-size: 14px;

          p:nth-child(1) {
            display: flex;

            span:nth-child(1) {
              font-weight: 700;
            }

            span:nth-child(2) {
              color: #909791;
            }
          }

          p:nth-child(2) {
            font-size: 14px;
            margin-top: 5px;
          }
        }

        li {
          height: 80px;
          border-bottom: 1px solid #474747;
          padding: 0 30px;
          box-sizing: border-box;
        }
      }

      .follow-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 646px;
        margin: 0 !important;

        span {
          margin-top: 10px;
        }

        img {
          border: none;
        }
      }
    }
  }


}

.Verse-class {
  color: #56E868;
  cursor: pointer;
}
</style>