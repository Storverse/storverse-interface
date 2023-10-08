<template>
  <div class="content " id="profile-content">
    <div class="content-left">
      <p>
        <span>{{ $t('settingProfile.Username') }}</span>
        <el-input v-model="form.username" maxlength="20" minlength="4" />
      </p>
      <p>
        <span>{{ $t('settingProfile.DataId') }}</span>
        <el-input v-model="form.id" :prefix-icon="icons" disabled maxlength="6">

        </el-input>
      </p>
      <p>
        <span>{{ $t('settingProfile.Bio') }}</span>
        <el-input type="textarea" :autosize="false" v-model="form.bio" resize="none" maxlength="160" />
      </p>
      <p>
        <span>{{ $t('settingProfile.Twitter') }}</span>
        <el-input v-model.trim="form.twitter" :prefix-icon="icons" maxlength="15">

        </el-input>
        <!-- <p><el-button  round>Connect twitter account</el-button></p> -->
      </p>
    </div>
    <div class="content-right">
      <div class="avatar">
        <p>
          <span class="title">{{ $t('settingProfile.Avatar') }}</span>
          <span class="text">{{ $t('settingProfile.avatarTip') }}</span>
        <div>
          <UpImages @changeImg="changeImg" type="avatar"></UpImages>
        </div>

        </p>
        <p class="flx-center showAvatar">
          <img :src="form.DownAvatar" alt="">
          
        </p>
      </div>
      <div class="ProfileImage">
        <p class="title" style="">{{ $t('settingProfile.ProfileImage') }}</p>
        <p class="text" style="width: 100%;">{{ $t('settingProfile.imgTip') }}</p>
        <p class="flx-center" :style="{ background: 'url(' + form.backImg + ')', backgroundSize: 'cover' }">
          <UpImages @changeImg="changeImg" type="image"></UpImages>
        </p>
      </div>
      <div>
        <p class="title">{{ $t('settingProfile.Youtube') }}</p>
        <el-input v-model.trim="form.youtube" :prefix-icon="icons" maxlength="30">

        </el-input>
      </div>
    </div>
  </div>
  <div class="button">
    <el-button type="success" round @click="saveProfile">{{ $t('settingProfile.save') }}</el-button>

  </div>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted, computed, toRefs } from "vue";
import icons from "@/components/setting/icon.vue";
import UpImages from "@/components/Upload/images.vue";
import { UserState } from "@/store/modules/users";
import { LoginState } from "@/store/modules/login";
import { ElLoading, ElMessage } from "element-plus";
import utils from "@/utils/utils";
import local from "@/utils/local";
import {
  initService as initUserService,
  getUserProfile,
  saveUserProfile,
  updateDataModelPermission
} from "@/libs/user";
import {
  initService as initFileService,
  uploadFileDataModel,
  createFileDataModel,
  downloadFile
} from "@/libs/file";
import { json } from "stream/consumers";
import i18n from '@/lang/index'

const t = i18n.global.t
interface UserProps {
  userName: string;
  bio: string;
  avatar: string;
  profileImage: string;
  Youtube: string;
}
// const form: UserProps = reactive({
//     userName: '',
//     handleName: '',
//     bio: "",
//     avatar: '',
//     profileImage: '',
//     Youtube: ''
// })
const userState = UserState();
const avatarFile = ref();
const bannerFile = ref();

const form: any = reactive({ ...userState.getUserInfo });
form.bio = decodeURIComponent(form.bio)
form.twitter = decodeURIComponent(form.twitter)
form.username = decodeURIComponent(form.username)
form.youtube = decodeURIComponent(form.youtube)

console.log(form);

onMounted(async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    const userProfile = await getUserProfile();

    const shouldReset = (
      decodeURIComponent(userProfile.username || '') !== decodeURIComponent(userState.getUserInfo.username) ||
      decodeURIComponent(userProfile.bio || '') !== decodeURIComponent(userState.getUserInfo.bio) ||
      decodeURIComponent(userProfile.twitter || '') !== decodeURIComponent(userState.getUserInfo.twitter) ||
      decodeURIComponent(userProfile.youtube || '') !== decodeURIComponent(userState.getUserInfo.youtube) ||
      userProfile.avatar !== userState.getUserInfo.avatar ||
      userProfile.banner !== userState.getUserInfo.banner
    );

    if (shouldReset) {
      form.username = decodeURIComponent(userProfile.username || '');
      form.bio = decodeURIComponent(userProfile.bio || '');
      form.twitter = decodeURIComponent(userProfile.twitter || '');
      form.youtube = decodeURIComponent(userProfile.youtube || '');
      // Set other form fields as necessary
      if (userProfile.avatar || userProfile.banner) {
        toDownloadFile(userProfile)
      } else {
        UserState().SetUserInfo(userProfile)
        LoginState().SetkeplrAddress(userProfile)
      }
    }
  } catch (error) {
    // Handle errors
    console.error("Failed to fetch user profile:", error);
  }
});

const changeImg = (type: string, url: string, file: any) => {
  // console.log(form);
  if (type == "avatar") {
    form.DownAvatar = url;

    avatarFile.value = file;
  } else {

    form.backImg = url;
    console.log(url);
    console.log(file);
    bannerFile.value = file;
  }
};
const arrayBufferToBase64 = (buffer: any) => {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};
const toDownloadFile = (info: any) => {
  let userdetails = { ...info };
  if (info.avatar !== "" && info.banner !== "") {
    downloadFile(info.avatar, false, false, true)
      .then(res => {
        console.log("downloadFile:", res);
        userdetails.DownAvatar =
          "data:image/png;base64," + res.data;
        // console.log(userdetails);
        downloadFile(info.banner, false, false, true).then(res1 => {
          console.log("downloadFile:", res);
          userdetails.backImg =
            "data:image/png;base64," + res1.data;
          // console.log(userdetails);
          console.log(userdetails, "====")
          UserState().SetUserInfo(userdetails);
          LoginState().SetkeplrAddress(userdetails);
        });
      })
      .catch(Response => {
        console.log(form.id);
        utils.ElMessage("error", Response.message);
        console.log(Response);
      });
  } else if (info.avatar !== "" && info.banner == "") {
    downloadFile(info.avatar, false, false, true)
      .then(res => {
        console.log("downloadFile:", res);
        userdetails.DownAvatar =
          "data:image/png;base64," + res.data;
        // console.log(userdetails);

        UserState().SetUserInfo(userdetails);
        LoginState().SetkeplrAddress(userdetails);
      })
      .catch(Response => {
        console.log(form.id);

        console.log(Response);
      });
  } else if (info.banner !== "" && info.avatar == "") {
    downloadFile(info.banner, false, false, true)
      .then(res => {
        console.log("downloadFile:", res);
        userdetails.backImg =
          "data:image/png;base64," + res.data;
        // console.log(userdetails);

        UserState().SetUserInfo(userdetails);
        LoginState().SetkeplrAddress(userdetails);
      })
      .catch(Response => {
        console.log(form.id);

        console.log(Response);
      });
  } else {
  }
};
const testClick = () => {
  updateDataModelPermission(form.id);
};

const saveProfile = async () => {
  if (form.username.trim()) {

    if (avatarFile.value && bannerFile.value) {
      console.log("both");
      toUploadBoth(avatarFile.value, bannerFile.value);
    } else if (avatarFile.value) {
      console.log("avatar");

      toUploadAvatar(avatarFile.value);
    } else if (bannerFile.value) {
      console.log("banner");
      toUploadBanner(bannerFile.value);
    } else {
      console.log("none");
      editProfile(form);
    }
  } else {
    form.username = ''
    ElMessage({
      customClass: 'successMessage',
      type: 'error',
      message: t('settingProfile.userNameTips'),
    })


  }

};

const editProfile = (val: any) => {
  let query = { ...val };

  delete query.DownAvatar;
  delete query.backImg;
  delete query.handleName
  query.username = encodeURIComponent(val.username)
  query.bio = encodeURIComponent(val.bio)
  query.twitter = encodeURIComponent(val.twitter)
  query.youtube = encodeURIComponent(val.youtube)

  console.log(query);
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)"
  });
  saveUserProfile(query)
    .then(res => {
      console.log(res);
      bannerFile.value = null;
      avatarFile.value = null;

      // UserState().SetUserInfo({ ...query, id: res })
      // LoginState().SetkeplrAddress(res)

      getUserProfile().then(async res1 => {
        console.log(res1);
        const Userinfo = res1;
        toDownloadFile(res1);


        console.log(Userinfo);

        loading.close();
      });
    })
    .catch(err => {
      console.error(err);
      utils.ElMessage("error", err.message);

      loading.close();
    });
};
const toUploadBoth = (fileAvatar: any, fileBanner: any) => {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)"
  });
  let tempAvatar = fileAvatar;
  let tempBanner = fileBanner;
  let query: any = { ...form };
  query.updatedAt = new Date().getTime();
  createFileDataModel(tempAvatar)
    .then(res => {
      console.log(res);
      query.avatar = res;
      createFileDataModel(tempBanner).then(res1 => {
        query.banner = res1;
        console.log(query);
        editProfile(query);
      });
    })
    .catch(err => {
      console.error(err);
      utils.ElMessage("error", err.message);

      // avatarFile.value = null
      loading.close();
    });
};
const toUploadBanner = (file: any) => {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)"
  });
  let temp = file;
  let query: any = { ...form };
  query.updatedAt = new Date().getTime();

  createFileDataModel(temp)
    .then(res => {
      console.log(res);
      query.banner = res;
      editProfile(query);
      // bannerFile.value = null
    })
    .catch(err => {
      console.error(err);
      utils.ElMessage("error", err.message);

      // avatarFile.value = null
      loading.close();
    });
};
const toUploadAvatar = (file: any) => {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)"
  });
  let temp = file;

  let query: any = { ...form };
  console.log(form.id);
  query.updatedAt = new Date().getTime();
  console.log(temp);

  createFileDataModel(temp)
    .then(res => {
      //   form.avatar = res;
      console.log(res);
      query.avatar = res;
      console.log(query);

      editProfile(query);
      // avatarFile.value = null
    })
    .catch(err => {
      console.error(err);
      utils.ElMessage("error", err.message);

      // avatarFile.value = null
      loading.close();
    });
};
</script>
<style scoped lang="scss">
#profile-content {
  :deep(.el-input) {
    background-color: #161616;
    // border: 1px solid #909791;
    border-radius: 8px;

    height: 36px;

    .el-input__wrapper {
      background: #161616;
      height: 36px;
      border-radius: 8px;
      box-shadow: 0 0 0;
      border: 1px solid #474747;
      box-sizing: border-box;
    }

    .el-input__wrapper:hover {
      border-color: #909791;
    }
  }

  :deep(.el-textarea) {
    background: #161616;
    // border: 1px solid #909791;
    border-radius: 8px;

    .el-textarea__inner {
      background: #161616;
      height: 66px;
      border-radius: 8px;
      box-shadow: 0 0 0;
      border: 1px solid #474747;
      max-height: 106px;
      min-height: 66px;
    }

    .el-textarea__inner:hover {
      border-color: #909791;
    }
  }

  :deep(.el-button) {
    width: 311px;
    height: 36px;
    background: #292929;
    border-radius: 80px;
    font-weight: 600;
    font-size: 16px;
    color: #21c143;
    border-color: #21c143;
  }
}

.content {
  display: flex;
  justify-content: space-between;
::v-deep(.el-input__inner){
  color: #fff;
}
::v-deep(.el-textarea__inner){
  color: #fff;

}
  .content-left {
    width: 320px;
    display: flex;
    flex-direction: column;

    p {
      margin-bottom: 20px;

      span {
        font-weight: 400;
        font-size: 14px;
        line-height: 21px;
        color: #fff;
        margin-bottom: 10px;
        display: inline-block;
      }
    }
  }

  .content-right {
    display: flex;
    flex-direction: column;

    width: 320px;

    .title {
      font-weight: 500;
      font-size: 14px;
      margin-bottom: 10px;
      text-transform: capitalize;
      display: inline-block;
    }

    .text {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: #909791;
      display: inline-block;
      width: 171px;
    }

    .avatar {
      display: flex;
      margin-bottom: 20px;

      >p {
        display: flex;
        flex-direction: column;

        div {
          margin-top: 10px;
        }
      }
      .showAvatar{
        width: 120px;
        height: 120px;
        overflow: hidden;
        border-radius: 120px;
        border: 1px dashed #474747;
        position: relative;
        img {
          width: 124px;
          height: 124px;
          position: absolute;
          top: -2px;
          left: -2px;
          // width: 126px;
          // height: 126px;

          // border-radius: 122px;
        }
      }
    }

    .ProfileImage {
      margin-bottom: 20px;

      p:nth-child(3) {
        width: 320px;
        height: 66px;
        border: 1px dashed #474747;
        border-radius: 10px;
        margin-top: 10px;
        background-position: center;
      }
    }
  }
}

.button {
  display: flex;
  justify-content: end;
  margin-top: 8px;
  cursor: default;

  :deep(.el-button) {
    width: 100px;
    height: 36px;
    background: #21c143;
    border-radius: 80px;
    font-weight: 600;
    font-size: 16px;
  }
}
</style>