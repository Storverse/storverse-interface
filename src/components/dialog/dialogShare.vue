<template>
    <div id="box">
        <el-dialog :model-value="props.Visible" title="Share" :before-close="handleClose">
            <div class="content-box">
                <div class="dialog-Share">
                    <img style="cursor: pointer;" src="@/assets/images/ShareIcon1.svg" alt="" @click="shareTwitter" />
                    <img style="cursor: pointer;" src="@/assets/images/ShareIcon2.svg" alt="" @click="shareFacebook" />
                    <img style="cursor: pointer;" src="@/assets/images/ShareIcon3.svg" alt="" @click="getCopyUrl" />
                </div>

                <div class="footer">
                    <el-button round style="border-color: #21c143;border: 1px solid; background: #161616; color: #fff"
                        @click="handleClose">Close</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { ElLoading } from "element-plus";
import { UserState } from "@/store/modules/users";
const myEmit = defineEmits(["handleClose"]);
const userState = UserState();
import { ElMessage } from 'element-plus'
interface DialogFileProps {
    Visible: boolean;
    data: any;
    pageType: number;
}

onMounted(() => {
    // console.log(document.location);
});

const props = withDefaults(defineProps<DialogFileProps>(), {
    Visible: false,
    data: {},
    pageType: 0,
});

const handleClose = () => {
    myEmit("handleClose");
};

const onPay = (type: string | number) => {
    const loading = ElLoading.service({
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.7)",
    });

    setTimeout(() => {
        // handleClose()
        loading.close();
    }, 2000);
};

const shareTwitter = () => {
    if (props.pageType == 1) {
        let id = userState.KeplrUserInfo.id;

        let verseId = props.data.id;
        let userDataId = props.data.owner
        // let url = document.location.origin + "/verse-details?verseId=" + encodeURIComponent(verseId) + "?userDataId=" + encodeURIComponent(userDataId);
        let url = document.location.origin + "/verse-details?verseId=" + encodeURIComponent(verseId);


        function popupwindow(url: string, id: string) {
            return window.open(
                "https://twitter.com/intent/tweet?url=" +
                encodeURIComponent(url) +
                "&id=" +
                encodeURIComponent(id),
                "_blank",
                "toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=600, height=450,top=100,left=350"
            );
        }

        popupwindow(url, id);
    } else if (props.pageType == 2) {
        let id =  props.data.id;
        let url =
            document.location.origin + "/userProfile?key=" + encodeURIComponent(id);
        console.log(document.location.origin);

        function popupwindow(url: string, id: string) {
            return window.open(
                "https://twitter.com/intent/tweet?url=" +
                encodeURIComponent(url) +
                "&id=" +
                encodeURIComponent(id),
                "_blank",
                "toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=600, height=450,top=100,left=350"
            );
        }
        popupwindow(url, id);
    
    } else {



        let id = userState.KeplrUserInfo.id;
        let url =
            document.location.origin + "/userProfile?key=" + encodeURIComponent(id);
        console.log(document.location.origin);

        function popupwindow(url: string, id: string) {
            return window.open(
                "https://twitter.com/intent/tweet?url=" +
                encodeURIComponent(url) +
                "&id=" +
                encodeURIComponent(id),
                "_blank",
                "toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=600, height=450,top=100,left=350"
            );
        }
        popupwindow(url, id);
    }
};
const shareFacebook = () => {
    if (props.pageType == 1) {
        let id = userState.KeplrUserInfo.id;

        let verseId = props.data.id;
        let userDataId = props.data.owner
        let url = document.location.origin + "/verse-details?verseId=" + encodeURIComponent(verseId);

        function popupwindow(url: string, id: string) {
            return window.open(
                "http://www.facebook.com/sharer.php?u=" + encodeURIComponent(url),
                "_blank",
                "toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=600, height=450,top=100,left=350"
            );
        }
        popupwindow(url, id);
    }else if(props.pageType == 2){
        let id = props.data.id;
        let url =
            document.location.origin +
            "/userProfile?key=" +
            encodeURIComponent(id);
        function popupwindow(url: string, id: string) {
            return window.open(
                "http://www.facebook.com/sharer.php?u=" + encodeURIComponent(url),
                "_blank",
                "toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=600, height=450,top=100,left=350"
            );
        }
        popupwindow(url, id);
    }else {

        let id = userState.KeplrUserInfo.id;
        let url =
            document.location.origin +
            "/userProfile?key=" +
            encodeURIComponent(id);
        function popupwindow(url: string, id: string) {
            return window.open(
                "http://www.facebook.com/sharer.php?u=" + encodeURIComponent(url),
                "_blank",
                "toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=600, height=450,top=100,left=350"
            );
        }
        popupwindow(url, id);
    }

};
const getCopyUrl = () => {
    if (props.pageType == 1) {

        let verseId = props.data.id;
        let userDataId = props.data.owner
        let url = document.location.origin + "/verse-details?verseId=" + encodeURIComponent(verseId);
        var cInput = document.createElement("input");
        cInput.value = url;
        document.body.appendChild(cInput);
        cInput.select();
        document.execCommand("copy");
        document.body.removeChild(cInput);
        ElMessage({
            dangerouslyUseHTMLString: true,
            customClass: 'successMessage',
            type: 'success',
            message: `<p style="color: #fff;">Copied! </p>`,
        })
    }else if(props.pageType == 2){
        let id = props.data.id;
        let url = document.location.origin + "/userProfile?key=" + encodeURIComponent(id);
        var cInput = document.createElement("input");
        cInput.value = url;
        document.body.appendChild(cInput);
        cInput.select();
        document.execCommand("copy");
        document.body.removeChild(cInput);
        ElMessage({
            dangerouslyUseHTMLString: true,
            customClass: 'successMessage',
            type: 'success',
            message: `<p style="color: #fff;">Copied! </p>`,
        })
    } else {
        let id = userState.KeplrUserInfo.id;
        let url = document.location.origin + "/userProfile?key=" + encodeURIComponent(id);
        var cInput = document.createElement("input");
        cInput.value = url;
        document.body.appendChild(cInput);
        cInput.select();
        document.execCommand("copy");
        document.body.removeChild(cInput);
        ElMessage({
            dangerouslyUseHTMLString: true,
            customClass: 'successMessage',
            type: 'success',
            message: `<p style="color: #fff;">Copied! </p>`,
        })
        // this.iscopy = true;
        // setTimeout(() => {
        // 	this.iscopy = false;
        // }, 3000);
    }
};
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

    .dialog-Share {
        height: 157px;
        width: 350px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-evenly;

        img {
            width: 50px;
            height: 50px;
            // margin-bottom: 23px;
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
