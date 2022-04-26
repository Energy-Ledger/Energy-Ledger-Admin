import axiosService from './axios.service';
import configService from "../services/config.service";
import responseService from "../services/response.service";

const contractAddress = configService.tokenContractAddress();
// Get Trending creators

const getUsersList = async (_page, _perPage, _search, _role) => {

    try {

        const response = await axiosService.get(
            `users?page=${_page}&per_page=${_perPage}&role=${_role}&search=${_search}&contract_address=${contractAddress}`        );

        if(response.status===200){
            return response.data.data;
                 
         }else{
             return responseService.buildFailure("something went wrong");
 
         }
            
    } catch (error) {
        console.log(error)
        return responseService.buildFailure(error.message);
    }
};
const getBatches = async (_page, _perPage, _search) => {
    try {

        const response = await axiosService.get(
            `batches?page=${_page}&per_page=${_perPage}&search=${_search}&contract_address=${contractAddress}`
        );
        if(response.status===200){
           return response.data.data
                
        }else{
            return responseService.buildFailure("something went wrong");

        }

            
    } catch (error) {
        console.log(error)
        return responseService.buildFailure(error.message);
    }
};

const updateUser = async (_blockNumber) => {
    try {

        const response = await axiosService.get(
            `cron/update-user?block_number=${_blockNumber}`
        );
        if(response.status===200){
           return responseService.buildSuccess("User updated successfully");
                
        }else{
            return responseService.buildFailure("something went wrong");

        }

            
    } catch (error) {
        console.log(error)
        return responseService.buildFailure(error.message);
    }
};

const createUser = async (_blockNumber) => {
    try {

        const response = await axiosService.get(
            `cron/create-user?block_number=${_blockNumber}`
        );
        if(response.status===200){
           return responseService.buildSuccess("User created successfully");
                
        }else{
            return responseService.buildFailure("something went wrong");

        }

            
    } catch (error) {
        console.log(error)
        return responseService.buildFailure(error.message);
    }
};

const insertBatch = async (_blockNumber) => {
    try {

        const response = await axiosService.get(
            `cron/create-batch?block_number=${_blockNumber}`
        );
        if(response.status===200){
           return responseService.buildSuccess("Batch created successfully");
                
        }else{
            return responseService.buildFailure("something went wrong");

        }

            
    } catch (error) {
        console.log(error)
        return responseService.buildFailure(error.message);
    }
};

const UserApiService = {
  getUsersList,
  getBatches,
  updateUser,
  createUser,
  insertBatch
};

export default UserApiService;