import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

import checkSignin from '../../customHook.js/checkSignin';
import { eligibleNumberchange, validatezipcodeapi } from '../../services/services';
import ProductsTableHead from '../../pages/ProductsTableHead';

import { useFetchNumberChangeHistoryQuery } from '../../services/Apis';

import Numberchangedetail from './Numberchangedetail';

import FuseScrollbars from '@fuse/core/FuseScrollbars';

const Changenumber = () => {
  document.title = 'Number Change History';
  checkSignin();
  useEffect(() => {
    setloading2(true);

    // numberchangehistory()
    //   .then((result) => {
    //     if (result.data.length > 0) {
    //       console.clear();

    //       let arr = result.data.map((obj, index) => {});

    //       // setData(result.data);
    //     }
    //   })
    //   .finally(() => {
    //     setloading2(false);
    //   });
  }, []);

  const { user } = useSelector((state) => {
    return state;
  });
  const { data: fetchHistory } = useFetchNumberChangeHistoryQuery({
    customer_id: user?.data?.detail?.id,
    per_page: 100,
    page: 1,
  });

  const { data } = useFetchNumberChangeHistoryQuery({
    customer_id: user?.data?.detail?.id,
    per_page: fetchHistory?.total,
    page: 1,
  });

  const [addon, setaddon] = useState([]);

  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState({
    direction: 'desc',
    id: null,
  });

  const [selectall, setselectall] = useState(false);
  const [checked, setchecked] = useState(false);
  // const [data, setData] = useState([]);
  const [loading2, setloading2] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [page, setPage] = useState(0);
  const [selectedno, setselectedno] = useState([]);
  const [rederror, setrederror] = useState(0);
  const [formstep, setformstep] = useState(0);
  const [qty, setqty] = useState('');
  const [addons, setaddons] = useState([]);

  const [numberchangelist, setnumberchangelist] = useState([]);

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
      setselectedno([...selectedno, ...data]);
    } else {
      // var filtered = selectedno.filter(function(el) { if(data.data.some(x=>x.id!=el.id)) return el });

      setselectedno([]);
    }
  };

  const rows = [
    {
      id: 'order',
      align: 'center',
      disablePadding: false,
      label: 'Order Number',
      sort: true,
    },
    {
      id: 'created_at',
      align: 'center',
      disablePadding: false,
      label: 'Date',
      sort: false,
    },
    {
      id: 'phoneno',
      align: 'center',
      disablePadding: false,
      label: 'Change Requests',
      sort: true,
    },
  ];

  function handleChangePage(event, value) {
    setchecked(false);

    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
    setPage(0);
  }
  const [zipcode, setzipcode] = useState('');
  const [textArea, settextArea] = useState('');
  const [isSelected, setisSeleceted] = useState([0, 0, 0]);
  const splitingnumbers = () => {
    if (textArea.length == 0) {
      Swal.fire({
        icon: 'info',
        title: 'Textarea is empty',
        text: 'Please enter some numbers ',
      });
    } else {
      const arrayOfLines = textArea.split('\n');
      setqty(arrayOfLines.length);
      setformstep(formstep + 1);
    }
  };

  const [loading, setLoading] = useState(false);

  const downloadCsv = () => {
    const rows = [['sim_num'], ['654452236565']];

    const csvContent = `data:text/csv;charset=utf-8,${rows.map((e) => e.join(',')).join('\n')}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'sample.csv');
    document.body.appendChild(link); // Required for FF

    link.click();
  };

  const [search, setsearch] = useState('');

  const exportcsv = () => {
    const json = data.data.map((obj) => {
      return {
        Plan_Name: obj.sim.name,
        Order_No: obj.order_num,
        Sim_No: obj.sim_num,
      };
    });
    const fields = Object.keys(json[0]);
    const replacer = function (key, value) {
      return value === null ? '' : value;
    };
    let csv = json.map(function (row) {
      return fields
        .map(function (fieldName) {
          return JSON.stringify(row[fieldName], replacer);
        })
        .join(',');
    });
    csv.unshift(fields.join(',')); // add header column
    csv = csv.join('\r\n');

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = `0${dd}`;
    if (mm < 10) mm = `0${mm}`;

    const formattedToday = `${dd}/${mm}/${yyyy}`;

    const csvContent = `data:text/csv;charset=utf-8,${csv}`;
    const encodedUri = encodeURI(csvContent);

    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ActivatedSims${formattedToday}.csv`);
    document.body.appendChild(link); // Required for FF

    link.click();
  };

  const textwrapper = () => {
    // let count = checked.filter((obj) => {
    //   if (obj) return true;
    // }).length;
    if (rederror == 1) {
      Swal.fire({
        icon: 'info',
        title: 'Invalid zipcode',
        text: 'Please enter valid zipcode ',
      });
    } else if (selectedno.length == 0) {
      Swal.fire({
        icon: 'info',
        title: 'Quantity error',
        text: 'Please select some numbers ',
      });
    } else {
      setqty(selectedno.length);
      setformstep(formstep + 3);
    }
  };

  const validatezipcode = (e) => {
    setzipcode(e.target.value);

    const zipRegex = /^(?:(\d{5})(?:[ \-](\d{4}))?)$/i;
    if (e.target.value == '') {
      setrederror(0);
    } else if (!zipRegex.test(e.target.value)) {
      setrederror(1);
    } else {
      validatezipcodeapi(e.target.value).then((result) => {
        if (result.data) {
          setrederror(0);
        } else {
          setrederror(1);
        }
      });
    }
  };

  const [loading3, setloading3] = useState(false);

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

  const handler = (e) => {
    setloading2(true);

    setaddon(e.target.value);
    eligibleNumberchange(e.target.value.id).then((response) => {
      setloading2(false);
      if (response.data.length > 0) setData(response.data);
    });
  };

  const [detaildata, setdetaildata] = useState([]);
  const getdetail = (data) => {
    setdetaildata(data);
    setformstep(2);
  };

  const getCount = (detail) => {
    const result = [];

    detail.map((obj) => {
      if (!result.some((item) => item.old_product === obj.old_product)) {
        result.push(obj);
      }

      return obj;
    });

    return result.length;
  };

  const getCreatedAt = (orderNum) => {
    const record = data?.data?.find((curr) => curr.order_num === orderNum);
    if (!record?.created_at) {
      return '-';
    }

    const createdDate = new Date(record.created_at);
    if (Number.isNaN(createdDate.getTime())) {
      return record.created_at;
    }

    return createdDate.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <>
      {' '}
      {formstep === 0 ? (
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
                    Number Change History
                  </Typography>{' '}
                </motion.div>
                {user?.data?.detail && user.data.detail.account_suspended == 1 && (
                  <Typography className="text-red-600 font-medium text-lg">
                    Account Suspended
                  </Typography>
                )}
                {/* <div
              style={{ rowGap: 15, marginTop: 30 }}
              className="flex flex-col gap-x-20 justify-center"
            >
              
                    <TextField
                    id="outlined-select-currency"
                    select
                    label="Select"
                    
                    helperText="Please select order num"
                    style={{ width: "50%" }}
                    required
                    
                    InputLabelProps={
                      isSelected[0] == 0
                        ? {
                            style: { color: "gray" },
                          }
                        : {
                            style: { color: "#de0505" },
                          }
                    }
                  >
                    {numberchangelist.map((obj, i) => {
                      return (
                        <MenuItem key={i} value={obj}>
                          {obj.order_num}
                        </MenuItem>
                      );
                    })}
                  </TextField>

                
            </div> */}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col  p-24 pt-[11px] " style={{ margin: '30px 0px 0px' }}>
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
                  disabledcheck={1}
                />

                <TableBody style={{ backgroundColor: '#fff' }}>
                  {data?.data?.length == 0 && (
                    <TableRow>
                      <TableCell colSpan={10} style={{ textAlign: 'center' }}>
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
                    [...new Set(data?.data?.map((item) => item.order_num))],
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

                          default: {
                            return o;
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
                            className="h-[20px] text-sm cursor-pointer"
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={j}
                            selected={isiamSelected}
                            onClick={() =>
                              getdetail(data?.data?.filter((curr) => curr.order_num === obj))
                            }
                          >
                            <TableCell
                              className="md:pl-4 md:text-center  md:text-sm"
                              component="th"
                              scope="row"
                            >
                              {obj}
                            </TableCell>
                            <TableCell
                              className="md:p-0  md:text-center  md:text-sm"
                              component="th"
                              scope="row"
                              style={{ minWidth: 130 }}
                            >
                              {getCreatedAt(obj)}
                            </TableCell>
                            <TableCell
                              className="md:p-0  md:text-center  md:text-sm"
                              component="th"
                              scope="row"
                              style={{ minWidth: 130 }}
                            >
                              <span>
                                {getCount(data?.data?.filter((curr) => curr.order_num === obj))}
                              </span>
                            </TableCell>
                            <TableCell
                              className="md:p-0  md:text-center  md:text-sm"
                              component="th"
                              scope="row"
                              align="right"
                            >
                              {' '}
                              <div className="flex justify-center gap-x-3 items-center" />
                            </TableCell>

                            <TableCell
                              className=" md:text-center   md:p-0 md:text-sm"
                              component="th"
                              scope="row"
                            />

                            <TableCell
                              className="md:p-0 md:text-sm md:text-center"
                              component="th"
                              scope="row"
                              align="right"
                            />
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
                count={
                  data?.data.length
                    ? [...new Set(data?.data?.map((item) => item.order_num))].length
                    : 0
                }
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
        </>
      ) : (
        <Numberchangedetail detail={detaildata} setformstep={setformstep} />
      )}
    </>
  );
};

export default Changenumber;
