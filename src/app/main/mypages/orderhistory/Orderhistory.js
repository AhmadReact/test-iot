import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';

import checkSignin from '../../customHook.js/checkSignin';

import CollapsibleTable from './CollapsableTable';

const Orderhistory = () => {
  checkSignin();
  const { user } = useSelector((state) => {
    return state;
  });

  document.title = 'Order history';

  // Add safety check to prevent black screen when user data is not loaded
  if (!user?.data?.detail) {
    return (
      <div className="flex w-full container">
        <div className="flex flex-col sm:flex-row flex-auto sm:items-end min-w-0 p-24 md:p-32 pb-0 md:pb-0">
          <div className="flex flex-col flex-auto">
            <motion.div
              className="flex"
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.3 } }}
            >
              <Typography className="text-3xl font-semibold tracking-tight leading-8">
                Order History
              </Typography>
            </motion.div>
            <Typography className="text-gray-600 font-medium text-lg">
              Loading user data...
            </Typography>
          </div>
        </div>
      </div>
    );
  }

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
                Order History
              </Typography>
            </motion.div>
            {user?.data?.detail && user.data.detail.account_suspended === 1 && (
              <Typography className="text-red-600 font-medium text-lg">
                Account Suspended
              </Typography>
            )}
          </div>
          <div />
        </div>
      </div>

      <div className="w-full flex flex-col  p-24 pt-[11px] " style={{ margin: '30px 0px 0px' }}>
        <CollapsibleTable />
      </div>
    </>
  );
};

export default Orderhistory;
