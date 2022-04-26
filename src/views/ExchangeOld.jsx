import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from "../components/common/Spinner";
import alertService from "../services/alert.service";
import { useNavigate } from 'react-router-dom';
import elxService from "../services/elx.service";
import { ErrorMessage, Field, Form, Formik } from "formik";
import TextError from "../components/common/TextError";
import * as Yup from "yup";
import blockchainService from "../services/blockchain.service";
import userService from "../services/user.service";
import { useDispatch } from "react-redux";
import { setMessage } from '../actions/message';
import bridgeService from '../services/bridge.service';



const Exchange = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [elxPrice, setElxPrice] = useState(0);
  const [decimal, setDecimal] = useState(0);
  const [elxAmount, setElxAmount] = useState("");
  const [elxAmountBNB, setElxAmountBNB] = useState("");
  const [exchnageType, setExchnageType] = useState("EthToBnb");
  const [bnbBalance, setBnbBalance] = useState(0);


  useEffect(() => {
    const getElxPrice = async () => {
      setLoading(true);
      try {
        let response = await elxService.getElxPrice();
        setElxPrice(response.exchangeRate);
        setDecimal(response.decimal);
        setLoading(false);

      } catch (error) {
        setLoading(false);
        alertService.showError(error.message);
      }
    };

    (async () => {
      await getElxPrice();
      await getBnbBalance();
    })();
  }, []);

  const initialValues = {
    _elxAmount: elxAmount,
    _elxAmountBnb: elxAmountBNB,


  };


  // get BNB balance
  const getBnbBalance = async () => {

    try {
      let _walletDetails = await blockchainService.getWalletDetails();
      let _bnbBalance = Number(_walletDetails.data.walletBalance);
      _bnbBalance = _bnbBalance.toFixed(4);
      setBnbBalance(_bnbBalance)
      // console.log("_bnbBalance",_bnbBalance)

    } catch (error) {

      alertService.showError(error.message);
    }
  };

  const validationSchema = Yup.object().shape({
    _elxAmount: Yup.number()
      .required("ELX Amount is required")
      .typeError('you must specify a number')
      .moreThan(0, 'Min value 0.')
      .max(bnbBalance * elxPrice, `Amount should be less than ${bnbBalance * elxPrice} Elx.`),
    _elxAmountBnb: Yup.number()
      .required("Amount is required")
      .typeError('you must specify a number')
      .moreThan(0, 'Min value 0.')
      .max(bnbBalance, `Amount should be less than ${bnbBalance} BNB.`)
      .test('len', 'Must be less than 7 characters', val => val ? val.toString().length < 8 : '')
  });


  const purchaseElx = async (_formInput) => {
    try {

      //check bnb balance
      let totalInputBnb = elxAmount / elxPrice;
      if (bnbBalance < totalInputBnb) {
        alertService.showError("Not suffician BNB to purchase ELX");
        return
      }

      _formInput._bnbAmount = (elxAmount / elxPrice) * Math.pow(10, decimal);
      setLoading(true)
      _formInput._bnbAmount = 100

      let walletAddress = await userService.getAdminWalletAddress();
      if (walletAddress.status != 'success') {
        alertService.showError(walletAddress.message);
        return
      }
      let checkAllowance = await userService.getAllowanceForAll(walletAddress.data);

      if (checkAllowance.status === 'success') {
        let _response = await bridgeService.bnbToEth(_formInput);
        if (_response.status === 'failure') {
          setLoading(false)
          alertService.showError(_response.message);

        } else {
          let _txHash = _response.data.hash;

          setLoading(false);

          let pendingMsg = {
            status: true,
            type: "pending",
            message: "Your transaction is in process",
            data: _txHash,
            showOkButton: false,
          }

          dispatch(setMessage(pendingMsg));

          await _response.data.wait();


          let completeMsg = {
            status: true,
            type: "success",
            message: "ELX Purchased",
            data: _txHash,
            showOkButton: true,
          }
          dispatch(setMessage(completeMsg));

          setLoading(false);
          setElxAmount("");
          setElxAmountBNB("");

        }

      }
      else {
        setLoading(false)
        alertService.showError(checkAllowance.message);
      }
    } catch (error) {

      alertService.showError(error.message);

    }
  }

  const ExchangeType = (value) => {
    setExchnageType(value)
  }

  const updateElxAmount = (value) => {
    setElxAmount(value)
    setElxAmountBNB(value / elxPrice)
  }
  const updateBnbAmount = (value) => {
    setElxAmountBNB(value)
    setElxAmount(value * elxPrice)
  }


  return (
    <div className="flex justify-center items-center h-full">
      {loading && <Spinner />}
      <div className="relative lg:w-1/2 mx-auto max-w-full ">
        {/*content*/}
        <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          {/*header*/}

          {/*body*/}
          <div className="relative lg:px-8 lg:py-12 p-4 flex-auto">
            <h3 className="text-2xl text-coalblack font-semibold leading-normal mb-4">
              Fastest cross-chain swaps
            </h3>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={purchaseElx}
              enableReinitialize
            >

              <Form autoComplete="off">
                <label htmlFor="email" style={{ display: 'block' }}>
                  Exchange To
                </label>
                <Field as="select" name="color" onChange={(e) => ExchangeType(e.target.value)} value={exchnageType} className="border text-coalblack sm:text-sm rounded-lg focus:shadow-sm block mb-2 p-3 pl-14">
                  <option value="EthToBnb">Eth to BnB</option>
                  <option value="BnbToEth">BnB to Eth</option>
                </Field>
                {
                  exchnageType == 'EthToBnb' &&
                  <div>
                    <img width={30} height={30} src="/images/ethereum.png" />
                    <Field type="text" name="_elxAmount" id="_elxAmount" onChange={(e) => updateElxAmount(e.target.value)} value={elxAmount} className="border text-coalblack sm:text-sm rounded-lg focus:shadow-sm block mb-2 p-3 pl-14" placeholder="Enter Eth Amount" required="" />
                    <div>
                      <svg _ngcontent-glb-c54="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 cust-icon"><path _ngcontent-glb-c54="" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                    </div>

                    <img width={30} height={30} src="/images/bnb-icon.svg" />
                    <Field type="text" name="_elxAmount" id="_elxAmount" onChange={(e) => updateElxAmount(e.target.value)} value={elxAmount} className="border text-coalblack sm:text-sm rounded-lg focus:shadow-sm block mb-2 p-3 pl-14" placeholder="Enter BnB Amount" required="" />

                  </div>
                }

                {
                  exchnageType == 'BnbToEth' &&
                  <div>
                    <img width={30} height={30} src="/images/bnb-icon.svg" />
                    <Field type="text" name="_elxAmount" id="_elxAmount" onChange={(e) => updateElxAmount(e.target.value)} value={elxAmount} className="border text-coalblack sm:text-sm rounded-lg focus:shadow-sm block mb-2 p-3 pl-14" placeholder="Enter BnB Amount" required="" />
                    <div>
                      <svg _ngcontent-glb-c54="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 cust-icon"><path _ngcontent-glb-c54="" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                    </div>


                    <img width={30} height={30} src="/images/ethereum.png" />
                    <Field type="text" name="_elxAmount" id="_elxAmount" onChange={(e) => updateElxAmount(e.target.value)} value={elxAmount} className="border text-coalblack sm:text-sm rounded-lg focus:shadow-sm block mb-2 p-3 pl-14" placeholder="Enter Eth Amount" required="" />
                  </div>
                }
                <button type="submit" className="text-sm text-center  mt-4 px-4 py-3 bg-blue-600 rounded-md text-white outline-none shadow-lg flex">
                  <span className="text-center mx-auto text-sm font-semibold">Confirm</span>
                </button>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Exchange