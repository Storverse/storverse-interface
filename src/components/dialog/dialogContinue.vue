<template>
    <div id="box">
        <el-dialog :model-value="props.Visible" title="Pay to continue" :before-close="handleClose">
            <div class="content-box">
                <div class="dialog-continue flx-c-center">
                    <img src="@/assets/images/bnb.png" alt="">
                    <p>{{ parseFloat((payData * Math.pow(10, -18)).toFixed(6)) }} BNB</p>
                    <p>{{ $t('dialogContinue.purchase') }}</p>
                </div>

                <div class="footer">
                    <el-button round
                        style="border-color: #21C143;background: #161616;color: #fff;border: 1px solid #21C143;"
                        @click="handleClose">{{ $t('dialogCid.Close') }}</el-button>
                    <el-button v-show="butDisabled" type="success" :disabled="butDisabled" round
                        style="background: #21C143;" @click="onPay">Insufficient BNB balance</el-button>
                    <el-button type="success" v-show="!butDisabled" round style="background: #21C143;" @click="onPay">{{
                        $t('dialogCid.pay')
                    }}</el-button>
                </div>
            </div>

        </el-dialog>
    </div>
</template>
<script  setup lang="ts">
import { onMounted, reactive, ref } from "vue";

import { getChainId, changeChainId, addNetwork, getBalances } from "@/api/web3"
import config from "@/libs/config";
import local from "@/utils/local";
declare const window: any;
import { ElLoading, ElMessage } from 'element-plus'
const myEmit = defineEmits(["handleClose"]);
interface DialogFileProps {
    Visible: boolean;
    payData: any

}
const butDisabled = ref(false)

onMounted(() => {
    const address = local.GET("metamaskAddress")

    if (address) {
        getBalances(address).then((res: any) => {

            const Balances = (res * Math.pow(10, -18)).toFixed(4)
            const payData = props.payData * Math.pow(10, -18)
            console.log(payData);
            
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
const getWalletBalances = () => {

}
const props = withDefaults(defineProps<DialogFileProps>(), {
    Visible: false,
    payData: 0

});

const handleClose = () => {
    myEmit("handleClose", false);
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
                myEmit("handleClose", true);

            } else {

                const data = await changeChainId()
                console.log(data)
                if (data == null) {
                    loading.close()
                    myEmit("handleClose", true);
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
                        myEmit("handleClose", true);
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
    :deep(.el-overlay) {
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
        min-width: 100px;
        height: 36px;
    }
}

.content-box {

    width: 498px;

    .dialog-continue {
        height: 295px;

        img {
            width: 80px;
            height: 80px;
            margin-bottom: 23px;
        }

        p:nth-child(2) {
            font-weight: 600;
            font-size: 40px;
            line-height: 60px;
            color: #FFFFFF;
            mix-blend-mode: normal;
        }

        p:nth-child(3) {
            font-weight: 400;
            font-size: 14px;
            line-height: 21px;
            text-align: center;
            color: #FFFFFF;
            mix-blend-mode: normal
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