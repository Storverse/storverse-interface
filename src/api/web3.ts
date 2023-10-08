import Web3 from "web3";

import config from "@/libs/config";
import utils from "@/utils/utils";
declare const window: any;

export async function awakenWallet() {
  if (window.ethereum) {
    return await window.ethereum.enable();
  } else {
    return null;
  }
}

export async function mint(
  dataId: string,
  amount: string | number,
  itemType: number,
  duration: number,
  fromAddress: string
) {
  console.log(dataId, amount, itemType, duration, fromAddress);

  const contracts: any = await contract();
  let gasAmount = await getGasAmount(
    fromAddress,
    dataId,
    amount.toString(),
    itemType,
    duration,
    contracts
  );
  console.log(gasAmount);
  const web3 = new Web3(window.ethereum);
  let gasPrice = await web3.eth.getGasPrice();
  console.log(gasPrice);

  gasAmount = BigInt(Math.round(Number(gasAmount) * 1.5)).toString();
  console.log(gasAmount);

  return contracts.methods
    .mint(dataId, amount.toString(), itemType, duration)
    .send({ from: fromAddress, gas: gasAmount, gasPrice: gasPrice });
}

const getGasAmount = async (
  fromAddress: string,
  dataId: string,
  amount: string | number,
  itemType: number,
  duration: number,
  contract: any
) => {
  const gasAmount = await contract.methods
    .mint(dataId, amount.toString(), itemType, duration)
    .estimateGas({ from: fromAddress });
  return gasAmount;
};

export async function payBuy(
  tokenId: string,
  amount: string,
  fromAddress: string,
  itemType: string | number
) {
  console.log(
    Number(amount) * Math.pow(10, -18),
    tokenId,
    fromAddress,
    itemType
  );
  const contracts: any = await contract();
  console.log(contracts);

  let gasAmount = await getGasAmountForBuy(
    fromAddress,
    tokenId,
    contracts,
    amount,
    itemType
  );
  console.log(gasAmount);
  const web3 = new Web3(window.ethereum);
  let gasPrice = await web3.eth.getGasPrice();
  console.log(gasPrice);

  gasAmount = BigInt(Math.round(Number(gasAmount) * 1.5)).toString();
  console.log(gasAmount);

  return await contracts.methods.buy(itemType, tokenId).send({
    from: fromAddress,
    value: amount,
    gas: gasAmount,
    gasPrice: gasPrice,
  });
}

const getGasAmountForBuy = async (
  fromAddress: string,
  tokenId: string,
  contract: any,
  amount: string,
  itemType: string | number
) => {
  const gasAmount = await contract.methods
    .buy(itemType, tokenId)
    .estimateGas({ from: fromAddress, value: amount });
  return gasAmount;
};

/**
 */
export async function finish(orderId: string, fromAddress: string) {
  return await contract().methods.finish(orderId).send({ from: fromAddress });
}

export async function withdraw(fromAddress: string) {
  const contracts: any = await contract();

  let gasAmount = await getGasAmountForWithdraw(fromAddress, contracts);
  console.log(gasAmount);
  const web3 = new Web3(window.ethereum);
  let gasPrice = await web3.eth.getGasPrice();
  console.log(gasPrice);

  gasAmount = BigInt(Math.round(Number(gasAmount) * 1.5)).toString();
  console.log(gasAmount);

  return await contracts.methods.withdraw().send({
    from: fromAddress,
    gas: gasAmount,
    gasPrice: gasPrice,
  });
}

const getGasAmountForWithdraw = async (fromAddress: string, contract: any) => {
  const gasAmount = await contract.methods
    .withdraw()
    .estimateGas({ from: fromAddress });
  return gasAmount;
};

/**
 */
export async function getBalance(fromAddress: string) {
  const contracts: any = await contract();
  // const selectedAddress = window.ethereum.selectedAddress;
  // console.log(selectedAddress);
  return contracts.methods.getBalance().call({ from: fromAddress });
}

export async function changePrice(
  tokenId: string,
  newPrice: string,
  fromAddress: string
) {
  console.log(tokenId, newPrice, fromAddress);
  const contracts: any = await contract();

  const gasAmount = await contracts.methods
    .changePrice(tokenId, newPrice)
    .estimateGas({ from: fromAddress });

  const web3 = new Web3(window.ethereum);
  let gasPrice = await web3.eth.getGasPrice();

  // Optionally increasing the estimated gas amount by 50% for safety
  const safeGasAmount = BigInt(Math.round(Number(gasAmount) * 1.5)).toString();

  return await contracts.methods.changePrice(tokenId, newPrice).send({
    from: fromAddress,
    gas: safeGasAmount,
    gasPrice: gasPrice,
  });
}

const contract = () => {
  const contractAbis: any = config.contractAbi;
  if (window.web3) {
    let web3 = new Web3(window.ethereum);
    return new web3.eth.Contract(contractAbis, config.contractAddress);
  }
};
export async function getWalletAddress() {
  if (window.ethereum) {
    const res = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(res);
    return res[0];
  }
  return false;
}
export async function handleBindMetamask(did: any, callback: any) {
  if (window.ethereum) {
  }
}
export async function getChainId() {
  if (window.ethereum) {
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    return chainId;
  }
  return false;
}

export async function changeChainId() {
  if (window.ethereum) {
    return window.ethereum
      .request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: config.defaultChainId }],
      })
      .then((res: any) => {
        // callBack(res)
        console.log(res, "pp");
        return res;
      })
      .catch((res: any) => {
        console.log(res, "9999");
        return res;
      });
  }
  return false;
}
export async function addNetwork() {
  if (window.ethereum) {
    return window.ethereum
      .request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: config.defaultChainId,
            chainName: config.defaultChainName,
            rpcUrls: [config.defaultProvider],
            iconUrls: [config.defaultIconUrls],
            blockExplorerUrls: [config.defaultBlockExplorerUrls],
            nativeCurrency: {
              name: config.defaultSymbol,
              symbol: config.defaultSymbol,
              decimals: 18,
            },
          },
        ],
      })
      .then((res: any) => {
        console.log(res);
        return res;
      })
      .catch((res: any) => {
        console.log(res);
        return res;
      });
  }
  return false;
}
export async function getBalances(walletAddress: string) {
  if (window.web3) {
    let web3 = new Web3(window.ethereum);
    // const contracts: any = await contract();
    // console.log(contracts);
    return await web3.eth.getBalance(walletAddress);
  }
}
