import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { Checkbox, Chip, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { useSelector } from 'react-redux';

import checkSignin from '../../customHook.js/checkSignin';

import { closeLines, getcustomersubscriptionfresh } from '../../services/services';

import ProductsTableHead from '../../pages/ProductsTableHead';

import Actionbtn from './Actiobtn';
import LabelEditbtn from './LabelEditbtn';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseScrollbars from '@fuse/core/FuseScrollbars';

const Closelines = () => {
  document.title = 'Close Lines';
  checkSignin();
  const [search, setsearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState({
    direction: 'desc',
    id: null,
  });

  const [selectall, setselectall] = useState(false);
  const [checked, setchecked] = useState(false);
  const [data, setData] = useState([]);
  const [loading2, setloading2] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [page, setPage] = useState(0);
  const [selectedno, setselectedno] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [loader, setloader] = useState(false);
  const [loader2, setloader2] = useState(false);
  const textref = useRef(null);
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
      id: 'datausage',
      align: 'center',
      disablePadding: false,
      label: 'Data Usage',
      sort: true,
    },
    {
      id: 'smsusage',
      align: 'center',
      disablePadding: false,
      label: 'SMS Usage',
      sort: true,
    },
    {
      id: 'voiceusage',
      align: 'center',
      disablePadding: false,
      label: 'Voice Usage',
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
    {
      id: 'action',
      align: 'center',
      disablePadding: false,
      label: 'Action',
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
  const [tmpdata, settmpdata] = useState();

  useEffect(() => {
    setloading2(true);

    getcustomersubscriptionfresh().then((result) => {
      const [key, value] = Object.entries(result)[0];
      setData(
        value.filter((obj) => obj.status_formated !== 'Subscription Closed' && obj.plan.type !== 4)
      );
      settmpdata(
        value.filter((obj) => obj.status_formated !== 'Subscription Closed' && obj.plan.type !== 4)
      );
      setloading2(false);
    });
  }, [refresh]);

  const searchresult = (e) => {
    setsearch(e.target.value);
    const arr = tmpdata.filter((obj) => {
      if (
        obj.plan.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        obj.sim_card_num.includes(e.target.value) ||
        obj.plan.amount_recurring.toString().includes(e.target.value) ||
        obj.status_formated.toLowerCase().includes(e.target.value.toLowerCase()) ||
        (obj.label && obj.label.toLowerCase().includes(e.target.value.toLowerCase()))
      ) {
        return true;
      }
    });

    setData(arr);
  };

  const exportcsv = () => {
    const json = data.map((obj) => {
      return {
        Plan_Name: obj.plan.name,
        Sim_No:
          obj.sim_card_num == 'null' || obj.sim_card_num == '' ? null : `'${obj.sim_card_num}`,
        Phone_No: obj.phone_number
          ? obj.phone_number.includes('null') || obj.phone_number === ''
            ? null
            : `'${obj.phone_number}`
          : '',
        Monthly_Charge: obj.plan.amount_recurring,
        Status: obj.status_formated,
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
    link.setAttribute('download', `customer_subscriptions${formattedToday}.csv`);
    document.body.appendChild(link); // Required for FF

    link.click();
  };

  const splitingnumbers = () => {
    if (textref.current.value.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Textarea is empty',
        text: 'Please enter some numbers ',
      });
    } else {
      const arrayOfLines = textref.current.value.split('\n').filter((obj) => obj != '');

      const mismatched = [];
      const subid = [];
      arrayOfLines.filter((obj) => {
        if (
          data.filter((sim) => obj === sim.sim_card_num || `${obj}F` == sim.sim_card_num).length ==
            0 &&
          data.filter((sim) => obj === sim.phone_number || `${obj}F` == sim.phone_number).length ==
            0
        ) {
          mismatched.push(obj);
        } else if (
          data.filter((sims) => obj === sims.phone_number || `${obj}F` == sims.phone_number)
            .length > 0
        ) {
          subid.push({
            id: data.filter(
              (sims) => obj === sims.phone_number || `${obj}F` == sims.phone_number
            )[0].id,
            sim_card_num: data.filter(
              (sims) => obj === sims.phone_number || `${obj}F` == sims.phone_number
            )[0].sim_card_num,
          });
        } else {
          subid.push({
            id: data.filter(
              (sims) => obj === sims.sim_card_num || `${obj}F` == sims.sim_card_num
            )[0].id,
            sim_card_num: data.filter(
              (sims) => obj === sims.sim_card_num || `${obj}F` == sims.sim_card_num
            )[0].sim_card_num,
          });
        }
      });

      if (mismatched.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'These numbers mismatched!',
          html: `${mismatched.map((obj) => {
            return `<h2>${obj}</h2>`;
          })}`,
        });

        return;
      }

      Swal.fire({
        icon: 'info',
        title: 'Do you want to close these subscriptions?',
        html: `${subid.map((obj) => {
          return `<h2>${obj.sim_card_num}</h2>`;
        })}`,
        showCloseButton: true,
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          setloader(true);
          closelineapiwrapper(subid).then(() => {
            textref.current.value = '';
            setloader(false);
          });
        }
      });
    }
  };

  const [loading, setLoading] = useState(false);

  const downloadCsv = () => {
    const simNumbers = [['sim_number']];

    const csvContent = `data:text/csv;charset=utf-8,${rows.map((e) => e.join(',')).join('\n')}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'sample.csv');
    document.body.appendChild(link); // Required for FF

    link.click();
  };

  const bulkoperation = () => {
    if (selectedno.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Quantity error',
        text: 'Please select some numbers ',
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Do you want to close these subscriptions?',
        html: `${selectedno.map((obj) => {
          return `<h2>${obj.sim_card_num}</h2>`;
        })}`,
        showCloseButton: true,
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          setloader2(true);
          closelineapiwrapper(selectedno).then(() => {
            setselectedno([]);
            setloader2(false);
          });
        }
      });
    }
  };

  const uploadthisCsv = (e) => {
    setLoading(true);

    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      const text = target.result;
      // if(processCSV(text))
      // {
      //   csvordersubscription(select.id, e.target.files[0]).then((result) => {

      //     if (result.status == "success") {
      //       alert(result.message);
      //       // setformstep(formstep + 1);
      //     } else {
      //       alert("CSV uploading failed");
      //     }
      //   });
      // };

      processCSV(text);

      setLoading(false);
    };

    reader.readAsText(e.target.files[0]);
  };

  // eslint-disable-next-line consistent-return
  const processCSV = (str, delim = ',') => {
    try {
      const headers = str.slice(0, str.indexOf('\n')).split(delim);
      let records = str.slice(str.indexOf('\n') + 1).split('\n');
      // eslint-disable-next-line array-callback-return,consistent-return
      records = records.filter((obj) => {
        if (obj !== undefined && obj !== '\r') {
          return obj;
        }
      });

      if (headers[0] !== undefined) {
        if (!headers[0].includes('sim_number')) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Headers of csv mismatched!. Download Sample.',
          });
          return 0;
        }
      }

      const newArray = rows.map((row) => {
        const values = row.split(delim);
        const eachObject = headers.reduce((obj, header, i) => {
          obj[header] = values[i];
          return obj;
        }, {});
        return eachObject;
      });

      const subscribes = [];
      const arr = [];

      records.map((obj) => {
        // eslint-disable-next-line no-empty
        if (obj === '') {
        } else {
          const count = data.filter((x) => {
            if (x.sim_card_num === obj || x.sim_card_num == `${obj}F`) return true;
          }).length;

          if (count === 0) {
            arr.push(obj);
          } else {
            const matched = data.find((x) => x.sim_card_num === obj || x.sim_card_num == `${obj}F`);
            if (matched) {
              subscribes.push({
                id: matched.id,
                sim_card_num: matched.sim_card_num,
              });
            }
          }
        }
      });

      if (arr.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'These numbers mismatched!',
          html: `${arr.map((obj) => {
            return `<h2>${obj}</h2>`;
          })}`,
        });
        return 0;
      }
      setLoading(false);

      Swal.fire({
        icon: 'error',
        title: 'Do you want to close these subscriptions?',
        html: `${subscribes.map((obj) => {
          return `<h2>${obj.sim_card_num}</h2>`;
        })}`,
      }).then((result) => {
        if (result.isConfirmed) {
          closelineapiwrapper(subscribes);
        }
      });

      return 1;
    } catch (err) {
      console.warn('ERROR');
      setLoading(false);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'CSV uploading failed',
      });
    }
  };

  const style = {
    minWidth: '32em',
  };

  const closelineapiwrapper = (subscribes) => {
    return new Promise((resolve, reject) => {
      closeLines(subscribes)
        .then((result) => {
          if (result.status === 'success') {
            setData(
              data.filter((obj) => !subscribes.some((x) => x.sim_card_num === obj.sim_card_num))
            );
            settmpdata(
              data.filter((obj) => !subscribes.some((x) => x.sim_card_num === obj.sim_card_num))
            );
            //   setloading2(false);
            Swal.fire({
              icon: 'success',
              title: 'Subscriptions are successfully closed!',
            });

            // getcustomersubscriptionfresh().then((result) => {
            //   let [key, value] = Object.entries(result)[0];
            //   setData(value.filter((obj)=>obj.status_formated!="Subscription Closed"));
            //   settmpdata(value.filter((obj)=>obj.status_formated!="Subscription Closed"));
            //   setloading2(false);
            //   Swal.fire({
            //     icon: "success",
            //     title: "Subscriptions are successfully closed !",
            //   });
            //   resolve(true);

            // });
          } else {
            Swal.fire({
              icon: 'error',
              customClass: 'min-w-fit',
              title: 'Unprocessable Entity',
              html: `${Object.keys(result.data).map((obj) => {
                return `<h2>${result.data[obj]}</h2>`;
              })}`,
            });
          }
        })
        .finally(() => {
          resolve(true);
          setloading2(false);
          setloader(false);
          setloader2(false);
        });
    });
  };

  const { user } = useSelector((state) => {
    return state;
  });

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
                Close Lines
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
                className="mt-10"
                id="outlined-multiline-static"
                label="Enter Sim Number or Phone Number in each new line"
                multiline
                style={{ width: '50%' }}
                rows={4}
                inputRef={textref}
              />
              {loader ? (
                <LoadingButton
                  loading
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="outlined"
                  style={{
                    width: '125px',
                    height: '40px',
                    position: 'relative',
                    top: 2,
                    left: '42.5%',
                  }}
                >
                  Processing..
                </LoadingButton>
              ) : (
                <Button
                  className="whitespace-nowrap pos"
                  variant="contained"
                  color="secondary"
                  onClick={splitingnumbers}
                  style={{
                    width: '100px',
                    height: '40px',
                    position: 'relative',
                    top: 2,
                    left: '42.5%',
                  }}
                >
                  Close Lines
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12 -translate-y-[30px]">
            <div className="relative top-[25px]">
              {loading ? (
                <LoadingButton
                  loading
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="outlined"
                >
                  Uploading..
                </LoadingButton>
              ) : (
                <>
                  {' '}
                  <Button
                    variant="contained"
                    color="secondary"
                    component="label"
                    className="mr-[10px]"
                  >
                    Upload CSV
                    <input hidden accept=".csv" type="file" onChange={(e) => uploadthisCsv(e)} />
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    component="label"
                    className="mr-[10px]"
                  >
                    Download CSV
                    <input hidden accept=".csv" type="button" onClick={downloadCsv} />
                  </Button>
                  <div className="flex mt-10">
                    <Paper
                      component={motion.div}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        transition: { delay: 0.2 },
                      }}
                      className="flex items-center  space-x-8 px-16 rounded-full border-1 shadow-0 w-[187px] mr-[10px]"
                    >
                      <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

                      <Input
                        placeholder="Search"
                        className="flex flex-1"
                        disableUnderline
                        value={search}
                        inputProps={{
                          'aria-label': 'Search',
                        }}
                        onChange={(e) => searchresult(e)}
                      />
                    </Paper>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: 0.2 },
                      }}
                    >
                      <Button
                        className=""
                        // component={Link}
                        to="/apps/e-commerce/products/new"
                        variant="contained"
                        color="secondary"
                        onClick={exportcsv}
                        disabled={data.length === 0}
                      >
                        <FuseSvgIcon className="text-48" size={24} color="white">
                          heroicons-outline:external-link
                        </FuseSvgIcon>
                      </Button>
                    </motion.div>
                  </div>
                </>
              )}
            </div>
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
            />

            <TableBody style={{ backgroundColor: '#fff' }}>
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} style={{ textAlign: 'center' }}>
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
                      {' '}
                      <TableRow
                        className="h-[20px] text-sm cursor-pointer"
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
                          className="md:pl-4 md:text-center  md:text-sm"
                          component="th"
                          scope="row"
                        >
                          {obj.sim_card_num}
                        </TableCell>
                        <TableCell
                          className="md:p-0 md:text-sm"
                          component="th"
                          scope="row"
                          align="center"
                          style={{ minWidth: 130 }}
                        >
                          <span>{obj.phone_number}</span>
                        </TableCell>
                        <TableCell
                          className="md:p-0 md:text-right md:text-sm"
                          component="th"
                          scope="row"
                          align="right"
                        >
                          {' '}
                          <div className="flex justify-center gap-x-3 items-center">
                            {obj.label == null ? 'NA' : obj.label}

                            <LabelEditbtn
                              label={obj.label}
                              id={obj.id}
                              settmpdata={settmpdata}
                              setData={setData}
                              data={data}
                            />
                          </div>
                        </TableCell>
                        <TableCell
                          className="md:p-0 md:text-sm md:text-center"
                          component="th"
                          scope="row"
                          align="right"
                        >
                          {obj.plan?.carrier?.slug === 'ultra' ? (
                            <span>
                              {obj.usage_data && Math.round(obj.usage_data.data * 100) / 100}
                            </span>
                          ) : (
                            <span>
                              {obj.att_two_usage_data &&
                                Math.round(obj.att_two_usage_data.usage_data * 100) / 100}
                            </span>
                          )}
                        </TableCell>
                        <TableCell
                          className="md:p-0 md:text-sm md:text-center"
                          component="th"
                          scope="row"
                          align="right"
                        >
                          <span>{obj.usage_data && obj.usage_data.sms}</span>
                        </TableCell>
                        <TableCell
                          className="md:p-0 md:text-sm md:text-center"
                          component="th"
                          scope="row"
                          align="right"
                        >
                          <span>{obj.usage_data && obj.usage_data.voice}</span>
                        </TableCell>

                        <TableCell className=" md:p-0 md:text-sm" component="th" scope="row">
                          {obj.plan.name}
                        </TableCell>

                        <TableCell
                          className="md:p-0 md:text-sm md:text-center"
                          component="th"
                          scope="row"
                          align="right"
                        >
                          <span>${obj.plan.amount_recurring}</span>
                        </TableCell>
                        <TableCell
                          className="md:p-0 md:text-sm"
                          component="th"
                          scope="row"
                          align="right"
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
                        <TableCell
                          className="md:p-0 md:text-sm"
                          component="th"
                          scope="row"
                          align="right"
                        >
                          <div className="flex flex-col gap-y-5 my-4 mr-5">
                            {/* <BasicModal id={obj.id} /> */}
                            {/* <Button className={open===obj.id?"bg-[#4f46e5] text-white":"bg-[#f6f9fb] "} variant="contained" onClick={open===obj.id?()=>setOpen(false):()=>setOpen(obj.id)}>View</Button> */}
                            <Actionbtn
                              click={closelineapiwrapper}
                              num={obj.sim_card_num}
                              subscription={obj}
                            />
                          </div>
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
        {loader2 ? (
          <LoadingButton
            loading
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="outlined"
          >
            Proccessing..
          </LoadingButton>
        ) : (
          <Button
            className="whitespace-nowrap pos"
            variant="contained"
            color="secondary"
            onClick={bulkoperation}
            // disabled={isSelected[1] == 0}
          >
            Select Sims
          </Button>
        )}
      </div>
    </>
  );
};

export default Closelines;
