import { defineStore } from "pinia";
import local from "@/utils/local";
interface loginState {
  dialogVisible: boolean;
  type: number;
  keplrAddress: string;
  metamaskAddress: string;
  modelManager: any;
  walletNumber: number;
}
// AuthStore
export const LoginState = defineStore({
  id: "LoginState",
  state: (): loginState => ({
    dialogVisible: false,
    type: 1,
    keplrAddress: local.GET("keplrAddress"),
    metamaskAddress: local.GET("metamaskAddress"),
    modelManager: null,
    walletNumber: 0,
  }),
  getters: {
    
  },
  actions: {
    getstate: () => {
      console.log(this);
    },
    setModelManager(val: any) {
      this.modelManager = val;
    },
    SetkeplrAddress(val: any) {
      local.SET("keplrAddress", val.did);
      this.keplrAddress = val.did;
    },
    removeLogin() {
      local.CLEAR();
      this.keplrAddress = "";
      this.metamaskAddress = "";
    },
  },
});
