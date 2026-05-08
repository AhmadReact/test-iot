import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import InputAdornment from '@mui/material/InputAdornment';

import { IMaskInput } from 'react-imask';
import { Button } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Swal from 'sweetalert2';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';

import states from '../../../data/states.json';
import { addbillingcardnew, getcustomercards } from '../../services/services';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="0000 0000 0000 0000 000"
      definitions={{
        '#': /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const MMYY = React.forwardRef(function MMYY(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="00/00"
      definitions={{
        '#': /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

MMYY.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const AddCreditCard = ({ customerdetail, setcustomercards }) => {
  const [rederror, setrederror] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [cardholdername, setcardholdername] = useState('');
  const [cardnumber, setcardnumber] = useState('saved');
  const [values, setValues] = React.useState({
    textmask: '',
    numberformat: '0000 0000 0000 0000',
    mmyy: '',
  });
  const [cvv, setcvv] = useState('');

  const [carddetail, setcarddetail] = useState({
    payment_card_no: '',
    payment_cvc: '',
    expires_mmyy: '',
    billing_city: '',
    billing_state_id: '',
    billing_zip: '',
    billing_address1: '',
    payment_card_holder: '',
    make_primary: false,
  });

  const addCard = () => {
    if (validate()) {
      setloading(true);
      addbillingcardnew(
        carddetail.payment_card_holder,
        carddetail.payment_card_no,
        carddetail.expires_mmyy,
        carddetail.payment_cvc,
        customerdetail,
        carddetail.billing_city,
        carddetail.billing_state_id,
        carddetail.billing_address1,
        carddetail.billing_zip,
        carddetail.make_primary
      ).then((response) => {
        setloading(false);
        if (response.message) {
          Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: response.message,
          });
        } else {
          setcarddetail({
            payment_card_no: '',
            payment_cvc: '',
            expires_mmyy: '',
            billing_city: '',
            billing_state_id: '',
            billing_zip: '',
            billing_address1: '',
            payment_card_holder: '',
            make_primary: false,
          });
          Swal.fire({
            icon: 'success',
            title: 'Updated Successfully',
            text: 'Card added successfully',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ok',
          });
          getcustomercards().then((result) => {
            setcustomercards(result);
          });
        }
      });
    }
  };

  const validate = () => {
    const arr = [0, 0, 0, 0, 0, 0, 0, 0];
    if (carddetail.payment_card_holder == '') {
      arr[0] = 1;
    }
    if (carddetail.expires_mmyy == '') {
      arr[1] = 1;
    }
    if (carddetail.payment_cvc == '') {
      arr[2] = 1;
    }
    if (carddetail.payment_card_no == '' || carddetail.payment_card_no.length < 15) {
      arr[3] = 1;
    }
    if (carddetail.billing_address1 == '') {
      arr[4] = 1;
    }
    if (carddetail.billing_city == '') {
      arr[5] = 1;
    }
    if (carddetail.billing_state_id == '') {
      arr[6] = 1;
    }
    if (carddetail.billing_zip == '') {
      arr[7] = 1;
    }

    if (arr.filter((obj) => obj == 1).length > 0) {
      setrederror(arr);
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setrederror([0, 0, 0, 0, 0, 0, 0, 0]);
    const { name, value } = e.target;
    setcarddetail({ ...carddetail, [name]: value });
  };

  const [loading, setloading] = useState(false);
  return (
    <>
      <div className="flex gap-6">
        <Typography className="md:w-[50%] mt-8 font-medium text-3xl leading-none">
          <TextField
            fullWidth
            error={rederror[3] === 1}
            InputProps={{
              inputComponent: TextMaskCustom,
            }}
            name="payment_card_no"
            placeholder="0000 0000 0000 0000"
            value={carddetail.payment_card_no}
            onChange={(e) => {
              handleChange(e);
            }}
            id="outlined-required"
            label="Card Number"
            helperText={rederror[3] === 1 && 'Invalid card number'}
          />
        </Typography>
        <Typography className="md:w-[25%] mt-8 font-medium text-3xl leading-none">
          <TextField
            fullWidth
            error={rederror[1] === 1}
            InputProps={{
              inputComponent: MMYY,
            }}
            id="outlined-required"
            label="MM/YY"
            name="expires_mmyy"
            value={carddetail.expires_mmyy}
            onChange={(e) => {
              handleChange(e);
            }}
            helperText={rederror[1] === 1 && 'Invalid expiry'}
          />
        </Typography>
        <Typography className="md:w-[25%] mt-8 font-medium text-3xl leading-none">
          <TextField
            fullWidth
            error={rederror[2] === 1}
            maxlength="3"
            name="payment_cvc"
            value={carddetail.payment_cvc}
            onChange={(e) => {
              (e.target.value >= 0) & (e.target.value.length < 5) && handleChange(e);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <FuseSvgIcon className="text-48" size={24} color="action">
                    material-outline:credit_card
                  </FuseSvgIcon>
                </InputAdornment>
              ),
            }}
            id="outlined-required"
            label="CVV"
            helperText={rederror[2] === 1 && 'Invalid cvv'}
          />
        </Typography>
      </div>
      <div className="flex gap-6">
        <Typography className="md:w-[50%] mt-8 font-medium text-3xl leading-none">
          <TextField
            error={rederror[0] === 1}
            fullWidth
            id="outlined-required"
            label="Cardholder Name"
            name="payment_card_holder"
            value={carddetail.payment_card_holder}
            onChange={(e) => {
              handleChange(e);
            }}
            helperText={rederror[0] === 1 && 'Invalid cardholder name'}
          />
        </Typography>

        <Typography className="md:w-[50%] mt-8 font-medium text-3xl leading-none">
          <TextField
            fullWidth
            error={rederror[4] === 1}
            name="billing_address1"
            value={carddetail.billing_address1}
            onChange={(e) => {
              handleChange(e);
            }}
            id="outlined-required"
            label="Address"
            helperText={rederror[4] === 1 && 'Invalid billing address'}
          />
        </Typography>
      </div>
      <div className="flex gap-6">
        <Typography className="mt-8 md:w-[33%] font-medium text-3xl leading-none">
          <TextField
            className="md:w-[100%]"
            error={rederror[5] === 1}
            id="outlined-required"
            label="City"
            name="billing_city"
            value={carddetail.billing_city}
            onChange={(e) => {
              handleChange(e);
            }}
            helperText={rederror[5] === 1 && 'Invalid city'}
          />
        </Typography>
        <Typography className="mt-8 md:w-[33%] font-medium text-3xl leading-none">
          <TextField
            className="md:w-[100%]"
            value={carddetail.billing_state_id}
            onChange={(e) => {
              handleChange(e);
            }}
            error={rederror[6] === 1}
            id="outlined-required"
            label="State"
            name="billing_state_id"
            select
            helperText={rederror[6] === 1 && 'Invalid state'}
          >
            {states.map((option, i) => (
              <MenuItem key={i} value={option.code}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Typography>
        <Typography className="mt-8 md:w-[33%] font-medium text-3xl leading-none">
          <TextField
            className="md:w-[100%]"
            error={rederror[7] === 1}
            id="outlined-required"
            label="Zipcode"
            name="billing_zip"
            value={carddetail.billing_zip}
            onChange={(e) => {
              handleChange(e);
            }}
            helperText={rederror[7] === 1 && 'Invalid zipcode'}
          />
        </Typography>
      </div>

      <div className="flex justify-between">
        <div>
          <FormControlLabel
            value="end"
            // ()=>setcustomerdetail({...customerdetail,auto_pay:!customerdetail.auto_pay})
            control={
              <Checkbox
                checked={carddetail.make_primary}
                onClick={() =>
                  setcarddetail({
                    ...carddetail,
                    make_primary: !carddetail.make_primary,
                  })
                }
              />
            }
            label="Make Primary"
            labelPlacement="end"
            className="md:mt-10"
          />
        </div>

        {loading ? (
          <LoadingButton
            loading
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="outlined"
            className="md:ml-10 md:mt-10"
          >
            Adding..
          </LoadingButton>
        ) : (
          <Button
            className="whitespace-nowrap md:ml-10 md:mt-10"
            variant="contained"
            color="secondary"
            onClick={() => addCard()}
            // disabled={qty>0&&simid!=''?false:true}
          >
            Add Card
          </Button>
        )}
      </div>
    </>
  );
};

export default AddCreditCard;
