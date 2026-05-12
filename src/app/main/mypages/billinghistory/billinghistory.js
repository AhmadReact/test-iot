import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button, ListSubheader, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import Swal from 'sweetalert2';
import secureLocalStorage from 'react-secure-storage';
import { useDispatch, useSelector } from 'react-redux';

import checkSignin from '../../customHook.js/checkSignin';
import {
  chargefromaccount,
  customerinvoices,
  getcustomeraccounts,
  getcustomercards,
  getcustomerdetail,
  MakePayment,
} from '../../services/services';
import ProductsTableHead from '../../pages/ProductsTableHead';
import { useFetchBillingHistoryQuery } from '../../services/Apis';
import { formatNumber } from '../../pages/OrderSummary';

import { setUser } from 'app/store/userSlice';
import FuseScrollbars from '@fuse/core/FuseScrollbars';

const configuredApi = process.env.NEXT_PUBLIC_API || process.env.REACT_APP_API || '/api/';
const urlapi = configuredApi.endsWith('/') ? configuredApi : `${configuredApi}/`;

const Billinghistory = () => {
  document.title = 'Billing';
  checkSignin();
  const [search, setsearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState({
    direction: 'desc',
    id: null,
  });
  const { user } = useSelector((state) => {
    return state;
  });
  const [selectall, setselectall] = useState(false);
  const [checked, setchecked] = useState(false);
  const [data, setData] = useState([]);
  const [loading2, setloading2] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [page, setPage] = useState(0);
  const [selectedno, setselectedno] = useState([]);
  const rows = [
    {
      id: 'date',
      align: 'center',
      disablePadding: false,
      label: 'ID',
      sort: true,
    },
    {
      id: 'date',
      align: 'center',
      disablePadding: false,
      label: 'Date',
      sort: true,
    },
    {
      id: 'type',
      align: 'center',
      disablePadding: false,
      label: 'Type',
      sort: true,
    },
    {
      id: 'notes',
      align: 'center',
      disablePadding: false,
      label: 'Notes',
      sort: true,
    },
    {
      id: 'amount',
      align: 'center',
      disablePadding: false,
      label: 'Amount',
      sort: true,
    },
    {
      id: 'Balance',
      align: 'center',
      disablePadding: false,
      label: 'Balance',
      sort: true,
    },
    {
      id: 'download',
      align: 'center',
      disablePadding: false,
      label: '',
      sort: false,
    },
  ];
  const [customercards, setcustomercards] = useState([]);
  const [customeraccounts, setcustomeraccounts] = useState([]);
  const count = useRef([-user?.data?.detail?.credits_count]);
  const credit_count = useRef([0]);
  const invoice_count = useRef([0]);
  const [customercard, setcustomercard] = useState('');
  const navigate = useNavigate();
  const userlocal = JSON.parse(secureLocalStorage.getItem('user_token'));
  const dispatch = useDispatch();

  const [amountDue, setAmountDue] = useState(0);
  const [customerInvoice, setCustomerInvoice] = useState();
  const {
    data: fetchBillingHistory,
    isFetching,
    isLoading,
    refetch,
  } = useFetchBillingHistoryQuery({
    page: page + 1,
    perpage: rowsPerPage,
    hash: userlocal?.hash,
    credit_count: credit_count.current[page],
    invoice_count: invoice_count.current[page],
  });

  // Set amount due from the API response
  useEffect(() => {
    if (fetchBillingHistory?.total_due !== undefined) {
      // If total_due is negative, set amount to 0, otherwise use the total_due value
      const amountToSet = fetchBillingHistory.total_due < 0 ? 0 : fetchBillingHistory.total_due;
      setAmountDue(amountToSet);
    }
  }, [fetchBillingHistory?.total_due]);

  count.current[0] = fetchBillingHistory?.total_due ? -fetchBillingHistory?.total_due : 0;

  function handleChangePage(event, value) {
    if (isFetching) return;

    credit_count.current = [
      ...credit_count.current,
      fetchBillingHistory ? fetchBillingHistory?.credit_count : 0,
    ];
    invoice_count.current = [
      ...invoice_count.current,
      fetchBillingHistory ? fetchBillingHistory?.invoice_count : 0,
    ];

    setchecked(false);

    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
    count.current = [-user?.data?.detail?.credits_count];
    credit_count.current = [0];
    invoice_count.current = [0];

    setPage(0);
  }

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

  const setsellecteddata = () => {
    if (checked == false) {
      setselectedno([...selectedno, ...data.data]);
    } else {
      // var filtered = selectedno.filter(function(el) { if(data.data.some(x=>x.id!=el.id)) return el });

      setselectedno([]);
    }
  };

  function binaryConverter(s) {
    // Converts the binary representation of data to hex
    //
    // version: 812.316
    // discuss at: http://phpjs.org/functions/bin2hex
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Linuxworld
    // *     example 1: bin2hex('Kev');
    // *     returns 1: '4b6576'
    // *     example 2: bin2hex(String.fromCharCode(0x00));
    // *     returns 2: '00'
    let v;
    let i;
    let f = 0;
    const a = [];
    s += '';
    f = s.length;

    for (i = 0; i < f; i++) {
      a[i] = s
        .charCodeAt(i)
        .toString(16)
        .replace(/^([\da-f])$/, '0$1');
    }

    return a.join('');
  }

  const sortDetails = (customerBillingData) => {
    return useMemo(() => {
      if (!customerBillingData?.data) {
        return [];
      }
      if (customerBillingData.data.length == 0) {
        return [];
      }

      // this map is used to prevent extensible error
      const billingDetails = customerBillingData.data.map((item) => {
        if (!Object.isExtensible(item)) {
          return { ...item };
        }
        return item;
      });

      if (page == 0) {
        billingDetails[0].balance = count.current[page];
      } else {
        billingDetails[0].balance = count.current[page];
      }

      for (let i = 1; i <= billingDetails.length - 1; i++) {
        billingDetails[i].subtotal
          ? billingDetails[i].subtotal === null
            ? (billingDetails[i].subtotal = 0)
            : null
          : null;
        billingDetails[i].amount
          ? billingDetails[i].amount === null
            ? (billingDetails[i].amount = 0)
            : null
          : null;

        billingDetails[i].balance = !billingDetails[i - 1].hasOwnProperty('subtotal')
          ? billingDetails[i - 1].balance - billingDetails[i - 1].amount
          : billingDetails[i - 1].balance + billingDetails[i - 1].subtotal;
      }

      count.current[page + 1] = !billingDetails[billingDetails.length - 1].hasOwnProperty(
        'subtotal'
      )
        ? billingDetails[billingDetails.length - 1].balance -
          billingDetails[billingDetails.length - 1].amount
        : billingDetails[billingDetails.length - 1].balance +
          billingDetails[billingDetails.length - 1].subtotal;
      return billingDetails;
    }, [customerBillingData]);
  };

  const billingAmount = (billingDetail) => {
    const url = `${urlapi}invoice/download/${user?.data?.detail?.company_id}?order_hash=`;
    const invoiceUrl = `${urlapi}invoice/download/${user?.data?.detail?.company_id}?invoice_hash=`;
    let subtotal = 0;
    let downloadLink;

    if (billingDetail && billingDetail.hasOwnProperty('subtotal')) {
      subtotal = <strong>-${formatNumber(billingDetail.subtotal.toFixed(2))}</strong>;
      if (billingDetail.order) {
        if (billingDetail.download_status == 1) {
          downloadLink = (
            <a
              className="download_button"
              style={{ background: 'none' }}
              target="_blank"
              href={`${url}${billingDetail.order.hash}`}
              rel="noreferrer"
            >
              Download
            </a>
          );
        } else if (billingDetail.download_status == 0) {
          downloadLink = (
            <span className="download_button" style={{ background: 'none' }}>
              Generating Invoice
            </span>
          );
        }
      } else if (billingDetail.download_status == 1) {
        downloadLink = (
          <a
            className="download_button"
            style={{ background: 'none' }}
            target="_blank"
            href={`${invoiceUrl}${binaryConverter(`invoice=${billingDetail.id}`)}`}
            rel="noreferrer"
          >
            Download
          </a>
        );
      } else if (billingDetail.download_status == 0) {
        downloadLink = (
          <span className="download_button" style={{ background: 'none' }}>
            Generating Invoice
          </span>
        );
      }
    } else {
      subtotal = (
        <strong>
          {billingDetail.amount ? `$${formatNumber(billingDetail.amount.toFixed(2))}` : null}
        </strong>
      );
      if (billingDetail && billingDetail.invoice) {
        // downloadLink = (
        //   <a
        //     className="download_button"
        //     style={{ background: "none" }}
        //     target={"_blank"}
        //     href={`${invoiceUrl}${binaryConverter(
        //       "invoice=" + billingDetail["invoice"]["id"]
        //     )}`}
        //   >
        //     Download
        //   </a>
        // );
        downloadLink = <td aria-label="download" />;
      } else {
        downloadLink = <td aria-label="download" />;
      }
    }

    return [subtotal, downloadLink];
  };

  const handleChange = (event) => {
    setcustomercard(event.target.value);
  };

  useEffect(() => {
    apisWrapper();
  }, []);

  function convertArrayToNumber(arr) {
    // Combine array elements into a single string
    const resultString = `${arr[0]}.${arr[1]}`;

    // Convert the string to a number
    return parseFloat(resultString);
  }

  const apisWrapper = () => {
    setloading2(true);
    // getBillinghistory().then((result) => {
    //   setData(sortDetails(result));
    //   setcompanyid(result.company_id);
    //   setloading2(false);
    // });
    const promise = [];
    const promisecard = getcustomercards().then((result) => {
      setcustomercards(result);

      // setcustomercard(
      //   result.filter((obj) => obj.default == 1).length == 0
      //     ? result[0]
      //     : result.filter((obj) => obj.default == 1)[0]
      // );

      return result;
    });

    promise.push(promisecard);

    const promisecustomer = getcustomeraccounts().then((result) => {
      setcustomeraccounts(result.data);
      return result.data;
    });

    promise.push(promisecustomer);

    Promise.all(promise).then((result) => {
      setcustomercard(
        [...result[0], ...result[1]].filter((obj) => obj.is_primary).length != 0
          ? [...result[0], ...result[1]].filter((obj) => obj.is_primary)[0]
          : [...result[0], ...result[1]][0]
      );
    });

    customerinvoices().then((result) => {
      const str = parseFloat(`${result.total[0]}.${result.total[1]}`);
      setCustomerInvoice(result);
    });
  };

  const chargecard = () => {
    setloading(true);

    if (customercard.type == 'card') {
      MakePayment(customercard.id, amountDue)
        .then((response) => {
          setData([]);
          setloading2(true);
          apisWrapper();
          Swal.fire({
            icon: 'success',
            title: 'Payment Successful!',
          });

          getcustomerdetail().then((detail) => {
            const user = {
              role: [],
              data: {
                detail,
                displayName: secureLocalStorage.getItem('name'),
                photoURL: 'assets/images/avatars/brian-hughes.jpg',
                email: secureLocalStorage.getItem('email'),
                shortcuts: ['apps.calendar', 'apps.mailbox', 'apps.contacts', 'apps.tasks'],
              },
            };

            count.current = [-detail?.credits_count];
            dispatch(setUser(user)).then(() => {
              refetch();
            });
          });
        })
        .catch(() => {
          setData([]);
          setloading2(true);
          apisWrapper();
          Swal.fire({
            icon: 'error',
            title: 'Something went wrong',
          });
        })
        .finally(() => {
          setloading(false);
        });
    } else {
      chargefromaccount(customercard.id, amountDue, true)
        .then((res) => {
          if (res.status == 'success') {
            setData([]);
            setloading2(true);
            apisWrapper();
            Swal.fire({
              icon: 'success',
              title: 'Payment Successful!',
            });
            getcustomerdetail().then((detail) => {
              const user = {
                role: [],
                data: {
                  detail,
                  displayName: secureLocalStorage.getItem('name'),
                  photoURL: 'assets/images/avatars/brian-hughes.jpg',
                  email: secureLocalStorage.getItem('email'),
                  shortcuts: ['apps.calendar', 'apps.mailbox', 'apps.contacts', 'apps.tasks'],
                },
              };
              count.current = [-detail?.credits_count];
              dispatch(setUser(user)).then(() => {
                refetch();
              });
            });
          } else {
            setData([]);
            setloading2(true);
            apisWrapper();
            Swal.fire({
              icon: 'error',
              title: 'Something went wrong',
            });
          }
        })
        .catch(() => {
          setData([]);
          setloading2(true);
          apisWrapper();
          Swal.fire({
            icon: 'error',
            title: 'Something went wrong',
          });
        })
        .finally(() => {
          setloading(false);
        });
    }
  };

  const [loading, setloading] = useState(false);
  const pattern = /^\d{1,10}$|(?=^.{1,10}$)^\d+\.\d{0,2}$/gm;

  return (
    <>
      <div className="flex w-full container">
        <div className="flex flex-col sm:flex-row flex-auto sm:items-end min-w-0 p-24 md:p-32 pb-0 md:pb-0">
          <Paper className="relative flex flex-col flex-auto p-24 pr-12 pb-12 rounded-2xl shadow overflow-hidden">
            <div className="flex items-center justify-between ">
              <div className="flex flex-col">
                <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
                  DUE DATE
                </Typography>
                <Typography className="text-green-600 font-medium text-sm">
                  {customerInvoice ? customerInvoice.due_date : null}
                </Typography>
              </div>
              <div>
                {user?.data?.detail && user.data.detail.account_suspended == 1 && (
                  <Typography className="text-red-600 font-medium text-lg">
                    Account Suspended
                  </Typography>
                )}
              </div>
              <div className="-mt-8 mr-12">
                {/* <IconButton aria-label="more" size="large">
                  <FuseSvgIcon>heroicons-outline:dots-vertical</FuseSvgIcon>
                </IconButton> */}
                {/* <a
                  className="cursor-pointer mr-16 !text-[#2196f3]"
                  onClick={() =>
                    navigate("/dashboards/account", {
                      state: { open: "payment" },
                    })
                  }
                >
                  Add New Card
                </a> */}
                <a
                  className="cursor-pointer !text-[#2196f3] mr-16"
                  onClick={() =>
                    navigate('/dashboards/account', {
                      state: { open: 'payment' },
                    })
                  }
                >
                  Edit Billing Preferences
                </a>
              </div>
            </div>
            <div className="flex flex-row flex-wrap mt-16 -mx-24 justify-between w-[100%]">
              <div className="flex flex-col mx-24 my-12">
                <Typography color="text.secondary" className="text-sm font-medium leading-none">
                  Total Due
                </Typography>
                <Typography className="mt-8 font-medium text-3xl leading-none">
                  {fetchBillingHistory?.total_due !== undefined &&
                  fetchBillingHistory?.total_due !== null
                    ? `$${formatNumber(
                        parseFloat(fetchBillingHistory.total_due).toFixed(2)
                      )}`.replace('$-', '-$')
                    : '$0.00'}
                </Typography>
              </div>
              <div className="flex flex-row flex-wrap -mx-24 items-center">
                <div className="flex flex-col mx-24 my-12">
                  <Typography
                    color="text.secondary"
                    className="flex text-sm font-medium leading-none"
                  >
                    Card/Bank
                  </Typography>
                  <FormControl className="md:w-[204px]" variant="standard" size="small">
                    <Select
                      id="demo-simple-select-standard"
                      value={customercard}
                      onChange={handleChange}
                    >
                      {customercards.length > 0 && (
                        <ListSubheader className="font-[700] leading-6">Credit cards</ListSubheader>
                      )}
                      {customercards.length > 0 &&
                        customercards.map((obj) => {
                          obj.type = 'card';
                          return <MenuItem value={obj}>{obj.info.split(' ').join(' - ')}</MenuItem>;
                        })}

                      <hr className="mt-10 mb-10" />
                      {customeraccounts.length > 0 && (
                        <ListSubheader className="font-[700] leading-6">
                          Bank accounts
                        </ListSubheader>
                      )}

                      {customeraccounts.length > 0 &&
                        customeraccounts.map((obj) => {
                          obj.type = 'account';
                          return (
                            <MenuItem value={obj}>
                              {`${obj.routing_number} - ${obj.account_number.replaceAll('*', '')}`}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                </div>
                <div className="flex flex-col mx-24 my-12 h-[55.5px]">
                  <Typography color="text.secondary" className="text-sm font-medium leading-none">
                    Amount
                  </Typography>
                  <TextField
                    id="outlined-size-small"
                    size="small"
                    variant="standard"
                    onChange={(e) =>
                      e.target.value == ''
                        ? setAmountDue(e.target.value)
                        : pattern.test(e.target.value) && setAmountDue(e.target.value)
                    }
                    value={amountDue}
                    error={amountDue === ''}
                    helperText={amountDue === '' && 'Please provide Amount'}
                  />
                </div>
                <div className="flex flex-col items-center gap-y-6 justify-center mx-24 my-12">
                  {loading ? (
                    <LoadingButton
                      loading
                      loadingPosition="start"
                      startIcon={<SaveIcon />}
                      variant="outlined"
                      className="md:ml-10 md:mt-10"
                    >
                      Processing..
                    </LoadingButton>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={() => chargecard()}
                      disabled={
                        amountDue === '' ||
                        amountDue === '0' ||
                        amountDue == 0 ||
                        customercard == null ||
                        customercard == undefined
                      }
                    >
                      Make Payment
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Paper>
        </div>
      </div>

      <hr className="mt-[3.2rem]" />
      <div className="flex w-full container">
        <div className="flex flex-col sm:flex-row flex-auto sm:items-end min-w-0 p-24 md:p-32 pb-0 md:pb-0">
          <div className="flex flex-col flex-auto space-y-11">
            <motion.div
              className="flex"
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.3 } }}
            >
              <Typography className="text-3xl font-semibold tracking-tight leading-8">
                Billing History
              </Typography>{' '}
            </motion.div>
          </div>
          <div />
        </div>
      </div>

      <div className="w-full flex flex-col  p-32 pt-[11px] " style={{ margin: '20px 0px 0px' }}>
        <FuseScrollbars className="grow overflow-x-auto">
          <Table stickyHeader className="min-w-xl">
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
              disabledcheck={1}
            />

            <TableBody style={{ backgroundColor: '#fff' }}>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={10} style={{ textAlign: 'center' }}>
                    <Box sx={{ width: '100%' }}>
                      <LinearProgress color="secondary" />
                    </Box>
                  </TableCell>
                </TableRow>
              )}
              {fetchBillingHistory?.data?.length == 0 && (
                <TableRow>
                  <TableCell colSpan={10} style={{ textAlign: 'center' }}>
                    <Box sx={{ width: '100%' }}>No data found</Box>
                  </TableCell>
                </TableRow>
              )}
              {_.orderBy(
                sortDetails(fetchBillingHistory || []),
                [
                  (o) => {
                    switch (order.id) {
                      case 'date': {
                        return o.created_at;
                      }
                      case 'type': {
                        return o.type_description;
                      }

                      case 'amount': {
                        return o.amount;
                      }

                      default: {
                        return o.created_at;
                      }
                    }
                  },
                ],
                [order.direction]
              ).map((obj, j) => {
                const isiamSelected = selected.indexOf(j) !== -1;
                return (
                  <>
                    <TableRow
                      className="h-[28px] text-sm cursor-pointer"
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={j}
                      selected={isiamSelected}
                    >
                      <TableCell
                        className="md:p-0 md:text-sm md:text-center"
                        component="th"
                        scope="row"
                        align="right"
                      >
                        <span>{obj.id}</span>
                      </TableCell>
                      <TableCell
                        className="md:p-0 md:text-sm md:text-center"
                        component="th"
                        scope="row"
                        align="right"
                      >
                        <span>{obj.created_at_formatted_with_time}</span>
                      </TableCell>
                      <TableCell
                        className="md:p-0 md:text-center  md:text-sm"
                        component="th"
                        scope="row"
                      >
                        {obj.type_description}
                      </TableCell>
                      <TableCell
                        className="md:p-0 md:text-center md:text-sm"
                        component="th"
                        scope="row"
                        align="center"
                      >
                        <span className="mr-[28px]">{obj.notes}</span>
                      </TableCell>
                      <TableCell
                        className="md:p-0 md:text-sm "
                        component="th"
                        scope="row"
                        align="center"
                      >
                        <span className="mr-[28px]">
                          {billingAmount(obj) && billingAmount(obj)[0]}
                        </span>
                      </TableCell>
                      <TableCell
                        className="md:p-0 md:text-sm "
                        component="th"
                        scope="row"
                        align="center"
                      >
                        <span className="mr-[28px]">
                          <strong>
                            {`$${formatNumber(obj?.balance?.toFixed(2))}`.replace('$-', '-$')}
                          </strong>{' '}
                        </span>
                      </TableCell>
                      <TableCell
                        className="md:p-0 md:text-sm md:text-center"
                        component="th"
                        scope="row"
                        align="right"
                      >
                        {billingAmount(obj) && billingAmount(obj)[1]}
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
            count={fetchBillingHistory?.total ? fetchBillingHistory.total : 0}
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

          {isFetching && (
            <div className="text-blue-400 flex justify-end mr-[20px] relative bottom-[15px] italic">
              Loading...
            </div>
          )}
        </FuseScrollbars>
      </div>
    </>
  );
};

export default Billinghistory;
