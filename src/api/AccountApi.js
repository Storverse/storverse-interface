import http from '../libs/http'

/**
 * Market api
 */


export default {
    
    getAccountList: (query) => {
        return http.get(`/SaoNetwork/sao/did/account_list/${query}:`, {})
    },
    
    getAccountId: (query) => {

        return http.get(`/SaoNetwork/sao/did/account_id/${query}:`, {})
    },
    getKeplrBalance: (query) => {
        return http.get(`/cosmos/bank/v1beta1/balances/${query}:`, {})
    }

}
