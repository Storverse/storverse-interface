import { handleConnect, getConnectWallet } from "@/libs/keplr";
import {
  initService as initFileService,
  uploadFileDataModel,
  createFileDataModel,
  downloadFile,
} from "@/libs/file";
import accountApi from "@/api/AccountApi";
import { getUserProfile, initService, saveUserProfile } from "@/libs/user";
import { initService as initNotificationService } from "@/libs/notification";
import { initService as initVerseCommentService } from "@/libs/verseComment";
import { initService as initVerseService } from "@/libs/verse";
import { initService as initfollowService } from "@/libs/followApi";
import { initService as verseCommentService } from "@/libs/verseComment";
import local from "@/utils/local";
import { reactive, computed } from "vue";
import { ElLoading } from "element-plus";
import pinia from "@/store/index";
import { LoginState } from "@/store/modules/login";
const loginState = LoginState(pinia);

export const reHandle = async () => {
  const checksid = local.GET("sid");
  console.log(checksid);
  let connectWallet = reactive({
    modelManager: {},
    provider: {},
    sid: "",
  });
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  setTimeout(() => {
    loading.close();
  }, 10000);

  if (checksid) {
    await handleConnect();
    connectWallet = getConnectWallet();
    const provider = local.GET("provider");
    initService(connectWallet);
    initFileService(connectWallet);
    initNotificationService(connectWallet);
    initVerseService(connectWallet);
    initfollowService(connectWallet);
    initVerseCommentService(connectWallet);
    verseCommentService(connectWallet);
    loginState.walletNumber++;

    if (loginState.keplrAddress) {
      init();
    }
    loading.close();

    async function init() {
      const data: any = await accountApi.getAccountList(provider.sid);
      const accountList = data.accountList.accountDids;
      accountList.forEach((item: object) => {
        accountApi.getAccountId(item).then((res: any) => {
          res.accountId.type = res.accountId.accountId.split(":")[0];
          res.accountId.address = res.accountId.accountId.split(":")[2];
          if (res.accountId.type == "eip155") {
            local.SET("metamaskAddress", res.accountId.accountId.split(":")[2]);
          }
        });
      });
    }
    // const init = async () =>
  } else {
    loading.close();
    return;
  }
};
