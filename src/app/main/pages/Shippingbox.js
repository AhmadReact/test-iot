import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo, useState, useImperativeHandle, useLayoutEffect } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import * as React from 'react';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import Swal from 'sweetalert2';
import secureLocalStorage from 'react-secure-storage';

import { updateShippingOnOrder, updateshippingaddress } from '../services/services';
import states from '../../data/states.json';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Shippingbox = React.forwardRef((props, ref) => {
  useLayoutEffect(() => {
    const user = JSON.parse(secureLocalStorage.getItem('user_info'));

    props.setformobj({
      firstname: user.shipping_fname,
      lastname: user.shipping_lname,
      streetaddress: user.shipping_address1,
      streetaddress2: user.shipping_address2,
      zipcode: user.shipping_zip,
      city: user.shipping_city,
      state: user.shipping_state_id,
    });
  }, []);

  const [rederror, setrederror] = useState(9);
  useImperativeHandle(ref, () => ({
    childFunction2() {
      if (props.formobj.firstname == '') {
        setState({ open: true, vertical: 'bottom', horizontal: 'right' });
        seterror('Enter valid first name');
        setrederror(0);

        return false;
      }
      if (
        props.formobj.lastname == '' ||
        props.formobj.lastname == 'null' ||
        props.formobj.lastname == null
      ) {
        setState({ open: true, vertical: 'bottom', horizontal: 'right' });
        seterror('Enter valid last name');
        setrederror(5);

        return false;
      }
      if (props.formobj.city == '') {
        setState({ open: true, vertical: 'bottom', horizontal: 'right' });
        seterror('Enter valid city name');
        setrederror(1);
        return false;
      }
      if (props.formobj.streetaddress == '') {
        setState({ open: true, vertical: 'bottom', horizontal: 'right' });
        seterror('Enter street address');
        setrederror(2);
        return false;
      }
      if (props.formobj.zipcode == '') {
        setState({ open: true, vertical: 'bottom', horizontal: 'right' });
        seterror('Enter valid zip code');
        setrederror(3);
        return false;
      }
      if (props.formobj.state == '') {
        setState({ open: true, vertical: 'bottom', horizontal: 'right' });
        seterror('Enter valid state');
        setrederror(4);
        return false;
      }
      return true;
    },
  }));

  const validate = () => {
    if (props.formobj.firstname == '') {
      setState({ open: true, vertical: 'bottom', horizontal: 'right' });
      seterror('Enter valid first name');
      setrederror(0);

      return false;
    }
    if (
      props.formobj.lastname == '' ||
      props.formobj.lastname == 'null' ||
      props.formobj.lastname == null
    ) {
      setState({ open: true, vertical: 'bottom', horizontal: 'right' });
      seterror('Enter valid last name');
      setrederror(5);

      return false;
    }
    if (props.formobj.city == '') {
      setState({ open: true, vertical: 'bottom', horizontal: 'right' });
      seterror('Enter valid city name');
      setrederror(1);
      return false;
    }
    if (props.formobj.streetaddress == '') {
      setState({ open: true, vertical: 'bottom', horizontal: 'right' });
      seterror('Enter street address');
      setrederror(2);
      return false;
    }
    if (props.formobj.zipcode == '') {
      setState({ open: true, vertical: 'bottom', horizontal: 'right' });
      seterror('Enter valid zip code');
      setrederror(3);
      return false;
    }
    if (props.formobj.state == '') {
      setState({ open: true, vertical: 'bottom', horizontal: 'right' });
      seterror('Enter valid state');
      setrederror(4);
      return false;
    }
    return true;
  };
  const [error, seterror] = useState('');
  const [loading, setloading] = useState(false);
  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;

  const updateEvent = (event) => {
    setrederror(9);
    const { name, value } = event.target;

    props.setformobj((preval) => {
      return {
        ...preval,
        [name]: value,
      };
    });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const updateshipping = () => {
    setloading(true);

    if (validate()) {
      updateshippingaddress(props.formobj).then((result) => {
        if (props.orderhash) {
          updateShippingOnOrder(props.formobj, props.orderhash).then((result) => {
            setloading(false);
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Successfully updated shipping address',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok',
            });
          });
        } else {
          setloading(false);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Successfully updated shipping address',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ok',
          });
        }
      });
    } else {
      setloading(false);
    }
  };

  return (
    <>
      <Paper className="relative flex flex-col flex-auto p-24 mb-24  rounded-2xl shadow overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
              Shipping Address
            </Typography>

            <Typography className="text-green-600 font-medium text-sm" />
          </div>
          <div className="-mt-8" />
        </div>

        <div className="flex gap-6 my-8">
          <Typography className="mt-8 font-medium text-3xl leading-none">
            <TextField
              error={rederror == 0}
              maxlength="3"
              id="outlined-required"
              label="First name"
              name="firstname"
              value={props.formobj.firstname}
              onChange={updateEvent}
              required
            />
          </Typography>
          <Typography className="mt-8 font-medium text-3xl leading-none">
            <TextField
              error={rederror == 5}
              id="outlined-required"
              label="Last name"
              name="lastname"
              value={props.formobj.lastname}
              onChange={updateEvent}
            />
          </Typography>
        </div>
        <Typography className="my-8 font-medium text-3xl leading-none">
          <TextField
            fullWidth
            error={rederror === 2}
            id="outlined-required"
            label="Address 1"
            name="streetaddress"
            value={props.formobj.streetaddress}
            onChange={updateEvent}
            required
          />
        </Typography>

        <Typography className="my-8 font-medium text-3xl leading-none">
          <TextField
            fullWidth
            id="outlined-required"
            label="Address 2"
            name="streetaddress2"
            value={props.formobj.streetaddress2}
            onChange={updateEvent}
          />
        </Typography>
        <Typography className="my-8 font-medium text-3xl leading-none">
          <TextField
            error={rederror == 1}
            fullWidth
            id="outlined-required"
            label="City"
            name="city"
            value={props.formobj.city}
            onChange={updateEvent}
            required
          />
        </Typography>

        <div className="flex gap-6 my-8">
          <Typography className="font-medium text-3xl leading-none">
            <TextField
              style={{ width: '200px' }}
              error={rederror == 4}
              value={props.formobj.state}
              name="state"
              onChange={updateEvent}
              id="outlined-required"
              select
              label="State"
              required
            >
              {states.map((option, i) => (
                <MenuItem key={i} value={option.code}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Typography>
          <Typography className="font-medium text-3xl leading-none">
            <TextField
              maxlength="3"
              error={rederror == 3}
              id="outlined-required"
              label="Zip Code"
              name="zipcode"
              value={props.formobj.zipcode}
              onChange={(e) => {
                e.target.value >= 0 && updateEvent(e);
              }}
            />
          </Typography>
        </div>

        <div className="absolute bottom-0 ltr:right-0 rtl:left-0 w-96 h-96 -m-24" />

        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleClose}
          message="I love snacks"
          key={vertical + horizontal}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Paper>

      <div className="flex justify-end mb-[24px]">
        {loading ? (
          <LoadingButton
            loading
            loadingPosition="start"
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
            onClick={updateshipping}
          >
            Update Shipping Address
          </Button>
        )}
      </div>
    </>
  );
});

export default memo(Shippingbox);
