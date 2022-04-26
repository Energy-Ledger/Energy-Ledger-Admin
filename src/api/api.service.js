import axiosService from './axios.service';
import configService from '../services/config.service';
import responseService from "../services/response.service";

const apiBaseUrl = configService.apiBaseUrl();
const contractAddress = configService.tokenContractAddress();

const addBridgeRecord = async (data) => {
  const response = await axiosService.post(`create-bridge-record`, data);
    return response.data;
};

// Get Reward history

const getRewardHistory = async (_page, _perPage, _walletAddress, _search) => {

    try {

        const response = await axiosService.get(
            `${apiBaseUrl}transaction/reward-history?page=${_page}&per_page=${_perPage}&search=${_search}&wallet_address=${_walletAddress}&contract_address=${contractAddress}`,
        );

        if(response.status===200){
            return response.data.data;
                 
         }else{
             return responseService.buildFailure("something went wrong");
 
         }
            
    } catch (error) {
        // console.log(error)
        return responseService.buildFailure(error.message);
    }
};

// Get User Reward history

const getUserRewardHistory = async (_page, _perPage, _walletAddress, _search) => {

    try {

        const response = await axiosService.get(
            `${apiBaseUrl}transaction/user-reward-history?page=${_page}&per_page=${_perPage}&search=${_search}&wallet_address=${_walletAddress}&contract_address=${contractAddress}`,
        );
            console.log(response)
        if(response.status===200){
            return response.data.data;
                 
         }else{
             return responseService.buildFailure("something went wrong");
 
         }
            
    } catch (error) {
        // console.log(error)
        return responseService.buildFailure(error.message);
    }
};

// Get Percentage history

const getPercentageHistory = async (_page, _perPage, _search) => {

  try {

      const response = await axiosService.get(
          `${apiBaseUrl}transaction/percentage-history?page=${_page}&per_page=${_perPage}&search=${_search}&contract_address=${contractAddress}`,
      );

      if(response.status===200){
          return response.data.data;
               
       }else{
           return responseService.buildFailure("something went wrong");

       }
          
  } catch (error) {
      // console.log(error)
      return responseService.buildFailure(error.message);
  }
};

// Get create stake history

const getCreateStakeHistory = async (_page, _perPage,_search) => {

    try {
  
        const response = await axiosService.get(
            `${apiBaseUrl}transaction/create-stack-history?page=${_page}&per_page=${_perPage}&search=${_search}&contract_address=${contractAddress}`
        );
  
        if(response.status===200){
            return response.data.data;
                 
         }else{
             return responseService.buildFailure("something went wrong");
  
         }
            
    } catch (error) {
        // console.log(error)
        return responseService.buildFailure(error.message);
    }
  };

  // Get remove stake history

const getRemoveStakeHistory = async (_page, _perPage, _search) => {

    try {
  
        const response = await axiosService.get(
            `${apiBaseUrl}transaction/remove-stack-history?page=${_page}&per_page=${_perPage}&search=${_search}&contract_address=${contractAddress}`
        );
  
        if(response.status===200){
            return response.data.data;
                 
         }else{
             return responseService.buildFailure("something went wrong");
  
         }
            
    } catch (error) {
        // console.log(error)
        return responseService.buildFailure(error.message);
    }
  };

  // Get elx history

const getElxHistory = async (_page, _perPage, _walletAddress, _search, _type) => {

    try {
  
        const response = await axiosService.get(
            `transaction/elx-history?page=${_page}&per_page=${_perPage}&wallet_address=${_walletAddress}&contract_address=${contractAddress}&search=${_search}&type=${_type}`,
        );
  
        if(response.status===200){
            return response.data.data;
                 
         }else{
             return responseService.buildFailure("something went wrong");
  
         }
            
    } catch (error) {
        // console.log(error)
        return responseService.buildFailure(error.message);
    }
  };



const apiService ={  
    addBridgeRecord,
    getRewardHistory,
    getUserRewardHistory,
    getPercentageHistory,
    getCreateStakeHistory,
    getRemoveStakeHistory,
    getElxHistory
  };
  export default apiService;