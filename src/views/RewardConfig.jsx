import React, { useState, useEffect } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";

import Spinner from "../components/common/Spinner";
import TextError from "../components/common/TextError";
import elxService from "../services/elx.service";
import alertService from '../services/alert.service';
import configService from "../services/config.service";
import stakingService from "../services/staking.service";
import blockchainService from "../services/blockchain.service";
import userService from "../services/user.service";

import { setMessage } from "../actions/message";
import { useDispatch } from "react-redux";
import transactionApiService from "../api/transactionApi.service";

const RewardConfig = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
 

 
  const [exchangeRate, setExchangeRate] = useState(0);
  const [rewardPercent, setRewardPercent] = useState(0);
  const [tokenAddress, setTokenAddress] = useState("");
  const[totalStakeAmt,setTotalStakeAmt] =  useState("")
  const [tokenDecimal, setTokenDecimal] = useState("");
  const [bnbBalance, setBnbBalance] = useState("");
  const [rewardPercentDivisor, setRewardPercentDivisor] = useState(100);
  
  useEffect(() => {
    (async () => { 
      await getdecimalValue();  
      await getRewardPercentDivisor();  
      await getTokenAddress();
      // await getStakingAddress();
      await setStake();
      await getRewardPercent();
      await getBnbBalance();
    })();
  }, [rewardPercentDivisor]);



  const getdecimalValue = async () => {
    try{
      setLoading(true);
      let _exchangeRateDecimal = await elxService.getdecimalValue();
      if (_exchangeRateDecimal.status === "failure") {
        setLoading(false);
        alertService.showError(_exchangeRateDecimal.message);
        return false;
      } else {
      
      let _decimalValue = _exchangeRateDecimal.data._decimalValue;

      setTokenDecimal(_decimalValue);

      await getExchangeRate(_decimalValue); 

      setLoading(false)
      }
    } catch (error) {
      setLoading(false);
      alertService.showError(error.message);
    }
  }

   /* Get exchange rate */

  const getExchangeRate = async (_decimalValue) => {
    setLoading(true);
    try {
      let _exchangeRate = await elxService.getExchangeRate();
    _exchangeRate = (Number(_exchangeRate.data._exchangeRate.toBigInt()))/Math.pow(10,_decimalValue);
    
    let _finalExchangeRate = configService.scientificToDecimal(_exchangeRate);

    setExchangeRate(_finalExchangeRate);

    setLoading(false);

    } catch (error) {
    setLoading(false);
    alertService.showError(error.message);
    }
  };

  /* Get reward percent divisor*/

  const getRewardPercentDivisor = async () => {
    setLoading(true);
    try {
      let _response = await stakingService.rewardPercentDivisor();
      if (_response.status === "failure"){
        alertService.showError(_response.message);
      }
      setRewardPercentDivisor(_response.data);

      setLoading(false);

    } catch (error) {
      setLoading(false);
      alertService.showError(error.message);
    }
  };

  /* Get reward percent */

  const getRewardPercent = async () => {
    setLoading(true);
    try {
      
      let _response = await stakingService.rewardPercent();
      if (_response.status === "failure") {
        alertService.showError(_response.message);
      }
      
      setRewardPercent(_response.data / rewardPercentDivisor);
      

      setLoading(false);

    } catch (error) {
    setLoading(false);
    alertService.showError(error.message);
    }
  };

  const getTokenAddress = async () => {
    setLoading(true);
    try {
      
      let _response = await blockchainService.getTokenAddress();

      if (_response.status === "failure") {
        alertService.showError(_response.message);
      }
      
      setTokenAddress(_response.data);

      setLoading(false);

    } catch (error) {
    setLoading(false);
    alertService.showError(error.message);
    }
  };

  // const getStakingAddress = async () => {
  //   setLoading(true);
  //   try {
      
  //     let _response = await blockchainService.getStakingAddress();

  //     if (_response.status === "failure") {
  //       alertService.showError(_response.message);
  //     }
      
  //     setStakingAddress(_response.data);
      
  //     setLoading(false);

  //   } catch (error) {
  //   setLoading(false);
  //   alertService.showError(error.message);
  //   }
  // };
  // get contract address BNB balance
  const getBnbBalance = async () => {
    setLoading(true);
    try {
      
      let _response = await blockchainService.getContractBnbBalance();
      // console.log("contract balance" , _response.data._bnbBalance);

      if (_response.status === "failure") {
        alertService.showError(_response.message);
      }
      
      setBnbBalance(_response.data._bnbBalance);
      
      setLoading(false);

    } catch (error) {
    setLoading(false);
    alertService.showError(error.message);
    }
  };

  const setStake = async () =>
{
    try {
      setLoading(true);
          
       let result= await stakingService.stakeOf();
       setTotalStakeAmt(result.totalStakeAmt);
       setLoading(false);
       if(result.status==='failure'){
        setLoading(false)
          alertService.showError(result.message);
        }
      else{

        //setStake()
     }
}
catch(error){

  alertService.showError(error.message);

}
}


const distributeReward = async () =>
{

    try {
        setLoading(true);
        let walletAddress =  await userService.getAdminWalletAddress();
        if(walletAddress.status !=='success')
        {
            alertService.showError(walletAddress.message);
            return
        }
        let checkAllowance=await userService.getAllowanceForAll(walletAddress.data);
        if(checkAllowance.status==='success'){
       let result= await stakingService.distributeRewards( );
       if(result.status==='failure'){
          setLoading(false)
          alertService.showError(result.message);
        }
      else{
      
          setLoading(false);
         
          let _txHash=result.data.hash;

          let pendingMsg={
            status: true,
            type: "pending",
            message: "Your transaction is in process",
            data: _txHash,
            showOkButton: false,
          }
          dispatch(setMessage(pendingMsg));   
          setLoading(false)


          await result.data.wait();
          const publicProvider=await blockchainService.getPublicProvider();
          const txInfo = await publicProvider.getTransaction(_txHash);
          let insertRewardHistory=await transactionApiService.insertRewardHistory(txInfo.blockNumber);
          // console.log("insertRewardHistory" , insertRewardHistory);
                 let completeMsg={
            status: true,
            type: "success",
            message: "Reward distributed successfully",
            data: _txHash,
            showOkButton: true,
          }
          dispatch(setMessage(completeMsg));

         
          //navigate("/admin/elx-stalking");
          alertService.showSuccess(result.message);
   
     }
    }else {
      setLoading(false)
      alertService.showError(checkAllowance.message);
  } 
}
catch(error){

  alertService.showError(error.message);

}

}
const withdrawBnb = async () =>
{

    try {
        setLoading(true);
        let walletAddress =  await userService.getAdminWalletAddress();
        if(walletAddress.status !=='success')
        {
            alertService.showError(walletAddress.message);
            return
        }
        let checkAllowance=await userService.getAllowanceForAll(walletAddress.data);
        if(checkAllowance.status==='success'){
       let result= await elxService.withdrawContractBnb();
       if(result.status==='failure'){
          setLoading(false)
          alertService.showError(result.message);
        }
      else{
          let _txHash=result.data.hash;
          setLoading(false);
         
          let pendingMsg={
            status: true,
            type: "pending",
            message: "Your transaction is in process",
            data: _txHash,
            showOkButton: false,
          }
          dispatch(setMessage(pendingMsg));   
          setLoading(false)


          await result.data.wait();

          
          let completeMsg={
            status: true,
            type: "success",
            message: "Bnb amount withdraw successfully",
            data: _txHash,
            showOkButton: true,
          }
          dispatch(setMessage(completeMsg));

          await getBnbBalance();
          //navigate("/admin/elx-stalking");
          alertService.showSuccess(result.message);
   
     }
    }else {
      setLoading(false)
      alertService.showError(checkAllowance.message);
  } 
}
catch(error){

  alertService.showError(error.message);

}

}


  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 justify-center items-center">
      {loading === true ? <Spinner /> : ""}
      <TokenAddressConfig
        setLoading={setLoading}
        tokenDecimal={tokenDecimal}
        tokenAddress={tokenAddress}
        getTokenAddress={getTokenAddress}
        dispatch={dispatch}
      />

      {/* <StakingAddressConfig
        setLoading={setLoading}
        tokenDecimal={tokenDecimal}
        stakingAddress={stakingAddress}
        getStakingAddress={getStakingAddress}
        dispatch={dispatch}
      /> */}

      <ExchangeRateConfig
        setLoading={setLoading}
        tokenDecimal={tokenDecimal}
        exchangeRate={exchangeRate}
        dispatch={dispatch}
      />

      <RewardPercentConfig
        setLoading={setLoading}
        rewardPercent={rewardPercent}
        rewardPercentDivisor={rewardPercentDivisor}
        getRewardPercentDivisor={getRewardPercentDivisor}
        dispatch={dispatch}
      />

      <AuthorizationConfig
        setLoading={setLoading}
        dispatch={dispatch}
      />

    <DistributeReward
        setLoading={setLoading}
        distributeReward={distributeReward}
        totalStakeAmt={totalStakeAmt}
        dispatch={dispatch}
      />
    <WithdrawBnb
        withdrawBnb={withdrawBnb}
        bnbBalance={bnbBalance}
      />
    </div>
  );
};

const TokenAddressConfig = ({
  setLoading,
  tokenAddress,
  getTokenAddress,
  dispatch
}) => {
  const validationSchema = Yup.object().shape({
    tokenAddress: Yup.string().required("Token address is required"),
  });

  const initialValues = {
    tokenAddress: tokenAddress ? tokenAddress : "",
  };

  const setTokenAddress = async (_formInput) => {
    setLoading(true);

    try {
      let _tokenAddress = _formInput.tokenAddress;

      if (_tokenAddress === tokenAddress) {
        alertService.showError(
          "Please change the value to update the token address"
        );
        setLoading(false);
        return false;
      }
      let walletAddress =  await userService.getAdminWalletAddress();
            if(walletAddress.status !=='success')
            {
                alertService.showError(walletAddress.message);
                return
            }
            let checkAllowance=await userService.getAllowanceForAll(walletAddress.data);
            if(checkAllowance.status==='success'){
      let _response = await blockchainService.setTokenAddress(_tokenAddress);

      if (_response.status === "failure") {
        alertService.showError(_response.message);
        setLoading(false);
        return false;
      }

     

      setLoading(false);
      let _txHash=_response.data.hash;
      
      let pendingMsg={
        status: true,
        type: "pending",
        message: "Your transaction is in process",
        data: _txHash,
        showOkButton: false,
      }
      dispatch(setMessage(pendingMsg));   
      setLoading(false)


      await _response.data.wait();

      
      let completeMsg={
        status: true,
        type: "success",
        message: "Token updated successfully",
        data: _txHash,
        showOkButton: true,
      }
      dispatch(setMessage(completeMsg));

      getTokenAddress();
    }else {
         setLoading(false)
         alertService.showError(checkAllowance.message);
     } 
    } catch (error) {
      setLoading(false);
      alertService.showError(error.message);
    }
  };

  return (
    <div className="relative w-full h-full mx-auto max-w-full ">
      {/*content*/}
      <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none h-full">
        {/*header*/}

        {/*body*/}
        <div className="relative lg:px-8 lg:py-12 p-4 flex-auto h-full">
          {/* <h3 className="text-2xl text-coalblack font-semibold leading-normal mb-4">
            Configuration
          </h3> */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={setTokenAddress}
            enableReinitialize
          >
            <Form>
              <div className="mb-4">
                <label
                  htmlFor=""
                  className="text-sm font-medium text-coalblack block mb-2"
                >
                  Set Token Address<span className="text-dark-red">*</span>
                </label>
                <Field
                  type="text"
                  name="tokenAddress"
                  id=""
                  className="border text-coalblack sm:text-sm rounded-lg focus:shadow-sm block w-full p-3"
                  placeholder="Token Address"
                  required=""
                />
              </div>

              <button
                type="submit"
                className="text-sm w-full mt-3 px-4 py-3 bg-blue-600 rounded-md text-white outline-none shadow-lg flex"
              >
                <span className="text-center mx-auto text-sm font-semibold">
                  Update
                </span>
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};
// const StakingAddressConfig = ({
//   setLoading,
 
//   stakingAddress,
//   getStakingAddress,
//   dispatch
// }) => {
//   const validationSchema = Yup.object().shape({
//     stakingAddress: Yup.string().required("Staking address is required"),
//   });

//   const initialValues = {
//     stakingAddress: stakingAddress ? stakingAddress : "",
//   };

//   const setStakingAddress = async (_formInput) => {
//     setLoading(true);

//     try {
//       let _stakingAddress = _formInput.stakingAddress;

//       if (_stakingAddress === stakingAddress) {
//         alertService.showError(
//           "Please change the value to update the token address"
//         );
//         setLoading(false);
//         return false;
//       }
//       let walletAddress =  await userService.getAdminWalletAddress();
// if(walletAddress.status !=='success')
// {
//     alertService.showError(walletAddress.message);
//     return
// }
// let checkAllowance=await userService.getAllowanceForAll(walletAddress.data);
// if(checkAllowance.status==='success'){

//       let _response = await blockchainService.setStakingAddress(_stakingAddress);

//       if (_response.status === "failure") {
//         alertService.showError(_response.message);
//         setLoading(false);
//         return false;
//       }

//       setLoading(false);

//       let _txHash=_response.data.hash;

//       let pendingMsg={
//         status: true,
//         type: "pending",
//         message: "Your transaction is in process",
//         data: _txHash,
//         showOkButton: false,
//       }
//       dispatch(setMessage(pendingMsg));   
//       setLoading(false)


//       await _response.data.wait();

      
//       let completeMsg={
//         status: true,
//         type: "success",
//         message: "Staking Address Updated",
//         data: _txHash,
//         showOkButton: true,
//       }
//       dispatch(setMessage(completeMsg));

//       getStakingAddress();
//     }else {
//       setLoading(false)
//       alertService.showError(checkAllowance.message);
//   } 
//     } catch (error) {
//       setLoading(false);
//       alertService.showError(error.message);
//     }
//   };

//   return (
//     <div className="relative w-full h-full mx-auto max-w-full ">
//       {/*content*/}
//       <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none h-full">
//         {/*header*/}

//         {/*body*/}
//         <div className="relative lg:px-8 lg:py-12 p-4 flex-auto h-full">
//           {/* <h3 className="text-2xl text-coalblack font-semibold leading-normal mb-4">
//             Configuration
//           </h3> */}
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={setStakingAddress}
//             enableReinitialize
//           >
//             <Form>
//               <div className="mb-4">
//                 <label
//                   htmlFor=""
//                   className="text-sm font-medium text-coalblack block mb-2"
//                 >
//                   Set Staking Address<span className="text-dark-red">*</span>
//                 </label>
//                 <Field
//                   type="text"
//                   name="stakingAddress"
//                   id=""
//                   className="border text-coalblack sm:text-sm rounded-lg focus:shadow-sm block w-full p-3"
//                   placeholder="Staking Address"
//                   required=""
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="text-sm w-full mt-3 px-4 py-3 bg-blue-600 rounded-md text-white outline-none shadow-lg flex"
//               >
//                 <span className="text-center mx-auto text-sm font-semibold">
//                   Update
//                 </span>
//               </button>
//             </Form>
//           </Formik>
//         </div>
//       </div>
//     </div>
//   );
// };

const ExchangeRateConfig = ({
  setLoading,
  tokenDecimal,
  exchangeRate,
  dispatch
}) => {
  const validationSchema = Yup.object().shape({
    exchangeRate: Yup.number()
      .required("Exchange rate is required")
      .typeError("Exchange rate must be a number"),
  });

  const initialValues = {
    exchangeRate: exchangeRate ? exchangeRate : "",
  };
  const configExchangeRate = async (values) => {
    setLoading(true);
    let _exchangeRate = values.exchangeRate;
    _exchangeRate = parseInt(_exchangeRate);
    
    if (_exchangeRate === exchangeRate) {
      alertService.showError(
        "Please change the value to update the exchange rate"
      );
      setLoading(false);
      return false;
    }

    try {
      let actualValue = _exchangeRate * Math.pow(10, tokenDecimal);

      actualValue = configService.scientificToDecimal(actualValue);
      let walletAddress =  await userService.getAdminWalletAddress();
      if(walletAddress.status !=='success')
      {
          alertService.showError(walletAddress.message);
          return
      }
      let checkAllowance=await userService.getAllowanceForAll(walletAddress.data);
      if(checkAllowance.status==='success'){
      let _rateResponse = await elxService.setExchangeRate(
        actualValue.toString()
      );

      if (_rateResponse.status === "failure") {
        alertService.showError(_rateResponse.message);
        setLoading(false);
        return false;
      } 
      setLoading(false);

      let _txHash=_rateResponse.data.hash;
      let pendingMsg={
        status: true,
        type: "pending",
        message: "Your transaction is in process",
        data: _txHash,
        showOkButton: false,
      }
      dispatch(setMessage(pendingMsg));   
      setLoading(false)


      await _rateResponse.data.wait();

      
      let completeMsg={
        status: true,
        type: "success",
        message: 'Exchange rate set successfully',
        data: _txHash,
        showOkButton: true,
      }

      dispatch(setMessage(completeMsg));

    }else {
      setLoading(false)
      alertService.showError(checkAllowance.message);
  }     // alertService.showSuccess(_rateResponse.message);
      
    } catch (error) {
      setLoading(false);
      alertService.showError(error.message);
    }
  };

  return (
    <div className="relative w-full h-full mx-auto max-w-full ">
      {/*content*/}
      <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none h-full">
        {/*header*/}

        {/*body*/}
        <div className="relative lg:px-8 lg:py-12 p-4 flex-auto h-full">
          {/* <h3 className="text-2xl text-coalblack font-semibold leading-normal mb-4">
            Exchange Rate Configuration
          </h3> */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={configExchangeRate}
            enableReinitialize
          >
            <Form>
              <div className="mb-4">
                <label
                  htmlFor=""
                  className="text-sm font-medium text-coalblack items-center mb-2 flex"
                >
                  Set Exchange Rate
                  <span className="text-dark-red">*</span>
                  <button
                      type="button"
                      title="How Much ELX Token User Get Per BNB?"
                      className="ml-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                </label>
                <Field
                  type="text"
                  name="exchangeRate"
                  id=""
                  className="border text-coalblack sm:text-sm rounded-lg focus:shadow-sm block w-full p-3"
                  placeholder="Exchange Rate"
                  required=""
                />
                <ErrorMessage name="exchangeRate" component={TextError} />
              </div>

              <button
                type="submit"
                className="text-sm w-full mt-3 px-4 py-3 bg-blue-600 rounded-md text-white outline-none shadow-lg flex"
              >
                <span className="text-center mx-auto text-sm font-semibold">
                  Update
                </span>
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

const RewardPercentConfig = ({
  setLoading,
  rewardPercent,
  rewardPercentDivisor,
  getRewardPercentDivisor,
  dispatch
}) => {
  const validationSchema = Yup.object().shape({
    rewardPercent: Yup.number()
      .required("Reward percent is required")
      .typeError("Reward percent must be a number"),
  });

  const initialValues = {
    rewardPercent: rewardPercent ? rewardPercent : "",
  };

  const updateRewardPercent = async (_formInput) => {
    setLoading(true);

    try {
      let _rewardPercent = _formInput.rewardPercent;

      if (_rewardPercent === rewardPercent) {
        alertService.showError(
          "Please change the value to update the reward percent"
        );
        setLoading(false);
        return false;
      }
      _rewardPercent =
        parseFloat(_rewardPercent) * parseFloat(rewardPercentDivisor);
        let walletAddress =  await userService.getAdminWalletAddress();
        if(walletAddress.status !=='success')
        {
            alertService.showError(walletAddress.message);
            return
        }
        let checkAllowance=await userService.getAllowanceForAll(walletAddress.data);
        if(checkAllowance.status==='success'){
      let _response = await stakingService.setRewardPercent(
        _rewardPercent.toString(),
        rewardPercentDivisor
      );

      if (_response.status === "failure") {
        alertService.showError(_response.message);
        setLoading(false);
        return false;
      }

     
      setLoading(false);
      
      let _txHash=_response.data.hash;

      let pendingMsg={
        status: true,
        type: "pending",
        message: "Your transaction is in process",
        data:_txHash,
        showOkButton: false,
      }
      dispatch(setMessage(pendingMsg));   
      setLoading(false)


      await _response.data.wait();
       const publicProvider=await blockchainService.getPublicProvider();
      const txInfo = await publicProvider.getTransaction(_txHash);
      let insertPercentageHistory=await transactionApiService.insertPercentageHistory(txInfo.blockNumber);
    //  console.log("insertPercentageHistory" , insertPercentageHistory);

      
      let completeMsg={
        status: true,
        type: "success",
        message: "Reward Percentage Updated",
        data:_txHash,
        showOkButton: true,
      }
      dispatch(setMessage(completeMsg));

      getRewardPercentDivisor();
    }else {
      setLoading(false)
      alertService.showError(checkAllowance.message);
  } 
    } catch (error) {
      setLoading(false);
      alertService.showError(error.message);
    }
  };

  return (
    <div className="relative w-full h-full mx-auto max-w-full ">
      {/*content*/}
      <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none h-full">
        {/*header*/}

        {/*body*/}
        <div className="relative lg:px-8 lg:py-12 p-4 flex-auto h-full">
          {/* <h3 className="text-2xl text-coalblack font-semibold leading-normal mb-4">
            Configuration
          </h3> */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={updateRewardPercent}
            enableReinitialize
          >
            <Form>
              <div className="mb-4">
                <label
                  htmlFor=""
                  className="text-sm font-medium text-coalblack block mb-2"
                >
                  Set Reward Percentage<span className="text-dark-red">*</span>
                </label>
                <Field
                  type="text"
                  name="rewardPercent"
                  id=""
                  className="border text-coalblack sm:text-sm rounded-lg focus:shadow-sm block w-full p-3"
                  placeholder="Reward Percent"
                  required=""
                />
                <ErrorMessage name="rewardPercent" component={TextError} />
              </div>

              <button
                type="submit"
                className="text-sm w-full mt-3 px-4 py-3 bg-blue-600 rounded-md text-white outline-none shadow-lg flex"
              >
                <span className="text-center mx-auto text-sm font-semibold">
                  Update
                </span>
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

const AuthorizationConfig = ({
  setLoading,
  dispatch
}) => {
  const validationSchema = Yup.object().shape({
    address: Yup.string().required("Account address is required"),
    authorizationStatus: Yup.string().required(
      "Authorization status is required"
    ),
  });

  const initialValues = {
    address: "",
    authorizationStatus: "",
  };
  
  const _options = [
    {
      label: " Set Authorize/Deauthorize",
      value: "",
    },
    {
      label: "Authorize",
      value: "authorize",
    },
    {
      label: "Deauthorize",
      value: "deauthorize",
    },
  ];

  const [selectedAuthStatus, setSelectedAuthStatus] = useState(_options[0]);
  const [currentAuthStatus, setCurrentAuthStatus] = useState(null);

  const changeAuthStatus = (selectedOption, setFieldValue) => {
    setSelectedAuthStatus(selectedOption);
    setFieldValue("authorizationStatus", selectedOption.value);
  };

  const clearForm = () => {
    initialValues.address = "";
    initialValues.authorizationStatus = "";
    setSelectedAuthStatus(_options[0])
  }

  const checkAuthStatus = async (_data) => {
    if (_data.target.value === "") {
      setCurrentAuthStatus(null);
      return false;
    }

    try {
      let _response = await stakingService.getAuthorizationStatus(
        _data.target.value
      );

      if (_response.status === "failure") {
        setCurrentAuthStatus(null);
        // alertService.showError(_response.message);
        return false;
      }

      if(_response.data === true){
        setCurrentAuthStatus("Authorized");
      }else {
        setCurrentAuthStatus("Unauthorized");
      }

    } catch (error) {
      alertService.showError(error.message);
    }
  };

  const updateAuthStatus = async (_formInput, { resetForm }) => {
    setLoading(true);

    try {
      let walletAddress =  await userService.getAdminWalletAddress();
if(walletAddress.status !=='success')
{
    alertService.showError(walletAddress.message);
    return
}
let checkAllowance=await userService.getAllowanceForAll(walletAddress.data);
if(checkAllowance.status==='success'){

      let _response = await stakingService.setAuthorizationStatus(
        _formInput.address,
        _formInput.authorizationStatus
      );

      if (_response.status === "failure") {
        alertService.showError(_response.message);
        setLoading(false);
        return false;
      }

      
      setLoading(false);

      let _txHash=_response.data.hash;

      let pendingMsg={
        status: true,
        type: "pending",
        message: "Your transaction is in process",
        data: _txHash,
        showOkButton: false,
      }
      dispatch(setMessage(pendingMsg));   
      setLoading(false)

      resetForm();
      clearForm();
      setCurrentAuthStatus(null);
      await _response.data.wait();

      
      let completeMsg={
        status: true,
        type: "success",
        message: "Authorization status updated successfully",
        data: _txHash,
        showOkButton: true,
      }
      dispatch(setMessage(completeMsg));
  
    }else {
      setLoading(false)
      alertService.showError(checkAllowance.message);
  } 
    } catch (error) {
      setLoading(false);
      alertService.showError(error.message);
    }
  };

  return (
    <div className="relative w-full h-full mx-auto max-w-full">
      {/*content*/}
      <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none h-full">
        {/*header*/}

        {/*body*/}
        <div className="relative lg:px-8 lg:py-12 p-4 flex-auto h-full">
          {/* <h3 className="text-2xl text-coalblack font-semibold leading-normal mb-4">
            Configuration
          </h3> */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={updateAuthStatus}
            enableReinitialize
          >
            {({ formik, setFieldValue }) => {
              return (
                <Form>
                  <div className="mb-2">
                    <label
                      htmlFor=""
                      className="text-sm font-medium text-coalblack block mb-2"
                    >
                      Account Address<span className="text-dark-red">*</span>
                    </label>
                    <Field
                      type="text"
                      name="address"
                      onInput={(e) => {
                        checkAuthStatus(e);
                      }}
                      className="border text-coalblack sm:text-sm rounded-lg focus:shadow-sm block w-full p-3"
                      placeholder="Account address"
                      required=""
                    />
                    <ErrorMessage name="address" component={TextError} />
                  </div>
                  {currentAuthStatus && (
                    <div className="mb-4">
                      <label className="text-sm font-medium text-coalblack block mb-2">
                        Current Status: <span>{currentAuthStatus || "NA"}</span>
                      </label>
                    </div>
                  )}
                  <div className="mb-4">
                    <label
                      htmlFor=""
                      className="text-sm font-medium text-coalblack block mb-2"
                    >
                      Authorization Status
                      <span className="text-dark-red">*</span>
                    </label>
                    <Select
                      value={selectedAuthStatus}
                      onChange={(e) => changeAuthStatus(e, setFieldValue)}
                      options={_options}
                      name="authorizationStatus"
                    />
                    <ErrorMessage
                      name="authorizationStatus"
                      component={TextError}
                    />
                  </div>

                  <button
                    type="submit"
                    className="text-sm w-full mt-3 px-4 py-3 bg-blue-600 rounded-md text-white outline-none shadow-lg flex"
                  >
                    <span className="text-center mx-auto text-sm font-semibold">
                      Update
                    </span>
                  </button>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

const DistributeReward = ({
  setLoading,
 
  distributeReward,
  totalStakeAmt,
  dispatch
}) => {
  return(
    <div className="relative w-full h-full mx-auto max-w-full">
      {/*content*/}
      <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none h-full">
        {/*header*/}

        {/*body*/}
        <div className="relative lg:px-8 lg:py-12 p-4 flex-auto h-full">
            <label
            htmlFor=""
            className="text-sm font-medium text-coalblack block mb-2"
            >
            <h3>Total user's stake amount:{totalStakeAmt} (ELX)</h3>                        
          </label>
          {(totalStakeAmt>0)?
          <button type="button" className="text-sm w-full mt-3 px-4 py-3 bg-blue-600 rounded-md text-white outline-none shadow-lg flex">
              <span className="text-center mx-auto text-sm font-semibold"  onClick={(e) => distributeReward()} >Distribute Rewards</span>
            </button>
               :
               <span className="inline-flex text-dark-red">No reward to distribute</span>
             }
        </div>
      
    </div>
    </div>
  )
}
const WithdrawBnb = ({
 
  withdrawBnb,
  bnbBalance,
}) => {
  return(
    <div className="relative w-full h-full mx-auto max-w-full">
      {/*content*/}
      <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none h-full">
        {/*header*/}

        {/*body*/}
        <div className="relative lg:px-8 lg:py-12 p-4 flex-auto h-full">
            <label
            htmlFor=""
            className="text-sm font-medium text-coalblack block mb-2"
            >
            <h3>Total BNB amount:{bnbBalance} (BNB)</h3>                        
          </label>
          {(bnbBalance>0)?
          <button type="button" className="text-sm w-full mt-3 px-4 py-3 bg-blue-600 rounded-md text-white outline-none shadow-lg flex">
              <span className="text-center mx-auto text-sm font-semibold"  onClick={(e) => withdrawBnb()} >Withdraw BNB</span>
            </button>
               :
               <span className="inline-flex text-dark-red">Withdraw BNB</span>
             }
        </div>
      
    </div>
    </div>
  )
}






export default RewardConfig;
