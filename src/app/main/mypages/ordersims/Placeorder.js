import { useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';

import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { getlistofsims } from 'src/app/main/services/services';
import secureLocalStorage from 'react-secure-storage';

import { useDispatch, useSelector } from 'react-redux';

import checkSignin from '../../customHook.js/checkSignin';

import BasicInfoTab from '../../apps/e-commerce/product/tabs/BasicInfoTab';
import {
  addOrderItem,
  getPendingOrderHash,
  getlistofgateways,
  getorderdetail,
  placesimsorder,
} from '../../services/services';
import { updateloader } from '../../apps/e-commerce/store/loaderSlice';

import Checkoutplaceorder from './Checkoutplaceorder';

import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';

const Placeorder = (props) => {
  const handleClose = () => setOpen(false);
  const [qty, setqty] = useState('');
  const [simid, setsimid] = useState('');
  const [servermsg, setservermsg] = useState('');
  const navigate = useNavigate();
  const [Formstep, setFormstep] = useState(0);
  const [style, setstyle] = useState({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  });
  const [open, setOpen] = useState(false);
  const navigation = useNavigate();
  const childRef = useRef();
  const childRef2 = useRef();
  const [sims, setsims] = useState([]);
  const [loading2, setloading2] = useState(false);
  const [gateways, setgateways] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  // userinfo.primary_payment_account?.payment_account_type=="bank-account"?1:0
  const dispatch = useDispatch();
  checkSignin();
  useEffect(() => {
    getlistofsims().then((obj) => {
      setsims(obj.data);
    });

    getlistofgateways().then((obj) => {
      setgateways(obj.hasOwnProperty('data') ? obj.data : []);
    });
  }, []);

  const placeorder = () => {
    return new Promise((resolve, reject) => {
      resolve(true);
      setFormstep(Formstep + 1);
    });
  };

  document.title = 'Order SIMs & Devices';
  const [itemsArray, setitemsArray] = useState({ summary: [] });
  const user = JSON.parse(secureLocalStorage.getItem('user_info'));

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

  const [showPatiencePopup, setShowPatiencePopup] = useState(false);
  const processCartOrder = (type) => {
    return new Promise((resolve, reject) => {
      if (orderhash) {
        const patiencePopupTimeout = setTimeout(() => {
          dispatch(updateloader('Processing your order. Please wait.'));
        }, 6000);

        addOrderItem(orderhash, {
          sim_id: simid.id,
          qty,
          type,
        })
          .then((result) => {
            if (result.status === 'success') {
              updatecart(orderhash).then(() => {
                resolve(true);
                dispatch(updateloader(''));
                clearTimeout(patiencePopupTimeout);
              });
            } else {
              reject(true);
              Swal.fire({
                icon: 'error',
                title: 'Cart is currently locked',
                text: 'Error',
              });
              dispatch(updateloader(''));
              clearTimeout(patiencePopupTimeout);
            }
          })
          .catch(() => {
            Swal.fire({
              icon: 'error',
              title: 'Server error',
              text: 'Error',
            });
            // props.setloading2(false);
            setloading2(false);
            dispatch(updateloader(''));
            clearTimeout(patiencePopupTimeout);
          })
          .finally(() => {});
      } else {
        const patiencePopupTimeout = setTimeout(() => {
          dispatch(updateloader('Processing your order. Please wait.'));
        }, 6000);

        placesimsorder(
          props.sim,
          props.tmp,
          formobj,
          formobj2,
          props.five,
          props.six,
          props.seven,
          props.eight,
          [
            {
              sim_id: simid.id,
              qty,
              type,
            },
          ]
        )
          .then((result) => {
            // setloading(false);
            if (result.status === 'success') {
              result.planactivation = 0;
              setOrderHash(result.data.order_hash);
              window.history.replaceState(
                null,
                'New Page Title',
                `/dashboards/placeorder?order_hash=${result.data.order_hash}`
              );
              updatecart(result.data.order_hash).then(() => {
                resolve(true);
                dispatch(updateloader(''));
                clearTimeout(patiencePopupTimeout);
              });
            } else {
              reject(result);
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
              });
              dispatch(updateloader(''));
              clearTimeout(patiencePopupTimeout);
            }
          })
          .catch((error) => {
            reject(error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            });
            dispatch(updateloader(''));
            clearTimeout(patiencePopupTimeout);
          });
      }
    });
  };

  const [searchParams, setSearchParams] = useSearchParams();

  const populateArray = (data) => {
    const sims = Object.entries(data.summary.sims).map((obj) => {
      return {
        sim_id: obj[0],
        sim_name: obj[1].sim,
        type: 'sims',
        price: obj[1].prices[0],
        qty: obj[1].quantity,
        total: obj[1].prices[0] * obj[1].quantity,
        order_group_ids: data.order_groups.filter((x) => x.sim_id == obj[0]).map((x) => x.id),
      };
    });

    const onoff = Object.entries(data.summary.one_offs).map((obj) => {
      return {
        sim_id: obj[0],
        sim_name: obj[1].one_off,
        type: 'one_offs',
        price: obj[1].prices[0],
        qty: obj[1].quantity,
        total: obj[1].prices[0] * obj[1].quantity,
        order_group_ids: data.order_groups.filter((x) => x.one_off_id == obj[0]).map((x) => x.id),
      };
    });

    data.summary = [...sims, ...onoff];
    return data;
    // return simsArray.map((obj) => {
    //   return {
    //     sim_id: obj[0],
    //     sim_name: obj[1].sim,
    //     price: obj[1].prices[0],
    //     qty: obj[1].quantity,
    //     order_group_ids: order_groups
    //       .filter((x) => x.sim_id == obj[0])
    //       .map((x) => x.id),
    //   };
    // });
  };

  const [orderhash, setOrderHash] = useState();
  const [refresh, setrefresh] = useState(0);
  useEffect(() => {
    wrapper();
  }, []);

  const [isLock, setIsLock] = useState(false);

  const wrapper = () => {
    setloader(true);

    if (searchParams.get('order_hash')) {
      setMessage('Loading your cart...');
      getorderdetail(searchParams.get('order_hash'), tabValue).then((result) => {
        setloader(false);
        if (result.status === 'success' && result.data.status === 0 && result.data.type === 1) {
          setitemsArray(populateArray(result.data));
          setIsLock(result.data.is_locked);
          setOrderHash(searchParams.get('order_hash'));
          refresh == 0 && result.data.order_groups.length > 0 && setFormstep(Formstep + 1);

          // setFormstep(1);
        } else if (result.data.type != 1) {
          Swal.fire({
            icon: 'info',
            title: 'Error',
            text: 'Invalid order type',
          });

          window.history.replaceState(null, 'New Page Title', window.location.pathname);
        } else if (result.data.status === 1) {
          Swal.fire({
            icon: 'info',
            title: 'This order has been placed',
            text: 'Order Already Placed',
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
      });
    } else {
      getPendingOrderHash(1).then((obj) => {
        if (obj?.data?.hash) {
          setMessage('Loading your cart...');
          getorderdetail(obj.data.hash, tabValue).then((result) => {
            if (result.status === 'success' && result.data.status === 0 && result.data.type === 1) {
              setitemsArray(populateArray(result.data));
              setOrderHash(obj.data.hash);
              setIsLock(result.data.is_locked);
              window.location.href.includes('placeorder') &&
                window.history.replaceState(
                  null,
                  'New Page Title',
                  `${window.location.pathname}?order_hash=${obj.data.hash}`
                );

              refresh == 0 && result.data.order_groups.length > 0 && setFormstep(Formstep + 1);
              // window.location.search = '?orderhash='+JSON.parse(secureLocalStorage.getItem("user_info")).order.hash;
              // setFormstep(1);
            } else if (result.data.type != 1) {
              Swal.fire({
                icon: 'info',
                title: 'Error',
                text: 'Invalid order type',
              });

              window.history.replaceState(null, 'New Page Title', window.location.pathname);
            } else if (result.data.status === 1) {
              Swal.fire({
                icon: 'info',
                title: 'This order has been placed',
                text: 'Order Already Placed',
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
            setloader(false);
          });
        } else {
          setloader(false);
        }
      });
    }
  };

  const updatecart = (hash) => {
    return new Promise((resolve, reject) => {
      const patiencePopupTimeout = setTimeout(() => {
        dispatch(updateloader('loading'));
      }, 6000);

      getorderdetail(hash, tabValue)
        .then((result) => {
          setsimid('');
          setqty('');
          setloading2(false);

          if (result.status === 'success' && result.data.status === 0) {
            setitemsArray(populateArray(result.data));
            resolve(result);
          } else if (result.data.status === 1) {
            Swal.fire({
              icon: 'info',
              title: 'This order has been placed',
              text: 'Order Already Placed',
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
          Swal.fire({
            icon: 'info',
            title: 'Invalid order',
            text: 'Not a valid order hash',
          });
        })
        .finally(() => {
          dispatch(updateloader(''));
          clearTimeout(patiencePopupTimeout);
        });
    });
  };

  useEffect(() => {
    if (itemsArray.hash) {
      updatecart(itemsArray.hash);
    }
  }, [refresh]);

  // useEffect(()=>{
  //   if (itemsArray.hash) {

  //     updatecartforsurcharge(itemsArray.hash);
  //   }
  // },[])

  const [loader, setloader] = useState(true);
  const [message, setMessage] = useState('');

  const loading = useSelector((state) => {
    return state.loader;
  });

  const { user: account } = useSelector((state) => {
    return state;
  });

  if (loader) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading message={message} />
      </div>
    );
  }

  return (
    <>
      {Formstep == 0 ? (
        <>
          <div className="flex flex-col w-full container">
            {/* {loading == "loading" && <Longloading />} */}

            <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
              <div className="flex flex-col flex-auto">
                <motion.div
                  className="flex"
                  initial={{ x: -20 }}
                  animate={{ x: 0, transition: { delay: 0.3 } }}
                >
                  <Typography className="text-3xl font-semibold tracking-tight leading-8">
                    Order SIMs & Devices
                  </Typography>
                </motion.div>
                {account?.data?.detail && account.data.detail.account_suspended == 1 && (
                  <Typography className="text-red-600 font-medium text-lg">
                    Account Suspended
                  </Typography>
                )}
              </div>
              <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12" />
            </div>

            <BasicInfoTab
              sims={sims}
              setsims={setsims}
              setqty={setqty}
              qty={qty}
              setdesc={setsimid}
              desc={simid}
              placeorder={placeorder}
              itemsArray={itemsArray}
              setitemsArray={setitemsArray}
              updatecart={updatecart}
              orderhash={orderhash}
              gateways={gateways}
              isLock={isLock}
              loading2={loading2}
              setloading2={setloading2}
              setrefresh={setrefresh}
              processCartOrder={processCartOrder}
              tabValue={tabValue}
            />
          </div>
        </>
      ) : (
        Formstep == 1 && (
          <>
            <Checkoutplaceorder
              setqty={setqty}
              setFormstep={setFormstep}
              qty={qty}
              simid={simid}
              itemsArray={itemsArray}
              setitemsArray={setitemsArray}
              orderhash={orderhash}
              tabValue={tabValue}
              setTabValue={setTabValue}
              setrefresh={setrefresh}
            />
          </>
        )
      )}
    </>
  );
};

export default Placeorder;
