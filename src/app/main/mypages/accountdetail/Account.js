import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import { useLocation } from 'react-router-dom';

import secureLocalStorage from 'react-secure-storage';
import Swal from 'sweetalert2';

import checkSignin from '../../customHook.js/checkSignin';

import { getcustomerdetail } from '../../services/services';

import Payment from './Payment';
import Security from './Security';
import Billing from './Billing';
import { Shipping } from './Shipping';
import Accountsetting from './Accountsetting';

import FuseLoading from '@fuse/core/FuseLoading';

const Account = () => {
  const [customerdetail, setcustomerdetail] = useState();

  checkSignin();
  useEffect(() => {
    getcustomerdetail()
      .then((result) => {
        setcustomerdetail(result);
        setloading(true);
      })
      .catch((res) => {
        Swal.fire({
          icon: 'error',
          title: 'Server error',
          text: 'Error',
        });
      });
  }, []);

  function handleChangeTab(event, value) {
    setTabValue(value);
  }
  const [tabValue, setTabValue] = useState(0);
  const [loading, setloading] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (location.state && location.state.open === 'payment') {
      setTabValue(4);
    }
  }, []);

  document.title = 'Account Profile';
  return (
    <>
      <div className="flex w-full container">
        <div className="flex flex-col sm:flex-row flex-auto sm:items-end min-w-0 p-24 md:p-32 pb-0 md:pb-0">
          <div className="flex flex-col flex-auto">
            <motion.div
              className="flex"
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.3 } }}
            >
              <Typography className="text-3xl font-semibold tracking-tight leading-8">
                Account Profile
              </Typography>{' '}
            </motion.div>
            {secureLocalStorage.getItem('user_info') &&
              JSON.parse(secureLocalStorage.getItem('user_info')).account_suspended == 1 && (
                <Typography className="text-red-600 font-medium text-lg">
                  Account Suspended
                </Typography>
              )}
          </div>
        </div>
      </div>

      <div className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0">
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          indicatorColor="secondary"
          textColor="inherit"
          variant="scrollable"
          scrollButtons={false}
          className="w-full px-24 -mx-4 min-h-40"
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
            label="Profile"
          />
          <Tab
            className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
            disableRipple
            label="Security"
          />
          <Tab
            className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
            disableRipple
            label="Shipping Address"
          />
          <Tab
            className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
            disableRipple
            label="Billing Address"
          />
          <Tab
            className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
            disableRipple
            label="Payment"
          />
        </Tabs>
        {loading ? (
          <>
            {tabValue === 0 && (
              <Accountsetting
                customerdetail={customerdetail}
                setcustomerdetail={setcustomerdetail}
              />
            )}
            {tabValue === 1 && (
              <Security customerdetail={customerdetail} setcustomerdetail={setcustomerdetail} />
            )}
            {tabValue === 2 && (
              <Shipping customerdetail={customerdetail} setcustomerdetail={setcustomerdetail} />
            )}
            {tabValue === 3 && (
              <Billing customerdetail={customerdetail} setcustomerdetail={setcustomerdetail} />
            )}
            {tabValue === 4 && (
              <Payment customerdetail={customerdetail} setcustomerdetail={setcustomerdetail} />
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

export default Account;
