<template>
    <div id="box">
        <el-dialog :model-value="props.Visible" title="Pay to follow" :before-close="handleClose">
            <div class="content-box">

                <div class="dialog-follow flx-c-center">
                    <div class="flx-justify-between">
                        <div class="flx-c-center">

                            <div style="border: 1px solid #474747;border-radius: 50%;width: 70px;height: 70px;">
                                <img :src="followData.img" alt="" v-if="followData.img" style="object-fit: cover;">
                                <img src="@/assets/images/avatar.png" alt="" v-else>
                            </div>
                            <span class="sle" style="max-width: 100px;display: inline-block;">{{
                                decodeURIComponent(followData.username)
                            }}</span>
                            <span class="sle" style="max-width: 100px;display: inline-block;">@{{
                                followData.handleName }}</span>
                        </div>
                        <div class="flx-c-center">
                            <img src="@/assets/images/bnb.png" alt="">
                            <span>{{ parseFloat((followData.toPay * Math.pow(10, -18)).toFixed(6)) }}</span>
                            <span>BNB</span>
                        </div>
                        <div class="flx-c-center">
                            <img src="@/assets/images/days.svg" alt="">
                            <span>{{ followData.days || 30 }}</span>
                            <span>{{ $t('dialogFollow.Days') }}</span>
                        </div>
                    </div>
                    <p>{{ $t('dialogFollow.tip') }}</p>
                </div>
                <div class="footer">
                    <el-button round
                        style="border-color: #21C143;background: #161616;color: #fff;border: 1px solid #21C143;"
                        @click="handleClose">{{ $t('dialogContinue.Close') }}</el-button>
                    <el-button type="success" v-show="butDisabled" :disabled="butDisabled" round
                        style="background: #21C143;width: 200px;" @click="onPay">Insufficient BNB balance</el-button>
                    <el-button type="success" v-show="!butDisabled" round style="background: #21C143;" @click="onPay">{{
                        $t('dialogContinue.pay')
                    }}</el-button>
                    <!-- <el-button type="success" round style="background: #21C143;" @click="onPay">{{ $t('dialogContinue.pay')
                    }}</el-button> -->
                </div>
            </div>

        </el-dialog>
    </div>
</template>
<script  setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { handleBindMetamask, Unbind, } from "../../libs/Metamask";
import { getChainId, changeChainId, addNetwork, getBalances } from "@/api/web3"
import config from "@/libs/config";
import local from "@/utils/local";
declare const window: any;
import { ElLoading, ElMessage } from 'element-plus'

const myEmit = defineEmits(["handleClose"]);
interface DialogFileProps {
    Visible: boolean;
    followData: any;

}
interface WalletListProps {
    title: number | string;
    icon: any;
    type: number | string;
    chex: boolean;
}
const butDisabled = ref(false)
onMounted(() => {
    console.log('??????????????');
    
    const address = local.GET("metamaskAddress")

    if (address) {
        getBalances(address).then((res: any) => {

            const Balances = (res * Math.pow(10, -18)).toFixed(4)
            const payData = props.followData.payToFollow * Math.pow(10, -18)
            console.log('??????????????',props.followData.payToFollow);
            console.log('??????????????',Balances);

            if (Number(Balances) >= Number(payData)) {
                butDisabled.value = false

            } else {
                butDisabled.value = true
            }
        }).catch(err => {
            console.log(err, 88888888888)
        })
    }
});

const props = withDefaults(defineProps<DialogFileProps>(), {
    Visible: false,
    followData: {},
});

const handleClose = () => {
    myEmit("handleClose");
};

const onPay = (type: string | number) => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })

    if (window.ethereum) {
        getChainId().then(async res => {

            if (config.defaultChainId == res) {
                myEmit("handleClose", props.followData);

            } else {


                const data = await changeChainId()
                console.log(data)
                if (data == null) {
                    loading.close()
                    myEmit("handleClose", props.followData);
                    return
                }
                if (data != null && data.code != 4902) {
                    loading.close()
                    ElMessage({
                        dangerouslyUseHTMLString: true,
                        customClass: 'successMessage',
                        type: 'error',
                        message: `<p style="color: #fff;">${data.message} </p>`,
                    })
                } else if (data != null && data.code == 4902) {
                    const res = await addNetwork()
                    loading.close()
                    if (res == null) {
                        myEmit("handleClose", props.followData);
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

        loading.close()
    }


}
</script>
<style scoped lang="scss">
#box {
    :deep(.el-overlay-dialog) {
        backdrop-filter: blur(11px);
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


    .dialog-follow {
        height: 295px;
        padding: 0 44px;
        box-sizing: border-box;

        >div {
            width: 100%;
            padding: 0 15px;
            box-sizing: border-box;

            .flx-c-center {
                color: #fff;
                justify-content: space-between;

                span {
                    font-weight: 600;
                    font-size: 20px;

                }

                span:nth-child(2) {
                    margin-top: 10px;
                    line-height: 30px;
                }

                span:nth-child(3) {
                    font-weight: 400;
                    font-size: 14px;

                }


            }

            img {
                width: 70px;
                height: 70px;
                border-radius: 50%;

            }
        }

        p {
            text-align: center;
            margin-top: 35px;
        }
    }


}

.footer {
    width: 498px;
    height: 64px;
    background: #161616;
    border-radius: 0px 0px 9px 9px;
    display: flex;
    align-items: center;
    justify-content: end;
    padding-right: 30px;
    box-sizing: border-box;

}
</style>