import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useLayoutEffect, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';

import { Tab, Tabs, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';

import { ja } from 'date-fns/locale';
import secureLocalStorage from 'react-secure-storage';

import { useDispatch, useSelector } from 'react-redux';
import { simsActivationLimit } from 'src/app/constraint/constraints';

import { useFetchListOfSimsQuery } from '../../services/Apis';
import { updateloader } from '../../apps/e-commerce/store/loaderSlice';

import checkSignin from '../../customHook.js/checkSignin';
import {
  addOrderItem,
  csvordersubscription,
  getPendingOrderHash,
  getlistofactivationsims,
  getorderdetail,
  getsimplans,
  getstandardplans,
  listordersims,
  ordersubscription,
  validateSims,
  validatezipcodeapi,
} from '../../services/services';
import ProductsTableHead from '../../pages/ProductsTableHead';

import StandardPlan from './StandardPlan';
import CheckoutStandardPlan from './CheckoutStandardPlan';

import FuseLoading from '@fuse/core/FuseLoading';
import OrderSummaryModified from 'app/shared-components/OrderSummaryModified';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import _ from '@lodash';
import FuseScrollbars from '@fuse/core/FuseScrollbars';

function Orderlist(props) {
  const [loading2, setloading2] = useState(false);

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
  const [order, setOrder] = useState({
    direction: 'desc',
    id: null,
  });
  const [selectedno, setselectedno] = useState([]);
  const [rederror, setrederror] = useState(0);
  const [errortext, setErrorText] = useState('');
  const [textArea, settextArea] = useState('');
  const [imei, setImei] = useState('');

  const [selectall, setselectall] = useState(false);
  const [checked, setchecked] = useState(false);
  const [summarycsv, setsummarycsv] = useState('');
  const [itemsArray, setitemsArray] = useState({ summary: [] });
  const [qty2, setqty2] = useState('');
  const [tmploader, settmploader] = useState(false);
  const [lines, setlines] = useState([]);
  const [refresh, setrefresh] = useState(0);
  const [tabValue2, setTabValue2] = useState(0);
  const user = JSON.parse(secureLocalStorage.getItem('user_info'));
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
  const [isLocked, setIsLocked] = useState(false);
  const [tmpdata, settmpdata] = useState();
  const [formstep, setformstep] = useState(0);
  const [search, setsearch] = useState('');
  const [orderhash, setOrderHash] = useState();

  const [searchParams, setSearchParams] = useSearchParams();
  const [universalLoader, setUniversalLoader] = useState('');
  const [tabValue, setTabValue] = useState(0);
  document.title = 'Activate SIMs & Devices';
  const [standardplans, setstandardplans] = useState([]);
  const [debouncedValue, setDebouncedValue] = useState(search);
  const dispatch = useDispatch();
  useEffect(() => {
    // Set up the debounce mechanism
    const handler = setTimeout(() => {
      setDebouncedValue(search);
    }, 500); // Set a delay of 500ms or any value you prefer

    // Clean up the timeout if the input changes before the delay is reached
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const [formobj, setformobj] = useState({
    firstname: user ? user.shipping_fname : '',
    lastname: user ? user.shipping_lname : '',
    streetaddress: user ? user.shipping_address1 : '',
    streetaddress2: user ? user.shipping_address2 : '',
    zipcode: user ? user.shipping_zip : '',
    city: user ? user.shipping_city : '',
    state: user ? user.shipping_state_id : '',
  });

  const [formobj2, setformobj2] = useState({
    firstname: user ? user.billing_fname : '',
    lastname: user ? user.billing_lname : '',
    streetaddress: user ? user.billing_address1 : '',
    streetaddress2: user ? user.billing_address2 : '',
    zipcode: user ? user.billing_zip : '',
    city: user ? user.billing_city : '',
    state: user ? user.billing_state_id : '',
  });

  const {
    data: listOfSims,
    isFetching,
    isLoading,
    refetch,
  } = useFetchListOfSimsQuery({
    customer_id: user?.id,
    per_page: rowsPerPage,
    page: page + 1,
    sim_id: sim?.id ? sim.id : 99999,
    search: debouncedValue,
    order_id: itemsArray?.id,
  });

  function cleanSimNumbers(simNumbers) {
    return simNumbers.map((item) => {
      let cleanSimNum = item.sim_num;
      if (cleanSimNum.endsWith('F')) {
        cleanSimNum = cleanSimNum.slice(0, -1);
      }
      return cleanSimNum;
    });
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

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(data.map((n, id) => id));
      return;
    }
    setSelected([]);
  }

  function handleDeselect() {
    setSelected([]);
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

  function handleChangePage(event, value) {
    setPage(value);
    // setchecked(false);
  }

  function handleChangeRowsPerPage(event) {
    // listordersims(data.data[0].sim_id, event.target.value, 1).then((result) => {
    //   setData(result);

    // });

    setRowsPerPage(event.target.value);
    // settmpdata(result);
    setPage(0);
  }

  function subscribeNew(shipping, billing) {
    return new Promise((resolve, reject) => {
      if (itemsArray.hash) {
        const result = {
          data: {
            order_hash: itemsArray.hash,
          },
        };
        result.amountcharged =
          tabValue2 == 0 ? itemsArray.credit_card.totalPrice : itemsArray.bank_account.totalPrice;
        result.planactivation = 1;
        resolve(result);
        setformstep(4);
      } else {
        alert('Something went wrong');
      }
    });
  }

  const createOrderHash = (arr) => {
    const patiencePopupTimeout = setTimeout(() => {
      dispatch(updateloader('Processing your order. Please wait.'));
    }, 6000);
    ordersubscription(arr.summary, zipcode, textArea, formobj, formobj2, sim)
      .then((result) => {
        // setloading3(false);
        settmploader(false);
        if (result.status == 'success') {
          secureLocalStorage.setItem('order_hash', result.data.order_hash);
          setrefresh(refresh + 1);
          window.history.replaceState(
            null,
            'New Page Title',
            `/dashboards/activatesims?order_hash=${result.data.order_hash}`
          );
          // updateSimsList();
          Swal.fire({
            icon: 'success',
            title: 'Plan added to your cart',
          });
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
      })
      .finally(() => {
        setUniversalLoader('');
        dispatch(updateloader(''));
        clearTimeout(patiencePopupTimeout);
      });
  };

  const uploadthisCsv = (e) => {
    try {
      setLoading('uploading');

      getBase64(e.target.files[0]).then((result) => {
        const reader = new FileReader();
        reader.onload = async ({ target }) => {
          const text = target.result;
          processCSV(text)
            .then(() => {
              csvordersubscription(select.id, result, null, null, sim, itemsArray)
                .then((result) => {
                  if (result.status == 'success') {
                    Swal.fire({
                      icon: 'success',
                      title: 'Plan added to your cart',
                    });
                    setrefresh(refresh + 1);
                  } else if (result.details) {
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      html: `${result.details.map((obj) => {
                        return `<h2>${obj}</h2>`;
                      })}`,
                    });
                  } else if (result.status == 'error') {
                    Swal.fire({
                      icon: 'error',
                      title: result.message,
                      html: `${result.invalid_zipcodes.map((obj) => {
                        return `<h2>${obj}</h2>`;
                      })}`,
                    });
                  }
                })
                .catch((error) => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'CSV uploading failed',
                  });
                })
                .finally(() => {
                  setLoading(false);
                });
            })
            .catch((error) => {
              if (!error) {
                setLoading(false);
                return;
              }
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'CSV uploading failed',
              });
              setLoading(false);
            });
        };

        reader.readAsText(e.target.files[0]);
      });
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
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function (error) {
        reject(error);
      };
    });
  }

  const processCSV = (str, delim = ',') => {
    return new Promise((resolve, reject) => {
      setsummarycsv(str);
      const headers = str.slice(0, str.indexOf('\n')).split(delim);
      let rows = str.slice(str.indexOf('\n') + 1).split('\n');
      rows = rows.filter((obj) => {
        if (obj != undefined && obj != '\r') {
          return obj;
        }
      });

      isSelected[0] == 1
        ? sim.zip_code_enabled === 1
          ? downloadultraCsv
          : downloadCsv
        : downloadCsv;

      if (sim.zip_code_enabled) {
        if (headers[1] != undefined && headers[0] != undefined) {
          if (!headers[1].includes('zip_code') || !headers[0].includes('sim_num')) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Headers of csv mismatched!. Download Sample.',
            });
            reject(false);
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Headers of csv mismatched!. Download Sample',
          });
          reject(false);
        }
      } else if (headers[0] != undefined && headers[1] == undefined) {
        if (!headers[0].includes('sim_num')) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Headers of csv mismatched!. Download Sample',
          });
          reject(false);
          return;
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Headers of csv mismatched!. Download Sample',
        });
        reject(false);
        return;
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
        reject(false);
        return;
      }

      if (newArray.length > simsActivationLimit) {
        Swal.fire({
          icon: 'info',
          title: 'Quantity error',
          text: `Please select maximum ${simsActivationLimit} sims at a time `,
        });
        reject(false);
        return;
      }

      // newArray.map((obj) => {
      //   if (obj.sim_num != "" && obj.sim_num != "\r") {
      //     let count = data.data.filter((x) => {
      //       if (x.sim_num === obj.sim_num) return true;
      //     }).length;

      //     if (count == 0) {
      //       arr.push(obj.sim_num);
      //     }
      //   }
      // });

      // if (arr.length > 0) {
      //   Swal.fire({
      //     icon: "error",
      //     title: "These numbers mismatched!",
      //     html: `${arr.map((obj) => {
      //       return `<h2>${obj}</h2>`;
      //     })}`,
      //   });
      //   return 0;
      // }

      const payload = {
        sim_id: sim.id,
        sim_numbers: cleanSimNumbers(newArray),
      };

      validateSims(payload, itemsArray.id).then((response) => {
        if (response.status == 'success') {
          setLoading(false);
          setqty(
            newArray.filter((obj) => {
              if (obj.sim_num.length > 1) return 1;
            }).length
          );

          const text = '';

          if (checkSimId()) {
            return true;
          }

          setUniversalLoader('');
          resolve(true);
        } else if (response.status == 'error') {
          Swal.fire({
            icon: 'error',
            title: response.message ?? 'These numbers mismatched!',
            html: `${response.non_matching_sim_numbers.map((obj) => {
              return `<h2>${obj}</h2>`;
            })}`,
          });
          setUniversalLoader('');
          reject(false);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Something went wrong',
          });
        }
      });
    });
  };

  const checkSimId = () => {
    if (sim?.id) {
      return false;
    }
    Swal.fire({
      icon: 'error',
      title: 'Sim id is required',
    });
    return true;
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
    setLoading('downloadcsv');

    const patiencePopupTimeout = setTimeout(() => {
      dispatch(updateloader('Downloading CSV. Please wait.'));
    }, 6000);
    listordersims(sim.id, listOfSims.total, 1)
      .then((response) => {
        const json = response.data.map((obj) => {
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
        link.setAttribute('download', `Sims${formattedToday}.csv`);
        document.body.appendChild(link); // Required for FF

        link.click();
      })
      .finally(() => {
        setLoading(false);
        dispatch(updateloader(''));
        clearTimeout(patiencePopupTimeout);
      });
  };

  const handler = (e) => {
    setloading2(true);
    setsimplans([]);
    setzipcode('');
    setData([]);
    setselectedno([]);
    settmpdata([]);
    getsimplans(e.target.value.id).then((resultw) => {
      if (resultw.details) {
        setsimplans([]);
        setloading2(false);
        setData([]);
        setselectedno([]);
        settmpdata([]);
      } else {
        setsimplans(resultw);
        setselectedno([]);
        setsim(e.target.value);
        setloading2(false);
        setisSeleceted([1, 0, 0]);
      }
      setPage(0);
    });
  };

  const updateSimsList = () => {
    if (sim?.id) {
      // setData(filteration(universalData));
      // settmpdata(filteration(universalData));
      setloading2(false);
      setselectedno([]);
      setchecked(false);
    }
  };

  useEffect(() => {
    updateSimsList();
  }, [itemsArray]);

  checkSignin();

  const validatezipcode = (e) => {
    setrederror(1);
    setzipcode(e.target.value);
  };

  useEffect(() => {
    const zipRegex = /^(?:(\d{5})(?:[ \-](\d{4}))?)$/i;
    const handler = setTimeout(() => {
      if (zipcode == '') {
        setrederror(0);
      } else if (!zipRegex.test(zipcode)) {
        setrederror(1);
        setErrorText('Zip code must be greater than 4 digit');
      } else if (sim.carrier_id == 6) {
        setrederror(0);
      } else if (sim.zip_code_enabled === 1) {
        validatezipcodeapi(zipcode).then((result) => {
          if (result.status == 'success') {
            setrederror(0);
          } else if (result.status == 'error') {
            setErrorText('Zip code is invalid');
            setrederror(1);
          }
        });
      }
    }, 2000);

    // Clean up the timeout if the input changes before the delay is reached
    return () => {
      clearTimeout(handler);
    };
  }, [zipcode]);

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
      let arrayOfImeiLines = imei.split('\n');
      arrayOfLines = arrayOfLines.filter((x) => x != '');
      arrayOfImeiLines = arrayOfImeiLines.filter((x) => x != '');
      if (sim.carrier_id == 6) {
        if (arrayOfImeiLines.length != arrayOfLines.length) {
          Swal.fire({
            icon: 'info',
            title: 'IMEIs quantity error',
            text: `IMEIs must be equal to sims selected.`,
          });
          return;
        }

        if (arrayOfImeiLines.length > 0) {
          if (arrayOfImeiLines.some((x) => x.length != 15)) {
            Swal.fire({
              icon: 'info',
              title: 'All IMEIs should be 15 digits long',
              // text: `Imei's cannot be greater than sims selected.`,
            });
            return;
          }
        }
      }
      if (arrayOfLines.length > simsActivationLimit) {
        Swal.fire({
          icon: 'info',
          title: 'Quantity Limit',
          text: `Please select maximum ${simsActivationLimit} sims at a time `,
        });
        return;
      }

      if (new Set(arrayOfLines).size !== arrayOfLines.length) {
        Swal.fire({
          icon: 'info',
          title: 'Duplicates value',
          text: 'Duplicate sim number not allowed',
        });
        return;
      }

      const payload = {
        sim_id: sim.id,
        sim_numbers: arrayOfLines.map((item) => {
          let cleanSimNum = item;
          if (cleanSimNum.endsWith('F')) {
            cleanSimNum = cleanSimNum.slice(0, -1);
          }
          return cleanSimNum;
        }),
      };

      setUniversalLoader('load2');
      validateSims(payload, itemsArray.id).then((response) => {
        if (response.status == 'success') {
          if (checkSimId()) {
            return true;
          }

          const newObj = {
            sim_name: sim.name,
            sim_id: sim.id,
            plan_name: select.name,
            plan_id: select.id,
            qty: arrayOfLines.length,
            text: textArea,
            type: 'standard_subscription',
            lines: arrayOfLines,
          };

          if (isSelected[0] == 1 && zipcode) {
            newObj.zip_code = zipcode;
          }
          if (sim.carrier_id == 6) {
            if (arrayOfImeiLines.length > 0) {
              newObj.sim_imeis = imei;
            }
          }
          setUniversalLoader('load2');
          processCartOrder(newObj)
            .then((result) => {
              if (result.status == 'success') {
                setUniversalLoader('');
              }
            })
            .catch(() => {
              setUniversalLoader('');
            });
        } else if (response.status == 'error') {
          Swal.fire({
            icon: 'error',
            title: response.message ?? 'These numbers mismatched!',
            html: `${response.non_matching_sim_numbers.map((obj) => {
              return `<h2>${obj}</h2>`;
            })}`,
          });
          setUniversalLoader('');
          return 0;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Something went wrong',
          });
          setUniversalLoader('');
        }
      });
    }
  };

  const textwrapper = () => {
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
    } else if (selectedno.length > simsActivationLimit) {
      Swal.fire({
        icon: 'info',
        title: 'Quantity Limit',
        text: `Please select maximum ${simsActivationLimit} sims at a time `,
      });
    } else {
      let text = '';

      selectedno.map((obj) => {
        text = `${text}\n${obj.sim_num}`;
      });

      if (checkSimId()) {
        return true;
      }

      const payload = {
        sim_id: sim.id,
        sim_numbers: selectedno.map((obj) => obj.sim_num),
      };

      setUniversalLoader('load2');
      setUniversalLoader('load3');
      validateSims(payload, itemsArray.id)
        .then((response) => {
          if (response.status == 'success') {
            const newObj = {
              sim_name: sim.name,
              sim_id: sim.id,
              plan_name: select.name,
              plan_id: select.id,
              qty: selectedno.length,
              text,
              type: 'standard_subscription',
              lines: selectedno.map((obj) => obj.sim_num),
            };

            if (isSelected[0] == 1 && zipcode) {
              newObj.zip_code = zipcode;
            }

            setUniversalLoader('load3');
            processCartOrder(newObj)
              .then((result) => {
                if (result.status == 'success') {
                }
                setUniversalLoader('');
              })
              .catch(() => {
                setUniversalLoader('');
              });
          } else if (response.status == 'error') {
            Swal.fire({
              icon: 'error',
              title: response.message ?? 'These numbers mismatched!',
              html: `${response.non_matching_sim_numbers.map((obj) => {
                return `<h2>${obj}</h2>`;
              })}`,
            });
            setUniversalLoader('');
            return 0;
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Something went wrong',
            });
            setUniversalLoader('');
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: error,
          });
          setUniversalLoader('');
        });
    }
  };

  const processCartOrder = (newObj) => {
    // if (newObj.qty > 900) {
    //   Swal.fire({
    //     icon: "info",
    //     title: "Quantity error",
    //     text: "Please enter maximum 900 numbers at a time.",
    //   });
    //   return;
    // }

    settmploader(true);
    if (tmploader) return;
    return new Promise((resolve, reject) => {
      if (itemsArray.hash) {
        newObj.order_type = itemsArray.type;
        const patiencePopupTimeout = setTimeout(() => {
          dispatch(updateloader('Processing your order. Please wait.'));
        }, 6000);
        addOrderItem(itemsArray.hash, null, newObj)
          .then((result) => {
            settmploader(false);
            setselectedno([]);
            if (result.status == 'success') {
              Swal.fire({
                icon: 'success',
                title: 'Plan added to your cart',
              });
              setrefresh(refresh + 1);
              resolve(result);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Cart is currently locked',
                text: 'Error',
              });
              reject(result);
              // setloading2(false);
            }
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Something went wrong',
              text: 'Error',
            });
            reject(error);
          })
          .finally(() => {
            dispatch(updateloader(''));
            clearTimeout(patiencePopupTimeout);
          });
      } else {
        const arr = itemsArray;

        arr.summary = [newObj];

        createOrderHash(arr);
      }
    });
  };

  const populateArray = (data) => {
    const plans = data;
    plans.summary = Object.entries(data.summary.plans).map((obj) => {
      return {
        plan_id: obj[0],
        // sim_id: obj[1],
        plan_name: obj[1].plan,
        // sim_name: obj[1].sim,
        type:
          data.order_groups.filter((x) => x.plan_id == obj[0]).map((x) => x.sim_num)[0] == null
            ? 'standard_recurring_plan'
            : 'standard_subscription',
        price: obj[1].prices.reduce((t, x) => t + parseFloat(x), 0),
        qty: obj[1].quantity,
        total: obj[1].prices.reduce((t, x) => t + parseFloat(x), 0),
        order_group_ids: data.order_groups.filter((x) => x.plan_id == obj[0]).map((x) => x.id),

        lines: data.order_groups
          .filter((x) => x.plan_id == obj[0])
          .map((x) => {
            return {
              sim: x.sim_num,
              zip: x.requested_zip,
              port: x.porting_number,
              carrier_id: x.plan.carrier_id,
              order_group_id: x.id,
              ...x,
            };
          }),
      };
    });
    plans.portNumbers = data.order_groups
      .filter((x) => x.porting_number)
      .map((obj) => {
        return { sim: obj.sim_num, port: obj.porting_number };
      });
    return plans;
  };

  const searchresult = (e) => {
    setPage(0);
    setsearch(e.target.value);
    // let arr = tmpdata.data.filter((obj) => {
    //   if (
    //     obj.sim.name.toLowerCase().includes(e.target.value) ||
    //     obj.sim_num.toString().includes(e.target.value) ||
    //     obj.order_num.toString().includes(e.target.value)
    //   ) {
    //     return true;
    //   }
    // });

    // setData({ ...data, data: arr });
  };
  function handleChangeTab(event, value) {
    setTabValue(value);
  }

  const setsellecteddata = () => {
    if (checked == false) {
      dispatch(updateloader('Selecting all sims. Please wait.'));

      listordersims(sim.id, listOfSims?.total, 1, itemsArray?.id)
        .then((response) => {
          setselectedno([...selectedno, ...response.data]);
        })
        .finally(() => {
          dispatch(updateloader(''));
        });
    } else {
      // var filtered = selectedno.filter(function(el) { if(data.data.some(x=>x.id!=el.id)) return el });

      setselectedno([]);
    }
  };

  useLayoutEffect(() => {
    getlistofactivationsims().then((obj) => {
      setsims(obj);
    });
  }, []);

  useEffect(() => {
    getstandardplans().then((obj) => {
      setstandardplans(obj);
    });
  }, []);

  useEffect(() => {
    if (searchParams.get('order_hash')) {
      getorderdetail(searchParams.get('order_hash'), tabValue2)
        .then((result) => {
          if (
            result?.status === 'success' &&
            result?.data?.status === 0 &&
            result.data.type === 2
          ) {
            setitemsArray(populateArray(result.data));
            setIsLocked(result.data.is_locked);
            refresh == 0 && result.data.order_groups.length > 0 && setformstep(formstep + 4);

            // setFormstep(1);
          } else if (result.data.type != 2) {
            Swal.fire({
              icon: 'info',
              title: 'Error',
              text: 'Invalid Order type',
            });

            window.history.replaceState(null, 'New Page Title', window.location.pathname);
          } else if (result?.data?.status === 1) {
            Swal.fire({
              icon: 'info',
              title: 'This order has been placed',
              text: 'Order Already Placed',
            });

            window.history.replaceState(null, 'New Page Title', window.location.pathname);
          } else if (result?.details) {
            Swal.fire({
              icon: 'info',
              title: 'Error',
              text: Object.entries(result.details)[0],
            });

            window.history.replaceState(null, 'New Page Title', window.location.pathname);
          } else {
            Swal.fire({
              icon: 'info',
              title: 'Invalid order',
              text: 'Not a valid order hash',
            });
            window.history.replaceState(null, 'New Page Title', window.location.pathname);
          }
        })
        .catch(() => {
          setloader(false);
        })
        .finally(() => {
          setloader(false);
        });
    } else {
      getPendingOrderHash(2)
        .then((result) => {
          setloader(false);
          if (result.data) {
            setloader(true);
            getorderdetail(result.data.hash, tabValue2).then((result) => {
              if (
                result?.status === 'success' &&
                result?.data?.status === 0 &&
                result.data.type === 2
              ) {
                setitemsArray(populateArray(result.data));
                setIsLocked(result.data.is_locked);
                refresh == 0 && result.data.order_groups.length > 0 && setformstep(formstep + 4);
                window.location.href.includes('activatesims') &&
                  window.history.replaceState(
                    null,
                    'New Page Title',
                    `${window.location.pathname}?order_hash=${result.data.hash}`
                  );
                // setFormstep(1);
              }
              setloader(false);
            });
          }
        })
        .finally(() => {});
    }
    refetch();
  }, [refresh]);

  const [loader, setloader] = useState(true);
  const { user: account } = useSelector((state) => {
    return state;
  });

  if (loader) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading />
      </div>
    );
  }

  return (
    <>
      {formstep == 0 ? (
        <>
          <div className="flex w-full container flex-col ">
            <div>
              <motion.div
                className="flex md:p-32 md:pb-0"
                initial={{ x: -20 }}
                animate={{ x: 0, transition: { delay: 0.3 } }}
              >
                <Typography className="text-3xl font-semibold tracking-tight leading-8">
                  Activate SIMs & Devices
                </Typography>{' '}
              </motion.div>
              {account?.data?.detail && account.data.detail.account_suspended == 1 && (
                <Typography className="md:pl-32 text-red-600 font-medium text-lg">
                  Account Suspended
                </Typography>
              )}
            </div>
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
                  label="Activate Sims"
                />
                {standardplans.length > 0 && (
                  <Tab
                    className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
                    disableRipple
                    label="Standard Recurring Plan"
                  />
                )}

                {/* <Tab
            className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
            disableRipple
            label="Standard Recurring Plan"
            /> */}
              </Tabs>
            </div>

            <div className="flex gap-x-[63px] flex-col md:items-start sm:flex-row flex-auto sm:items-end min-w-0 p-24 md:pt-0 md:p-32 pb-0 md:pb-0">
              {tabValue === 0 && (
                <>
                  <div className="flex flex-col flex-auto">
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
                        id="outlined-select-currency"
                        select
                        label={loading2 ? 'Loading ...' : 'Select'}
                        value={select}
                        onChange={(e) => {
                          setselect(e.target.value), setisSeleceted([1, 1, 0]);
                        }}
                        helperText="Please select your sim plan"
                        required={!loading2}
                        disabled={isSelected[0] == 0}
                        InputLabelProps={
                          isSelected[0] == 0
                            ? {
                                style: { color: 'gray' },
                              }
                            : {
                                style: { color: '#de0505' },
                              }
                        }
                      >
                        {simplans.map((obj, i) => {
                          return (
                            <MenuItem key={i} value={obj}>
                              {obj.name}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                      {isSelected[0] == 1 && sim.zip_code_enabled === 1 && (
                        <TextField
                          value={zipcode}
                          onChange={(e) => {
                            validatezipcode(e);
                          }}
                          id="outlined-required"
                          label="Zip Code (Optional)"
                          name="zipcode"
                          // disabled={isSelected[1] == 0?true:}
                          error={rederror == 1}
                          helperText={
                            rederror == 1 ? errortext : 'Only required for select carriers.'
                          }
                        />
                      )}

                      <TextField
                        className="mt-10"
                        id="outlined-multiline-static"
                        label="Enter Sims numbers in each new line"
                        multiline
                        rows={10}
                        value={textArea}
                        onChange={(e) => {
                          settextArea(e.target.value),
                            e.target.value.length > 0
                              ? setisSeleceted([1, 1, 1])
                              : setisSeleceted([1, 1, 0]);
                        }}
                        disabled={isSelected[1] == 0}
                      />
                      {isSelected[0] == 1 && sim.carrier_id == 6 && (
                        <TextField
                          className="mt-10"
                          id="outlined-multiline-static"
                          label="Enter Imei in each new line"
                          multiline
                          rows={10}
                          value={imei}
                          onChange={(e) => {
                            setImei(e.target.value);
                          }}
                          disabled={isSelected[1] == 0}
                        />
                      )}

                      <LoadingButton
                        loading={universalLoader === 'load2'}
                        className="whitespace-nowrap pos"
                        variant="contained"
                        color="secondary"
                        onClick={splitingnumbers}
                        disabled={isSelected[2] == 0 || rederror == 1}
                        style={{
                          width: '100px',
                          height: '40px',
                        }}
                      >
                        Select Sims
                      </LoadingButton>
                    </div>
                  </div>
                </>
              )}

              {tabValue === 1 && (
                <>
                  <StandardPlan
                    setformstep={setformstep}
                    itemsArray={itemsArray}
                    setitemsArray={setitemsArray}
                    qty={qty2}
                    setqty={setqty2}
                    standardplans={standardplans}
                    setrefresh={setrefresh}
                    processCartOrder={processCartOrder}
                  />
                </>
              )}

              <div className="min-w-[400px] max-w-[400px]  mt-[30px]">
                {itemsArray?.summary?.length > 0 && (
                  <>
                    <OrderSummaryModified
                      setrefresh={setrefresh}
                      checkout={subscribeNew}
                      orderhash={orderhash}
                      lines={lines}
                      itemsArray={itemsArray}
                      setitemsArray={setitemsArray}
                      plan2
                      isLock={isLocked}
                      updateSimsList={updateSimsList}
                      showSubmitBtn
                    />
                  </>
                )}
              </div>
            </div>
            {tabValue === 0 && (
              <>
                <hr className="mt-[30px]" />
                <div className="p-24 pb-0 flex justify-between">
                  <div className="">
                    {loading == 'uploading' ? (
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
                          disabled={isSelected[1] == 0}
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
                                ? sim.zip_code_enabled
                                  ? downloadultraCsv
                                  : downloadCsv
                                : downloadCsv
                            }
                          />
                        </Button>
                      </>
                    )}
                  </div>

                  <div className="flex">
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
                        disabled={listOfSims?.data?.length === 0}
                      >
                        {loading == 'downloadcsv' ? (
                          <div>Downloading...</div>
                        ) : (
                          <FuseSvgIcon className="text-48" size={24} color="white">
                            heroicons-outline:external-link
                          </FuseSvgIcon>
                        )}
                      </Button>
                    </motion.div>
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
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={13} style={{ textAlign: 'center' }}>
                              {' '}
                              <Box sx={{ width: '100%' }}>
                                <LinearProgress color="secondary" />
                              </Box>
                            </TableCell>{' '}
                          </TableRow>
                        ) : listOfSims.data?.length == 0 ? (
                          <TableRow>
                            <TableCell colSpan={13} style={{ textAlign: 'center' }}>
                              No data found
                            </TableCell>
                          </TableRow>
                        ) : (
                          _.orderBy(
                            listOfSims?.data,
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
                          ).map((obj, j) => {
                            const isiamSelected = selected.indexOf(j) !== -1;
                            return (
                              <TableRow
                                className="h-[20px] text-sm cursor-pointer"
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={ja}
                                selected={isiamSelected}
                                // onClick={(event) => handleClick(j)}
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
                                  className="p-4 text-right md:p-16"
                                  component="th"
                                  scope="row"
                                >
                                  {obj.sim.name}
                                </TableCell>
                                <TableCell
                                  className="p-4 text-right md:p-16"
                                  component="th"
                                  scope="row"
                                >
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
                          })
                        )}
                      </TableBody>
                    </Table>

                    <TablePagination
                      className="shrink-0 border-t-1"
                      component="div"
                      count={listOfSims?.total ? listOfSims?.total : 10}
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
                  <div className="text-blue-400 flex justify-end mr-[20px] relative bottom-[15px] italic min-h-[20px]">
                    {isFetching && ' Loading... '}
                  </div>
                </div>

                <div className="flex flex-col flex-auto" />

                <div
                  className="flex items-center justify-end mt-24 sm:mr-20 sm:mx-8 space-x-12 relative"
                  style={{ bottom: 42, marginTop: 50 }}
                >
                  <LoadingButton
                    loading={universalLoader === 'load3'}
                    className="whitespace-nowrap pos"
                    variant="contained"
                    color="secondary"
                    onClick={textwrapper}
                    disabled={isSelected[1] == 0}
                  >
                    Select Sims
                  </LoadingButton>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <CheckoutStandardPlan
          setqty={setqty2}
          setFormstep={setformstep}
          qty={qty2}
          //   simid={simid}
          subscribe={subscribeNew}
          itemsArray={itemsArray}
          setitemsArray={setitemsArray}
          lines={lines}
          orderhash={orderhash}
          tabValue={tabValue2}
          setTabValue={setTabValue2}
          setrefresh={setrefresh}
        />
      )}
    </>
  );
}

export default Orderlist;
