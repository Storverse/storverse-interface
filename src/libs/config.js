import contractAbi from "../assets/abi/Storverse.json"
export default {

	// localStorageUserKey: "sao_user",
	// localStorageSignKey: "sao_sign",
	// localStorageSignKeyList: "sao_sign_list",

	//Base API
	timeout: 100000,
	baseApi: "https://api-beta.sao.network/",
	contractAbi: contractAbi,
	nftTime: 30 * 24 * 60 * 60 * 1000,
	//Contract address
	contractAddress: "0x6BbbB966a251c24d4e45bF0264bCB939A93671b5",

	//network chainId
	networkChainIdList: ["0x38"],

	//network
	networkSaoUrl: "https://faucet.sao.network/",

	//default chainId
	defaultChainId: "0x38",

	//default keplrBalance
	keplrBalance: 10000,

	//default defaultTokeUrl
	defaultTokeUrl: "https://bscscan.com/token/",

	//default Provider: 
	defaultProvider: "https://bsc-dataseed2.binance.org",//"https://bsc-dataseed1.ninicoin.io"

	//default chainName
	defaultChainName: "Binance Smart Chain Mainnet",//Binance Smart Chain Mainnet

	//default Symbol
	defaultSymbol: "BNB",//"BNB"

	//default iconUrls
	defaultIconUrls: "chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/images/bnb.png",

	// default blockExplorerUrls
	defaultBlockExplorerUrls: 'https://bscscan.com/',//https://bscscan.com/
	//default subscriptionAddress
	subscriptionAddress: '0x8b97960f30C17DE9A97519790D60b00bA13115D8',
	//default subscriptionUrl
	defaultSubscriptionUrl: 'https://bscscan.com/address/',


}
