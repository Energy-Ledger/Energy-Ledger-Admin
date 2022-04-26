import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
// import {useHistory} from 'react-router';
import {Navigation} from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = useLocation();
  let urls = pathname.split("/");

  let activeUrl = '';
  
  if(location.pathname === '/admin/batches/view'){
    activeUrl = '/admin/batches';
  }else{
    activeUrl = location.pathname;
  }

  return (
    <>
    
    <div className="sidebarPanel hidden fixed lg:flex flex-col top-0 left-0 w-64 text-coalblack bg-white h-full  transition-all duration-300 z-10 sidebar border-r">
      <div className="overflow-y-auto overflow-x-hidden flex flex-col flex-grow">
        <NavLink to="/admin/dashboard" activeclassname="active" className="text-2xl font-bold p-4">
          <img src="../../logo.svg" alt="" />
        </NavLink>
        <Navigation
        activeItemId={activeUrl}
        onSelect={({ itemId }) => {
          if(itemId!='submenu_logs' && itemId!='submenu_config')
          {
            navigate(itemId);
          }
        }}
        items={[
          {
            title: 'Dashboard',
            itemId: '/admin/dashboard',
            
            elemBefore: () => <img
              src="../../images/home.svg"
              alt=""
              className={urls[2] === "dashboard" ? "white-image" : ""}
            />,
          },

          {
            title: 'Bridge',
            itemId: '/admin/exchange',
            
            elemBefore: () => <img
            src="../../images/basket.svg"
            alt=""
            className={urls[2] === "exchange" ? "white-image" : ""}
          />,
          },

          {
            title: 'Users',
            itemId: '/admin/users',
            
            elemBefore: () => <img
            src="../../images/users.svg"
            alt=""
            className={urls[2] === "users" ? "white-image" : ""}
          />,
          },
          {
            title: 'Batches',            
            itemId: '/admin/batches',
            
            elemBefore: () => <img
            src="../../images/batches.svg"
            alt=""
            className={urls[2] === "batches" ? "white-image" : ""}
          />,
          },         
          {
            title: 'Staking',
            itemId: '/admin/elx-stalking',
            
            elemBefore: () => <img
            src="../../images/staking.svg"
            alt=""
            className={urls[2] === "elx-stalking" ? "white-image" : ""}
          />,
          },
          // {
          //   title: 'Rewards',
          //   itemId: '/admin/rewards',
            
          //   elemBefore: () => <img
          //   src="../../images/award.svg"
          //   alt=""
          //   className={urls[2] === "rewards" ? "white-image" : ""}
          // />,
          // },
          {
            title: 'Buy ELX',
            itemId: '/admin/buy-elx',
            
            elemBefore: () => <img
            src="../../images/basket.svg"
            alt=""
            className={urls[2] === "buy-elx" ? "white-image" : ""}
          />,
          },
          // {
          //   title: 'Buy BNB',
          //   itemId: '/admin/buy-bnb',
            
          //   elemBefore: () => <img
          //   src="../../images/basket.svg"
          //   alt=""
          //   className={urls[2] === "buy-bnb" ? "white-image" : ""}
          // />,
          // },
          
  
          {
            title: 'Onchain Config',
            itemId: 'submenu_config',
            elemBefore: () => <img
            src="../../images/settings.svg"
            alt=""
           
          />,
            subNav: [
              {
                title: 'General',
                itemId: '/admin/reward-config',
                
                elemBefore: () => <img
                src="../../images/settings.svg"
                alt=""
                className={urls[2] === "reward-config" ? "white-image" : ""}
              />,
              },
              {
                title: 'Fees',
                itemId: '/admin/fees-config',
                
                elemBefore: () => <img
                src="../../images/settings.svg"
                alt=""
                className={urls[2] === "fees-config" ? "white-image" : ""}
              />,
              },
              {
                title: 'Bridge',
                itemId: '/admin/bridge-config',
                
                elemBefore: () => <img
                src="../../images/settings.svg"
                alt=""
                className={urls[2] === "bridge-config" ? "white-image" : ""}
              />,
              },
            ],
          },

          {
            title: 'Logs',
            itemId: 'submenu_logs',
            elemBefore: () => <img
            src="../../images/log.svg"
            alt=""
           
          />,
            subNav: [
              {
                title: 'Transaction History',
                itemId: '/admin/transactions',
                
                elemBefore: () => <img
                src="../../images/trans-history.svg"
                alt=""
                className={urls[2] === "transactions" ? "white-image" : ""}
              />,
              },
              {
                title: 'Admin Reward History',
                itemId: '/admin/reward_history',
                
                elemBefore: () => <img
                src="../../images/trans-history.svg"
                alt=""
                className={urls[2] === "reward_history" ? "white-image" : ""}
              />,
              },
              {
                title: 'User Reward History',
                itemId: '/admin/user_reward_history',
                
                elemBefore: () => <img
                src="../../images/trans-history.svg"
                alt=""
                className={urls[2] === "user_reward_history" ? "white-image" : ""}
              />,
              },
              {
                title: 'Stake History',
                itemId: '/admin/stake-history',
                
                elemBefore: () => <img
                src="../../images/trans-history.svg"
                alt=""
                className={urls[2] === "stake-history" ? "white-image" : ""}
              />,
              },
            ],
          },

          {
            title: 'Account Settings',
            itemId: '/admin/settings',
            
            elemBefore: () => <img
            src="../../images/settings.svg"
            alt=""
            className={urls[2] === "settings" ? "white-image" : ""}
          />,
          },


         

        ]}
      />
        {/* <ul className="flex flex-col space-y-1">
          <li>
            <Link
              to="/admin/dashboard"
              className={
                urls[2] === "dashboard"
                  ? "relative flex flex-row items-center h-11 focus:outline-none  pr-6 bg-blue-500 text-white "
                  : "relative flex flex-row items-center h-11 focus:outline-none hover:text-white-800 pr-6"
              }
            >
              <span className="inline-flex justify-center items-center ml-4">
                <img
                  src="../../images/home.svg"
                  alt=""
                  className={urls[2] === "dashboard" ? "white-image" : ""}
                />
              </span>
              <span className="ml-2 text-sm font-semibold tracking-wide truncate ">
                Dashboard
              </span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/users"
              className={
                urls[2] === "users"
                  ? "relative flex flex-row items-center h-11 focus:outline-none  pr-6 bg-blue-500 text-white "
                  : "relative flex flex-row items-center h-11 focus:outline-none hover:text-white-800 pr-6"
              }
            >
              <span className="inline-flex justify-center items-center ml-4">
                <img
                  src="../../images/users.svg"
                  alt=""
                  className={urls[2] === "users" ? "white-image" : ""}
                />
              </span>
              <span className="ml-2 text-sm font-semibold tracking-wide truncate ">
                Users
              </span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/batches"
              className={
                urls[2] === "batches"
                  ? "relative flex flex-row items-center h-11 focus:outline-none  pr-6 bg-blue-500 text-white "
                  : "relative flex flex-row items-center h-11 focus:outline-none hover:text-white-800 pr-6"
              }
            >
              <span className="inline-flex justify-center items-center ml-4">
                <img
                  src="../../images/batches.svg"
                  alt=""
                  className={urls[2] === "batches" ? "white-image" : ""}
                />
              </span>
              <span className="ml-2 text-sm font-semibold tracking-wide truncate ">
                Batches
              </span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/elx-stalking"
              className={
                urls[2] === "elx-stalking"
                  ? "relative flex flex-row items-center h-11 focus:outline-none  pr-6 bg-blue-500 text-white "
                  : "relative flex flex-row items-center h-11 focus:outline-none hover:text-white-800 pr-6"
              }
            >
              <span className="inline-flex justify-center items-center ml-4">
                <img
                  src="../../images/staking.svg"
                  alt=""
                  className={urls[2] === "elx-stalking" ? "white-image" : ""}
                />
              </span>
              <span className="ml-2 text-sm font-semibold tracking-wide truncate ">
              Staking
              </span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/rewards"
              className={
                urls[2] === "rewards"
                  ? "relative flex flex-row items-center h-11 focus:outline-none  pr-6 bg-blue-500 text-white "
                  : "relative flex flex-row items-center h-11 focus:outline-none hover:text-white-800 pr-6"
              }
            >
              <span className="inline-flex justify-center items-center ml-4">
                <img
                  src="../../images/award.svg"
                  alt=""
                  className={urls[2] === "rewards" ? "white-image" : ""}
                />
              </span>
              <span className="ml-2 text-sm font-semibold tracking-wide truncate ">
              Rewards
              </span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/buy-elx"
              className={
                urls[2] === "buy-elx"
                  ? "relative flex flex-row items-center h-11 focus:outline-none  pr-6 bg-blue-500 text-white "
                  : "relative flex flex-row items-center h-11 focus:outline-none hover:text-white-800 pr-6"
              }
            >
              <span className="inline-flex justify-center items-center ml-4">
                <img
                  src="../../images/basket.svg"
                  alt=""
                  className={urls[2] === "buy-elx" ? "white-image" : ""}
                />
              </span>
              <span className="ml-2 text-sm font-semibold tracking-wide truncate ">
                Buy ELX
              </span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/buy-bnb"
              className={
                urls[2] === "buy-bnb"
                  ? "relative flex flex-row items-center h-11 focus:outline-none  pr-6 bg-blue-500 text-white "
                  : "relative flex flex-row items-center h-11 focus:outline-none hover:text-white-800 pr-6"
              }
            >
              <span className="inline-flex justify-center items-center ml-4">
                <img
                  src="../../images/basket.svg"
                  alt=""
                  className={urls[2] === "buy-bnb" ? "white-image" : ""}
                />
              </span>
              <span className="ml-2 text-sm font-semibold tracking-wide truncate ">
                Buy BNB
              </span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/reward-config"
              className={
                urls[2] === "reward-config"
                  ? "relative flex flex-row items-center h-11 focus:outline-none  pr-6 bg-blue-500 text-white "
                  : "relative flex flex-row items-center h-11 focus:outline-none hover:text-white-800 pr-6"
              }
            >
              <span className="inline-flex justify-center items-center ml-4">
                <img
                  src="../../images/award.svg"
                  alt=""
                  className={urls[2] === "reward-config" ? "white-image" : ""}
                />
              </span>
              <span className="ml-2 text-sm font-semibold tracking-wide truncate ">
                Configuration
              </span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/fees-config"
              className={
                urls[2] === "fees-config"
                  ? "relative flex flex-row items-center h-11 focus:outline-none  pr-6 bg-blue-500 text-white "
                  : "relative flex flex-row items-center h-11 focus:outline-none hover:text-white-800 pr-6"
              }
            >
              <span className="inline-flex justify-center items-center ml-4">
                <img
                  src="../../images/award.svg"
                  alt=""
                  className={urls[2] === "fees-config" ? "white-image" : ""}
                />
              </span>
              <span className="ml-2 text-sm font-semibold tracking-wide truncate ">
                Fees Configuration
              </span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/transactions"
              className={
                urls[2] === "transactions"
                  ? "relative flex flex-row items-center h-11 focus:outline-none  pr-6 bg-blue-500 text-white "
                  : "relative flex flex-row items-center h-11 focus:outline-none hover:text-white-800 pr-6"
              }
            >
              <span className="inline-flex justify-center items-center ml-4">
                <img
                  src="../../images/trans-history.svg"
                  alt=""
                  className={urls[2] === "transactions" ? "white-image" : ""}
                />
              </span>
              <span className="ml-2 text-sm font-semibold tracking-wide truncate ">
                Transaction History
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/reward_history"
              className={
                urls[2] === "reward_history"
                  ? "relative flex flex-row items-center h-11 focus:outline-none  pr-6 bg-blue-500 text-white "
                  : "relative flex flex-row items-center h-11 focus:outline-none hover:text-white-800 pr-6"
              }
            >
              <span className="inline-flex justify-center items-center ml-4">
                <img
                  src="../../images/trans-history.svg"
                  alt=""
                  className={urls[2] === "reward_history" ? "white-image" : ""}
                />
              </span>
              <span className="ml-2 text-sm font-semibold tracking-wide truncate ">
               Admin Reward History
              </span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/user_reward_history"
              className={
                urls[2] === "user_reward_history"
                  ? "relative flex flex-row items-center h-11 focus:outline-none  pr-6 bg-blue-500 text-white "
                  : "relative flex flex-row items-center h-11 focus:outline-none hover:text-white-800 pr-6"
              }
            >
              <span className="inline-flex justify-center items-center ml-4">
                <img
                  src="../../images/trans-history.svg"
                  alt=""
                  className={urls[2] === "user_reward_history" ? "white-image" : ""}
                />
              </span>
              <span className="ml-2 text-sm font-semibold tracking-wide truncate ">
                User Reward History
              </span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/settings"
              className={
                urls[2] === "settings"
                  ? "relative flex flex-row items-center h-11 focus:outline-none  pr-6 bg-blue-500 text-white "
                  : "relative flex flex-row items-center h-11 focus:outline-none hover:text-white-800 pr-6"
              }
            >
              <span className="inline-flex justify-center items-center ml-4">
                <img
                  src="../../images/settings.svg"
                  alt=""
                  className={urls[2] === "settings" ? "white-image" : ""}
                />
              </span>
              <span className="ml-2 text-sm font-semibold tracking-wide truncate ">
              Account Settings
              </span>
            </Link>
          </li>
        </ul> */}

        
      </div>
    </div>
    </>
  );
};
export default Sidebar;
