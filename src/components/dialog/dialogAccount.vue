<template>
    <div id="box">
        <el-dialog :model-value="props.Visible" title="Connect Your Account" :before-close="handleClose">
            <div class="content-box">
                <p v-if="props.titleType == 0" class="login">{{ $t('dialogAccount.Afterbinding') }}
                </p>
                <p v-if="props.titleType == 1" class="wallet">{{ $t('dialogAccount.Toproceed') }}</p>
                <div class="flx-align-center Wallet-box">
                    <div class="WalletBut flx-center" @click="onWallet(item.type)" v-for="item in WalletList"
                        :key="item.type" :style="item.chex ? 'border-color:#21C143' : 'border-color:#474747'">
                        <img src="@/assets/login/Metamask.png" v-if="item.type == 1" alt="">
                        <img src="@/assets/login/BinanceWallet.svg" v-if="item.type == 2" alt="">
                        <img src="@/assets/login/imtoken.png" v-if="item.type == 3" alt="">
                        <span style="color: #fff;">{{ item.title }}</span>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script  setup lang="ts">
import { onMounted, reactive, computed, ref } from "vue";
declare const window: any;
import { require } from '@/utils/require';
import { UserState } from "@/store/modules/users"
import { ElLoading, ElMessage } from 'element-plus'
import local from '@/utils/local'
import { handleBindMetamask, Unbind, } from "../../libs/Metamask";
import { getChainId, changeChainId, addNetwork } from "@/api/web3"
import { Loading } from "element-plus/es/components/loading/src/service";
import accountApi from "@/api/AccountApi"
import config from "@/libs/config";
const myEmit = defineEmits(["handleClose"]);
interface DialogFileProps {
    Visible: boolean;
    titleType: number
    // data: any

}
interface WalletListProps {
    title: number | string;
    icon: any,
    type: number | string;
    chex: boolean
}

const WalletList: Array<WalletListProps> = reactive([{
    title: 'Metamask',
    icon: require('@/assets/login/Metamask.png'),
    type: 1,
    chex: false
},
    // {
    //     title: 'Binance Wallet',
    //     icon: require('@/assets/login/BinanceWallet.svg'),
    //     type: 2,
    //     chex: false
    // }, {
    //     title: 'imToken',
    //     icon: require('@/assets/login/imtoken.png'),
    //     type: 3,
    //     chex: false
    // }
])
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

const userState = UserState();
let loading = ref()
onMounted(async () => {
    const provider = local.GET('provider')
    // console.log(provider);
    if (provider) {
        did.id = provider.sid
        did.accountName = userState.KeplrUserInfo.username
        did.address = provider.accountProvider.address
        did.chain = provider.accountProvider.cosmosChainId
    }

});

const props = withDefaults(defineProps<DialogFileProps>(), {
    Visible: false,
    titleType: 1
});

const handleClose = (type: string | number) => {
    myEmit("handleClose", type);
};

const onWallet = async (type: string | number) => {

    WalletList.forEach(item => {
        item.chex = false
        if (item.type == type) {
            item.chex = true
        }
    })
    loading.value = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })

    if (type == 1) {

        if (window.ethereum) {
            getChainId().then(async res => {

                if (config.defaultChainId == res) {

                    handleBindMetamask(did, callbackInit).then(res => {
                        init()
                        handleClose(type)
                        loading.value.close()
                    }).catch(res => {
                        console.log(99999)
                        init()

                        handleClose(type)
                        loading.value.close()
                    })

                    setTimeout(() => {
                        loading.value.close()
                    }, 10000)
                } else {

                    loading.value.close()
                    const data = await changeChainId()

                    if (data == null) {
                        handleBindMetamask(did, callbackInit).then(res => {
                            init()
                            handleClose(type)
                            loading.value.close()
                        }).catch(res => {
                            init()

                            handleClose(type)
                            loading.value.close()
                        })
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
                            onWallet(1)
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

            }).catch((err: any) => {
                console.log(err, "====")
            })
        } else {
            window.open('https://metamask.io/')

            loading.value.close()
        }


    }

    // handleClose(type)

}

const callbackInit = (item: any) => {
    if (item) {
        init()
        loading.value.close()
    } else {
        loading.value.close()
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
                local.SET("metamaskAddress", res.accountId.accountId.split(':')[2]);
            }

        })
    });
}
</script>
<style scoped lang="scss">
#box {
    :deep(.el-overlay) {
        backdrop-filter: blur(8px);
        // background-color: rgba(0,0,0,0.3);
    }

    :deep(.el-dialog) {
        // height: 477px;
        width: 500px;
        background-color: #292929;
        position: relative;
        border-radius: 9px;
        border: 1px solid #909791;

        .el-dialog__header {
            height: 40px;
            background-color: #161616;
            margin-right: 0;
            border-radius: 9px 9px 0px 0px;
            box-sizing: border-box;
            padding: 0;
            line-height: 40px;
            padding-left: 20px;

            .el-dialog__title {
                color: #fff;
                font-weight: 500;
                font-size: 16px;
                line-height: 28px;
            }

            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .el-dialog__headerbtn {
            width: 12px;
            height: 12px;
            margin-right: 20px;

            display: flex;
            align-items: center;
            justify-content: center;
            position: static;

        }

        .el-dialog__body {
            padding: 0;
            box-sizing: border-box;
        }
    }

    :deep(.el-button) {
        width: 100px;
        height: 36px;
    }
}

.content-box {

    width: 498px;
    height: 260px;

    >.login {
        height: 36px;
        background: #E6D32D;
        font-weight: 400;
        font-size: 14px;
        line-height: 17px;
        color: #000000;
        mix-blend-mode: normal;
        text-align: center;
        line-height: 36px;
    }

    >.wallet {
        height: 36px;
        background: #416BFF;
        font-weight: 400;
        font-size: 14px;
        line-height: 17px;
        color: #fff;
        mix-blend-mode: normal;
        text-align: center;
        line-height: 36px;

    }

    .Wallet-box {
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 38px 30px;
        box-sizing: border-box;

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
            cursor: pointer;

            img {
                width: 38px;
                height: 38px;
                margin-right: 10px;
            }
        }
    }



}
</style>