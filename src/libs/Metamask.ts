import {
  CosmosDidStore,
  SaoKeplrAccountProvider,
  EthAccountProvider,
  SidManager,
} from "@saonetwork/sid";
// import { ElMessage } from "element-plus";
import utils from "@/utils/utils";
declare const window: any;
let sidManagers: any = null;
let sid: any = "";
import { handleConnect, getConnectWallet } from "@/libs/keplr";
// const did = {
//   chain: "sao-20230629",
//   address: "sao19rzd68zll7094gevgnpug2l2elrpssytryc27g",
//   accountName: "yhf",
//   accountId: "cosmos:sao-20230629:sao19rzd68zll7094gevgnpug2l2elrpssytryc27g",
//   id: "did:sid:7cc6a7b96e3b3664f11b39c20e4cceafaf8467536e91359c7d4cef8687dcfe90",
//   accountList: [
//     {
//       accountDid: "did:key:z6MkkBCLFfCcJZ4oHSXXDwkdyhzDtRqLjEokj4gkzH7FigJs",
//       accountId:
//         "cosmos:sao-20230629:sao19rzd68zll7094gevgnpug2l2elrpssytryc27g",
//       creator: "",
//     },
//     {
//       accountDid: "did:key:z6MkmYj4CvmVzEYt7t3hjuPJcWpUFsyW8jUHdAQDTekyq3MX",
//       accountId: "eip155:1:0x8a986bbd7f649d9d1804c2d6b941137358c8c4e4",
//       creator: "",
//     },
//   ],
//   paymentAddress: "sao19rzd68zll7094gevgnpug2l2elrpssytryc27g",
// };
const selected = {
  chain_name: "sao-20230629",
  api: ["https://api-beta.sao.network"],
  rpc: ["https://rpc-beta.sao.network"],
  node: ["https://gataway-testnet-node0.sao.network"],
  sdk_version: "0.46.2",
  addr_prefix: "sao",
  coin_type: 118,
  min_tx_fee: "0",
  logo: "/logos/saonetwork.png",
  assets: [
    {
      symbol: "SAO",
      base: "sao",
      exponent: 6,
      coingecko_id: "sao",
      logo: "/logos/saonetwork.png",
    },
  ],
};

export async function handleBindMetamask(did: any, callback: any) {
  try {
    if (window.ethereum) {
      const provider = await EthAccountProvider.new(window.ethereum);
      const accountId = await provider.accountId();
      if (sidManagers === null || sid === "") {
        await getSid(did);
      }

      const params = await sidManagers.setAccountProvider(provider, false, sid);

      sidManagers
        .bind(params)
        .then((res: any) => {
          utils.ElMessage("success");
          callback(true);
          return true;
        })
        .catch((res: any) => {
          console.log(res);
          if (
            res.message ==
            "Cannot read properties of undefined (reading 'rootDocId')"
          ) {
            utils.ElMessage(
              "error",
              "The address is already bound, please try other address."
            );
          } else {
            utils.ElMessage("error", res.message);
          }

          callback(false, res);
          return false;
        });
    }
  } catch (err: any) {
    if (err.code) {
      utils.ElMessage("error", err.message);
    } else {
      utils.ElMessage("error", err);
    }

    callback(false);
    return;
  }
}
export async function getSid(did: any) {
  const chainId = "sao-20230629"; //await this.$http.getLatestBlock().then(ret => ret.block.header.chain_id)
  if (window.keplr) {
    await window.keplr.enable(chainId);

    const offlineSigner = await window.getOfflineSigner(chainId);
    const accounts = await offlineSigner.getAccounts();

    // if (did.paymentAddress !== undefined) {
    //     let isFound = false
    //     for (let i = 0; i < accounts.length; i += 1) {
    //         if (accounts[i].address === did.paymentAddress) {
    //             isFound = true
    //         }
    //     }
    //     console.log(accounts)
    //     // if (!isFound) {
    //     //     this.$toast({
    //     //         component: ToastificationContent,
    //     //         props: {
    //     //             title: `Please switch to the account ${did.accountName} in Keplr.`,
    //     //             icon: 'BellIcon',
    //     //             variant: 'danger',
    //     //         },
    //     //     })
    //     //     this.disabled = false
    //     //     return 0
    //     // }
    // }

    const didStore = new CosmosDidStore(
      offlineSigner,
      Array.isArray(selected.api) ? selected.api[0] : selected.api,
      Array.isArray(selected.rpc) ? selected.rpc[0] : selected.rpc
    );
    const accountProvider = await SaoKeplrAccountProvider.new(
      window.keplr,
      did.chain
    );

    sidManagers = await SidManager.createManager(
      accountProvider,
      didStore,
      false
    );

    const provider = await sidManagers.getSidProvider();
    sid = provider.sid;
  }

  return 0;
}
export async function Unbind(did: any, accountId: string, callback: any) {
  if (sidManagers === null || sid === "") {
    await getSid(did);
  }

  sidManagers
    .unbind(accountId)
    .then((res: any) => {
      utils.ElMessage("success");

      callback(true);
      return true;
    })
    .catch((res: any) => {
      console.log(res, "===");
      utils.ElMessage("error", res.message);
      callback(false);
      return false;
    });
}
