import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { memo, useLayoutEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';

import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import { ja } from 'date-fns/locale';
import secureLocalStorage from 'react-secure-storage';
import { useSelector } from 'react-redux';

import checkSignin from '../../customHook.js/checkSignin';
import Customdisabled from '../../pages/Customdisabled';

import {
  csvordersubscription,
  getsimplans,
  getstandardplans,
  listordersims,
  ordersubscription,
  validatezipcodeapi,
} from '../../services/services';
import ProductsTableHead from '../../pages/ProductsTableHead';

import Checkoutorderlist from './Checkoutorderlist';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import _ from '@lodash';
import FuseScrollbars from '@fuse/core/FuseScrollbars';

const allowedExtensions = ['csv'];

function Gateways(props) {
  const [loading2, setloading2] = useState(false);
  const [csv, setcsv] = useState();
  const [loading3, setloading3] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [sim, setsim] = useState();
  const [sims, setsims] = useState([]);
  const [select, setselect] = useState('');
  const [isSelected, setisSeleceted] = useState([0, 0, 0]);
  const [simplans, setsimplans] = useState([]);
  const [zipcode, setzipcode] = useState('');
  const [qty, setqty] = useState('');
  const [datacsv, setdatacsv] = useState([]);
  const [order, setOrder] = useState({
    direction: 'desc',
    id: null,
  });
  const [selectedno, setselectedno] = useState([]);
  const [rederror, setrederror] = useState(0);
  const [textArea, settextArea] = useState('');
  const [basecon, setbasecon] = useState();
  const [selectall, setselectall] = useState(false);
  const [checked, setchecked] = useState(false);
  const [summarycsv, setsummarycsv] = useState('');
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

  function handleDeselect() {
    setSelected([]);
  }

  function handleClick(item) {
    props.navigate(`/apps/e-commerce/products/${item.id}/${item.handle}`);
  }

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

  const [mypagesetting, setmypagesetting] = useState(2);
  const [mypagerows, setmypagerows] = useState(1000);
  function handleChangePage(event, value) {
    setPage(value);

    if (data.data.slice(value * rowsPerPage, value * rowsPerPage + rowsPerPage).length == 0) {
      listordersims(data.data[0].sim_id, mypagerows, mypagesetting).then((result) => {
        setData((prev) => {
          return {
            ...prev,
            data: [...prev.data, ...result.data],
          };
        });
        // settmpdata(result);
        setmypagesetting(mypagesetting + 1);
      });
    }
    setchecked(false);
  }

  function handleChangeRowsPerPage(event) {
    listordersims(data.data[0].sim_id, event.target.value, 1).then((result) => {
      setData(result);
      setRowsPerPage(event.target.value);
      settmpdata(result);
    });

    setPage(0);
  }

  const subscribe = (shipping, billing) => {
    return new Promise((resolve, reject) => {
      let arr = '';

      selectedno.map((obj, i) => {
        arr = `${arr}\n${selectedno[i].sim_num}`;
      });

      ordersubscription(select.id, zipcode, arr, shipping, billing, sim).then((result) => {
        if (result.status == 'success') {
          result.planactivation = 1;
          resolve(result);
        } else {
          const [key, value] = Object.entries(result.details)[0];
          Swal.fire({
            icon: 'error',
            title: 'Server error',
            text: value,
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload();
            }
          });
          reject(result);
        }
      });
    });
  };

  function subscribe2(shipping, billing) {
    return new Promise((resolve, reject) => {
      ordersubscription(select.id, zipcode, textArea, shipping, billing, sim).then((result) => {
        // setloading3(false);

        if (result.status == 'success') {
          secureLocalStorage.setItem('order_hash', result.data.order_hash);
          result.planactivation = 1;
          resolve(result);
        } else {
          const [key, value] = Object.entries(result.details);
          Swal.fire({
            icon: 'error',
            title: 'Server error',
            text: result.details.map((obj) => `${obj}\n`),
          });
          reject(false);
          return false;
        }
      });
    });
  }

  const uploadthisCsv = (e) => {
    try {
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
          setformstep(formstep + 2);
        }
        setLoading(false);
      };

      reader.readAsText(e.target.files[0]);

      setcsv(e.target.files[0]);
    } catch (err) {
      setLoading(false);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'CSV uploading failed',
      });
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

      isSelected[0] == 1 ? (sim.id === 12 ? downloadultraCsv : downloadCsv) : downloadCsv;

      if (sim.id === 12) {
        if (headers[1] != undefined && headers[0] != undefined) {
          if (!headers[1].includes('zip_code') || !headers[0].includes('sim_num')) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Headers of csv mismatched!. Download Sample.',
            });
            return 0;
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Headers of csv mismatched!. Download Sample',
          });
          return 0;
        }
      } else if (headers[0] != undefined && headers[1] == undefined) {
        if (!headers[0].includes('sim_num')) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Headers of csv mismatched!. Download Sample',
          });
          return 0;
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Headers of csv mismatched!. Download Sample',
        });
        return 0;
      }

      const newArray = rows.map((row) => {
        const values = row.split(delim);
        const eachObject = headers.reduce((obj, header, i) => {
          if (values[i].indexOf("'") > -1) obj[header] = values[i].substring(1, values[i].length);
          else obj[header] = values[i];
          return obj;
        }, {});
        return eachObject;
      });

      const arr = [];

      if (new Set(rows).size !== newArray.length) {
        Swal.fire({
          icon: 'info',
          title: 'Duplicates value',
          text: 'Duplicate sim number not allowed',
        });
        return;
      }

      newArray.map((obj) => {
        if (obj.sim_num != '' && obj.sim_num != '\r') {
          const count = data.data.filter((x) => {
            if (x.sim_num === obj.sim_num) return true;
          }).length;

          if (count == 0) {
            arr.push(obj.sim_num);
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
      setqty(
        newArray.filter((obj) => {
          if (obj.sim_num.length > 1) return 1;
        }).length
      );
      return 1;
    } catch (err) {
      setLoading(false);
      console.warn(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Wrong csv format',
      });
    }
  };

  const downloadultraCsv = () => {
    const rows = [['sim_num', 'zip_code']];

    const csvContent = `data:text/csv;charset=utf-8,${rows.map((e) => e.join(',')).join('\n')}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'sample.csv');
    document.body.appendChild(link); // Required for FF

    link.click();
  };

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

  const exportcsv = () => {
    const json = data.data.map((obj) => {
      return {
        Plan_Name: obj.sim.name,
        Order_Number: obj.order_num,
        Sim_Number: obj.sim_num == 'null' || obj.sim_num == '' ? null : `'${obj.sim_num}`,
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

  const csvorderwrapper = (shipping, billing) => {
    return new Promise((resolve, reject) => {
      csvordersubscription(select.id, basecon, shipping, billing, sim).then((result) => {
        // setloading3(false);

        if (result.status == 'success') {
          result.planactivation = 1;
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
      });
    });
  };

  useLayoutEffect(() => {
    // getlistofactivationsims().then((obj) => {
    //   setsims(obj);
    // });

    getstandardplans().then((obj) => {
      setsims(obj);
    });
  }, []);

  const handler = (e) => {
    setloading2(true);
    getsimplans(e.target.value.id).then((result) => {
      if (result.details) {
        setsimplans([]);
        setloading2(false);
        setData([]);
        settmpdata([]);
      } else {
        setsimplans(result);
        setsim(e.target.value);
        listordersims(e.target.value.id, mypagerows).then((result) => {
          setData(result);
          settmpdata(result);
          setloading2(false);
          setisSeleceted([1, 0, 0]);
        });
      }
    });
  };

  const splitingnumbers = () => {
    if (rederror === 1) {
      Swal.fire({
        icon: 'info',
        title: 'Invalid zipcode',
        text: 'Please enter valid zipcode ',
      });
    }
    if (textArea.length == 0) {
      Swal.fire({
        icon: 'info',
        title: 'Textarea is empty',
        text: 'Please enter some numbers ',
      });
    } else {
      let arrayOfLines = textArea.split('\n');
      arrayOfLines = arrayOfLines.filter((x) => x != '');

      if (new Set(arrayOfLines).size !== arrayOfLines.length) {
        Swal.fire({
          icon: 'info',
          title: 'Duplicates value',
          text: 'Duplicate sim number not allowed',
        });
        return;
      }

      if (arrayOfLines.filter((x) => !data.data.some((obj) => obj.sim_num == x)).length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'These numbers mismatched!',
          html: `${arrayOfLines
            .filter((x) => !data.data.some((obj) => obj.sim_num == x))
            .map((obj) => {
              return `<h2>${obj}</h2>`;
            })}`,
        });
        return 0;
      }

      setqty(arrayOfLines.length);
      setformstep(formstep + 1);
    }
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

  checkSignin();

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

  const setsellecteddata = () => {
    if (checked == false) {
      setselectedno([...selectedno, ...data.data]);
    } else {
      // var filtered = selectedno.filter(function(el) { if(data.data.some(x=>x.id!=el.id)) return el });

      setselectedno([]);
    }
  };

  const rows = [
    {
      id: 'id',
      align: 'right',
      disablePadding: false,
      label: 'Sim Name',
      sort: true,
    },

    {
      id: 'order',
      align: 'right',
      disablePadding: false,
      label: 'Order No',
      sort: true,
    },

    {
      id: 'simnum',
      align: 'right',
      disablePadding: false,
      label: 'Sim No',
      sort: true,
    },
  ];

  const [tmpdata, settmpdata] = useState();
  const [formstep, setformstep] = useState(0);
  const [search, setsearch] = useState('');
  const searchresult = (e) => {
    setsearch(e.target.value);
    const arr = tmpdata.data.filter((obj) => {
      if (
        obj.sim.name.toLowerCase().includes(e.target.value) ||
        obj.sim_num.toString().includes(e.target.value) ||
        obj.order_num.toString().includes(e.target.value)
      ) {
        return true;
      }
    });

    setData({ ...data, data: arr });
  };
  const { user } = useSelector((state) => {
    return state;
  });
  document.title = 'Activate SIMs & Devices';
  return (
    <>
      {formstep == 0 ? (
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
                    Standard Recurring Plan
                  </Typography>{' '}
                </motion.div>

                {user?.data?.detail && user.data.detail.account_suspended == 1 && (
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
                    value={sim}
                    onChange={(e) => handler(e)}
                    helperText="Please select your sim"
                    style={{ width: '50%' }}
                    required
                    InputLabelProps={{
                      style: { color: '#de0505' },
                    }}
                  >
                    {sims &&
                      sims.map((obj, i) => {
                        return (
                          <MenuItem key={i} value={obj}>
                            {obj.name}
                          </MenuItem>
                        );
                      })}
                  </TextField>

                  <TextField
                    className="mt-10"
                    id="outlined-multiline-static"
                    label="Enter Sims numbers in each new line"
                    multiline
                    style={{ width: '50%' }}
                    rows={4}
                    value={textArea}
                    onChange={(e) => {
                      settextArea(e.target.value),
                        e.target.value.length > 0
                          ? setisSeleceted([1, 1, 1])
                          : setisSeleceted([1, 1, 0]);
                    }}
                    disabled={isSelected[1] == 0}
                  />
                  <Customdisabled>
                    <Button
                      className="whitespace-nowrap pos"
                      variant="contained"
                      color="secondary"
                      onClick={splitingnumbers}
                      disabled={
                        secureLocalStorage.getItem('user_info') &&
                        secureLocalStorage.getItem('mode') === 'off'
                          ? true
                          : isSelected[2] == 0 || rederror == 1
                      }
                      style={{
                        width: '100px',
                        height: '40px',
                        position: 'relative',
                        top: 2,
                        left: '42.5%',
                      }}
                    >
                      Select Sims
                    </Button>
                  </Customdisabled>
                </div>

                <h4>OR</h4>
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
                          disabled={
                            secureLocalStorage.getItem('user_info') &&
                            secureLocalStorage.getItem('mode') === 'off'
                              ? true
                              : isSelected[1] == 0
                          }
                          className="mr-[10px]"
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
                        <input
                          hidden
                          accept=".csv"
                          type="button"
                          onClick={
                            isSelected[0] == 1
                              ? sim.id === 12
                                ? downloadultraCsv
                                : downloadCsv
                              : downloadCsv
                          }
                        />
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
                            <FuseSvgIcon className="text-48" size={24}>
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
          <div className="w-full flex flex-col  p-24 pt-[11px] ">
            <FuseScrollbars className="grow overflow-x-auto">
              <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
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
                      <TableCell colSpan={8} style={{ textAlign: 'center' }}>
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
                    data.data,
                    [
                      (o) => {
                        switch (order.id) {
                          case 'simnum': {
                            return o.sim_num;
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
                        <TableRow
                          className="h-[20px] text-sm cursor-pointer"
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={ja}
                          selected={isiamSelected}
                          onClick={(event) => handleClick(j)}
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

                          <TableCell className="p-4 text-right md:p-16" component="th" scope="row">
                            {obj.sim.name}
                          </TableCell>
                          <TableCell className="p-4 text-right md:p-16" component="th" scope="row">
                            {obj.order_num}
                          </TableCell>
                          <TableCell
                            className="p-4 md:p-16"
                            component="th"
                            scope="row"
                            align="right"
                          >
                            <span>{obj.sim_num}</span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>

              <TablePagination
                className="shrink-0 border-t-1"
                component="div"
                count={data.total ? data.total : 10}
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
                  secureLocalStorage.getItem('user_info') &&
                  secureLocalStorage.getItem('mode') === 'off'
                    ? true
                    : isSelected[1] == 0
                }
              >
                Place Order
              </Button>
            </Customdisabled>
          </div>
        </>
      ) : formstep == 1 ? (
        <Checkoutorderlist
          simid={sim}
          setformstep={setformstep}
          plan={select}
          qty={qty}
          subscribe={subscribe2}
          loading={loading3}
          setloading={setloading3}
          textarea={textArea}
        />
      ) : formstep === 2 ? (
        <Checkoutorderlist
          simid={sim}
          setformstep={setformstep}
          plan={select}
          qty={qty}
          subscribe={csvorderwrapper}
          loading={loading3}
          setloading={setloading3}
          csv={summarycsv}
        />
      ) : (
        <Checkoutorderlist
          simid={sim}
          setformstep={setformstep}
          plan={select}
          qty={qty}
          subscribe={subscribe}
          loading={loading3}
          setloading={setloading3}
          selectedno={selectedno}
          data={data.data}
        />
      )}
    </>
  );
}

export default memo(Gateways);
