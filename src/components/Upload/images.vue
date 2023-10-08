<template>
    <div class="" id="Upload">
        <el-upload :show-file-list="false" class="upload-demo" action="#" :limit="1" multiple
            :http-request="handleHttpUpload" :on-exceed="handleExceed" :before-upload="beforeAvatarUpload">
            <div class="Upload-but">+{{$t('UploadImage.Upload')}}</div>

        </el-upload>

    </div>
</template>
<script setup lang="ts">
import type { UploadProps, UploadRequestOptions, } from 'element-plus'

import { ref } from "vue"
import i18n from '@/lang/index'

const t = i18n.global.t
import { ElMessage, genFileId } from 'element-plus'
import utils from "@/utils/utils.js"
type FileTypes =
    | "image/apng"
    | "image/bmp"
    | "image/gif"
    | "image/jpeg"
    | "image/pjpeg"
    | "image/png"
    | "image/svg+xml"
    | "image/tiff"
    | "image/webp"
    | "image/x-icon";
interface UploadFileProps {
    type: number | string;
    fileType?: FileTypes[]; 
}
const props = withDefaults(defineProps<UploadFileProps>(), {
    type: 0,
    fileType: () => ["image/jpeg", "image/png", "image/gif"],
});
const imageUrl = ref('')
const myEmit = defineEmits(['changeImg']);


const handleHttpUpload = async (options: UploadRequestOptions) => {
    let formData = new FormData();
    formData.append("file", options.file);
    console.log(9999)
    try {
        // const api = props.api ?? uploadImg;
        // const { data } = await api(formData);
        // emit("update:imageUrl", data.fileUrl);
        
        // formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);
        // emit("check-validate");
    } catch (error) {
        options.onError(error as any);
    }
};


const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile: any) => {
    const imgType = props.fileType;

    if (!imgType.includes(rawFile.type as FileTypes)) {
        ElMessage({
            customClass: 'successMessage',
            type: 'error',
            message: t('UploadImage.avatarTip'),
        })

        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage({
            customClass: 'successMessage',
            type: 'error',
            message: t('UploadImage.avatarMax'),
        })
        return false
    }
    console.log(rawFile)
    utils.getFileAvatarBase64(rawFile).then(res => {
        myEmit("changeImg", props.type, res, rawFile);
    })
    return true
}
const handleExceed: UploadProps['onExceed'] = (files) => {
    console.log(files)
    utils.getFileAvatarBase64(files[0]).then(res => {
        myEmit("changeImg", props.type, res, files[0]);
    })
}

</script>
<style>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
<style scoped lang="scss">
#Upload {
    :deep(.upload-demo) {
        .el-upload:focus {
            color: #FFFFFF !important;

        }
    }
}

.Upload-but {
    display: inline-block;
    width: 86px !important;
    height: 30px;
    border: 1px solid #FFFFFF;
    border-radius: 34px;
    line-height: 30px;
    text-align: center;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
}
</style>