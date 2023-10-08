<template>
    <div id="box">
        <el-dialog :model-value="props.Visible" title="" :before-close="handleClose">
            <div class="content-box">
                <div class="dialog-text ">
                    <p><span v-if="props.data != 'Are you sure to disconnect the wallet link'">{{ $t('dialogText.delete')
                    }}</span> <span>“{{
    decodeURIComponent(props.data).substring(0, 50) }}”</span> ?</p>
                </div>

                <div class="footer">
                    <el-button round style="border-color: #21C143;background: #161616;color: #fff;border: 1px solid;"
                        @click="handleClose">{{ $t('postVerse.Close') }}</el-button>
                    <el-button v-if="props.data != 'Are you sure to disconnect the wallet link'" round
                        style="border-color: #F56E6E;background: #161616;color: #F56E6E;;border: 1px solid;"
                        @click="onDelete">{{ $t('dialogText.Delete') }}</el-button>
                    <el-button v-else round
                        style="border-color: #F56E6E;background: #161616;color: #F56E6E;;border: 1px solid;"
                        @click="onDelete">{{ $t('dialogText.Confirm') }}</el-button>
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
    data: any
}


onMounted(() => {

});

const props = withDefaults(defineProps<DialogFileProps>(), {
    Visible: false,
    data: {}

});

const handleClose = (type: string | number) => {
    myEmit("handleClose", type);
};
const onDelete = (type: string | number) => {

    handleClose(1)

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
        width: 100px;
        height: 36px;
    }
}

.content-box {

    width: 498px;

    .dialog-text {
        height: 157px;
        width: 370px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        color: #fff;


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