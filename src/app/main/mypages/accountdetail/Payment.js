import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';

import {
  getcustomeraccounts,
  getcustomercards,
  getcustomerdetail,
  UpdateCustomerInformation,
} from '../../services/services';

import img from './pulse.svg';
import ListCard from './ListCard';
import AddCreditCard from './AddCreditCard';
import AddBankAccount from './AddBankAccount';
import CustomizedAccordionsBanks from './Accordianbanks';

import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';

const Payment = ({ customerdetail, setcustomerdetail }) => {
  const [loader, setloader] = useState(false);
  const [loading, setloading] = useState(true);
  const AutopayHandler = (mode, noSwal) => {
    setloader(true);
    UpdateCustomerInformation({
      auto_pay: mode == 'off' ? 0 : customerdetail.auto_pay == 0 ? 1 : 0,
    }).then((res) => {
      setloader(false);
      if (res.message === 'sucessfully Updated') {
        // props.UpdateUserInfoAction({ key1, val1 });
        setcustomerdetail({
          ...customerdetail,
          auto_pay: mode || (customerdetail.auto_pay === 0 ? 1 : 0),
        });
        getcustomerdetail().then(() => {});
        if (!noSwal) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Auto pay changes Done',
          });
        }
      }
    });
  };
  const [refreshCard, setRefreshCard] = useState(0);
  const [refreshAccount, setRefreshAccount] = useState(0);

  const [customercards, setcustomercards] = useState([]);
  const [customeraccounts, setcustomeraccounts] = useState([]);
  function handleChangeTab(event, value) {
    setTabValue(value);
  }

  const promises = [];
  useEffect(() => {
    const cardpromise = getcustomercards().then((result) => {
      setloading(false);
      setcustomercards(result);
      return result;
    });
    promises.push(cardpromise);
  }, [refreshCard]);

  useEffect(() => {
    const accountpromise = getcustomeraccounts().then((result) => {
      if (result.status == 'success') setcustomeraccounts(result.data);
      return result.data;
    });

    promises.push(accountpromise);
  }, [refreshAccount]);

  useEffect(() => {
    Promise.all(promises).then((result) => {
      if (result[0].length == 0 && result[1].length == 0) {
        setTabValue(0);
      } else if (result[0].length == 0) {
        setTabValue(1);
      } else if (result[1].length === 0) {
        setTabValue(0);
      } else {
        setTabValue(result[0].some((obj) => obj.is_primary) ? 0 : 1);
      }
    });

    // setTabValue()
  }, []);

  const [tabValue, setTabValue] = useState(0);

  return (
    <>
      {' '}
      <div className="md:px-32">
        {' '}
        <div className="md:my-10">
          <FormControlLabel
            value="end"
            // ()=>setcustomerdetail({...customerdetail,auto_pay:!customerdetail.auto_pay})
            control={
              <Checkbox
                checked={customerdetail.auto_pay == 1 ? 1 : 0}
                onChange={() => AutopayHandler()}
              />
            }
            label="Enroll in Auto-Pay Uncheck to Opt-Out of Auto-Pay"
            labelPlacement="end"
            className="md:mt-10 md:mr-1"
          />
          {loader && (
            <img
              className="inline w-[50px] scale-y-[1.8] scale-x-[1.2] ml-5"
              src={img}
              alt="loading"
            />
          )}
        </div>
        <hr className="md:mb-10" />
      </div>
      <div className="md:px-32">
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          indicatorColor="secondary"
          textColor="inherit"
          variant="scrollable"
          scrollButtons={false}
          className="w-full  py-10 mb-5 -mx-4 min-h-40"
          classes={{
            indicator: 'flex justify-center bg-transparent w-full h-full',
          }}
          TabIndicatorProps={{
            children: (
              <Box
                sx={{ bgcolor: 'text.disabled' }}
                className="w-full h-full rounded-full opacity-20"
              />
            ),
          }}
        >
          <Tab
            className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
            disableRipple
            label="Credit"
          />
          <Tab
            className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
            disableRipple
            label="Bank"
          />
        </Tabs>
        {!loading ? (
          <>
            {tabValue === 0 && (
              <div className="md:w-[100%] md:flex">
                <div className="md:w-[50%] md:border-r-2 md:pr-8">
                  <AddCreditCard
                    customerdetail={customerdetail}
                    setcustomercards={setcustomercards}
                  />
                </div>
                <div className="md:w-[50%] md:ml-8">
                  <ListCard
                    AutopayHandler={AutopayHandler}
                    setRefreshAccount={setRefreshAccount}
                    customercards={customercards}
                    setcustomercards={setcustomercards}
                  />
                </div>
              </div>
            )}
            {tabValue === 1 && (
              <div className="md:w-[100%] md:flex">
                <div className="md:w-[50%] md:border-r-2 md:pr-8">
                  <AddBankAccount setcustomeraccounts={setcustomeraccounts} />
                </div>
                <div className="md:w-[50%] md:ml-8">
                  <CustomizedAccordionsBanks
                    AutopayHandler={AutopayHandler}
                    setRefreshCard={setRefreshCard}
                    customeraccounts={customeraccounts}
                    setcustomeraccounts={setcustomeraccounts}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <FuseLoading />
          </div>
        )}
      </div>
    </>
  );
};

export default Payment;
