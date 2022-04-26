import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import Spinner from '../../components/common/Spinner';
import alertService from '../../services/alert.service';
import configService from '../../services/config.service';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import apiService from "../../api/api.service";
import { GlobalPagination } from "../../components/common/GlobalPagination";
import * as momemt from 'moment';
import TransactionFilter from '../../components/common/TransactionFilter';

const StakeHistory = () => {

    const [loading, setLoading] = useState(false);

    const [stackTotalCount, setStackTotalCount] = useState(0);
    const [removeStackTotalCount, setRemoveStackTotalCount] = useState(0);

    const [stackPage, setStackPage] = useState(1);
    const [removeStackPage, setRemoveStackPage] = useState(1);
    const [perPage] = useState(10);

    const [stackSearch, setStackSearch] = useState("");
  const [removeStackSearch, setRemoveStackSearch] = useState("");

    const bscUrl = configService.getBlockchainExplorerEndpoint();
  
    const [stakeHistoryList, setStakeHistoryList] = useState([]);

    const [removeStakeHistoryList, setRemoveStakeHistoryList] = useState([]);

    const setStackPageRecord=(value)=>{
      console.log(value)
      setStackPage(Number(value)+1)
    }
  
    const setRemoveStackPageRecord=(value)=>{
      setRemoveStackPage(Number(value)+1)
    }

    const setStackSearchRecord=(search)=>{
      setStackSearch(search)
      setStackPage(1)
    }
  
    const setRemoveStackSearchRecord=(search)=>{
      setRemoveStackSearch(search)
      setRemoveStackPage(1)
    }

      useEffect(() => {
        (async () => {
            await createStakeHistory();
            await removeStakeHistory();
        })();
      },[stackPage, removeStackPage, stackSearch, removeStackSearch]);
      

      // Create stake history
      const createStakeHistory = async () => {
        try {
          setLoading(true);
          let _response = await apiService.getCreateStakeHistory(
            stackPage,
            perPage,
            stackSearch
          );
    
          if(_response.status === "failure"){
            alertService.showError(_response.message);
           setLoading(false);
    
          }
          setStackTotalCount(_response.pagination.totalCount)
    
          let _txns = [..._response.records];
          for(let _txn of _txns){
            _txn["transactionHash"] = _txn.transaction_hash
            _txn["stakeAmount"] = _txn.amount
            _txn["account"] = _txn.wallet_address
            _txn["timestamp"] = momemt.unix(_txn.update_date).format("lll");
                
          }
          
          setStakeHistoryList(_txns);
    
          setLoading(false);
        } catch (error) {
          alertService.showError(error.message);
        }
      };

    // Remove Stake history

    const removeStakeHistory = async () => {
      try {
        setLoading(true);
        let _response = await apiService.getRemoveStakeHistory(
          removeStackPage,
          perPage,
          removeStackSearch
        );
  
        if(_response.status === "failure"){
          alertService.showError(_response.message);
         setLoading(false);
  
        }
        setRemoveStackTotalCount(_response.pagination.totalCount)
  
        let _txns = [..._response.records];
        for(let _txn of _txns){
          _txn["transactionHash"] = _txn.transaction_hash
          _txn["stakeAmount"] = _txn.amount
          _txn["account"] = _txn.wallet_address
          _txn["timestamp"] = momemt.unix(_txn.update_date).format("lll");
              
        }
        
        setRemoveStakeHistoryList(_txns);
  
        setLoading(false);
      } catch (error) {
        alertService.showError(error.message);
      }
    };

    return (
        <div>
        <div className="content text-coalblack">
          {loading === true ? <Spinner /> : ""}       
        {/* table */}
        <div className="bg-white rounded-xl border shadow-sm">
          <Tabs>
            <TabList>
              <Tab>Create Stake History</Tab>
              <Tab>Remove Stake History</Tab>
            </TabList>

            <TabPanel>
              <div className="overflow-y-auto">
                <TransactionFilter
                    setSearch={setStackSearchRecord}
                    search={stackSearch}
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
                        Amount (ELX)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stakeHistoryList.length > 0 ? (
                      stakeHistoryList.map((row, index) => {


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
                              {row.wallet_address|| "NA"}
                            </td>
                            <td className="border-t-0 px-4 py-2 align-middle border-l-0 border-r-0 text-xs font-normal whitespace-nowrap p-4 truncate max-w-xs trans-code">
                              {row.stakeAmount || "NA"}
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
                totalCount={stackTotalCount}
                dataCount={stackTotalCount}
                pageSize={perPage}
                currentPage={stackPage-1}
                gotoPage={setStackPageRecord}
              
              />
                </TabPanel>

            <TabPanel>
              <div className="overflow-y-auto">
              <TransactionFilter
                  setSearch={setRemoveStackSearchRecord}
                  search={removeStackSearch}
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
                        Amount (ELX)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {removeStakeHistoryList.length > 0 ? (
                      removeStakeHistoryList.map((row, index) => {
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
                              {row.wallet_address || "NA"}
                            </td>
                            <td className="border-t-0 px-4 py-2 align-middle border-l-0 border-r-0 text-xs font-normal whitespace-nowrap p-4 truncate max-w-xs trans-code">
                              {row.stakeAmount || "NA"}
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
                totalCount={removeStackTotalCount}
                dataCount={removeStackTotalCount}
                pageSize={perPage}
                currentPage={removeStackPage-1}
                gotoPage={setRemoveStackPageRecord}
              
              />
              </TabPanel>
            </Tabs>
        </div>
      </div>
    </div>
    )
}

export default StakeHistory
