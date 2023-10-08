<template>
    <div class="square">
        <el-scrollbar height="100%">
            <div class="square-left">
                <div class="square-verses">
                    <div class="tabs flx-justify-between ">
                        <div>
                            <img src="@/assets/images/goback.svg" alt="" @click="goBack">
                            <span class="tabs-title">{{ $t('postVerse.NewPost') }}</span>
                        </div>
                        <div class="flx-center">
                            <div class="select-status">
                                <el-select v-model="statusValue" class="m-2" placeholder="Select" size="large"
                                    :suffix-icon="iconGreen" :teleported="false" popper-class="select-verse-status">
                                    <el-option v-for="item in options" :key="item.value" :label="item.label"
                                        :value="item.value" />
                                </el-select>
                            </div>
                            <div class="post-btn" @click="postVerse">
                                {{ $t('postVerse.POST') }}
                            </div>
                        </div>
                    </div>
                    <div class="verse">
                        <div class="verse-text">
                            <el-input maxlength="2000" v-model="verseContent" resize="none" type="textarea"
                                :placeholder="$t('postVerse.PleaseInput')" />
                        </div>

                    </div>
                    <div :class="fileList.length < uploadLimit ? 'verse-upload' : 'verse-uploaded verse-upload'">
                        <el-upload action="#" list-type="picture-card" :auto-upload="false" :limit="uploadLimit"
                            v-model:file-list="fileList" :before-upload="beforeMediaUpload" :accept="uploadRule"
                            :on-change="watchUpload">

                            <template #trigger>
                                <div class="upload-btn">
                                    <img src="@/assets/images/upload-add.svg" alt="">
                                    <span v-show="fileList.length <= 0">{{ UploadTip }}</span>
                                </div>
                            </template>
                            <template #file="{ file }">

                                <div class="upload-media">
                                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt=""
                                        v-if="uploadLimit === 4" />
                                    <div v-else>

                                        <video :src="file.url" style="width: 148px;height: 148px;border-radius: 10px;" muted
                                            controls></video>
                                    </div>
                                </div>
                                <img class="deleteImg" src="@/assets/images/upload-delete.svg" alt=""
                                    @click="handleRemove(file)">
                                <!-- <el-progress width="50"  :percentage="50" type="circle"></el-progress> -->
                                <!-- <div class="upload-progress">

                                    
                                </div> -->

                            </template>
                        </el-upload>
                    </div>

                </div>
            </div>

        </el-scrollbar>


        <div class="square-right">
            <suggestions></suggestions>
        </div>
    </div>
    <setPay :Visible="SetPayVisible" @handleClose="closeSetPay" :data="setPayData" @setPrice="setPayPrice"></setPay>
    <dialogAccount v-model:Visible="dialogVisible" @handleClose="onDialog" :titleType="1"></dialogAccount>
</template>

<script setup lang="ts">
import { saveVerse, getVerse, deleteVerse, getVerseOfOthers, getVersesByOwner } from "@/libs/verse"
import { uploadFileDataModel, createFileDataModel, downloadFile } from "@/libs/file"
import { ElLoading, ElMessage } from "element-plus";
import local from "@/utils/local";
import { useRouter } from 'vue-router'
import suggestions from '@/components/suggestions.vue';
import { ref, reactive, computed } from 'vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import type { UploadFile } from 'element-plus'
import iconGreen from '@/components/select/icon-green.vue';
import dialogAccount from "@/components/dialog/dialogAccount.vue";
import setPay from './components/set-pay.vue';
import { UserState } from "@/store/modules/users"
import { mint, getWalletAddress } from "@/api/web3"
import { reject } from "lodash";
import i18n from '@/lang/index'
const t = i18n.global.t
const router = useRouter()

const verseContent = ref('')
const fileList = ref<UploadUserFile[]>([])
const uploadRule = ref('.jpg,.png,.gif,.mp4')
const UploadTip = ref(t('postVerse.UploadTip'))
const goBack = () => {
    history.back()
}
const userState = UserState();
const statusValue = ref('1')

const options = [
    {
        value: '1',
        label: t('postVerse.options1'),
    },
    {
        value: '2',
        label: t('postVerse.options2'),
    },
    {
        value: '3',
        label: t('postVerse.options3'),
    },
    {
        value: '4',
        label: t('postVerse.options4'),
    },
    {
        value: '5',
        label: t('postVerse.options5'),
    },
]
const setPayData = reactive({})

const uploadLimit = ref(4)
const handleRemove = (file: UploadFile) => {
    console.log(fileList.value);
    console.log(file)
    const url = file.url
    const i = fileList.value.findIndex(x => x.url === url)

    fileList.value.splice(i, 1)
    if (fileList.value.length === 0) {
        uploadRule.value = '.jpg,.png,.gif,.mp4'

    }
}
const SetPayVisible = ref(false)
const closeSetPay = () => {
    SetPayVisible.value = false
}
interface FileQueryType {
    createdAt: number,
    fileIds: any,
    owner: string,
    price: string,
    digest: string,
    scope: number,
    status: number,
    nftTokenId: string,
    isPaid: boolean,
    fileType: string
}
const dialogVisible = ref(false)
const onDialog = () => {
    dialogVisible.value = false
}

const setPayPrice = async (val: number) => {

    console.log(val * Math.pow(10, 18));

    const Postloading = ElLoading.service({
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.7)",
    });
    console.log(verseContent.value);
    console.log(fileList.value);
    let query: FileQueryType = {
        createdAt: new Date().getTime(),
        fileIds: [],
        owner: String(userState.getUserInfo.id),
        price: '',
        digest: verseContent.value,
        scope: Number(statusValue.value),
        status: 1,
        nftTokenId: "",
        isPaid: true,
        fileType: 'image'
    }
    if (fileList.value.length > 0) {
        if (fileList.value[0].raw?.type.includes('image')) {
            query.fileType = 'image'
        } else if (fileList.value[0].raw?.type.includes('video')) {
            query.fileType = 'video'
        }

        else {
            query.fileType = ''

        }
        let value = await Promise.all(fileList.value.map(async (item: any) => {
            let temp: any = item.raw
            // fileQuery.push(item.raw.name)
            console.log(String(duration.value));

            const resValue = await uploadFileDataModel(temp, {
                "createdAt": new Date().getTime(),
                "contentType": temp.type,
                "owner": String(userState.getUserInfo.id),
                "filename": encodeURIComponent(item.name),
                "extendInfo": String(duration.value)

            }, false)
            console.log(resValue);
            if (resValue == undefined) {
                Postloading.close();
                ElMessage({
                    customClass: 'successMessage',
                    type: 'error',
                    message: t('postVerse.options5'),
                })
                isPost.value = false
                reject
            }
            return resValue

        })
        )

        query.fileIds = value.filter(res => { return res !== undefined })

    } else {
        query.fileIds = []
    }

    console.log(query);
    query.digest = encodeURIComponent(query.digest)
    query.price = String(val * Math.pow(10, 18))
    if (isPost.value) {
        console.log(query);

        saveVerse(query).then(res => {
            console.log(res);
            if (val > 0) {

                getWalletAddress().then(AddressVal => {
                    console.log(AddressVal);

                    if (AddressVal) {
                        mint(res, val * Math.pow(10, 18), 1, 0, AddressVal).then(res1 => {
                            console.log(res1);
                            Postloading.close();
                            SetPayVisible.value = false
                            // ElMessage({
                            //     message: 'post successful',
                            //     grouping: true,
                            //     type: 'success',
                            // })
                            router.push({
                                name: 'Verse-Square',
                            })
                        }).catch(mintFail => {
                            console.log(mintFail);
                            Postloading.close();
                            SetPayVisible.value = false
                            router.push({
                                name: 'Verse-Square',
                            })
                        })
                    } else {
                        SetPayVisible.value = false

                        Postloading.close();
                    }
                }).catch(AddressVal1 => {
                    console.log(AddressVal1);

                })
            } else {
                Postloading.close();
                SetPayVisible.value = false
                // ElMessage({
                //     message: 'post successful',
                //     grouping: true,
                //     type: 'success',
                // })
                router.push({
                    name: 'Verse-Square',
                })
            }


        }).catch(Response => {
            console.log(Response);
            Postloading.close();
            // ElMessage({
            //     message: 'post fail',
            //     grouping: true,
            //     type: 'warning',
            // })
        })
    }
}
const isPost = ref(true)
const duration = ref(0)
const postVerse = async () => {
    let maxSize = 0
    fileList.value.forEach(item => {
        maxSize += item.size
    })

    isPost.value = true
    if (verseContent.value.trim() == '' && fileList.value.length == 0) {
        ElMessage({
            customClass: 'successMessage',
            type: 'error',
            message: t('postVerse.NoVerseInfo'),
        })
        verseContent.value = ''
    } else if (maxSize / 1024 / 1024 > 20) {
        ElMessage({
            customClass: 'successMessage',
            type: 'error',
            message: 'Maximum upload file size: 20MB',
        })

    }
    else {


        if (statusValue.value === '4') {

            // ElMessage({
            //     dangerouslyUseHTMLString: true,
            //     customClass: 'successMessage',
            //     type: 'success',
            //     message: '<p style="color: #fff;">The operation is successful. Kindly note that data is stored on decentralized network, which may cause some delay. We kindly recommend refreshing the page at a later time. </p>',
            // })
            if (local.GET('metamaskAddress')) {
                SetPayVisible.value = true

            } else {
                dialogVisible.value = true
            }

        } else {
            const loading = ElLoading.service({
                lock: true,
                text: "Loading",
                background: "rgba(0, 0, 0, 0.7)",
            });
            console.log(verseContent.value);
            console.log(fileList.value);
            let query: FileQueryType = {
                createdAt: new Date().getTime(),
                fileIds: [],
                owner: String(userState.getUserInfo.id),
                price: '',
                digest: verseContent.value,
                scope: Number(statusValue.value),
                status: 1,
                nftTokenId: "",
                isPaid: true,
                fileType: 'image'
            }
            if (fileList.value.length > 0) {
                if (fileList.value[0].raw?.type.includes('image')) {
                    query.fileType = 'image'
                } else if (fileList.value[0].raw?.type.includes('video')) {
                    query.fileType = 'video'

                }

                else {
                    query.fileType = ''

                }

                let value = await Promise.all(fileList.value.map(async (item: any) => {
                    let temp: any = item.raw
                    // fileQuery.push(item.raw.name)
                    console.log(temp);
                    console.log(String(duration.value));

                    const isPublic = query.scope === 1;
                    try {
                        const resValue = await uploadFileDataModel(temp, {
                            "createdAt": new Date().getTime(),
                            "contentType": temp.type,
                            "owner": String(userState.getUserInfo.id),
                            "filename": encodeURIComponent(item.name),
                            "extendInfo": String(duration.value)
                        }, isPublic)
                        console.log(resValue);

                        if (resValue == undefined) {

                            loading.close();
                            ElMessage({
                                customClass: 'successMessage',
                                type: 'error',
                                message: t('postVerse.repostTip'),
                            })
                            isPost.value = false
                        }
                        console.log(resValue);
                        return resValue
                    } catch (error) {
                        console.log(error);
                        loading.close();
                        isPost.value = false
                        ElMessage({
                            customClass: 'successMessage',
                            type: 'error',
                            message: 'No token available at the current address.',
                        })

                    }

                    // fileQuery.push(resValue)

                })
                )
                query.fileIds = value.filter(res => { return res !== undefined })

            } else {
                query.fileIds = []
            }

            console.log(query);
            query.digest = encodeURIComponent(query.digest)

            if (isPost.value) {

                saveVerse(query).then(res => {
                    console.log(res);
                    loading.close();
                    // ElMessage({
                    //     message: 'post successful',
                    //     grouping: true,
                    //     type: 'success',
                    // })
                    router.push({
                        name: 'Verse-Square',
                    })
                }).catch(Response => {
                    console.log(Response);
                    loading.close();
                    // ElMessage({
                    //     message: 'post fail',
                    //     grouping: true,
                    //     type: 'warning',
                    // })
                })
            }
        }
    }
}


const beforeMediaUpload: UploadProps['beforeUpload'] = (rawFile) => {

    // if (rawFile.type =='video/mp4') {
    //     if(rawFile.size / 1024 / 1024 > 1){
    //         ElMessage.error('Maximum upload file size: 20MB')
    //         return false
    //     }

    // }
    // return true
    //   if (rawFile.type !== 'image/jpeg') {
    //     ElMessage.error('Avatar picture must be JPG format!')
    //     return false
    //   } else if (rawFile.size / 1024 / 1024 > 2) {
    //     ElMessage.error('Avatar picture size can not exceed 2MB!')
    //     return false
    //   }
    //   return true
}
const watchUpload = (rawFile: UploadUserFile) => {
    console.log(rawFile);
    console.log(fileList.value);

    if (rawFile.raw) {
        // rawFile.showProgress = true
        if (rawFile.raw.type.includes('video')) {
            uploadLimit.value = 1
                var url = URL.createObjectURL(rawFile.raw);
                var audioElement = new Audio(url);


                audioElement.addEventListener("loadedmetadata", function () {

                    duration.value = audioElement.duration;
                    console.log(duration.value);

                });



        } else {
            uploadLimit.value = 4
            uploadRule.value = '.jpg,.png,.gif'
            console.log(fileList.value);



        }
    }

}


</script>
<!-- <style  lang="scss">
 ::v-deep(.el-message){
        background-color: #161616;
        border: 1px solid #21C143;
        border-radius: 10px
    }
</style> -->
<style scoped lang="scss">
.square {
    width: 1040px;
    height: 100%;
    display: flex;

    .square-left {
        width: 670px;
        // min-height: 708px;
        margin-right: 20px;

        .verse {
            width: 100%;
            // padding: 20px 30px;
            box-sizing: border-box;

            .verse-text {
                width: 100%;
                height: 300px;
                background-color: #1A1A1A;
                padding: 20px 30px;
                box-sizing: border-box;

                ::v-deep(.el-textarea__inner) {
                    min-height: 260px !important;
                    max-height: 260px;
                    background-color: #1A1A1A;
                    box-shadow: none;
                    padding: 0;
                    font-weight: 400;
                    font-size: 16px;
                    color: #fff;
                }
            }




        }

        .verse-upload {
            //    ::v-deep(.el-upload){
            //         width: 154px;
            //         height: 154px;
            //         background: #1A1A1A;
            //         /* grey line */

            //         border: 1px dashed #474747;
            //         border-radius: 10px;
            //     }
            box-sizing: border-box;
            padding: 12px;

            ::v-deep(.el-upload) {
                border: none;
                width: 148px;
                height: 148px;
                background-color: #292929;
            }

            .upload-btn {
                width: 148px;
                height: 148px;
                overflow: hidden;
                background: #1A1A1A;
                box-sizing: border-box;
                /* grey line */
                border: 1px dashed #474747;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                // padding-top: 20px;
                box-sizing: border-box;

                span {
                    text-align: center;
                    font-weight: 400;
                    font-size: 12px;
                    color: #474747;
                    width: 126px;
                    margin-top: 10px;
                }

            }

            ::v-deep(.el-upload-list__item) {
                width: 148px;
                height: 148px;
                background: none;
                border: none;
                box-sizing: border-box;
            }

            .upload-media {
                width: 148px;
                height: 148px;
                background: #1A1A1A;
                /* grey line */
                overflow: hidden;
                border: 1px dashed #474747;
                border-radius: 10px;
                box-sizing: border-box;

            }

            .upload-progress {
                position: absolute;
                top: 1px;
                left: 1px;
                width: 148px;
                height: 148px;
                background: rgba(0, 0, 0, 0.4);

                ::v-deep(.el-progress) {
                    width: 50px;
                    height: 50px;

                    .el-progress-circle {
                        width: 50px !important;
                        height: 50px !important;

                        .el-progress__text {
                            color: #000 !important;
                        }
                    }
                }

            }

            .deleteImg {
                position: absolute;
                top: 8px;
                right: 8px;
                cursor: pointer;
            }

        }

        .verse-uploaded {
            ::v-deep(.el-upload) {
                display: none;
            }
        }

        .mote {
            cursor: pointer;
            margin-left: 12px;
        }

        .square-verses {
            // margin-top: 15px;
            background: #292929;
            box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            min-height: 500px;

            .tabs {
                width: 100%;
                height: 60px;
                border-bottom: 1px solid #474747;
                box-sizing: border-box;
                position: relative;
                padding: 0 30px;

                .tabs-title {
                    font-weight: 600;
                    font-size: 18px;
                    line-height: 28px;
                    margin-left: 30px;
                }

                .post-btn {
                    width: 100px;
                    height: 36px;
                    background: #21C143;
                    border-radius: 80px;
                    font-weight: 600;
                    font-size: 16px;
                    color: #fff;
                    margin-left: 10px;
                    text-align: center;
                    line-height: 36px;
                    cursor: pointer;
                }

                .select-status {
                    .el-select {
                        --el-select-input-focus-border-color: none
                    }

                    ::v-deep(.el-input__wrapper) {
                        width: 201px;
                        height: 36px;
                        box-sizing: border-box;
                        background-color: #292929;
                        border: 1px solid #21C143;
                        box-shadow: none;
                        border-radius: 80px;
                        padding-left: 29px;

                        .el-input__inner {
                            font-weight: 400;
                            font-size: 14px;
                            color: #fff;
                            // padding-left: 20px;
                            // box-sizing: border-box;
                        }

                    }

                    ::v-deep(.el-popper__arrow) {
                        display: none;
                    }

                    ::v-deep(.select-verse-status) {

                        /* grey words */

                        // border: 1px solid #909791;
                        border: none;

                        background: #292929;
                        overflow: hidden;

                        .el-select-dropdown__wrap {
                            //     width: 201px;
                            // height: 205px;
                            // box-sizing: border-box;
                            // padding: 0;
                            border: 1px solid #909791;
                            border-radius: 10px;


                        }

                        .el-select-dropdown__list {
                            background: #292929;

                            width: 201px;
                            height: 205px;
                            display: flex;
                            box-sizing: border-box;
                            padding: 0;
                            margin: 0 !important;
                            flex-direction: column;
                            align-items: center;
                            justify-content: space-between;
                        }

                        .el-select-dropdown__item {
                            width: 100%;
                            height: 40px;
                            color: #909791;
                            font-weight: 400;
                            font-size: 14px;
                            line-height: 40px;
                            box-sizing: border-box;
                            padding-left: 38px;
                        }

                        .el-select-dropdown__list :nth-child(4) {
                            color: #E6D32D;
                        }

                        .hover {
                            background-color: #1A1A1A;
                            color: #fff;
                        }
                    }
                }
            }
        }
    }

    .square-right {
        // width: 350px;
        // height: 600px;
        // background-color: #ccc;
    }
}
</style>