import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import alertService from "../services/alert.service";
import ManageBatch from './Batch/ManageBatch';
import { useSelector , useDispatch } from "react-redux";
import userService from "../../src/services/user.service";
import { USERS } from "../actions/type";
import { ROLES } from "../actions/type";
import elxService from '../services/elx.service';
import configService from "../services/config.service";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import QRCode from "react-qr-code";
import blockchainService from "../services/blockchain.service";
import UserApiService from "../api/UserApi.service";
import Spinner from "../components/common/Spinner";


const Dashboard =  () => {

  const { batches } = useSelector(state => state);
  const { users }   = useSelector(state => state);
  const { roles }   = useSelector(state => state);
  const { user: authUser } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [elxBalance, setElxBalance] = useState(0);
  const [bnbBalance, setBnbBalance] = useState(0);
  const [copied, setCopied] = useState(false);
  const userContractAddress = configService.tokenContractAddress();
  const  dispatch = useDispatch();

  
  

  useEffect(() => {
    (async () => {
      setLoading(true)
      await getRoles(); 
      await getElxPrice();
      await getBnbBalance();
      await getUsersList();
      setLoading(false)
    })();
  }, []);

  // get elx balance
  const getElxPrice = async () => {

    try {
      let balance = await elxService.getBalance();
      balance = Number(balance.data);
      balance = balance.toFixed(4);
      setElxBalance(balance)
    
    } catch (error) {
     
      alertService.showError(error.message);
    }
  };

  // get BNB balance
  const getBnbBalance = async () => {

    try {
      let _walletDetails = await blockchainService.getWalletDetails();
      let _bnbBalance = Number(_walletDetails.data.walletBalance);
      _bnbBalance = _bnbBalance.toFixed(4);
      setBnbBalance(_bnbBalance)
      
    } catch (error) {

      alertService.showError(error.message);
    }
  };

  const copyWalletAddress = (inputAddress) => {
    setCopied(true);
    if(inputAddress === "walletAddress"){
      alertService.showSuccess("Wallet address copied successfully");
    }else if(inputAddress === "supplyChain"){
      alertService.showSuccess("Supply chain contract address copied successfully");
    }else if(inputAddress === "storageContract"){
      alertService.showSuccess("Storage contract address copied successfully");
    }else{
      alertService.showSuccess("User contract address copied successfully");
    }
  }
  //get users count

  const getUsersList = async () => {
    try {
      let usersResponse = await UserApiService.getUsersList(1,1,"" ,"");
      // console.log(usersResponse.pagination.totalCount);
      if (usersResponse.status === "failure") {
        return false;
      } else {
        // setRefreshUserList(usersResponse.data._usersListResponse.length)
        dispatch({
          type: USERS,
          payload: {totalUsers:usersResponse.pagination.totalCount},
        });      
      }
    }
    catch (error) {
    }
  }

  // Get user roles count
  const getRoles = async () => {
    try {
      let rolesResponse = await userService.getRoles();
      if (rolesResponse.status === "failure") {
        alertService.showError(rolesResponse.message);
        return false;
      } else {
        dispatch({
          type: ROLES,
          payload: {totalRoles:rolesResponse.data.roles.length},
        });
      }
    } catch (error) {
      alertService.showError(error.message);
    }
  };


  return (
    <div className="">
              {loading === true ? <Spinner /> : ""}

      <div className="content text-coalblack">
        {/* cards */}
        <div className="mb-8">
          <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
            <Link
              to="/admin/users"
              className="bg-white rounded-xl border shadow-sm p-6"
            >
              <div className="w-12 h-12 rounded-full bg-pestel-pink inline-flex justify-center items-center float-right text-white">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h6 className="text-sm">Total Users</h6>
              <h2 className="text-xl font-semibold my-1">{users.totalUsers}</h2>
              {/* <p className="text-xs text-light-coalblack mt-2">Lorem Ipsum is simply dummy text of the printing </p> */}
            </Link>

            <Link to="/admin/users" className="bg-white rounded-xl border shadow-sm p-6">
              <div className="w-12 h-12 rounded-full bg-regular-blue inline-flex justify-center items-center float-right text-white">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h6 className="text-sm">Total Roles</h6>
                <h2 className="text-xl font-semibold my-1">{roles.totalRoles}</h2>
              {/* <p className="text-xs text-light-coalblack mt-2">Lorem Ipsum is simply dummy text of the printing </p> */}
            </Link>

            <Link
              to="/admin/batches"
              className="bg-white rounded-xl border shadow-sm p-6"
            >
              <div className="w-12 h-12 rounded-full bg-grinish-blue inline-flex justify-center items-center float-right text-white">
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h6 className="text-sm">Total Batches</h6>
              <h2 className="text-xl font-semibold my-1">{batches.totalBatches}</h2>
              {/* <p className="text-xs text-light-coalblack mt-2">Lorem Ipsum is simply dummy text of the printing </p> */}
            </Link>

            {/* show admin elx balance */}
            <Link
              to="#"
              className="bg-white rounded-xl border shadow-sm p-6"
            >
              <div className="w-12 h-12 rounded-full bg-grinish-blue inline-flex justify-center items-center float-right text-white">
                <img src="../images/basket.svg" alt="" />
              </div>
              <h6 className="text-sm">ELX Balance</h6>
              <h2 className="text-xl font-semibold my-1">{elxBalance}</h2>
              {/* <p className="text-xs text-light-coalblack mt-2">Lorem Ipsum is simply dummy text of the printing </p> */}
            </Link>

            {/* show admin BNB balance */}
            <Link
              to="#"
              className="bg-white rounded-xl border shadow-sm p-6"
            >
              <div className="w-12 h-12 rounded-full bg-grinish-blue inline-flex justify-center items-center float-right text-white">
                <img src="../images/basket.svg" alt="" />
              </div>
              <h6 className="text-sm">BNB Balance</h6>
              <h2 className="text-xl font-semibold my-1">{bnbBalance}</h2>
              {/* <p className="text-xs text-light-coalblack mt-2">Lorem Ipsum is simply dummy text of the printing </p> */}
            </Link>

          </div>
        </div>

        <ManageBatch onPage="dashboard"/>
        {/* table */}
        
        <div className="bg-white rounded-xl border shadow-sm p-6 lg:grid-cols-2 grid-cols-1 lg:grid w-full gap-4 md:mt-8 mt-4">
            <h2 className="md:mb-0 mb-3 text-sm font-semibold col-span-2">Addresses</h2>
            {/* address card */}
            <div className="bg-white rounded-xl border shadow-sm p-3 mb-3 w-full">
              <div className="inline-flex">
              <QRCode value={authUser.wallet_address} size={30}/> 

                {/* <img src="../../images/qr-code.png" alt="" /> */}
                <p className="ml-3 text-sm font-semibold w-64">Your Address</p>
              </div>
              <div className="bg-white rounded-md border shadow-sm p-3 inline-flex w-full relative">
                <p className="text-xs font-normal text-slate-gray">
                {authUser.wallet_address.slice(0,10)+'...'+authUser.wallet_address.slice(-10) || ""}        

                </p>
              <CopyToClipboard text={authUser.wallet_address} onCopy={() => copyWalletAddress("walletAddress")}>         
                <Link to="#" className="text-xs text-indigo-500 mr-1">
                <img
                className="absolute right-2"
                src="../../images/copy.svg"
                alt=""
                title="Copy wallet address"
                />
                </Link>
              </CopyToClipboard>
              </div>
            </div>
           <div className="bg-white rounded-xl border shadow-sm p-3 mb-3 w-full">
              <div className="inline-flex">
              <QRCode value={userContractAddress} size={30}/> 
                {/* <img src="../../images/qr-code.png" alt="" /> */}
                <p className="ml-3 text-sm font-semibold truncate w-64">
                   Supplychain Contract Address                  
                </p>
              </div>
              <div className="bg-white rounded-md border shadow-sm p-3 inline-flex w-full relative">
                <p className="text-xs font-normal text-slate-gray">
                {userContractAddress.slice(0,10)+'...'+userContractAddress.slice(-10) || ""}        
                </p>
                <CopyToClipboard text={userContractAddress} onCopy={() => copyWalletAddress("supplyChain")}>         
                  <Link to="#" className="text-xs text-indigo-500 mr-1">
                  <img
                  className="absolute right-2"
                  src="../../images/copy.svg"
                  alt=""
                  title="Copy supplichain contract address"
                  />
                  </Link>
                </CopyToClipboard>
              </div>
            </div>

            
          </div>
        {/*<div className="grid lg:grid-cols-12 grid-cols-1 gap-4 mt-8">
           <div className="bg-white rounded-xl border shadow-sm  lg:col-span-8">
            <div className="flex justify-between w-full py-3 items-center">
              <h2 className="ml-3 text-sm font-semibold relative">
                Statistics
              </h2>
              <button
                type="button"
                className=" px-4 py-3 bg-white rounded-md text-gray-700 outline-none shadow-lg transform transition-transform mx-3 flex"
              >
                <span className="ml-2 text-xs font-semibold">Attach</span>
              </button>
            </div>
            <img src="/images/statistic.png" className="w-full" alt=""/>
          </div> 

          
        </div>*/}
      </div>
    </div>
  );
};
export default Dashboard;
