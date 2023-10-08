<template>
    <div class="content">
        <div class="account-money">
            <p>
                <span class="sle" style="width: 300px;display: inline-block;">Hi! {{ decodeURIComponent(userinfo.username)
                }}</span>
                <span>${{ ccnum(balance) }}</span>
            </p>
            <p>
                <span>
                    {{ $t('assets.tips') }}
                </span>
                <span>
                    {{ $t('assets.TotalEarings') }}
                </span>
            </p>
        </div>
        <div class="table">
            <el-table :data="tableData" :border="false" stripe style="width: 100%;  background-color: #1d1d1d " height="300"
                row-class-name="table-list" :highlight-current-row="false" :align="'center'"
                header-row-class-name="table-header">
                <el-table-column prop="Assets" label="Assets">
                    <template #default="scope">
                        <div style="display: flex; align-items: center;">
                            <el-avatar :size="36" src="@/assets/images/bnb.png">
                                <img src="@/assets/images/bnb.png" />
                            </el-avatar>
                            <span style="margin-left: 10px;font-weight: 700;">{{ scope.row.Assets.name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="Network" label="Network" />
                <el-table-column prop="balances" label="Balance" />
                <el-table-column prop="" label="" :align="'right'">
                    <template #default="scope">
                        <div class="">
                            <el-button type="primary" round color="#fff" v-if="scope.row.balances != 0"
                                @click="onClaim(scope)">{{ $t('assets.Claim') }}</el-button>
                            <el-button type="primary" round color="#333333" disabled v-else>{{ $t('assets.Claim')
                            }}</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="echarts">
            <p>{{ $t('assets.BestMonth') }}</p>
            <div style="height: 240px; " ref="liveChart"></div>
        </div>
    </div>
    <dialogAccount v-model:Visible="dialogVisible" @handleClose="onDialog" :titleType="1"></dialogAccount>
</template>
<script setup lang="ts">
import { ref, onMounted, Ref, reactive, watch, computed } from "vue"
import { UserState } from "@/store/modules/users"
import * as echarts from "echarts/core";
// import { getBalance } from "@/api/web3"
import accountApi from "@/api/AccountApi"
import local from "@/utils/local";
import { ECharts, EChartsOption, init } from 'echarts'
import { getBalance, getWalletAddress, withdraw, getChainId, changeChainId, addNetwork } from "@/api/web3"
import { GetCoinPrice, GetEarningsByMonth } from "@/libs/user"
import dialogAccount from "@/components/dialog/dialogAccount.vue";
import { ElMessage, ElLoading } from 'element-plus'
import { LoginState } from "@/store/modules/login";
import i18n from '@/lang/index'

import config from "@/libs/config";

const t = i18n.global.t
const loginState = LoginState();
const walletNumber = computed(() => loginState.walletNumber);


declare const window: any;

const userState = UserState();
let userinfo = userState.getUserInfo
const dialogVisible = ref(false)
let markAddress = ref()
const tableData = ref([
    {
        Assets: {
            icon: 'https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2021%2F1003%2F03331e5aj00r0ej040005c000690069g.jpg&thumbnail=660x2147483647&quality=80&type=jpg',
            name: 'BNB'
        },
        Network: 'BSC',
        Balance: 0,
        balances: '0'
    },

])
const liveChart: Ref<HTMLElement | null> = ref(null);

const balance = ref("0")
let xAxisData: any = reactive([])
let yAxisData: any = reactive([])
watch(walletNumber, (newValue, oldValue) => {
    markAddress.value = local.GET("metamaskAddress")
    const provider = local.GET('provider')
    const myChart = init(liveChart.value as HTMLElement);

    changeChaindId()
    getByMonth(myChart)
});
// let option: EChartsOption = reactive()
onMounted(async () => {
    markAddress.value = local.GET("metamaskAddress")
    const provider = local.GET('provider')
    const myChart = init(liveChart.value as HTMLElement);

    // getMetamaskAddress(provider)
    changeChaindId()
    getByMonth(myChart)
});
const getBalances = () => {
    markAddress.value = local.GET("metamaskAddress")
    getBalance(markAddress.value).then(res => {
        tableData.value[0].Balance = res
        tableData.value[0].balances = res == 0 ? "0" : (res * Math.pow(10, -18)).toFixed(6)
        console.log(res)
        GetCoinPrice("BNBUSDT").then((res1: any) => {
            console.log(res1)
            balance.value = (res1 * (res * Math.pow(10, -18))).toFixed(6)

        }).catch(res1 => {
            console.log(res)

            balance.value = '0'
        })
    }).catch(err => {
        console.log(err)
    })
}

const changeChaindId = () => {
    if (window.ethereum) {
        getChainId().then(async res => {
            if (config.defaultChainId == res) {
                getBalances()

            } else {


                const data = await changeChainId()

                if (data == null) {
                    getBalances()
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
                        getBalances()
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


    }

}
const getMetamaskAddress = async (provider: any) => {

    const data: any = await accountApi.getAccountList(provider.sid)
    const accountList = data.accountList.accountDids
    accountList.forEach((item: object) => {
        accountApi.getAccountId(item).then((res: any) => {
            res.accountId.type = res.accountId.accountId.split(':')[0]
            if (res.accountId.type == 'eip155') {
                console.log(res.accountId.accountId.split(':')[2])
            }

        })
    });
}

const getByMonth = (myChart: any) => {
    let option: EChartsOption = {
        title: {
            text: "",
        },
        grid: {
            left: "0",
            right: "0",
            top: "10%",
            bottom: "0",
            containLabel: true,
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: 'none'
            },
            backgroundColor: '#292929',
            borderColor: '#474747',
            textStyle: {
                color: "#fff"
            }

        },
        xAxis: {
            boundaryGap: true,
            // alignWithLabel:true,
            // type: 'time',
            data: xAxisData
        },
        dataZoom: [
            {

                type: "inside",
                // start: 0,

                startValue: 0,
                endValue: 5,
                minValueSpan: 6,
                maxValueSpan: 6,
            },
        ],

        yAxis: {
            type: "value",
            splitLine: {
                lineStyle: {
                    color: "#474747"
                }
            },



        },
        series: [
            {
                type: 'bar',
                data: yAxisData,
                barWidth: 69,
                itemStyle: {
                    color: '#4B6388',
                    borderRadius: [10, 10, 0, 0],

                },
                emphasis: {
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{


                            offset: 0,
                            color: '#21C143'
                        }, {
                            offset: 1,
                            color: '#006B17'
                        }]),

                    }


                }

            },
        ],
    }
    GetEarningsByMonth(userinfo.id).then(res => {
        res.forEach((item: any) => {
            xAxisData.push(item.Month)
            yAxisData.push((item.Total * Math.pow(10, -18)).toFixed(6))
        })

        console.log(res)
        myChart.setOption(option)
    }).catch(res => {
        console.log('getByMonth error', res)
        myChart.setOption(option)
    })
    myChart.setOption(option)
}

function ccnum(str: string | number) {
    if (str) {
        return Number(str).toLocaleString()
    } else {
        return 0
    }
}
const onClaim = (item: any) => {


    if (markAddress.value) {
        const loading = ElLoading.service({
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        if (window.ethereum) {
            getWalletAddress().then(res => {
                if (res == markAddress.value) {
                    getChainId().then(async res => {
                        if (config.defaultChainId == res) {
                            withdraw(markAddress.value).then(res => {
                                tableData.value[0].balances = "0"
                                balance.value = "0"
                                loading.close();
                                ElMessage({
                                    dangerouslyUseHTMLString: true,
                                    customClass: 'successMessage',
                                    type: 'success',
                                    message: t('utils.message')
                                })
                            }).catch(res => {
                                console.log(res, "======")
                                loading.close();
                                ElMessage({
                                    dangerouslyUseHTMLString: true,
                                    customClass: 'successMessage',
                                    type: 'error',
                                    message: `<p style="color: #fff;">${res.message} </p>`,
                                })
                            })
                        } else {

                            const data = await changeChainId()
                            console.log(data)
                            if (data == null) {
                                loading.close()
                                withdraw(markAddress.value).then(res => {
                                    tableData.value[0].balances = "0"
                                    balance.value = "0"
                                    loading.close();
                                    ElMessage({
                                        dangerouslyUseHTMLString: true,
                                        customClass: 'successMessage',
                                        type: 'success',
                                        message: t('utils.message')
                                    })
                                }).catch(res => {
                                    console.log(res, "======")
                                    loading.close();
                                    ElMessage({
                                        dangerouslyUseHTMLString: true,
                                        customClass: 'successMessage',
                                        type: 'error',
                                        message: `<p style="color: #fff;">${res.message} </p>`,
                                    })
                                })
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
                                    withdraw(markAddress.value).then(res => {
                                        tableData.value[0].balances = "0"
                                        balance.value = "0"
                                        loading.close();
                                        ElMessage({
                                            dangerouslyUseHTMLString: true,
                                            customClass: 'successMessage',
                                            type: 'success',
                                            message: t('utils.message')
                                        })
                                    }).catch(res => {
                                        console.log(res, "======")
                                        loading.close();
                                        ElMessage({
                                            dangerouslyUseHTMLString: true,
                                            customClass: 'successMessage',
                                            type: 'error',
                                            message: `<p style="color: #fff;">${res.message} </p>`,
                                        })
                                    })
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
                    loading.close();
                    ElMessage({
                        dangerouslyUseHTMLString: true,
                        customClass: 'successMessage',
                        type: 'error',
                        message: `<p style="color: #fff;">The current bind account does not match, please switch the account to "${markAddress.value}" on Metamask </p>`,
                    })
                }
            })
        } else {
            window.open('https://metamask.io/')
            loading.close()
        }

        return

    } else {
        dialogVisible.value = true
    }
}
const onDialog = (type: string | number) => {

    dialogVisible.value = !dialogVisible.value
    markAddress.value = local.GET("metamaskAddress")
}

</script>
<style lang="scss">
.el-table__body-wrapper::-webkit-scrollbar-track {
    background-color: #0F0F0F;
    // border-radius: 5px;
    padding: 0px 2px;

}

.el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #333333;
    border-radius: 20px;
}

.el-table__header-wrapper {
    padding: 0 18px;
    box-sizing: border-box;
}

// .el-table__body {
//     padding-left: 18px !important;
//     box-sizing: border-box;
//     background-color: #242424;
// }

.table {
    .el-table {
        border-radius: 10px;
        border-style: none !important;
        --el-table-border-color: none;
        --el-table-tr-bg-color: none
    }




    .table-header>th {
        background-color: #1d1d1d !important;
        ;
        border-bottom: none;
    }

    .table-list>td {
        padding: 0 18px !important;
        box-sizing: border-box;
        background-color: #242424 !important;
        ;
        height: 60px;
    }

    .el-table__row--striped>td {
        background-color: #1d1d1d !important;
    }

    .el-table__cell {

        font-weight: 400;
        font-size: 14px;
        line-height: 21px;
        color: #fff;
    }

    .table-header .cell {
        font-weight: 600;
        color: #909791;
    }

    .el-button {
        color: #000;
        text-align: center;
        /* border: none; */
        font-weight: 700;
        font-size: 14px;
        width: 86px;
        height: 30px
    }

    .is-disabled {
        background-color: #333333 !important;
        color: #909791 !important;
        border: none;
        font-weight: 600;
    }



}
</style>
<style scoped lang="scss">
.content {
    height: 100%;

    .account-money {
        width: 683px;
        height: 124px;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        padding: 30px;
        box-sizing: border-box;

        p {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        p:nth-child(1) {
            font-weight: 600;
            font-size: 23px;
            line-height: 34px;

            span:nth-child(2) {
                font-weight: 600;
                font-size: 39px;
                // line-height: 58px;
                text-align: right;
                color: #E6D32D;
            }
        }

        p:nth-child(2) {
            margin-top: 10px;
            font-weight: 400;
            font-size: 16px;
            line-height: 24px;

            span:nth-child(2) {
                font-weight: 400;
                font-size: 14px;
                line-height: 21px;
                text-align: right;
                color: #909791;
            }
        }
    }

    .table {
        width: 683px;
        height: 300px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        margin-top: 12px;

        // .button {
        //     width: 86px;
        //     height: 30px;
        //     background: #FFFFFF;
        //     border-radius: 34px;
        //     color: #000;
        //     text-align: center;
        //     line-height: 30px;
        //     font-weight: 700;
        //     font-size: 14px;

        // }
    }


    .echarts {
        width: 683px;
        height: 300px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        box-sizing: border-box;
        padding: 20px 30px;
        margin-top: 20px;

        P {
            font-weight: 600;
            font-size: 14px;
            line-height: 21px;
            color: #909791;
        }
    }

}
</style>