<template>
    <div id="box">
        <el-dialog v-model="props.Visible" title="Set value for view to pay" :before-close="handleClose">
            <div class="content-box">

                <div class="dialog-setpay flx-c-center">
                    <div class="net-token">
                        <SelectEth></SelectEth>
                    </div>
                    <div class="amount flx-c-star">
                        <span class="amount-title">{{ $t('postVerse.Amount') }}</span>
                        <div class="amount-content flx-justify-between">
                            <el-input v-model="AmountValue" placeholder="0.00" @input="changeMonth"></el-input>
                            <div class="float-num">
                                ≈ {{ onNUm(AmountValue) }} USDT
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <el-button round style="border-color: #21C143;background: #161616;color: #fff;" @click="handleClose">{{
                        $t('postVerse.Close') }}</el-button>
                    <el-button type="success" round style="background: #21C143;" @click="onPay">{{ $t('postVerse.Save')
                    }}</el-button>
                </div>
            </div>

        </el-dialog>
    </div>
</template>
<script  setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { GetCoinPrice } from "@/libs/user"

import { ElLoading, ElMessage } from 'element-plus'
import SelectEth from '@/components/select/index.vue';
import { getChainId, changeChainId, addNetwork } from "@/api/web3"
import config from "@/libs/config";
declare const window: any;
const myEmit = defineEmits(["handleClose", 'setPrice']);
interface DialogFileProps {
    Visible: boolean;

    data: any;



}
interface WalletListProps {
    title: number | string;
    icon: any;
    type: number | string;
    chex: boolean;
}
const AmountValue = ref()
onMounted(() => {
    console.log(8888);
});

const props = withDefaults(defineProps<DialogFileProps>(), {
    Visible: false,
    data: {},



});

const handleClose = () => {
    myEmit("handleClose");
    AmountValue.value = undefined
};
const BNBPrice = ref(0)
const onNUm = (month: number) => {
    if (month) {
        const num = month * BNBPrice.value
        return num.toString()
    } else {
        return 0.00
    }


}
const changeMonth = () => {
    AmountValue.value = AmountValue.value.replace(/[^\d.]/g, "");
    AmountValue.value = AmountValue.value.replace(/\.{2,}/g, ".");
    AmountValue.value = AmountValue.value
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
    AmountValue.value = AmountValue.value.replace(
        /^(-)*(\d+)\.(\d\d\d\d).*$/,
        "$1$2.$3"
    );
    AmountValue.value = AmountValue.value > 999 ? 999 : AmountValue.value
    AmountValue.value = AmountValue.value == '0000' ? '' : AmountValue.value
}
GetCoinPrice("BNBUSDT").then(res1 => {
    BNBPrice.value = Number(res1)
}).catch(res1 => {
    BNBPrice.value = 0
})
const onPay = (type: string | number) => {
    if (AmountValue.value > 0) {
        const loading = ElLoading.service({
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        if (window.ethereum) {
            getChainId().then(async res => {

                if (config.defaultChainId == res) {
                    myEmit("setPrice", AmountValue.value);

                } else {

                    const data = await changeChainId()
                    console.log(data)
                    if (data == null) {
                        loading.close()
                        myEmit("setPrice", AmountValue.value);
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
                            myEmit("setPrice", AmountValue.value);
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





    } else {

    }

}
</script>
<style scoped lang="scss">
#box {
    // :deep(.el-overlay-dialog) {
    //     backdrop-filter: blur(11px);
    // }

    :deep(.el-dialog) {
        height: 300px;
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
    // height: 195px;
    width: 498px;

    .dialog-setpay {
        height: 194px;
        padding: 20px 30px 30px 30px;
        box-sizing: border-box;
        justify-content: space-between;

        ::v-deep(.select) {
            margin-right: 14px;
        }

        >div {
            width: 100%;
            // padding: 0 15px;
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

        .amount-title {
            margin-bottom: 7px;
            color: #fff;
        }

        .amount-content {
            width: 442px;
            height: 36px;
            border: 1px solid #474747;
            border-radius: 8px;
            padding-right: 14px;
            background: #161616;
            box-sizing: border-box;
            position: relative;

            .el-input {
                width: 100%;

                ::v-deep(.el-input__wrapper) {
                    background-color: #161616 !important;
                    border: none;
                    box-shadow: none;
                    color: #fff;

                    .el-input__inner {
                        color: #fff;
                        font-weight: 600;
                        font-size: 14px;
                    }
                }
            }

            .float-num {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
            }
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