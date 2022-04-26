import axiosService from './axios.service';
import responseService from "../services/response.service";



const insertCreateStake = async (_blockNumber) => {
    try {

        const response = await axiosService.get(
            `cron/insert-create-stake-history?block_number=${_blockNumber}`
        );
        if(response.status===200){
           return responseService.buildSuccess("ELX created successfully");
                
        }else{
            return responseService.buildFailure("something went wrong");

        }

            
    } catch (error) {
        console.log(error)
        return responseService.buildFailure(error.message);
    }
};
const insertRemoveStake = async (_blockNumber) => {
    try {

        const response = await axiosService.get(
            `cron/insert-remove-stake-history?block_number=${_blockNumber}`
        );
        if(response.status===200){
           return responseService.buildSuccess("Elx removed successfully");
                
        }else{
            return responseService.buildFailure("something went wrong");

        }

            
    } catch (error) {
        console.log(error)
        return responseService.buildFailure(error.message);
    }
};
const insertRewardHistory = async (_blockNumber) => {
    try {

        const response = await axiosService.get(
            `cron/insert-reward-history?block_number=${_blockNumber}`
        );
        if(response.status===200){
           return responseService.buildSuccess("reward record inserted successfully");
                
        }else{
            return responseService.buildFailure("something went wrong");

        }

            
    } catch (error) {
        console.log(error)
        return responseService.buildFailure(error.message);
    }
};
const insertPercentageHistory = async (_blockNumber) => {
    try {

        const response = await axiosService.get(
            `cron/insert-percentage-history?block_number=${_blockNumber}`
        );
        if(response.status===200){
           return responseService.buildSuccess("Percentage update successfully");
                
        }else{
            return responseService.buildFailure("something went wrong");

        }

            
    } catch (error) {
        console.log(error)
        return responseService.buildFailure(error.message);
    }
};

const transactionApiService = {
    insertCreateStake,
    insertRemoveStake,
    insertRewardHistory,
    insertPercentageHistory
};

export default transactionApiService;