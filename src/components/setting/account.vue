<template>
    <div class="account">
        <div class="account-list">
            <span>DID</span>
            <div class="flx-justify-between Wallet-list">
                <p class="sle">{{ walletInfo.did }}</p>
                <div>
                    <img src="@/assets/images/verse-share.svg" alt="">
                </div>
            </div>
        </div>
        <div class="account-list">
            <span>{{ $t('settingAccount.MainWallet') }}</span>
            <div class="flx-justify-between Wallet-list">
                <p class="sle">{{ walletInfo.mainWallet }}</p>

                <div @click="Disconnect">
                    <span>{{ $t('settingAccount.Disconnect') }}</span>
                    <img src="@/assets/images/break.svg" alt="">
                </div>
            </div>
        </div>
        <div class="Bind-Account">
            <div>
                <span>{{ $t('settingAccount.BindAccount') }}</span>
                <p>{{ $t('settingAccount.bindTip') }}</p>
            </div>
            <el-button round @click="dialogVisible = true" :disabled="disabled">{{ $t('settingAccount.BindAccount')
            }}</el-button>

        </div>
        <div class="account-list">
            <span>{{ $t('settingAccount.BindWallet') }}</span>
            <div v-for="(item, index) in did.accountList" :key="index">
                <div class="flx-justify-between Wallet-list" v-if="item.type == 'eip155' && index == 0">
                    <p class="sle">
                        <img src="@/assets/images/bnb.png" alt="">
                        <span> {{ item.address }}</span>
                    </p>
                    <div @click="Unlink(item)">
                        <span>{{ $t('settingAccount.Unlink') }}</span>
                        <img src="@/assets/images/break.svg" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <dialogAccount v-model:Visible="dialogVisible" @handleClose="onDialog" :titleType="0"></dialogAccount>
    <dialogText v-model:Visible="deletVisible" @handleClose="onUnlink" data="Are you sure to disconnect the wallet link">
    </dialogText>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { UserState } from "@/store/modules/users"
import { LoginState } from "@/store/modules/login";

import dialogAccount from "@/components/dialog/dialogAccount.vue";
import dialogText from "@/components/dialog/dialogText.vue";
import accountApi from "@/api/AccountApi"
import { ElLoading, ElMessage } from 'element-plus'
import local from '@/utils/local'
import { clear } from 'console';
import { handleBindMetamask, Unbind } from "../../libs/Metamask";
import { useRouter } from 'vue-router'
const $router = useRouter()
const userState = UserState();
const walletInfo = reactive({
    did: '',
    mainWallet: '',
    bindWallet: []
});
const dialogVisible = ref(false)
const deletVisible = ref(false)
const disabled = ref(false)
const loginState = LoginState();
const loading = ref()

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
const deleteWallet = ref("")
onMounted(async () => {
    await getDid()
    init()
});

const onDialog = (type: string | number) => {

    dialogVisible.value = !dialogVisible.value
    if (type) {
        did.accountList = []
        init()
    }
}
const getDid = () => {
    const provider = local.GET('provider')
    // console.log(provider);
    if (provider) {
        walletInfo.did = provider.sid
        walletInfo.mainWallet = provider.accountProvider.address
        did.id = provider.sid
        did.accountName = userState.KeplrUserInfo.username
        did.address = provider.accountProvider.address
        did.chain = provider.accountProvider.cosmosChainId
    }
}

const init = async () => {

    const data: any = await accountApi.getAccountList(did.id)

    const accountList = data.accountList.accountDids
    accountList.forEach((item: object) => {
        accountApi.getAccountId(item).then((res: any) => {
            res.accountId.type = res.accountId.accountId.split(':')[0]
            res.accountId.address = res.accountId.accountId.split(':')[2]
            if (res.accountId.type == 'eip155') {
                disabled.value = true
                did.accountList.push(res.accountId)
            }


        })
    });
}

const Unlink = (item: any) => {
    deleteWallet.value = item.accountId
    deletVisible.value = true

}
const onUnlink = async (type: string | number) => {
    loading.value = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    if (type == 1) {
        deletVisible.value = false
        await Unbind(did, deleteWallet.value, callbackInit)

    } else {
        loading.value.close()
    }

    deletVisible.value = false
}
const Disconnect = () => {
    $router.push("/");
    // $router.go(0);
    setTimeout(() => {

        LoginState().removeLogin();
        UserState().removeLogin();
    $router.go(0);

    }, 200)
}


const callbackInit = async (type: boolean, item: any) => {

    if (type) {
        did.accountList = []
        await init()

        local.REMOVE("metamaskAddress")
        loading.value.close()
    } else {
        await getDid()
        init()
        loading.value.close()
    }
}
</script>
<style scoped lang="scss">
.account {
    :deep(.el-button) {
        width: 150px;
        height: 36px;
        background: #292929;
        border-radius: 80px;
        font-weight: 600;
        font-size: 16px;
        color: #21C143;
        border-color: #21C143;
    }

    height: 100%;

    .account-list {
        margin-bottom: 20px;

        >span {
            font-weight: 400;
            font-size: 14px;
            line-height: 21px;
            margin-bottom: 10px;
            display: inline-block;
        }

        .Wallet-list {
            width: 683px;
            height: 37px;
            background: #161616;
            border-radius: 8px;
            padding: 0 20px;
            box-sizing: border-box;
            font-weight: 400;
            font-size: 14px;
            line-height: 21px;
            color: #56E868;

            >p {
                max-width: 582px;
                line-height: 37px;
                display: flex;
                align-items: center;

                img {
                    width: 20px;
                    height: 20px;
                    margin-right: 8px;

                }
            }

            >div {
                display: flex;
                align-items: center;
                font-weight: 500;
                font-size: 14px;
                line-height: 24px;
                color: #F56E6E;
                cursor: pointer;

                img {
                    margin-left: 10px;
                }
            }
        }
    }

    .Bind-Account {
        width: 683px;
        display: flex;
        align-items: end;
        margin-bottom: 20px;

        >div:nth-child(1) {
            flex: 1;

            span {
                font-weight: 400;
                font-size: 14px;
                line-height: 21px;
                margin-bottom: 10px;
                display: inline-block;
            }

            p {
                font-weight: 600;
                font-size: 14px;
                line-height: 21px;
                color: #EADBA8;
            }
        }

        >div:nth-child(2) {
            width: 150px;
            height: 36px;
            background: #21C143;
            border-radius: 80px;
            font-weight: 600;
            font-size: 16px;
            line-height: 36px;
            text-align: center;
            cursor: default;
        }
    }
}
</style>