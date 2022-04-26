import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import alertService from "../../services/alert.service";
import blockchainService from '../../services/blockchain.service';
import configService from '../../services/config.service';
import elxService from '../../services/elx.service';
import Spinner from "../../components/common/Spinner";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Table from "../../components/common/Table";
import stakingService from "../../services/staking.service";
import * as momemt from 'moment';
const TransactionHistory =  () => {

  const [elxTxList, setElxTxLixt] = useState([]);
  const [bnbTxList, setBnbTxLixt] = useState([]);
  const [loading, setLoading] = useState(false);
  const [elxTable,setElxTable] = useState("elxTable");
  const [bnbTable,setBnbTable] = useState("bnbTable");
  const [sortField,setSortField] = useState('block_number')
  const [onPage,setOnPage] = useState('transaction')
  const bscUrl = configService.getBlockchainExplorerEndpoint();


  const elxColumns = [
    {
      accessor: "transaction",
      disableSortBy: true,
      Header: "Transaction Id",
      Cell: ({ row }) => (
        <>
          <a
            href={bscUrl + "tx/" + row.original.transaction}
            target="_blank"
            rel="noreferrer"
          >
            {row.original.transaction.slice(0, 5) +
              "..." +
              row.original.transaction.slice(-4) || ""}
          </a>
        </>
      ),
    },

    {
      accessor: "block_number",
      disableSortBy: true,
      Header: "Block Number",
      Cell: ({ row }) => <>{row.original.block_number || "N/A"}</>,
    },

    {
      accessor: "created_date",
      Header: "date",
      disableSortBy: true,
      Cell: ({ row }) => <>{row.original.created_date || "N/A"}</>,
    },

    {
      accessor: "value",
      Header: "value (ELX)",
      disableSortBy: true,
      Cell: ({ row }) => <>{row.original.value || "N/A"}</>,
    },

    {
      accessor: "type",
      Header: "type",
      disableSortBy: true,
      Cell: ({ row }) => (
        <>
          {/* <span className="bg-green-500 text-white py-2 px-3 rounded-md w-32 text-center inline-block">
                {row.original.type || 'N/A'}
              </span> */}
          <div
            className={
              row.original.type === "Received"
                ? "inline-flex text-dark-green"
                : row.original.type === "Sent"
                ? "inline-flex text-dark-red"
                : ""
            }
          >
            {row.original.type}
          </div>
          {/* <span className="bg-red-600 text-white py-2 px-3 rounded-sm w-full inline-block">
                {row.original.type || 'N/A'}
              </span>  */}
        </>
      ),
    },
  ];

  const bnbColumns = [
    {
      accessor: "transaction",
      disableSortBy: true,
      Header: "Transaction Id",
      Cell: ({ row }) => (
        <>
          <a
            href={bscUrl + "tx/" + row.original.transaction}
            target="_blank"
            rel="noreferrer"
          >
            {row.original.transaction.slice(0, 5) +
              "..." +
              row.original.transaction.slice(-4) || ""}
          </a>
        </>
      ),
    },

    {
      accessor: "block_number",
      disableSortBy: true,
      Header: "Block Number",
      Cell: ({ row }) => <>{row.original.block_number || "N/A"}</>,
    },

    {
      accessor: "created_date",
      Header: "date",
      disableSortBy: true,
      Cell: ({ row }) => <>{row.original.created_date || "N/A"}</>,
    },

    {
      accessor: "gasUsed",
      Header: "Gas Used (BNB)",
      disableSortBy: true,
      Cell: ({ row }) => <>{row.original.gasUsed || "N/A"}</>,
    },
  ];

 
      
  const getElxHistoryList = async () => {
    try {
      setLoading(true);
      let rec= await elxService.getElxTransactions()
      setElxTxLixt(rec)
      setLoading(false);
    }
    catch (error)
    {
      alertService.showError(error.message);
    }
  }

  const getBnbHistoryList = async () => {
    try {
      setLoading(true);
      let rec= await elxService.getBnbTransactions()
      setBnbTxLixt(rec)
      setLoading(false);
    }
    catch (error)
    {
      alertService.showError(error.message);
    }
  }

  
useEffect(() => {
    (async () => {
        await getElxHistoryList();
        await getBnbHistoryList();
       })();
  },[]);

  return (
    <div>
      <div className="content text-coalblack">
        {/* {loading === true ? <Spinner /> : ""} */}

        {/* table */}
        <div className="bg-white rounded-xl border shadow-sm">
          <Tabs>
            <TabList>
              <Tab>ELX Transactions History</Tab>
              <Tab>BSC Transactions History</Tab>
            </TabList>

            <TabPanel>
              <Table
                data={elxTxList}
                columns={elxColumns}
                roles={null}
                isRolesEnabled={null}
                perPage={10}
                tableType={elxTable}
                sortField={sortField}
                onPage={onPage}
                isLoader={loading}
              />
            </TabPanel>
            <TabPanel>
              <Table
                data={bnbTxList}
                columns={bnbColumns}
                roles={null}
                isRolesEnabled={null}
                perPage={10}
                tableType={bnbTable}
                sortField={sortField}
                onPage={onPage}
                isLoader={loading}
              />
            </TabPanel>
            
          </Tabs>
        </div>
      </div>
    </div>
  );

}

export default TransactionHistory;