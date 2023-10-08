import { defineStore } from "pinia";
import local from "@/utils/local";
import accountApi from "@/api/AccountApi";
declare const window: any;
interface userinfoState {
  avatar?: string;
  backImg?: string;
  userName?: string;
  Email?: string;
  introduce?: string;
  followingMy?: string;
  myFollowing?: string;
  DID?: string;
  handleName?: string;
  address?: string;
  balance?: number | string;
  id?: string;
}
interface KeplrUser {
  bio: string;
  did: string;
  id: string;
  twitter: string;
  username: string;
  youtube: string;
  avatar: string;
  DownAvatar: string;
  followingCount: number;
  followercount: number;
  handleName: string;
  backImg: string;
  banner: string;
}
interface UserState {
  userinfo: userinfoState;
  KeplrUserInfo: KeplrUser;
  paymentReminder: Boolean;
  KeplrBalanceNumber: number | string;
  totalCount: number | string;
}

// AuthStore
export const UserState = defineStore({
  id: "UserState",
  state: (): UserState => ({
    userinfo: {
      avatar:
        "",
      backImg:
        "",
      userName: "",
      Email: "@handle name",
      introduce:
        "",
      followingMy: "2000",
      myFollowing: "300",
      DID: "did:sid:93eef2ac5d12f44658f7b51cd80a44018e29a9fda9cc24ede9ae8490637a053d",
      handleName: "",
      address:
        "93eef2ac5d12f44658f7b51cd80a44018e29a9fda9cc24ede9ae8490637a053d",
      balance: "3456.22",
    },
    KeplrUserInfo: local.GET("KeplrUser"),
    paymentReminder: local.GET("KeplrPaymentReminder"),
    KeplrBalanceNumber: 0,
    totalCount: 0,
  }),
  getters: {
    getUserInfo: (state) => {
      return state.KeplrUserInfo;
    },
    getKeplrPaymentReminder: (state) => {
      return state.paymentReminder;
    },
  },
  actions: {
    SetUserInfo(val: KeplrUser) {
      console.log(val);
      // val.handleName = val.id.substring(0, 13) + "...";
      val.handleName = val.id;

      local.SET("KeplrUser", val);
      this.KeplrUserInfo = val;
    },
    setUserBackImg(val: string) {
      this.KeplrUserInfo.backImg = val;
      local.SET("KeplrUser", this.KeplrUserInfo);
    },
    setUserAvatar(val: string) {
      this.KeplrUserInfo.DownAvatar = val;
      local.SET("KeplrUser", this.KeplrUserInfo);
    },
    removeLogin() {
      local.CLEAR();
      this.totalCount = 0;
      this.KeplrUserInfo = local.GET("KeplrUser");
    },
    setPaymentReminder(val: boolean) {
      this.paymentReminder = val;
      local.SET("KeplrPaymentReminder", val);
    },
    SetKeplrBalanceNumber() {
      if (window.keplr) {
        window.keplr
          .getKey("sao-20230629")
          .then(async (res: any) => {
            console.log(res);
            let balances: any = [];
            const data: any = await accountApi.getKeplrBalance(
              res.bech32Address
            );
            console.log(data.balances);
            
            // balances = data.balances.filter((item: any) => item.denom == "sao");
            // if (balances.length == 0 || balances[0].amount <= config.keplrBalance) {
            //   keplrWalletAddress.value = keplraddress
            //   loading.close();
            //   balanceStatus.value = true
            //   return false
            // }
            console.log(data.balances[0].amount);
            this.KeplrBalanceNumber = data.balances[0].amount;
          })
          .catch((res: any) => {
            return false;
          });
      }
    },
    setTotalCount(count: number | string) {
      this.totalCount = count;
    },
  },
});
