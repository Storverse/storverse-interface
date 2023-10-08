import { getCurrentInstance } from "vue";
import Web3 from "web3";
// import local from "./Storage"
declare const window: any;
import { ElMessage } from "element-plus";
interface walletState {
  $getWalletAddress: any;
}

// const walle:any={

// }
export default <walletState>{
  
  $getWalletAddress: async () => {
    // localStorage.removeItem("disconnect");
    if (window.ethereum) {
      const res = await window.ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .catch((res: any) => {
          ElMessage.error("error" + res.message);
        });

      return res[0];
    }
    return false;
  },
};
