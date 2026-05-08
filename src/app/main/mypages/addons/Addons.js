import { useLayoutEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import secureLocalStorage from 'react-secure-storage';
import { Checkbox, Chip, LinearProgress, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Box } from '@mui/system';
import { useSelector } from 'react-redux';

import ProductsTableHead from '../../pages/ProductsTableHead';

import checkSignin from '../../customHook.js/checkSignin';
import Customdisabled from '../../pages/Customdisabled';
import {
  customerplansapi,
  getcustomersubscriptionfresh,
  listaddonapi,
} from '../../services/services';

import CheckoutAddons from './CheckoutAddons';

import FuseScrollbars from '@fuse/core/FuseScrollbars';

const Addons = () => {
  checkSignin();
  const [plans, setplans] = useState([]);
  const [plan, setplan] = useState('');
  const [customerplans, setcustomerplans] = useState([]);
  const [customerplan, setcustomerplan] = useState('');
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState({
    direction: 'desc',
    id: null,
  });

  const [selectall, setselectall] = useState(false);
  const [checked, setchecked] = useState(false);
  const [data, setdata] = useState([]);
  const [cdata, setcdata] = useState([]);
  const [loading2, setloading2] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [selectedno, setselectedno] = useState([]);
  const [operation, setoperation] = useState('');
  const [operations, setoperations] = useState(['Add', 'Remove']);
  const [formstep, setformstep] = useState(0);
  const [loading3, setloading3] = useState(false);
  function handleChangePage(event, value) {
    setchecked(false);

    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
    setPage(0);
  }

  const rows = [
    {
      id: 'order',
      align: 'center',
      disablePadding: false,
      label: 'Sim Number',
      sort: true,
    },
    {
      id: 'phoneno',
      align: 'center',
      disablePadding: false,
      label: 'Phone Number',
      sort: true,
    },
    {
      id: 'label',
      align: 'center',
      disablePadding: false,
      label: 'Label',
      sort: true,
    },

    {
      id: 'feature',
      align: 'center',
      disablePadding: false,
      label: 'Feature',
      sort: true,
    },
    {
      id: 'id',
      align: 'center',
      disablePadding: false,
      label: 'Plan Name',
      sort: true,
    },

    {
      id: 'month',
      align: 'center',
      disablePadding: false,
      label: 'Monthly Charge',
      sort: true,
    },

    {
      id: 'status',
      align: 'center',
      disablePadding: false,
      label: 'Status',
      sort: true,
    },
  ];

  function handleSelectAllClick(event) {
    // if (event.target.checked) {
    //   setchecked(
    //     checked.map((obj) => {
    //       return 1;
    //     })
    //   );
    // } else {
    //   setchecked(
    //     checked.map((obj) => {
    //       return 0;
    //     })
    //   );
    // }
    if (event.target.checked) {
      setSelected(data.map((n, id) => id));
      return;
    }
    setSelected([]);
    // if (event.target.checked) {
    //   setSelected(data.map((n) => n.id));
    //   return;
    // }
  }

  function handleRequestSort(event, property) {
    const id = property;
    let direction = 'desc';

    if (order.id === property && order.direction === 'desc') {
      direction = 'asc';
    }

    setOrder({
      direction,
      id,
    });
  }

  function handleDeselect() {
    setSelected([]);
  }

  useLayoutEffect(() => {
    customerplansapi().then((res) => {
      setplans(res);
    });
  }, []);

  const handler = (e) => {
    setselectedno([]);
    setoperation('');
    setdata([]);
    setcustomerplan('');
    setloading2(true);
    setPage(0);
    setplan(e.target.value);
    getcustomersubscriptionfresh(e.target.value.id).then((result) => {
      const [key, value] = Object.entries(result)[0];

      setdata(
        value.filter(
          (obj) =>
            obj.status_formated.toLowerCase().includes('active') &&
            obj.upgrade_downgrade_status == null
        )
      );
      setcdata(
        value.filter(
          (obj) =>
            obj.status_formated.toLowerCase().includes('active') &&
            obj.upgrade_downgrade_status == null
        )
      );
      setloading2(false);
    });

    listaddonapi(e.target.value.id).then((res) => {
      setcustomerplans(res);
    });
  };

  const handler2 = (e) => {
    setselectedno([]);
    setcustomerplan(e.target.value);
  };

  const setsellecteddata = () => {
    if (!checked) {
      setselectedno([...selectedno, ...data]);
    } else {
      // var filtered = selectedno.filter(function(el) { if(data.data.some(x=>x.id!=el.id)) return el });

      setselectedno([]);
    }
  };

  function handleCheck(obj) {
    if (selectedno.some((x) => x.id === obj.id)) {
      const filtered = selectedno.filter(function (el) {
        return el.id != obj.id;
      });
      setselectedno(filtered);
    } else {
      setselectedno([...selectedno, obj]);
    }
  }

  const checkfeature = (e) => {
    setselectedno([]);
    setoperation(e.target.value);
    let tmp = [];
    if (e.target.value === 'add') {
      // eslint-disable-next-line array-callback-return,consistent-return
      tmp = cdata.filter((obj) => {
        if (obj.subscription_addon_not_removed.length > 0) {
          if (
            obj.subscription_addon_not_removed.some(
              (obj2) => obj2.addons.name !== customerplan.name
            )
          ) {
            return obj;
          }
        } else {
          return obj;
        }
      });
    } else {
      // eslint-disable-next-line array-callback-return,consistent-return
      tmp = cdata.filter((obj) => {
        if (obj.subscription_addon_not_removed.length > 0) {
          if (
            obj.subscription_addon_not_removed.some(
              (obj2) => obj2.addons.name === customerplan.name
            )
          ) {
            return obj;
          }
        }
      });
    }

    setdata(tmp);
  };

  const { user } = useSelector((state) => {
    return state;
  });

  return (
    <>
      {formstep === 0 && (
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
                    Add/Remove Addons
                  </Typography>{' '}
                </motion.div>
                {user?.data?.detail && user.data.detail.account_suspended === 1 && (
                  <Typography className="text-red-600 font-medium text-lg">
                    Account Suspended
                  </Typography>
                )}

                <div
                  style={{ rowGap: 15, marginTop: 30 }}
                  className="flex flex-col gap-x-20 justify-center"
                >
                  <TextField
                    id="outlined-select-currency"
                    select
                    label="Select"
                    value={plan}
                    onChange={(e) => handler(e)}
                    helperText="Please select your plan"
                    style={{ width: '50%' }}
                    required
                    InputLabelProps={{
                      style: { color: '#de0505' },
                    }}
                  >
                    {plans &&
                      plans.map((obj, i) => {
                        return (
                          <MenuItem key={i} value={obj}>
                            {obj.name}
                          </MenuItem>
                        );
                      })}
                  </TextField>

                  <TextField
                    id="outlined-select-currency2"
                    select
                    label="Select"
                    value={customerplan}
                    onChange={(e) => {
                      // eslint-disable-next-line no-unused-expressions,no-sequences
                      handler2(e), setoperation('');
                    }}
                    helperText="Please select addon"
                    style={{ width: '50%' }}
                    required
                    InputLabelProps={{
                      style: { color: '#de0505' },
                    }}
                    disabled={plan === ''}
                  >
                    {customerplans &&
                      customerplans.map((obj, i) => {
                        return (
                          <MenuItem key={i} value={obj}>
                            {obj.name}
                          </MenuItem>
                        );
                      })}
                  </TextField>

                  <TextField
                    id="outlined-select-currency"
                    select
                    label="Select"
                    onChange={(e) => checkfeature(e)}
                    value={operation}
                    helperText="Please select operation"
                    style={{ width: '50%' }}
                    required
                    InputLabelProps={{
                      style: { color: '#de0505' },
                    }}
                    disabled={customerplan === '' || loading2 === true}
                  >
                    {operations.map((obj, i) => {
                      return (
                        <MenuItem value={obj.toLocaleLowerCase()} key={i}>
                          {obj}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col  p-24 pt-[11px] mt-10">
            <FuseScrollbars className="grow overflow-x-auto">
              <Table stickyHeader className="min-w-xl" aria-labelledby="collapsible table">
                <ProductsTableHead
                  selectedProductIds={selected}
                  order={order}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  onMenuItemClick={handleDeselect}
                  setselecteddata={setsellecteddata}
                  selectall={selectall}
                  checked={checked}
                  setchecked={setchecked}
                  rows={rows}
                />

                <TableBody style={{ backgroundColor: '#fff' }}>
                  {data.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={13} style={{ textAlign: 'center' }}>
                        {loading2 ? (
                          <Box sx={{ width: '100%' }}>
                            <LinearProgress color="secondary" />
                          </Box>
                        ) : (
                          <>No data found</>
                        )}
                      </TableCell>
                    </TableRow>
                  )}

                  {/* eslint-disable-next-line no-undef */}
                  {_.orderBy(
                    data,
                    [
                      (o) => {
                        switch (order.id) {
                          case 'simnum': {
                            return o.sim_card_num;
                          }
                          case 'status': {
                            return o.status_formated;
                          }
                          case 'month': {
                            return o.plan.amount_recurring;
                          }
                          case 'datausage': {
                            if (o.usage_data) {
                              return o.usage_data ? o.usage_data.data : 0;
                            }
                            if (o.att_two_usage_data) {
                              return o.att_two_usage_data ? o.att_two_usage_data.usage_data : 0;
                            }
                          }
                          // eslint-disable-next-line no-fallthrough
                          case 'smsusage': {
                            return o.usage_data ? o.usage_data.sms : 0;
                          }
                          case 'voiceusage': {
                            return o.usage_data ? o.usage_data.voice : 0;
                          }
                          case 'phoneno': {
                            return o.phone_number;
                          }
                          case 'activation_date': {
                            return o.activation_date;
                          }
                          case 'close_date': {
                            return o.closed_date;
                          }

                          default: {
                            return o.order_id;
                          }
                        }
                      },
                    ],
                    [order.direction]
                  )
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((obj, j) => {
                      const isiamSelected = selected.indexOf(j) !== -1;
                      return (
                        <>
                          <TableRow
                            className="h-[20px] text-[1.1rem] cursor-pointer"
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={j}
                            selected={isiamSelected}
                          >
                            <TableCell className="w-64 text-center" padding="none">
                              <Checkbox
                                checked={selectedno.some((x) => x.id === obj.id)}
                                onClick={(event) => {
                                  event.stopPropagation();
                                }}
                                onChange={() => handleCheck(obj)}
                              />
                            </TableCell>
                            <TableCell
                              className="md:pl-4 md:text-center  md:text-[1.1rem]"
                              component="th"
                              scope="row"
                            >
                              {obj.sim_card_num}
                            </TableCell>
                            <TableCell
                              className="md:p-0 md:text-[1.1rem]"
                              component="th"
                              scope="row"
                              align="center"
                              style={{ minWidth: 130 }}
                            >
                              <span>{obj.phone_number}</span>
                            </TableCell>
                            <TableCell
                              className="md:p-0 md:text-right md:text-[1.1rem]"
                              component="th"
                              scope="row"
                              align="right"
                            >
                              {' '}
                              <div className="flex justify-center gap-x-3 items-center">
                                {obj.label == null ? 'NA' : obj.label}
                              </div>
                            </TableCell>

                            <TableCell
                              className="md:p-0 md:text-[1.1rem] md:text-center"
                              component="th"
                              scope="row"
                              align="center"
                            >
                              <span>
                                {obj.subscription_addon_not_removed.length > 0 && (
                                  <>
                                    {/* eslint-disable-next-line no-shadow */}
                                    {obj.subscription_addon_not_removed.map((obj) => {
                                      return <p className="text-left">• {obj.addons.name}</p>;
                                    })}
                                  </>
                                )}
                              </span>
                            </TableCell>

                            <TableCell
                              className="md:p-0 md:text-[1.1rem]"
                              component="th"
                              scope="row"
                              align="center"
                            >
                              {obj.plan.name}
                            </TableCell>

                            <TableCell
                              className="md:p-0 md:text-[1.1rem] md:text-center"
                              component="th"
                              scope="row"
                              align="center"
                            >
                              <span>${obj.plan.amount_recurring}</span>
                            </TableCell>

                            <TableCell
                              className="md:p-0 md:text-[1.1rem]"
                              component="th"
                              scope="row"
                              align="center"
                            >
                              <Chip
                                className="font-semibold text-10"
                                label={obj.status_formated}
                                color={
                                  // eslint-disable-next-line no-nested-ternary
                                  obj.status_formated.includes('for Activation')
                                    ? 'warning'
                                    : obj.status_formated === 'active'
                                    ? 'success'
                                    : 'error'
                                }
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                          {/* <TableRow tabIndex={-1}
                  key={j}
                  selected={isiamSelected}
                  onClick={(event) => handleClick(j)}
                 
                  style={{boxShadow: "rgb(153 171 187 / 50%) 3px 3px 6px 0px inset, rgb(153 171 187 / 25%) -3px -3px 6px 1px inset"}}
                  >
<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
  <Collapse in={open==obj.id} timeout="auto" unmountOnExit>
    <Box sx={{ margin: 1 }}>

      <Table size="small" aria-label="purchases">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Total price ($)</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          
            <TableRow key={1}>
              <TableCell component="th" scope="row">
              02/14/23
              </TableCell>
              <TableCell>512</TableCell>
              <TableCell align="right">$100</TableCell>
              <TableCell align="right">
            $120
              </TableCell>
            </TableRow>
      
        </TableBody>
      </Table>
    </Box>
  </Collapse>
</TableCell>
</TableRow>

*/}
                        </>
                      );
                    })}
                </TableBody>
              </Table>

              <TablePagination
                className="shrink-0 border-t-1"
                component="div"
                count={data.length ? data.length : 10}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={{
                  'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                  'aria-label': 'Next Page',
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[50, 100, 1000]}
              />
            </FuseScrollbars>
          </div>
          <div className="flex flex-col flex-auto" />
          <div
            className="flex items-center justify-end mt-24 sm:mr-20 sm:mx-8 space-x-12 relative"
            style={{ bottom: 42, marginTop: 50 }}
          >
            <Customdisabled>
              <Button
                className="whitespace-nowrap pos"
                variant="contained"
                color="secondary"
                onClick={(e) => setformstep(1)}
                disabled={
                  secureLocalStorage.getItem('user_info') &&
                  secureLocalStorage.getItem('mode') === 'off'
                    ? true
                    : plan === '' ||
                      customerplan === '' ||
                      operation === '' ||
                      selectedno.length === 0
                }
              >
                Update Addons
              </Button>
            </Customdisabled>
          </div>
        </>
      )}
      {formstep === 1 && (
        <CheckoutAddons
          setformstep={setformstep}
          loading={loading3}
          setloading={setloading3}
          selectedno={selectedno}
          addoninfo={customerplan}
          mode={operation}
        />
      )}
    </>
  );
};

export default Addons;
