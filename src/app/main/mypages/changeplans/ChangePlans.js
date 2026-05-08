import { useLayoutEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import secureLocalStorage from 'react-secure-storage';
import { Checkbox, Chip, LinearProgress, Tab, Tabs, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Box } from '@mui/system';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CallMadeIcon from '@mui/icons-material/CallMade';

import checkSignin from '../../customHook.js/checkSignin';
import Customdisabled from '../../pages/Customdisabled';
import ProductsTableHead from '../../pages/ProductsTableHead';
import { customerplansapi, getcustomersubscriptionfresh } from '../../services/services';

import Checkoutplan from './Checkoutplan';

import FuseScrollbars from '@fuse/core/FuseScrollbars';

const ChangePlans = () => {
  checkSignin();
  const [plans, setplans] = useState([]);
  const [plan, setplan] = useState();
  const [customerplans, setcustomerplans] = useState([]);
  const [customerplan, setcustomerplan] = useState();
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState({
    direction: 'desc',
    id: null,
  });

  const [selectall, setselectall] = useState(false);
  const [checked, setchecked] = useState(false);
  const [data, setdata] = useState([]);
  const [scheduledData, setScheduledData] = useState([]);
  const [loading2, setloading2] = useState(false);
  const [loading3, setloading3] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [selectedno, setselectedno] = useState([]);
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

  const rows2 = [
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
      id: 'id',
      align: 'center',
      disablePadding: false,
      label: 'Plan (New)',
      sort: true,
    },
    {
      id: 'old',
      align: 'center',
      disablePadding: false,
      label: 'Plan (Old)',
      sort: true,
    },
    {
      id: 'upgrade_downgrade_date_submitted',
      align: 'center',
      disablePadding: false,
      label: 'Due date',
      sort: true,
    },
    {
      id: 'upgrade_downgrade_status',
      align: 'center',
      disablePadding: false,
      label: 'Upgrade downgrade Status',
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
    setdata([]);
    setScheduledData([]);
    setselectedno([]);
    setplan(e.target.value);
    setcustomerplan();
    setloading2(true);
    setPage(0);

    customerplansapi(e.target.value.id).then((res) => {
      setcustomerplans(res);
    });

    getcustomersubscriptionfresh(e.target.value.id).then((result) => {
      const [key, value] = Object.entries(result)[0];
      setdata(
        value.filter(
          (obj) =>
            obj.status_formated.toLowerCase().includes('active') &&
            obj.upgrade_downgrade_status == null
        )
      );

      setScheduledData(
        value.filter((obj) => obj.upgrade_downgrade_status != null && obj.status != 'closed')
      );
      setloading2(false);
    });
  };

  const handler2 = (e) => {
    setcustomerplan(e.target.value);
  };

  const setsellecteddata = () => {
    if (checked == false) {
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

  function handleChangeTab(event, value) {
    setTabValue(value);
  }
  const [formstep, setformstep] = useState(0);
  const [tabValue, setTabValue] = useState(0);

  const convertDate = (obj) => {
    return `${obj.slice(0, 10).split('-')[1]}-${obj.slice(0, 10).split('-')[2]}-${
      obj.slice(0, 10).split('-')[0]
    }`;
  };
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
                    Change Plans
                  </Typography>{' '}
                </motion.div>
                {secureLocalStorage.getItem('user_info') &&
                  JSON.parse(secureLocalStorage.getItem('user_info')).account_suspended == 1 && (
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
                    disabled={loading2}
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
                    id="outlined-select-currency"
                    select
                    label="Select"
                    value={customerplan}
                    onChange={(e) => handler2(e)}
                    helperText="Please select your updated plan"
                    style={{ width: '50%' }}
                    required
                    InputLabelProps={{
                      style: { color: '#de0505' },
                    }}
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
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col  p-24 pt-[11px] mt-10">
            <div>
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
                  label={`Available Plans (${data.length})`}
                />
                <Tab
                  className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
                  disableRipple
                  label={`Upgrade/Downgrade (${scheduledData.length})`}
                />
              </Tabs>
            </div>
            {tabValue == 0 && (
              <>
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
                      {data.length == 0 && (
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
                                    checked={selectedno.some((x) => x.id == obj.id)}
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
                </FuseScrollbars>{' '}
                <div className="flex flex-col flex-auto" />
              </>
            )}

            {tabValue == 1 && (
              <>
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
                      disabledcheck
                      rows={rows2}
                    />

                    <TableBody style={{ backgroundColor: '#fff' }}>
                      {scheduledData.length == 0 && (
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

                      {_.orderBy(
                        scheduledData,
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
                                  className="md:p-0 md:text-[1.1rem]"
                                  component="th"
                                  scope="row"
                                  align="center"
                                >
                                  {obj.upgrade_downgrade_status == 'for-downgrade' ||
                                  obj.upgrade_downgrade_status == 'for-upgrade'
                                    ? obj?.plan?.name
                                    : obj?.new_plan_detail?.name}
                                </TableCell>
                                <TableCell
                                  className="md:p-0 md:text-[1.1rem]"
                                  component="th"
                                  scope="row"
                                  align="center"
                                >
                                  {obj.upgrade_downgrade_status == 'for-downgrade' ||
                                  obj.upgrade_downgrade_status == 'for-upgrade'
                                    ? obj?.old_plan?.name
                                    : obj.plan.name}
                                </TableCell>
                                <TableCell
                                  className="md:p-0 md:text-[1.1rem] md:text-center"
                                  component="th"
                                  scope="row"
                                  align="center"
                                >
                                  <span>
                                    {obj.upgrade_downgrade_status == 'downgrade-scheduled'
                                      ? convertDate(obj.downgrade_date)
                                      : convertDate(obj.upgrade_downgrade_date_submitted)}
                                  </span>
                                </TableCell>
                                <TableCell
                                  className="md:p-0 md:text-[1.1rem] md:text-center"
                                  component="th"
                                  scope="row"
                                  align="center"
                                >
                                  <span>
                                    {obj.upgrade_downgrade_status == 'for-upgrade'
                                      ? obj.upgrade_downgrade_status
                                      : obj.upgrade_downgrade_status}
                                    {obj.upgrade_downgrade_status == 'for-upgrade' ? (
                                      <CallMadeIcon color="success" fontSize="small" />
                                    ) : (
                                      <CallReceivedIcon color="error" fontSize="small" />
                                    )}
                                  </span>
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
                    count={scheduledData.length ? scheduledData.length : 10}
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
              </>
            )}
          </div>
          {tabValue == 0 && (
            <div
              className="flex items-center justify-end mt-24 sm:mr-20 sm:mx-8 space-x-12 relative "
              style={{ bottom: 42, marginTop: 50 }}
            >
              <Customdisabled>
                <Button
                  className="whitespace-nowrap pos mb-[20px]"
                  variant="contained"
                  color="secondary"
                  onClick={() => setformstep(1)}
                  disabled={
                    secureLocalStorage.getItem('user_info') &&
                    secureLocalStorage.getItem('mode') === 'off'
                      ? true
                      : selectedno.length == 0 || !customerplan
                  }
                >
                  Update Plans
                </Button>
              </Customdisabled>
            </div>
          )}
        </>
      )}
      {formstep == 1 && (
        <Checkoutplan
          setformstep={setformstep}
          loading={loading3}
          setloading={setloading3}
          oldplan={plan}
          newplan={customerplan}
          selectedno={selectedno}
        />
      )}
    </>
  );
};

export default ChangePlans;
