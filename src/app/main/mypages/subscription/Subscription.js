import { useState } from 'react';

import { Tab, Tabs } from '@mui/material';
import { Box } from '@mui/system';
import { useSelector } from 'react-redux';

import checkSignin from '../../customHook.js/checkSignin';

import CommonTable from './CommonTable';

const Subscription = () => {
  checkSignin();

  const [tabValue, setTabValue] = useState(0);

  document.title = 'Subscriptions';

  function handleChangeTab(event, value) {
    setTabValue(value);
  }
  const { user } = useSelector((state) => {
    return state;
  });
  return (
    <>
      <div className="md:p-32 md:pb-0">
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
            label="Standard Subscription"
          />
          {user.str == true && (
            <Tab
              className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
              disableRipple
              label="Standard Recurring Plan"
            />
          )}
        </Tabs>
      </div>
      {tabValue == 0 && (
        <>
          <CommonTable heading="Active / Pending Lines" type="customer-plans" />

          <hr />

          <CommonTable heading="Closed Lines" type="closed-customer-plans" />
        </>
      )}

      {tabValue == 1 && (
        <>
          <CommonTable
            heading="Active / Pending Standard Recurring Plans"
            type="active-standard-recurring-plans"
          />

          <hr />

          <CommonTable
            heading="Closed Standard Recurring Plans"
            type="closed-standard-recurring-plans"
          />
        </>
      )}
    </>
  );
};

export default Subscription;
