import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import alertService from "../services/alert.service";
import blockchainService from "../services/blockchain.service";
import { login } from "../actions/auth";
import Spinner from "../components/common/Spinner";
import userService from "../services/user.service";
import { useSelector } from "react-redux";
import configService from "../services/config.service";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
      return new Promise(function(resolve,reject){
        Promise.all([ blockchainService.getBlockchainProvider(true),  blockchainService.getBlockchainProvider()  , blockchainService.initContractInstance()]).then(function(data){
          resolve(data);
        });
      });

      // await loadBlockchainInstance();
      // await getWalletDetails();

  }, []);

 

  // Get user details
  const getUserDetail = async (_walletAddress) => {
    try {
      let response = await userService.getUserDetails(_walletAddress);
      if(response.status === "failure"){
        alertService.showError(response.message);
      }else{
        return response.data;
      }
    } catch (error) {
      alertService.showError(error.message);
    }
  };

  const connectWallet = async () => {
    setLoading(true);
    try {
      const _walletResp = await blockchainService.connectWallet();
      if (_walletResp.status === "failure") {
        setLoading(false);
        alertService.showError(_walletResp.message);
        return false;
      }
      new Promise(function(resolve,reject){
        Promise.all([blockchainService.initElxContractInstance()]).then(function(data){
          resolve(data);
      });
      });
     const wallet_address = _walletResp.data.walletAddress;
     const userDetails = await getUserDetail(_walletResp.data.walletAddress);

      let _formData = {
        wallet_address: wallet_address,
        name: userDetails.name,
        role: userDetails.role,
        profileHash: userDetails.profileHash,
        profileHashUrl: configService.createIpfsUrl(userDetails.profileHash),
      };

      dispatch(login(_formData))
        .then(async (response) => {
            setLoading(false);
          if (_walletResp.status === "success") {
            let walletAddress =  await userService.getAdminWalletAddress();
            if(walletAddress.status !=='success')
            {
                alertService.showError(walletAddress.message);
                return
            }
            let checkAllowance=await userService.getAllowanceForAll(walletAddress.data);
            // console.log("checkAllowance" , checkAllowance);
              
            alertService.showSuccess("You have successfully logged in");
            navigate("/admin/dashboard");

          } else {
            alertService.showError(_walletResp.message);
          }
        })
        .catch(() => {
          alertService.showError(_walletResp.message);
            setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      alertService.showError(error.message);
    }
  };

  // const getWalletDetails = async () => {
  //   try {
  //     //   setLoading(true);
  //     let response = await blockchainService.getWalletDetails();
  //     if (response.status === "failure") {
  //       let _error = response.data;
  //       if (
  //         _error != null &&
  //         _error?.code === "UNSUPPORTED_OPERATION" &&
  //         _error?.operation === "getAddress"
  //       ) {
  //         dispatch(logout());
  //         navigate("/");

  //         return false;
  //       } else if (_error != null && _error?.code === "SIGNER_UNAVAILABLE") {
  //         //   setLoading(false);
  //         return false;
  //       } else {
  //         alertService.showError(response.message);
  //         //   setLoading(false);
  //         return false;
  //       }
  //     }
  //   } catch (error) {
  //     //   setLoading(false);
  //     alertService.showError(error.message);
  //   }
  // };


  return (
    <div className="relative max-w-full text-center mx-auto h-screen flex items-center justify-center">
      {/*content*/}
      <div className="login-box mx-auto justify-center items-center border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none lg:p-10 p-4">
      {(loading === true) ? <Spinner /> : ''}
        
        <img className="mx-auto mb-3" src="../../ver-logo.svg" alt="" />
        <h3 className="text-xl text-coalblack font-semibold leading-normal mb-2">
          Welcome
        </h3>
        <p className="text-sm font-normal text-coalblack">
          Connect metamask for wallet connections.
        </p>
        <button
          onClick={connectWallet}
          type="button"
          className="sm:w-3/4 text-center mx-auto items-center justify-center inline-flex text-sm font-semibold w-full mt-6 px-4 py-2 bg-tranperant text-indigo-500 rounded-md border border-indigo-600 outline-none shadow-lg"
        >
          <img className="mr-2" src="../../images/metamask.svg" alt="" />
          Login With MetaMask
        </button>
      </div>
    </div>
  );
};
export default Login;
