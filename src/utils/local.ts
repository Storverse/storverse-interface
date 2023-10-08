export default{
    SET(key:string,value:any){
        localStorage.setItem(key,JSON.stringify(value))
    },
    GET(key:string){
        let value = localStorage.getItem(key)
        if(value){
            try{
                return JSON.parse(value)
            }
            catch(e){
                return value
            }
        }
        return ''
    },
    REMOVE(key:string){
        localStorage.removeItem(key)
    },
    CLEAR(){
        localStorage.clear()
    },
//  suggestSaoNetworkChain  () {
//          window.keplr.experimentalSuggestChain({
//             chainId: 1,
//             chainName: 2,
//             rpc: 3,
//             rest: 4,
//             bip44: {
//                 coinType: 118,
//             },
//             bech32Config: {
//                 bech32PrefixAccAddr: 'sao',
//                 bech32PrefixAccPub: 'saopub',
//                 bech32PrefixValAddr: 'saovaloper',
//                 bech32PrefixValPub: 'saovaloperpub',
//                 bech32PrefixConsAddr: 'saovalcons',
//                 bech32PrefixConsPub: 'saovalconspub',
//             },
//             currencies: [
//                 {
//                     coinDenom: 'sao',
//                     coinMinimalDenom: 'sao',
//                     coinDecimals: 0,
//                     coinGeckoId: 'sao',
//                 },
//             ],
//             feeCurrencies: [
//                 {
//                     coinDenom: 'sao',
//                     coinMinimalDenom: 'sao',
//                     coinDecimals: 0,
//                     coinGeckoId: 'sao',
//                     gasPriceStep: {
//                         low: 0.01,
//                         average: 0.025,
//                         high: 0.04,
//                     },
//                 },
//             ],
//             stakeCurrency: {
//                 coinDenom: 'sao',
//                 coinMinimalDenom: 'sao',
//                 coinDecimals: 0,
//                 coinGeckoId: 'sao',
//             }
//         });
//     }
}