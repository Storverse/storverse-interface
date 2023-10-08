import {
  CosmosDidStore,
  SaoKeplrAccountProvider,
  SidManager,
} from "@saonetwork/sid";
import { ModelManager } from "@saonetwork/model";

import { generateKeyPair } from "@libp2p/crypto/keys";
import { createFromPrivKey } from "@libp2p/peer-id-factory";
import { SidProvider } from "@saonetwork/sid/dist/sid_provider";
import { UserState } from "@/store/modules/users"
import local from "@/utils/local";
import config from "./config";
const paymentReminderStatus =local.GET('KeplrPaymentReminder')
declare const window: any;
export type ConnectWallet = {
  modelManager: any;
  provider: any;
  sid: string;
};

const CHAIN_ID = "sao-20230629";
const CHAIN_NAME = "sao-beta";
const API = "https://api-beta.sao.network";
const RPC = "https://rpc-beta.sao.network";
const NODE_API_URL = "https://gateway-beta.sao.network/rpc/v0";
const PLATFORM_ID = "storverse-sao";
const NODE = "https://api-beta.sao.network/SaoNetwork/sao/node/node";


export async function handleConnect() {
  const sm = await getSidManager()
    .then((res) => {
      console.log(res);
      
      return res;
    })
    .catch((error) => {
      console.log(error.message);
      return error.message;
    });


  if (typeof sm == "string") {
    if (
      sm.includes(
        "Could not broadcast Tx: Account does not exist on chain. Send some tokens there before trying to query sequence"
      )
    ) {
      return 1;
    } else {
      return false;
    }
  } else {
    const provider: any = await sm.getSidProvider();

    const modelManager = await getModelManager(provider.sid, sm);

    window.connectWallet = {
      modelManager,
      provider,
    };

    localStorage.setItem("modelManager", JSON.stringify(modelManager));
    localStorage.setItem("provider", JSON.stringify(provider));
    localStorage.setItem("sid", provider.sid);

    generateAndStoreToken(provider);

    return true;
  }
}


export function getConnectWallet(): ConnectWallet {
  let modelManager = localStorage.getItem("modelManager");
  if (modelManager) modelManager = JSON.parse(modelManager);
  let provider = localStorage.getItem("provider");
  if (provider) provider = JSON.parse(provider);
  let sid = localStorage.getItem("sid");

  if (!modelManager || !provider || !sid) {
    throw new Error("Keplr wallet not found.");
  }

  return {
    modelManager: window.connectWallet.modelManager,
    provider,
    sid,
  };
}

export async function generateAndStoreToken(sidProvider: SidProvider) {
  const clientProposal = await sidProvider.createJWS({
    payload: sidProvider.sid,
  });

  const tokenString = `${clientProposal.payload}:${clientProposal.signatures[0].protected}:${clientProposal.signatures[0].signature}`;
  console.log(tokenString);

  // Store the token in localStorage
  localStorage.setItem("token", tokenString);
}

export async function generatePeerInfo() {
  const key = await generateKeyPair("Ed25519");
  const peerInfo = await createFromPrivKey(key);

  localStorage.setItem("publicKey", toString(key.public.bytes));
  localStorage.setItem("privateKey", toString(key.bytes));
  return peerInfo;
}

export async function getMultiAddress() {
  const response = await fetch(NODE);
  const data = await response.json();
  let addresses = [];
  for (let node of data.node) {
    let peers = node.peer.split(",");
    for (let peer of peers) {
      if (peer.includes("/udp/") && peer.includes("8.222.225.178")) {
        addresses.push(peer);
        break;
      }
    }
    if (addresses.length >= 5) {
      break;
    }
  }
  return addresses;
}

const getSidManager = async () => {
  if (window.keplr) {
    await suggestSaoNetworkChain();
    await window.keplr.enable(CHAIN_ID);
    const offlineSigner = await window.getOfflineSigner(CHAIN_ID);
    const didStore = new CosmosDidStore(offlineSigner, API, RPC);
    const accountProvider = await SaoKeplrAccountProvider.new(
      window.keplr,
      CHAIN_ID
    );
    const manager = await SidManager.createManager(accountProvider, didStore);
    return manager;
  } else {
    throw new Error("Keplr wallet not found.");
  }
};

const suggestSaoNetworkChain = async () => {
  await window.keplr.experimentalSuggestChain({
    chainId: CHAIN_ID,
    chainName: CHAIN_NAME,
    rpc: RPC,
    rest: API,
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "sao",
      bech32PrefixAccPub: "saopub",
      bech32PrefixValAddr: "saovaloper",
      bech32PrefixValPub: "saovaloperpub",
      bech32PrefixConsAddr: "saovalcons",
      bech32PrefixConsPub: "saovalconspub"
    },
    currencies: [
      {
        coinDenom: "SAO Credit",
        coinMinimalDenom: "usct",
        coinDecimals: 6,
        coinGeckoId: "usct",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "SAO Credit",
        coinMinimalDenom: "usct",
        coinDecimals: 6,
        coinGeckoId: "usct",
        gasPriceStep: {
          low: 0.01,
          average: 0.025,
          high: 0.03,
        },
      },
    ],
    stakeCurrency: {
      coinDenom: "SAO Credit",
      coinMinimalDenom: "usct",
      coinDecimals: 6,
      coinGeckoId: "usct",
    },
  });
};

const getModelManager = async (ownerDid: string, sidManager: any) => {  
  await window.keplr.enable(CHAIN_ID);
  const offlineSigner = await window.getOfflineSigner(CHAIN_ID);
  const manager = new ModelManager(
    {
      ownerDid,
      chainApiUrl: API,
      chainApiToken: "TOKEN",
      chainRpcUrl: RPC,
      chainPrefix: "sao",
      signer: offlineSigner,
      nodeApiUrl: NODE_API_URL,
      nodeApiToken: "TOKEN",
      platformId: PLATFORM_ID,
    },
    sidManager,
    {
      duration: 90 * 60 * 60 * 24,
      replica: 2,
      timeout: 60,
      operation: 1,
      isPublish: paymentReminderStatus,
    }
  );
  await manager.init();

  try {
    await manager.loadModel("0");
  } catch {
    
    
    
    // return null
  }

  return manager;
};


