<template>
  <div id="box">
    <el-dialog :model-value="dialogVisible" title="" :before-close="handleClose">
      <div class="content-box">
        <img class="imgs" src="@/assets/login/loginLog.png" alt="" />
        <div v-if="!keplrAddress && !metamaskAddress && !balanceStatus" class="content">
          <p>{{ $t('dialogLogin.ConnectWallet') }}</p>
          <div class="KeplrWallet flx-center cursor-s" @click="onWallet(4)">
            <img src="@/assets/login/KeplrWallet.png" alt="" />
            <div>
              <p>{{ $t('dialogLogin.KeplrWallet') }}</p>
              <p>{{ $t('dialogLogin.logfirst') }}</p>
            </div>
          </div>
          <p>{{ $t('dialogLogin.Quicklogin') }}</p>
          <p class="text">{{ $t('dialogLogin.quickTip') }}</p>
          <div class="flx-align-center Wallet-box">
            <div class="WalletBut flx-center cursor-s" @click="onWallet(item.type)" v-for="item in WalletList"
              :key="item.type" :style="item.chex ? 'border-color:#21C143' : 'border-color:#474747'
                ">
              <img src="@/assets/login/Metamask.png" v-if="item.type == 1" alt="">
              <img src="@/assets/login/BinanceWallet.svg" v-if="item.type == 2" alt="">
              <img src="@/assets/login/imtoken.png" v-if="item.type == 3" alt="">
              <!-- <img
                :src="item.type == 1 ? '' : item.type == 2 ? '@/assets/login/BinanceWallet.svg' : '@/assets/login/imtoken.png'"
                alt="" /> -->
              <div style="display: flex;flex-direction: column;color: #909791;">
                <span>{{ item.title }}</span>
                <span>({{ $t('dialogLogin.commingSoon') }})</span>
              </div>

            </div>
          </div>
        </div>
        <div v-if="!keplrAddress && metamaskAddress && !balanceStatus" class="content">
          <p>{{ $t('dialogLogin.ConnectWallet') }}</p>
          <p class="text">
            {{ $t('dialogLogin.connectTip') }}
          </p>
          <div class="address flx-center">
            <p class="break-word">{{ metamaskAddress }}</p>
          </div>
          <div class="KeplrWallet flx-center cursor-s" @click="onWallet(4)">
            <img src="@/assets/login/KeplrWallet.png" alt="" />
            <div>
              <p>{{ $t('dialogLogin.KeplrWallet') }}</p>
              <p>{{ $t('dialogLogin.logfirst') }}</p>
            </div>
          </div>
        </div>
        <div class="content" v-if="balanceStatus">
          <p style="margin-bottom: 15px;">{{ $t('dialogLogin.ConnectWallet') }}</p>
          <div class="address flx-center">
            <p class="break-word">{{ keplrWalletAddress }}</p>
          </div>
          <p class="current-address" style="color: #E5D32D;">{{ $t('dialogLogin.notoken') }}</p>
          <p class="current-address" style="font-weight: 400;font-size: 14px;">{{ $t('dialogLogin.needDid') }}
          </p>

          <div class="Claim" @click="ClaimSAOToken">
            {{ $t('dialogLogin.Claim') }}
          </div>
          <div class="claimed" @click="onWallet(4)">
            {{ $t('dialogLogin.hasClaim') }} >
          </div>
        </div>
        <!-- <el-button @click="toDownloadFile">+</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, computed, inject, watch } from "vue";
import { require } from "@/utils/require";
import { ElLoading, ElMessage } from "element-plus";
import { LoginState } from "@/store/modules/login";
import { UserState } from "@/store/modules/users";
import utils from '@/utils/utils';
import { useRouter, useRoute } from 'vue-router'
import $wallet from "@/utils/wallet.js";
import local from "@/utils/local";
import accountApi from "@/api/AccountApi"
import { handleConnect, getConnectWallet } from "../../libs/keplr";
import { getUserProfile, initService, saveUserProfile } from '../../libs/user'
import { initService as initFileService, uploadFileDataModel, createFileDataModel, downloadFile } from "@/libs/file"
import { initService as initVerseService, saveVerse, getVerse, deleteVerse, getVerseOfOthers, getVersesByOwner } from "@/libs/verse"
import { initService as initNotificationService, getNotifications } from "@/libs/notification"

import { initService as initfollowService } from "@/libs/followApi";
import { initService as verseCommentService } from "@/libs/verseComment";
import config from "@/libs/config"
const $router = useRouter()

declare const window: any;

// const type = computed(() => loginState.type)
// const myEmit = defineEmits(["handleClose"]);
interface UploadFileProps {
  Visible: boolean;
  type: number | string;
}
interface WalletListProps {
  title: number | string;
  icon: any;
  type: number | string;
  chex: boolean;
}

onMounted(() => {

  keplrWalletAddress.value = ''
  balanceStatus.value = false
  // LoginState().removeLogin()
  // UserState().removeLogin()

});
const balanceStatus = ref()
const loginState = LoginState();
const keplrWalletAddress = ref("")
const dialogVisible = computed(() => loginState.dialogVisible);
const keplrAddress = computed(() => loginState.keplrAddress);
const metamaskAddress = computed(() => loginState.metamaskAddress);
const WalletList: Array<WalletListProps> = reactive([
  {
    title: "Metamask",
    icon: require("@/assets/login/Metamask.png"),
    type: 1,
    chex: false,
  },
  // {
  //   title: "Binance Wallet",
  //   icon: require("@/assets/login/BinanceWallet.svg"),
  //   type: 2,
  //   chex: false,
  // },
  // {
  //   title: "imToken",
  //   icon: require("@/assets/login/imtoken.png"),
  //   type: 3,
  //   chex: false,
  // },
]);

watch(dialogVisible, (newValue, oldValue) => {
  keplrWalletAddress.value = ''
  balanceStatus.value = false
})
const state = reactive({
  modelManager: {},
  smProvider: {},
});

const arrayBufferToBase64 = (buffer: any) => {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
// const base64Str = ref()
const toDownloadFile = (user: any) => {
  let userdetails = { ...user }

  downloadFile(user.avatar, false, false, true).then(res => {
    userdetails.DownAvatar = 'data:image/png;base64,' + res.data;
    UserState().setUserAvatar(userdetails.DownAvatar)
  }).catch(Response => {
    console.log(Response);

  })

}

const handleClose = () => {
  loginState.dialogVisible = false;

  // myEmit("handleClose");
};
let connectWallet = reactive({
  modelManager: {},
  provider: {},
  sid: ""
});
let dataId = ref("")
const userDetails = ref()
const onWallet = async (type: string | number) => {






  // WalletList.forEach((item) => {
  //   item.chex = false;
  //   if (item.type == type) {
  //     item.chex = true;
  //   }
  // });
  if (type == 1) {
    return
    onMetamask();
    loading.close();
    handleClose()
  } else if (type == 4) {
    const loading = ElLoading.service({
      lock: true,
      text: "Loading",
      background: "rgba(0, 0, 0, 0.7)",
    });


    if (!window.keplr) {
      window.open('https://www.keplr.app/download')
      loading.close();
      return
    }
    const data = await handleConnect()


    if (!data) {
      loading.close();
      return
    }
    if (data === 1) {
      const status = await getKeplrBalance(loading)
      if (!status) {
        return

      }
    }


    connectWallet = getConnectWallet()

    initService(connectWallet)
    initFileService(connectWallet);
    initVerseService(connectWallet);
    initNotificationService(connectWallet);
    getMetamaskAddress(connectWallet.provider)
    initfollowService(connectWallet);
    verseCommentService(connectWallet)
    let query = {
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      did: connectWallet.sid,
      ethAddr: "",
      avatar: "",
      username: connectWallet.sid.substring(8, 14),
      followingCount: "",
      twitter: "",
      youtube: "",
      bio: "",
      banner: "",
      followingDataId: ""
    }

    getUserProfile().then(res => {
      console.log(res);

      LoginState().SetkeplrAddress(res)
      UserState().SetUserInfo(res)
      getNotificationsCount(res)
      if (!res.avatar) {

        // LoginState().SetkeplrAddress(res)
      } else {
        toDownloadFile(res)
      }
      loginState.walletNumber++;

      loading.close();
      handleClose()
    }).catch(response => {


      let date = Date.now();

      saveUserProfile(query).then(res => {

        dataId.value = res;
        console.log(res);

        getUserProfile().then(res1 => {
          console.log(res1);

          LoginState().SetkeplrAddress(res1)
          UserState().SetUserInfo(res1)
          getNotificationsCount(res1)
          // LoginState().SetkeplrAddress(res1)
          if (res1.avatar === '') {
            // UserState().SetUserInfo(res1)
            // LoginState().SetkeplrAddress(res1)
          } else {
            toDownloadFile(res1)
          }
          loginState.walletNumber++;

          loading.close();
          handleClose()
        }).catch(err => {
          loginState.walletNumber++;

          const res: any = { ...query }
          res.id = dataId.value
          loading.close();
          UserState().SetUserInfo(res)
          LoginState().SetkeplrAddress(res)
          getNotificationsCount(res)
          handleClose()
        })
        // loading.close();
        // handleClose()
      }).catch(err => {

        ElMessage({
          dangerouslyUseHTMLString: true,
          customClass: "successMessage",
          type: "error",
          message: `<p style="color: #fff;">${err} </p>`,
        });
        loading.close();
        handleClose()
      })
    })



    // const userInfo = await getUserProfile()
    // console.log(userInfo);


  } else {
    return
    // ElMessage({
    //   dangerouslyUseHTMLString: true,
    //   customClass: 'successMessage',
    //   type: 'error',
    //   message: '<p style="color: #fff;">error this is a error  </p>',
    // })
    // loading.close();
  }
};


const getNotificationsCount = async (res: any) => {
  const notifications = await getNotifications("0", res.id, 10, 0);
  UserState().setTotalCount(notifications.totalCount)
}
const getKeplrBalance = async (loading:any) => {
  const keplraddress = await window.keplr.getKey('sao-20230629').then((res: any) => {
    return res.bech32Address;
  }).catch((res: any) => {

    return false

  })
  let balances: any = []


  if (keplraddress) {
    const data: any = await accountApi.getKeplrBalance(keplraddress)
    console.log(data);

    // balances = data.balances.filter((item: any) => item.denom == "sao")
    balances = data.balances

    if (balances.length == 0 || balances[0].amount <= config.keplrBalance) {
      keplrWalletAddress.value = keplraddress
      loading.close();
      balanceStatus.value = true
      return false
    }

  } else {
    return true
  }
}
const getMetamaskAddress = async (provider: any) => {

  const data: any = await accountApi.getAccountList(provider.sid)
  const accountList = data.accountList.accountDids
  accountList.forEach((item: object) => {
    accountApi.getAccountId(item).then((res: any) => {
      res.accountId.type = res.accountId.accountId.split(':')[0]
      if (res.accountId.type == 'eip155') {
        local.SET("metamaskAddress", res.accountId.accountId.split(':')[2]);
      }

    })
  });
}

const onMetamask = () => {


  if (typeof window.ethereum !== "undefined") {
    $wallet.$getWalletAddress().then((res: any) => {
      // local.SET("metamaskAddress", res);
      // loginState.keplrAddress = res;

      // router.push({
      //   path: "/user",
      // });
    });
  } else {
    window.open('https://metamask.io/')
    // ElMessage({
    //   dangerouslyUseHTMLString: true,
    //   customClass: 'successMessage',
    //   type: 'error',
    //   message: '<p style="color: #fff;">error this is a error Metamask </p>',
    // })
  }

  return;
};

const ClaimSAOToken = () => {
  console.log(config.networkSaoUrl)
  window.open(config.networkSaoUrl)
}



</script>
<style scoped lang="scss">
#box {
  :deep(.el-overlay) {
    backdrop-filter: blur(8px);
    // background-color: rgba(0,0,0,0.3);
  }

  :deep(.el-dialog) {
    height: 477px;
    width: 800px;
    background-color: #292929;
    position: relative;
    border-radius: 9px;
    border: 1px solid #909791;

    .el-dialog__headerbtn {
      width: 12px;
      height: 12px;
      margin-right: 20px;
      margin-top: 20px;
      top: -5px;
    }

    .el-dialog__body {
      padding: 0;
      box-sizing: border-box;
    }
  }
}

.content-box {
  display: flex;
  justify-content: end;
  height: 477px;
  width: 800px;

  .imgs {
    width: 299px;
    height: 474px;
    position: absolute;
    top: 0;
    left: 0;
  }

  .content {
    width: 500px;
    height: 447px;
    padding: 0 30px;
    box-sizing: border-box;
    color: #fff;

    .text {
      font-weight: 400;
      font-size: 14px;
      line-height: 21px;
      color: #909791;
      margin-top: 14px;
      margin-bottom: 18px;
    }

    .current-address {
      font-weight: 600;
      font-size: 18px;
      line-height: 27px;
      margin-top: 10px;
    }

    .address {
      width: 437px;
      height: 80px;
      background: #161616;
      border-radius: 8px;

      p {
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        text-align: center;
        color: #56e868;
        mix-blend-mode: normal;
        width: 270px;
      }
    }

    P {
      font-weight: 600;
      font-size: 24px;
      line-height: 28px;
    }

    .KeplrWallet {
      width: 437px;
      height: 127px;
      background: #161616;
      border: 1px solid #474747;
      border-radius: 8px;
      margin: 14px 0 30px 0;

      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-right: 30px;
      }

      div {
        p {
          font-weight: 400;
          font-size: 20px;
          line-height: 30px;
        }

        p:nth-child(2) {
          font-weight: 400;
          font-size: 14px;
          line-height: 21px;
          color: #909791;
        }
      }
    }

    .text {
      font-weight: 400;
      font-size: 14px;
      line-height: 21px;
      color: #909791;
      margin: 8px 0 20px 0;
    }

    .Wallet-box {
      flex-wrap: wrap;
      justify-content: space-between;

      .WalletBut {
        width: 209.51px;
        height: 60px;
        background: #161616;
        border: 1px solid #21c143;
        border-radius: 8px;
        justify-content: flex-start;
        padding-left: 16px;
        box-sizing: border-box;
        margin-bottom: 15px;
        cursor: not-allowed;

        img {
          width: 38px;
          height: 38px;
          margin-right: 10px;
        }
      }
    }

    .Claim {
      width: 437px;
      height: 50px;
      background: #21C143;
      border-radius: 80px;
      font-weight: 600;
      font-size: 18px;
      line-height: 50px;
      text-align: center;
      margin-top: 48px;
      cursor: pointer;
    }



    .claimed {
      width: 437px;
      height: 50px;
      text-align: center;
      font-weight: 600;
      font-size: 18px;
      line-height: 50px;
      border: 1px solid #FFFFFF;
      border-radius: 80px;
      color: #fff;
      margin-top: 20px;
      cursor: pointer;
    }
  }
}
</style>
