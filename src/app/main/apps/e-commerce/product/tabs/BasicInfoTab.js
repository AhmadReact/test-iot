import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

import { Button, Tab, Tabs } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import Swal from 'sweetalert2';
import { Box } from '@mui/system';

import { useSelector } from 'react-redux';
import { simsOrderingLimit } from 'src/app/constraint/constraints';

import OrderSummaryModified from 'app/shared-components/OrderSummaryModified';

function BasicInfoTab(props) {
  const handleChange = (event) => {
    props.setdesc(event.target.value);
  };
  const handleinput = (e) => {
    if (e.target.value > 0 || e.target.value === '') {
      props.setqty(e.target.value);
    }
  };

  const addItem = (type) => {
    if (props.qty > simsOrderingLimit) {
      Swal.fire({
        icon: 'info',
        title: 'Quantity error',
        text: `Please enter maximum ${simsOrderingLimit} sims at a time.`,
      });
      return;
    }

    props.setloading2(true);

    props
      .processCartOrder(type)
      .then((result) => {
        props.setloading2(false);
      })
      .catch((error) => {
        props.setloading2(false);
      });
  };

  const [loading, setloading] = useState(false);

  const [tabValue, setTabValue] = useState(0);
  function handleChangeTab(event, value) {
    props.setdesc('');
    props.setqty('');
    setTabValue(value);
  }
  const loadingSummary = useSelector((state) => {
    return state.loader;
  });

  return (
    <>
      <div className="flex gap-x-24 p-24  flex-col md:flex-col lg:flex-row sm:flex-col">
        <div
          className=" h-fit p-24 rounded-2xl shadow basis-2/3 mb-24 lg:mb-0 flex flex-col gap-x-20 justify-start"
          style={{
            backgroundColor: '#fff',
            padding: 15,
            margin: '0px 10px 0px 10px',
            borderRadius: 10,
          }}
        >
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
              label="Sims & Devices"
            />
            {props.gateways.length > 0 && (
              <Tab
                className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
                disableRipple
                label="One Offs"
              />
            )}
          </Tabs>
          {tabValue === 0 && (
            <>
              {' '}
              <TextField
                className="mt-8 mb-16 w-full sm:w-1/2 md:w-full"
                required
                onChange={(e) => handleinput(e)}
                label="Quantity"
                autoFocus
                id="name"
                variant="outlined"
                value={props.qty}
              />
              <TextField
                id="outlined-select-currency"
                select
                label="Select"
                value={props.desc}
                onChange={(e) => handleChange(e)}
                helperText="Please select your sim"
                className="w-full sm:w-1/2 md:w-full"
                required
              >
                {props.sims &&
                  props.sims.map((obj, i) => {
                    return (
                      <MenuItem key={i} value={obj}>
                        {obj.name}
                      </MenuItem>
                    );
                  })}
              </TextField>
              <div className="flex flex-row sm:flex-row flex-auto sm:items-center min-w-0 pr-0 p-20 md:pt-20 pb-0 md:pb-0">
                <div className="flex flex-col flex-auto" />
                <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
                  {props.loading2 ? (
                    <LoadingButton
                      loading
                      loadingPosition="start"
                      className=" whitespace-nowrap"
                      startIcon={<SaveIcon />}
                      variant="outlined"
                    >
                      Processing..
                    </LoadingButton>
                  ) : (
                    <Button
                      className="whitespace-nowrap"
                      variant="contained"
                      color="secondary"
                      onClick={() => addItem('sims')}
                      // onClick={placeorder}
                      disabled={
                        loadingSummary === 'loading' ? true : !(props.qty > 0 && props.desc)
                      }
                    >
                      Add item
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}

          {tabValue == 1 && (
            <>
              {' '}
              <TextField
                className="mt-8 mb-16 w-full sm:w-1/2 md:w-full"
                required
                onChange={(e) => handleinput(e)}
                label="Quantity"
                autoFocus
                id="name"
                variant="outlined"
                value={props.qty}
              />
              <TextField
                id="outlined-select-currency"
                select
                label="Select"
                value={props.desc}
                onChange={(e) => handleChange(e)}
                helperText="Please select your product"
                className="w-full sm:w-1/2 md:w-full"
                required
              >
                {props.gateways &&
                  props.gateways.map((obj, i) => {
                    return (
                      <MenuItem key={i} value={obj}>
                        {obj.name}
                      </MenuItem>
                    );
                  })}
              </TextField>
              <div className="flex flex-row sm:flex-row flex-auto sm:items-center min-w-0 pr-0 p-20 md:pt-20 pb-0 md:pb-0">
                <div className="flex flex-col flex-auto" />
                <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
                  {props.loading2 ? (
                    <LoadingButton
                      loading
                      loadingPosition="start"
                      className=" whitespace-nowrap"
                      startIcon={<SaveIcon />}
                      variant="outlined"
                    >
                      Processing..
                    </LoadingButton>
                  ) : (
                    <Button
                      className="whitespace-nowrap"
                      variant="contained"
                      color="secondary"
                      onClick={() => addItem('one_offs')}
                      // onClick={placeorder}
                      disabled={
                        loadingSummary === 'loading' ? true : !(props.qty > 0 && props.desc)
                      }
                    >
                      Add item
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="basis-1/3">
          {props.itemsArray.summary.length > 0 && (
            <OrderSummaryModified
              // desc={props.desc}
              itemsArray={props.itemsArray}
              setitemsArray={props.setitemsArray}
              qty={2}
              removable
              orderhash={props.orderhash}
              isLock={props.isLock}
              tooltip={false}
              setrefresh={props.setrefresh}
              tabValue={props.tabValue}
            />
          )}
        </div>
      </div>

      {props.itemsArray.summary.length > 0 && (
        <div className="flex flex-row sm:flex-row flex-auto sm:items-center min-w-0 p-20  md:pt-20 pb-0 md:pb-0">
          <div className="flex flex-col flex-auto" />
          <div className="flex items-center mb-28 mt-24 sm:mt-0 sm:mx-8 space-x-12">
            {loading ? (
              <LoadingButton
                loading
                loadingPosition="start"
                className=" whitespace-nowrap"
                startIcon={<SaveIcon />}
                variant="outlined"
              >
                Processing..
              </LoadingButton>
            ) : (
              <Button
                className="whitespace-nowrap"
                variant="contained"
                color="secondary"
                onClick={() => {
                  setloading(true);
                  props.placeorder().then((result) => {
                    setloading(false);
                  });
                }}
                disabled={
                  loadingSummary === 'loading' ? true : !(props.itemsArray.summary.length > 0)
                }
              >
                Place Order
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default BasicInfoTab;
