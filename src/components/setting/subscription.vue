<template>
  <div class="content-subscription">
    <p style=" padding: 0 40px;">{{ $t('settingsubscription.needsPay') }}</p>
    <div v-loading="elLoading" element-loading-background="#292929" v-if="elLoading"
      style="  width: 800px;height: 598px;">

    </div>
    <div v-if="userInfo.nftTokenID" style="margin-top: 15px;" class="nftToken flx-justify-between">
      <div>
        {{ $t('settingsubscription.CurrentFollowFees') }}:
        <span> {{ userInfo.payToFollow }} BNB/ {{ $t('settingsubscription.Month') }}</span>
        {{ $t('settingsubscription.TokenID') }}: <span @click="onTokenId" class="cursor-s"> #{{ userInfo.nftTokenID
        }}</span>
      </div>
      <p @click="onEdit" class="butEdit">
        {{ $t('settingsubscription.Edit') }}
      </p>
      <span :class="!timeStatus ? '' : 'message'">{{ userInfo.time }} {{ $t('settingsubscription.daysedit') }}!</span>
      <!-- <p>
        Edit
      </p> -->
    </div>
    <div style="margin-top: 30px;background: rgba(22, 22, 22, 0.4);padding: 30px 40px;" class="Select-input"
      v-if="inputStatus">
      <div class="flx-justify-between" style="align-items: baseline;">
        <SelectEth @changeSelect="changeSelect"></SelectEth>

        <div>
          <span class="title">{{ $t('settingsubscription.Pricepermonth') }}</span>
          <p class="month">
            <el-input v-model="month" placeholder="0" @input="changeMonth">
            </el-input>
          </p>
          <p class="usdt">≈ {{ onNUm(month) }} USDT</p>
        </div>
      </div>

      <div class="button">
        <p>{{ $t('settingsubscription.modifiedTip') }}</p>
        <el-button type="success" @click="onFliter" round>{{ $t('settingProfile.save') }}</el-button>

      </div>
    </div>
  </div>
  <dialogAccount v-model:Visible="dialogVisible" @handleClose="onDialog" :titleType="1"></dialogAccount>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import SelectEth from '@/components/select/index.vue';
import { ElLoading, ElMessage } from 'element-plus'
import { UserState } from "@/store/modules/users"
import accountApi from "@/api/AccountApi"
import { mint, changePrice, getWalletAddress } from "@/api/web3"
import { GetCoinPrice, GetUserProfileOfOthers } from "@/libs/user"
import { handleBindMetamask, Unbind } from "../../libs/Metamask";
import dialogAccount from "@/components/dialog/dialogAccount.vue";
import local from '@/utils/local';
import config from "@/libs/config";
import i18n from '@/lang/index'
import { getChainId, changeChainId, addNetwork } from "@/api/web3"

declare const window: any;
const t = i18n.global.t
const elLoading = ref(false)
const month = ref()
const amountObj = reactive({
  itemType: 2,
  amount: 0,
  duration: 0,
  dataId: '',
  fromAddress: ''
})
let markAddress = ref('')
const $UserState = UserState()
interface didProps {
  accountList: Array<[]>;
  id: string;
  accountName: string,
  address: string,
  chain: string

}
const did: didProps = reactive({
  accountList: [],
  id: '',
  accountName: '',
  address: '',
  chain: ''
})
const BNBPrice = ref()
const userInfo = ref({
  payToFollow: '',
  nftTokenID: "",
  time: 0
})
const inputStatus = ref(false)
const timeStatus = ref(false)
onMounted(async () => {
  elLoading.value = true
  GetCoinPrice("BNBUSDT").then(res1 => {
    BNBPrice.value = res1
  }).catch(res1 => {
    BNBPrice.value = 0
  })
  init()


});
const changeSelect = (obj: object) => {
  console.log(obj)
}
const onEdit = () => {
  if (timeStatus.value) {

  } else {
    inputStatus.value = true
  }
}
const init = async () => {
  markAddress.value = local.GET("metamaskAddress")
  GetUserProfileOfOthers($UserState.KeplrUserInfo.id).then(res => {

    userInfo.value.nftTokenID = res.nftTokenID
    const time = Date.now()


    if (time <= res.nftListingTime + config.nftTime) {
      userInfo.value.time = (res.nftListingTime + config.nftTime) - time

      userInfo.value.time = Math.floor(userInfo.value.time / (1000 * 60 * 60 * 24))
      console.log(userInfo.value.time)
      timeStatus.value = true

    } else {
      timeStatus.value = false
    }

    const payToFollow = res.payToFollow ? Number(res.payToFollow) * Math.pow(10, -18) : 0

    userInfo.value.payToFollow = payToFollow ? payToFollow.toFixed(4) : '0'
    if (res.nftTokenID) {
      month.value = payToFollow
      inputStatus.value = false
    } else {
      inputStatus.value = true
    }
    elLoading.value = false
    console.log(userInfo)
  })
}
const loading = ref()
let dialogVisible = ref(false)

const onNUm = (month: number) => {
  if (month) {
    const num = month * BNBPrice.value
    return num.toFixed(6)
  } else {
    return 0.00
  }


}

const onDialog = (type?: string | number) => {
  dialogVisible.value = !dialogVisible.value
  if (type) {
    init()

  }
}



const changeMonth = () => {
  month.value = month.value.replace(/[^\d.]/g, "");
  month.value = month.value.replace(/\.{2,}/g, ".");
  month.value = month.value
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".");
  month.value = month.value.replace(
    /^(-)*(\d+)\.(\d\d\d\d).*$/,
    "$1$2.$3"
  );
  month.value = month.value > 999 ? 999 : month.value
  month.value = month.value == '0000' ? '' : month.value
}
const onFliter = () => {
  if (window.ethereum) {
    loading.value = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    getChainId().then(async res => {

      if (config.defaultChainId == res) {

        onSave()

      } else {

        loading.value.close()
        const data = await changeChainId()
        console.log(data)
        if (data == null) {
          onSave()
          return
        }
        if (data != null && data.code != 4902) {
          console.log(data)
          ElMessage({
            dangerouslyUseHTMLString: true,
            customClass: 'successMessage',
            type: 'error',
            message: `<p style="color: #fff;">${data.message} </p>`,
          })
        } else if (data.code == 4902) {
          const res = await addNetwork()
          if (res == null) {
            onSave()
          } else if (res != null) {

            ElMessage({
              dangerouslyUseHTMLString: true,
              customClass: 'successMessage',
              type: 'error',
              message: `<p style="color: #fff;">${data.message} </p>`,
            })
          }

        }

      }

    })
  } else {
    window.open('https://metamask.io/')

    loading.value.close()
  }
}
const onSave = async () => {

  if (markAddress.value) {
    loading.value = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    })

    const { itemType, duration } = amountObj
    const dataObj = {
      amount: month.value * Math.pow(10, 18),
      dataId: $UserState.KeplrUserInfo.id,
      itemType, duration, fromAddress: markAddress.value
    }




    getWalletAddress().then(res => {
      if (userInfo.value.nftTokenID) {

        changePrice(userInfo.value.nftTokenID, dataObj.amount.toString(), markAddress.value).then(res => {
          userInfo.value.payToFollow = month.value ? month.value : 0
          loading.value.close()
          ElMessage({
            customClass: 'successMessage',
            type: 'success',
            message: t('utils.message'),
          })
        }).catch(err => {

          loading.value.close()
          ElMessage({
            dangerouslyUseHTMLString: true,
            customClass: 'successMessage',
            type: 'error',
            message: `<p style="color: #fff;">${err.message}</p>`,
          })
        })
      } else {
        mint(dataObj.dataId, dataObj.amount.toString(), itemType, duration, markAddress.value).then(res => {
          userInfo.value.payToFollow = month.value ? month.value : 0
          init()
          loading.value.close()
          ElMessage({
            customClass: 'successMessage',
            type: 'success',
            message: t('utils.message'),
          })
        }).catch(err => {

          loading.value.close()
          ElMessage({
            dangerouslyUseHTMLString: true,
            customClass: 'successMessage',
            type: 'error',
            message: `<p style="color: #fff;">${err.message}</p>`,
          })
        })
      }
    }).catch(err => {
      loading.value.close()
      ElMessage({
        dangerouslyUseHTMLString: true,
        customClass: 'successMessage',
        type: 'error',
        message: `<p style="color: #fff;">${err.message}</p>`,
      })
    })
    // return


  } else {
    onDialog()
  }



}
const onTokenId = () => {
  const url = `${config.defaultSubscriptionUrl}${config.subscriptionAddress}?a=${userInfo.value.nftTokenID}`
 
  
  window.open(url)
}
</script>
<style scoped lang="scss">
.content-subscription {

  :deep(.el-input) {
    // border: 1px solid #474747;
    border-radius: 8px;
    box-sizing: border-box;

    .el-input__wrapper {
      background-color: #161616;
      width: 213px;
      box-sizing: border-box;

      border: 1px solid #474747;

      box-shadow: none;
      color: #fff;
    }



    .el-input__inner {
      color: #fff;
    }

    .is-focus {
      border-color: #909791;
    }

    .is-focus~.el-input-group__append {
      border-color: #909791;
    }
  }

  :deep(.el-button) {
    width: 100px;
    height: 36px;
    background: #21C143;
    border-radius: 80px;
    font-weight: 600;
    font-size: 16px;
  }

  .nftToken {
    padding: 0 40px;
    box-sizing: border-box;
    position: relative;

    >div {
      width: 500px;
      height: 30px;
      background: #161616;
      width: 568px;
      height: 37px;
      border: 1px solid #474747;
      border-radius: 8px;
      line-height: 37px;
      font-size: 14px;
      padding-left: 20px;
      box-sizing: border-box;

      span {
        margin-right: 30px;
        color: #E6D32D;

      }

    }

    >span {
      position: absolute;
      bottom: -30px;
      left: 40px;
      display: none;
      color: #ff0000;
    }

    .message {}

    .butEdit:hover+.message {
      display: block;
    }

    >p {
      width: 100px;
      height: 36px;
      border-radius: 34px;
      background-color: #fff;
      cursor: pointer;
      color: #000;
      text-align: center;
      line-height: 36px;
      font-size: 14px;
      font-weight: 700;
    }
  }

  .Select-input {
    border-top: 1px solid #474747;
    border-bottom: 1px solid #474747;
  }

  .title {
    font-size: 14px;
    line-height: 21px;
  }

  >P {}

  .month {
    background: #161616;
    margin-top: 10px;
  }

  .usdt {
    font-size: 14px;
    line-height: 21px;
    color: #909791;
    margin-top: 6px;
  }

  .button {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    cursor: default;

    >p:nth-child(1) {
      font-size: 16px;
      color: #E6D32D;
    }
  }
}
</style>