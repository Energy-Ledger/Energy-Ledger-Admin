import React, { useEffect, useState } from "react";
import alertService from "../../services/alert.service";
import configService from '../../services/config.service';
import Spinner from "../../components/common/Spinner";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import apiService from "../../api/api.service";
import * as momemt from 'moment';
import { GlobalPagination } from "../../components/common/GlobalPagination";
import TransactionFilter from '../../components/common/TransactionFilter';
import { useSelector } from "react-redux";

const TransactionHistory =  () => {

  const [loading, setLoading] = useState(false);

  const [percentageTotalCount, setPercentageTotalCount] = useState(1);
  const [rewardTotalCount, setRewardTotalCount] = useState(1);

  const [percentagePage, setPercentagePage] = useState(1);
  const [rewardPage, setRewardPage] = useState(1);

  const [rewardSearch, setRewardSearch] = useState("");
  const [percentageSearch, setPercentageSearch] = useState("");

  const [perPage] = useState(10);

  const [rewardDistHistoryList, setRewardDistHistoryList] = useState([]);

  const [rewardPercentHistoryList, setRewardPercentHistoryList] = useState([]);

  const bscUrl = configService.getBlockchainExplorerEndpoint();

  const {user } = useSelector(state => state.auth);
  
  const setPercentagePageRecord=(value)=>{
    setPercentagePage(Number(value)+1)
  }

  const setRewardPageRecord=(value)=>{
    setRewardPage(Number(value)+1)
  }

  const setSearchRecord=(search)=>{
    setRewardSearch(search)
    setRewardPage(1)
  }

  const setPercentageSearchRecord=(search)=>{
    setPercentageSearch(search)
    setPercentagePage(1)
  }

  const rewardDistributionHistory = async () => {
    try {
      setLoading(true);
      let _response = await apiService.getRewardHistory(
        rewardPage,
        perPage,
        user.wallet_address,
        rewardSearch
      );

      if(_response.status === "failure"){
        alertService.showError(_response.message);
       setLoading(false);

      }
      setRewardTotalCount(_response.pagination.totalCount)

      let _txns = [..._response.records];
      for(let _txn of _txns){
        _txn["transactionHash"] = _txn.transaction_hash
        _txn["rewardElx"] = _txn.reward_amount
        _txn["account"] = _txn.wallet_address
        _txn["timestamp"] = momemt.unix(_txn.reward_date).format("lll");
            
      }
      
      setRewardDistHistoryList(_txns);

      setLoading(false);
    } catch (error) {
      alertService.showError(error.message);
    }
  };
  
  const rewardPercentUpdateHistory = async () => {
    try {
      setLoading(true);
      let _response = await apiService.getPercentageHistory(
        percentagePage,
        perPage,
        percentageSearch
      );

      if(_response.status === "failure"){
        alertService.showError(_response.message);
       setLoading(false);

      }
      setPercentageTotalCount(_response.pagination.totalCount)
      let _txns = [..._response.records];
      for(let _txn of _txns){
        _txn["transactionHash"] = _txn.transaction_hash
        _txn["rewardPercentage"] = _txn.reward_percetage
        _txn["timestamp"] = momemt.unix(_txn.update_date).format("lll");
            
      }
      
      setRewardPercentHistoryList(_txns);

      setLoading(false);
    } catch (error) {
      alertService.showError(error.message);
    }
  };
      
 
  useEffect(() => {
    (async () => {
        await rewardDistributionHistory();
        await rewardPercentUpdateHistory()
             
    })();
  },[percentagePage, rewardPage, percentageSearch, rewardSearch]);


  return (
    <div>
      <div className="content text-coalblack">
        {loading === true ? <Spinner /> : ""}

        {/* table */}
        <div className="bg-white rounded-xl border shadow-sm">
          <Tabs>
            <TabList>
              <Tab>Reward Distribution History</Tab>
              <Tab>Reward Percent Update History</Tab>
            </TabList>

            <TabPanel>
              <div className="overflow-y-auto">
              <TransactionFilter
                  setSearch={setSearchRecord}
                  search={rewardSearch}
                  />
                <table className="items-center bg-transparent w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 h-10 bg-gray-50 text-slate-gray align-middle border text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Transaction Hash
                      </th>
                      <th className="px-4 py-2 h-10 bg-gray-50 text-slate-gray align-middle border text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Timestamp
                      </th>
                      <th className="px-4 py-2 h-10 bg-gray-50 text-slate-gray align-middle border text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Account
                      </th>
                      <th className="px-4 py-2 h-10 bg-gray-50 text-slate-gray align-middle border text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Reward (ELX)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rewardDistHistoryList.length > 0 ? (
                      rewardDistHistoryList.map((row, index) => {
                        return (
                          <tr key={index}>
                            <td className="border-t-0 px-4 py-2 align-middle border-l-0 border-r-0 text-xs font-normal whitespace-nowrap p-4 truncate max-w-xs trans-code">
                              <a
                                href={bscUrl + "tx/" + row.transactionHash}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {row.transactionHash.slice(0, 5) +
                                  "..." +
                                  row.transactionHash.slice(-4)}
                              </a>
                            </td>
                            <td className="border-t-0 px-4 py-2 align-middle border-l-0 border-r-0 text-xs font-normal whitespace-nowrap p-4 truncate max-w-xs trans-code">
                              {row.timestamp || "NA"}
                            </td>
                            <td className="border-t-0 px-4 py-2 align-middle border-l-0 border-r-0 text-xs font-normal whitespace-nowrap p-4 truncate max-w-xs trans-code">
                              {row.account || "NA"}
                            </td>
                            <td className="border-t-0 px-4 py-2 align-middle border-l-0 border-r-0 text-xs font-normal whitespace-nowrap p-4 truncate max-w-xs trans-code">
                              {row.rewardElx || "NA"}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td className="border-t-0 px-4 py-2 align-middle border-l-0 border-r-0 text-xs font-normal whitespace-nowrap p-4 truncate max-w-xs trans-code">
                          <p className="text-sm font-normal p-4 text-slate-gray">
                            No records found
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <GlobalPagination
                totalCount={rewardTotalCount}
                dataCount={rewardTotalCount}
                pageSize={perPage}
                currentPage={rewardPage-1}
                gotoPage={setRewardPageRecord}
              
              />
            </TabPanel>
            <TabPanel>
              <div className="overflow-y-auto">
              <TransactionFilter
                  setSearch={setPercentageSearchRecord}
                  search={percentageSearch}
                  />
                <table className="items-center bg-transparent w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 h-10 bg-gray-50 text-slate-gray align-middle border text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Transaction Hash
                      </th>
                      <th className="px-4 py-2 h-10 bg-gray-50 text-slate-gray align-middle border text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Timestamp
                      </th>
                      <th className="px-4 py-2 h-10 bg-gray-50 text-slate-gray align-middle border text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        REWARD PERCENT (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rewardPercentHistoryList.length > 0 ? (
                      rewardPercentHistoryList.map((row, index) => {
                        return (
                          <tr key={index}>
                            <td className="border-t-0 px-4 py-2 align-middle border-l-0 border-r-0 text-xs font-normal whitespace-nowrap p-4 truncate max-w-xs trans-code">
                              <a
                                href={bscUrl + "tx/" + row.transactionHash}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {row.transactionHash.slice(0, 5) +
                                  "..." +
                                  row.transactionHash.slice(-4)}
                              </a>
                            </td>
                            <td className="border-t-0 px-4 py-2 align-middle border-l-0 border-r-0 text-xs font-normal whitespace-nowrap p-4 truncate max-w-xs trans-code">
                              {row.timestamp || "NA"}
                            </td>
                            <td className="border-t-0 px-4 py-2 align-middle border-l-0 border-r-0 text-xs font-normal whitespace-nowrap p-4 truncate max-w-xs trans-code">
                              {row.rewardPercentage || "NA"}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td className="border-t-0 px-4 py-2 align-middle border-l-0 border-r-0 text-xs font-normal whitespace-nowrap p-4 truncate max-w-xs trans-code">
                          <p className="text-sm font-normal p-4 text-slate-gray">
                            No records found
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <GlobalPagination
                totalCount={percentageTotalCount}
                dataCount={percentageTotalCount}
                pageSize={perPage}
                currentPage={percentagePage-1}
                gotoPage={setPercentagePageRecord}
              
              />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>
  );

}

export default TransactionHistory;