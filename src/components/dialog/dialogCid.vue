<template>
    <div id="box">
        <el-dialog :model-value="props.Visible" :title="$t('dialogCid.DataIDInfo')" :before-close="handleClose" align-center>
            <div class="content-box">
                <div class="dialog-Share ">
                    <ul class="cid-all">
                        <li class="cid-single">
                            <div class="cid-id-title">{{$t('dialogCid.VerseCID')}}</div>
                            <!-- <div class="cid-id-title" v-else>Video{{index+1}}</div> -->

                            <div class="cid-id-details">{{ cidVerse }}</div>
                            <img src="@/assets/images/verse-share.svg" alt="">
                        </li>
                        <li class="cid-single" v-for="(item, index) in cidData" :key="index">
                            <div class="cid-id-title">{{ cidType }}({{ index + 1 }})</div>
                            <!-- <div class="cid-id-title" v-else>Video{{index+1}}</div> -->

                            <div class="cid-id-details">{{ item }}</div>
                            <img src="@/assets/images/verse-share.svg" alt="">
                        </li>
                    </ul>
                </div>

                <div class="footer">
                    <el-button round style="border-color: #21C143;background: #161616;color: #fff;"
                        @click="handleClose">{{$t('postVerse.Close')}}</el-button>


                </div>
            </div>

        </el-dialog>
    </div>
</template>
<script  setup lang="ts">
import { onMounted, reactive } from "vue";
import { ElLoading } from 'element-plus'

const myEmit = defineEmits(["handleClose"]);
interface DialogFileProps {
    Visible: boolean;
    cidData: any
    cidType: string
    cidVerse: string
}


onMounted(() => {
    console.log(8888);
});

const props = withDefaults(defineProps<DialogFileProps>(), {
    Visible: false,
    cidData: [],
    cidType: '',
    cidVerse: ""
});

const handleClose = () => {
    myEmit("handleClose");
};


</script>
<style scoped lang="scss">
#box {
    // :deep(.el-overlay-dialog) {
    //     backdrop-filter: blur(11px);
    // }

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

    .dialog-Share {
        width: 100%;

        .cid-all {
            width: 100%;

            .cid-single {
                width: 100%;
                padding: 10px 30px;
                box-sizing: border-box;
                display: flex;
                justify-content: space-between;
                align-items: center;

                // background-color: #161616;
                .cid-id-title {
                    font-weight: 400;
                    font-size: 14px;
                    color: #909791;
                    width: 100px;
                }

                .cid-id-details {
                    width: 268px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    // margin: 0 60px 0 28px;
                    color: #fff;
                    font-weight: 400;
                    font-size: 14px;
                }
            }
        }

        .cid-single:nth-child(even) {
            background-color: #161616;
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

}</style> 