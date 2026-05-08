import { useEffect, useState } from 'react';
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
import Checkbox from '@mui/material/Checkbox';
import { Chip, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import secureLocalStorage from 'react-secure-storage';

import Customdisabled from '../../pages/Customdisabled';
import { useFetchEligibleNumbersQuery } from '../../services/Apis';
import {
  addonNumberchange,
  eligibleNumberchange,
  csvnumberchange,
  placesimsorder,
  validatezipcodeapi,
} from '../../services/services';
import checkSignin from '../../customHook.js/checkSignin';
import ProductsTableHead from '../../pages/ProductsTableHead';

import Checkoutchange from './Checkoutchange';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseScrollbars from '@fuse/core/FuseScrollbars';

const Changenumber = () => {
  document.title = 'Change Number';
  const user = JSON.parse(secureLocalStorage.getItem('user_token'));
  checkSignin();
  const [addon, setaddon] = useState();
  const [message, setmessage] = useState();
  useEffect(() => {
    setloading2(true);
    addonNumberchange()
      .then((result) => {
        if (result.length > 0) {
          setaddon(result[0]);

          setmessage('Loading your sims');
          setloading2(false);

          // eligibleNumberchange(result[0].id).then((response) => {
          //   setloading2(false);
          //   if (response.data.length > 0) setData(response.data);
          // });
        } else {
          setloading2(false);
        }
      })
      .catch((error) => {
        console.warn(error);
      })
      .finally(() => {
        // setloading2(false);
      });
  }, []);

  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState({
    direction: 'desc',
    id: null,
  });
  const [basecon, setbasecon] = useState();
  const [csv, setcsv] = useState();
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
  const [summarycsv, setsummarycsv] = useState('');
  const { data: fetchNumbers, isFetching } = useFetchEligibleNumbersQuery({
    addon_id: addon?.id ? addon.id : 0,
    per_page: rowsPerPage,
    page: page + 1,
    customer_id: user?.id,
  });
  // two times fetch numbers calling , first one is to get total numbers
  const { data: totalData } = useFetchEligibleNumbersQuery({
    addon_id: addon?.id ? addon.id : 0,
    per_page: fetchNumbers?.total,
    page: 1,
    customer_id: user?.id,
  });

  const [tabValue, setTabValue] = useState(0);
  const processCSV = (str, delim = ',') => {
    try {
      setsummarycsv(str);
      const headers = str.slice(0, str.indexOf('\n')).split(delim);
      let rows = str.slice(str.indexOf('\n') + 1).split('\n');
      rows = rows.filter((obj) => {
        if (obj != undefined && obj != '\r') {
          return obj;
        }
      });

      if (headers[0] != undefined && headers[1] != undefined) {
        if (!headers[0].includes('phone_number') || !headers[1].includes('zip_code')) {
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

      newArray.map((obj) => {
        if (obj.phone_number === '') {
        } else {
          const count = totalData?.data.filter((x) => {
            if (x.phone_number === obj.phone_number) return true;
          }).length;

          if (count == 0) {
            arr.push(obj.phone_number);
          } else {
            subscribes.push({
              id: totalData?.data.filter((ele) => ele.phone_number === obj.phone_number)[0].id,
            });
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

      setdatafarward(subscribes);
      setqty(
        newArray.filter((obj) => {
          if (obj.phone_number.length > 1) return 1;
        }).length
      );
      return 1;
    } catch (err) {
      console.warn(err);
      setLoading(false);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'CSV uploading failed',
      });
    }
  };

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
      setSelected(totalData?.data.map((n, id) => id));
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
      if (totalData.data.length > 0) {
        // setData(totalData.data);
        setselectedno([...selectedno, ...totalData.data]);
      }
    } else {
      // var filtered = selectedno.filter(function(el) { if(data.data.some(x=>x.id!=el.id)) return el });

      setselectedno([]);
    }
  };

  function getBase64(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setbasecon(reader.result);
    };
    reader.onerror = function (error) {
      console.warn('Error: ', error);
    };
  }

  const rows = [
    {
      id: 'order',
      align: 'center',
      disablePadding: false,
      label: 'Subscription id',
      sort: true,
    },
    {
      id: 'simnum',
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
  const [datafarward, setdatafarward] = useState('');
  const [isSelected, setisSeleceted] = useState([0, 0, 0]);

  const [amountcharged, setamountcharged] = useState();
  const splitingnumbers = () => {
    if (rederror == 1) {
      Swal.fire({
        icon: 'info',
        title: 'Invalid zipcode',
        text: 'Please enter valid zipcode ',
      });
    } else if (textArea.length == 0) {
      Swal.fire({
        icon: 'info',
        title: 'Textarea is empty',
        text: 'Please enter some numbers ',
      });
    } else {
      const arrayOfLines = textArea.split('\n');
      const mismatched = [];
      const subid = [];
      arrayOfLines.filter((obj) => {
        if (
          totalData?.data.filter((sim) => obj === sim.sim_card_num).length == 0 &&
          totalData?.data.filter((sim) => obj === sim.phone_number).length == 0
        ) {
          mismatched.push(obj);
        } else if (totalData?.data.filter((sims) => obj === sims.phone_number).length > 0) {
          subid.push({
            id: totalData?.data.filter((sims) => obj === sims.phone_number)[0].id,
            sim: obj,
          });
        } else {
          subid.push({
            id: totalData?.data.filter((sims) => obj === sims.sim_card_num)[0].id,
            sim: obj,
          });
        }
      });

      // if(arrayOfLines.length>500)
      //   {
      //     Swal.fire({
      //       icon: "info",
      //       title: "Quantity error",
      //       text: "Please enter maximum 500 numbers at a time.",
      //     });
      //     return
      //   }

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

      setdatafarward(subid);
      setqty(arrayOfLines.length);
      setformstep(formstep + 2);
    }
  };

  const [loading, setLoading] = useState(false);

  const downloadCsv = () => {
    const rows = [['phone_number', 'zip_code']];

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
    const json = totalData?.data.map((obj) => {
      return {
        Subscription_id: obj.id,
        Sim_number:
          obj.sim_card_num.includes('null') || obj.sim_card_num == ''
            ? null
            : `'${obj.sim_card_num}`,
        Phone_number: obj.phone_number
          ? obj.phone_number.includes('null') || obj.phone_number == ''
            ? null
            : `'${obj.phone_number}`
          : '',
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
    link.setAttribute('download', `Change_number${formattedToday}.csv`);
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
      // if(selectedno.length>500)
      // {
      //   Swal.fire({
      //     icon: "info",
      //     title: "Quantity error",
      //     text: "Please select maximum 500 numbers at a time.",
      //   });
      //   return
      // }

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
        if (result.status == 'success') {
          setrederror(0);
        } else if (result.status == 'error') {
          setrederror(1);
        } else {
          setrederror(1);
        }
      });
    }
  };

  const [loading3, setloading3] = useState(false);

  const subscribe = (shipping, billing) => {
    return new Promise((resolve, reject) => {
      let arr = '';

      selectedno.map((obj, i) => {
        arr = `${arr}\n${selectedno[i].sim_num}`;
      });

      placesimsorder(false, qty, shipping, billing, addon, selectedno, zipcode)
        .then((result) => {
          // setloading3(false);
          if (result.status === 'success') {
            result.planactivation = 0;

            result.amountcharged =
              tabValue == 0
                ? amountcharged.credit_card.totalPrice
                : amountcharged.bank_account.totalPrice;
            resolve(result);
          } else {
            reject(result);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: result.data,
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
          console.warn(error);
        });
    });
  };

  const csvorderwrapper = () => {
    return new Promise((resolve, reject) => {
      csvnumberchange(basecon, addon)
        .then((result) => {
          if (result.status == 'success') {
            result.planactivation = 0;
            result.amountcharged =
              tabValue == 0
                ? amountcharged.credit_card.totalPrice
                : amountcharged.bank_account.totalPrice;
            resolve(result);
          } else {
            reject(result);
            Swal.fire({
              icon: 'error',
              title: 'CSV uploading failed',
              text: result.details,
            }).then((result) => {
              if (result.isConfirmed) {
                location.reload();
              }
            });
          }
        })
        .then()
        .catch((result) => {
          reject(result);

          Swal.fire({
            icon: 'error',
            title: 'CSV uploading failed',
            text: result.details,
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload();
            }
          });
        });
    });
  };

  const subscribe2 = (shipping, billing) => {
    return new Promise((resolve, reject) => {
      placesimsorder(false, qty, shipping, billing, addon, null, zipcode, datafarward)
        .then((result) => {
          // setloading3(false);
          if (result.status === 'success') {
            result.planactivation = 0;
            result.amountcharged =
              tabValue == 0
                ? amountcharged.credit_card.totalPrice
                : amountcharged.bank_account.totalPrice;
            resolve(result);
          } else {
            reject(result);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
          console.warn(error);
        });
    });
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

  const handler = (e) => {
    setloading2(true);

    setaddon(e.target.value);
    eligibleNumberchange(e.target.value.id).then((response) => {
      setloading2(false);
      if (response.data.length > 0) setData(response.data);
    });
  };

  const uploadthisCsv = (e) => {
    setLoading(true);

    getBase64(e.target.files[0]);

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

      if (processCSV(text)) {
        setformstep(formstep + 4);
      }
      setLoading(false);
    };

    reader.readAsText(e.target.files[0]);

    setcsv(e.target.files[0]);
  };

  if (loading2) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading message={message} />
      </div>
    );
  }

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
                    Change Numbers
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
                    value={zipcode}
                    style={{ width: '50%' }}
                    onChange={(e) => {
                      validatezipcode(e);
                    }}
                    maxlength="3"
                    id="outlined-required"
                    label="Zip Code"
                    name="zipcode"
                    // disabled={isSelected[1] == 0?true:}
                    error={rederror == 1}
                    helperText={rederror == 1 && 'Invalid Zipcode'}
                  />

                  <TextField
                    className="mt-10"
                    id="outlined-multiline-static"
                    label="Enter Sim Number or Phone Number in each new line"
                    multiline
                    style={{ width: '50%' }}
                    rows={4}
                    value={textArea}
                    onChange={(e) => {
                      settextArea(e.target.value);
                    }}
                  />

                  <Customdisabled>
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
                      disabled={
                        !!(
                          secureLocalStorage.getItem('user_info') &&
                          secureLocalStorage.getItem('mode') === 'off'
                        )
                      }
                    >
                      Select Sims
                    </Button>
                  </Customdisabled>
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
                      <Customdisabled>
                        <Button
                          variant="contained"
                          color="secondary"
                          component="label"
                          className="mr-[10px]"
                          disabled={
                            !!(
                              secureLocalStorage.getItem('user_info') &&
                              secureLocalStorage.getItem('mode') === 'off'
                            )
                          }
                        >
                          Upload CSV
                          <input
                            hidden
                            accept=".csv"
                            type="file"
                            onChange={(e) => uploadthisCsv(e)}
                          />
                        </Button>
                      </Customdisabled>
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
                            disabled={totalData?.data?.length === 0}
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

                <TableBody className="relative" style={{ backgroundColor: '#fff' }}>
                  {isFetching && (
                    <div className="absolute inset-0 bg-black opacity-30 z-50 flex justify-center items-center" />
                  )}

                  {/* {data?.length == 0 && (
                    <TableRow>
                      <TableCell colSpan={10} style={{ textAlign: "center" }}>
                        {loading2 ? (
                          <Box sx={{ width: "100%" }}>
                            <LinearProgress color="secondary" />
                          </Box>
                        ) : (
                          <>No data found</>
                        )}
                      </TableCell>
                    </TableRow>
                  )} */}

                  {_.orderBy(
                    fetchNumbers?.data,
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
                            return o.order_id;
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
                          className="h-[20px] text-sm cursor-pointer"
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
                            className="md:pl-4 md:text-center  md:text-sm"
                            component="th"
                            scope="row"
                          >
                            {obj.id}
                          </TableCell>
                          <TableCell
                            className="md:pl-4 md:text-center  md:text-sm"
                            component="th"
                            scope="row"
                          >
                            {obj.sim_card_num}
                          </TableCell>
                          <TableCell
                            className="md:p-0  md:text-center  md:text-sm"
                            component="th"
                            scope="row"
                            style={{ minWidth: 130 }}
                          >
                            <span>{obj.phone_number}</span>
                          </TableCell>
                          <TableCell
                            className="md:p-0  md:text-center  md:text-sm"
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
                          <TableCell
                            className="md:p-0 md:text-sm  md:text-center "
                            component="th"
                            scope="row"
                            align="right"
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
                count={fetchNumbers?.total ? fetchNumbers.total : 0}
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
                onClick={textwrapper}
                disabled={
                  !!(
                    secureLocalStorage.getItem('user_info') &&
                    secureLocalStorage.getItem('mode') === 'off'
                  )
                }
              >
                Place Order
              </Button>
            </Customdisabled>
          </div>{' '}
        </>
      )}

      {formstep == 3 && (
        <Checkoutchange
          addon={addon}
          setformstep={setformstep}
          qty={qty}
          subscribe={subscribe}
          loading={loading3}
          setloading={setloading3}
          selectedno={selectedno}
          data={totalData.data}
          setamountcharged={setamountcharged}
          tabValue={tabValue}
          setTabValue={setTabValue}
        />
      )}

      {formstep === 4 && (
        <Checkoutchange
          addon={addon}
          csvdata={datafarward}
          setformstep={setformstep}
          qty={qty}
          subscribe={csvorderwrapper}
          loading={loading3}
          setloading={setloading3}
          csv={summarycsv}
          setamountcharged={setamountcharged}
          tabValue={tabValue}
          setTabValue={setTabValue}
        />
      )}

      {formstep == 2 && (
        <Checkoutchange
          addon={addon}
          setformstep={setformstep}
          qty={qty}
          subscribe={subscribe2}
          loading={loading3}
          setloading={setloading3}
          textarea={datafarward}
          setamountcharged={setamountcharged}
          tabValue={tabValue}
          setTabValue={setTabValue}
        />
      )}
    </>
  );
};

export default Changenumber;
