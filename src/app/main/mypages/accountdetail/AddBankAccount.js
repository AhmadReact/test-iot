import { Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Swal from 'sweetalert2';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';

import states from '../../../data/states.json';
import { addAccount, getcustomeraccounts } from '../../services/services';

const AddBankAccount = ({ setcustomeraccounts }) => {
  const [accountDetail, setAccountDetail] = useState({
    routing_number: '',
    account_number: '',
    confirm_account: '',
    name_on_account: '',
    nick_name: 'test',
    make_primary: 0,
    billing_fname: '',
    billing_lname: '',
    billing_address1: '',
    billing_city: '',
    billing_zip: '',
    billing_state_id: '',
  });

  const [rederror, setrederror] = useState([0, 0, 0, 0, 0, 0, 0, 0]);

  const handleChange = (e) => {
    setrederror([0, 0, 0, 0, 0, 0, 0, 0]);
    const { name, value } = e.target;
    setAccountDetail({ ...accountDetail, [name]: value });
  };

  const [loading, setloading] = useState(false);
  const AddBankAcccount = () => {
    if (validate()) {
      setloading(true);
      addAccount(accountDetail).then((result) => {
        setloading(false);
        if (result.details) {
          Swal.fire({
            icon: 'info',
            title: 'Error',
            text: Object.keys(result.details).map((obj) => `${result.details[obj]},`),
          });
        } else if (result.status == 'success') {
          setAccountDetail({
            routing_number: '',
            account_number: '',
            confirm_account: '',
            name_on_account: '',
            nick_name: 'test',
            make_primary: 0,
            billing_fname: '',
            billing_lname: '',
            billing_address1: '',
            billing_city: '',
            billing_zip: '',
            billing_state_id: '',
          });
          getcustomeraccounts().then((result) => {
            setcustomeraccounts(result.data);
          });
          Swal.fire({
            icon: 'success',
            title: 'Account Successfully Added',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong',
          });
        }
      });
    }
  };
  const [mismatched, setmismatched] = useState(false);

  const validate = () => {
    const arr = [0, 0, 0, 0, 0, 0, 0, 0];
    if (accountDetail.routing_number == '' || accountDetail.routing_number.length < 9) {
      arr[0] = 1;
    }
    if (accountDetail.name_on_account === '') {
      arr[1] = 1;
    }
    if (
      accountDetail.account_number === '' ||
      accountDetail.account_number.length < 5 ||
      accountDetail.account_number.length > 17
    ) {
      arr[2] = 1;
    }
    if (accountDetail.account_number !== accountDetail.confirm_account) {
      setmismatched(true);
    }
    if (accountDetail.billing_fname === '') {
      arr[3] = 1;
    }
    if (accountDetail.billing_lname === '') {
      arr[4] = 1;
    }
    if (accountDetail.billing_address1 === '') {
      arr[5] = 1;
    }
    if (accountDetail.billing_city == '') {
      arr[6] = 1;
    }
    if (accountDetail.billing_state_id == '') {
      arr[7] = 1;
    }
    if (accountDetail.billing_zip == '') {
      arr[8] = 1;
    }
    if (arr.filter((obj) => obj == 1).length > 0) {
      setrederror(arr);
      return false;
    }
    return true;
  };

  const handlePaste = (event) => {
    event.preventDefault(); // Prevent pasting data
  };

  return (
    <>
      <div className="flex gap-6">
        <Typography className="md:w-[50%] mt-8 font-medium text-3xl leading-none">
          <TextField
            fullWidth
            error={rederror[2] === 1 || mismatched}
            maxlength="3"
            name="account_number"
            value={accountDetail.account_number}
            onChange={(e) => {
              // eslint-disable-next-line no-unused-expressions
              e.target.value >= 0 && e.target.value.length <= 17 && handleChange(e);
            }}
            // InputProps={{
            //   endAdornment: (
            //     <InputAdornment position="end">
            //       <FuseSvgIcon className="text-48" size={24} color="action">
            //         material-outline:credit_card
            //       </FuseSvgIcon>
            //     </InputAdornment>
            //   ),
            // }}
            id="outlined-required"
            label="Account number"
            helperText={
              (rederror[2] === 1 && 'Invalid account number') ||
              (mismatched && 'Confirm mismatched') ||
              (accountDetail.account_number.length != 0 &&
                (accountDetail.account_number.length < 5 ||
                  accountDetail.account_number.length > 17) &&
                'Account no. must be between 5 to 17')
            }
          />
        </Typography>
        <Typography className="md:w-[50%] mt-8 font-medium text-3xl leading-none">
          <TextField
            fullWidth
            error={
              rederror[2] === 1 ||
              mismatched ||
              (accountDetail.confirm_account.length > 0 &&
                accountDetail.confirm_account != accountDetail.account_number &&
                'This should match')
            }
            maxlength="3"
            name="confirm_account"
            value={accountDetail.confirm_account}
            onChange={(e) => {
              // eslint-disable-next-line no-unused-expressions
              e.target.value >= 0 && e.target.value.length <= 17 && handleChange(e);
            }}
            onPaste={handlePaste}
            // InputProps={{
            //   endAdornment: (
            //     <InputAdornment position="end">
            //       <FuseSvgIcon className="text-48" size={24} color="action">
            //         material-outline:credit_card
            //       </FuseSvgIcon>
            //     </InputAdornment>
            //   ),
            // }}
            id="outlined-required"
            label="Confirm account number"
            helperText={
              (rederror[2] === 1 && 'Invalid account number') ||
              (mismatched && 'Confirm mismatched') ||
              (accountDetail.confirm_account.length > 0 &&
                accountDetail.confirm_account !== accountDetail.account_number &&
                'This should match with account no.')
            }
          />
        </Typography>
      </div>
      <div className="flex gap-6">
        <Typography className="md:w-[50%] mt-8 font-medium text-3xl leading-none">
          <TextField
            fullWidth
            error={rederror[0] === 1}
            // InputProps={{
            //   inputComponent: TextMaskCustom,
            // }}
            name="routing_number"
            placeholder="000000000"
            value={accountDetail.routing_number}
            onChange={(e) => {
              (e.target.value >= 0) & (e.target.value.length <= 9) && handleChange(e);
            }}
            id="routing_number"
            label="Routing number"
            helperText={
              (rederror[0] === 1 && 'The routing number must be 9 digits') ||
              (accountDetail.routing_number.length != 0 &&
                accountDetail.routing_number.length != 9 &&
                'The routing number must be 9 digits')
            }
          />
        </Typography>
        <Typography className="md:w-[50%] mt-8 font-medium text-3xl leading-none">
          <TextField
            fullWidth
            error={rederror[1] === 1}
            // InputProps={{
            //   inputComponent: MMYY,
            // }}
            id="outlined-required"
            label="Account holder's name"
            name="name_on_account"
            value={accountDetail.name_on_account}
            onChange={(e) => {
              handleChange(e);
            }}
            helperText={rederror[1] === 1 && "Invalid holder's name"}
          />
        </Typography>
      </div>

      <div className="flex gap-6">
        <Typography className="md:w-[33%] mt-8 font-medium text-3xl leading-none">
          <TextField
            fullWidth
            error={rederror[3] === 1}
            maxlength="3"
            name="billing_fname"
            value={accountDetail.billing_fname}
            onChange={(e) => {
              handleChange(e);
            }}
            // InputProps={{
            //   endAdornment: (
            //     <InputAdornment position="end">
            //       <FuseSvgIcon className="text-48" size={24} color="action">
            //         material-outline:credit_card
            //       </FuseSvgIcon>
            //     </InputAdornment>
            //   ),
            // }}
            id="outlined-required"
            label="Billing first name"
            helperText={rederror[3] === 1 && 'Invalid billing first name'}
          />
        </Typography>
        <Typography className="md:w-[33%] mt-8 font-medium text-3xl leading-none">
          <TextField
            fullWidth
            error={rederror[4] === 1}
            name="billing_lname"
            value={accountDetail.billing_lname}
            onChange={(e) => {
              handleChange(e);
            }}
            // InputProps={{
            //   endAdornment: (
            //     <InputAdornment position="end">
            //       <FuseSvgIcon className="text-48" size={24} color="action">
            //         material-outline:credit_card
            //       </FuseSvgIcon>
            //     </InputAdornment>
            //   ),
            // }}
            id="outlined-required"
            label="Billing last name"
            helperText={rederror[4] === 1 && 'Invalid billing last name'}
          />
        </Typography>
        <Typography className="md:w-[33%] mt-8 font-medium text-3xl leading-none">
          <TextField
            fullWidth
            error={rederror[5] === 1}
            maxlength="3"
            name="billing_address1"
            value={accountDetail.billing_address1}
            onChange={(e) => {
              handleChange(e);
            }}
            // InputProps={{
            //   endAdornment: (
            //     <InputAdornment position="end">
            //       <FuseSvgIcon className="text-48" size={24} color="action">
            //         material-outline:credit_card
            //       </FuseSvgIcon>
            //     </InputAdornment>
            //   ),
            // }}
            id="outlined-required"
            label="Billing address"
            helperText={rederror[5] === 1 && 'Invalid billing address'}
          />
        </Typography>
      </div>

      <div className="flex gap-6">
        <Typography className="mt-8 md:w-[33%] font-medium text-3xl leading-none">
          <TextField
            className="md:w-[100%]"
            error={rederror[6] === 1}
            id="outlined-required"
            label="City"
            name="billing_city"
            value={accountDetail.billing_city}
            onChange={(e) => {
              handleChange(e);
            }}
            helperText={rederror[6] === 1 && 'Invalid city'}
          />
        </Typography>
        <Typography className="mt-8 md:w-[33%] font-medium text-3xl leading-none">
          <TextField
            className="md:w-[100%]"
            value={accountDetail.billing_state_id}
            onChange={(e) => {
              handleChange(e);
            }}
            error={rederror[7] === 1}
            id="outlined-required"
            label="State"
            name="billing_state_id"
            select
            helperText={rederror[7] === 1 && 'Invalid state'}
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
            error={rederror[8] === 1}
            id="outlined-required"
            label="Zipcode"
            name="billing_zip"
            value={accountDetail.billing_zip}
            onChange={(e) => {
              handleChange(e);
            }}
            helperText={rederror[8] === 1 && 'Invalid zipcode'}
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
                checked={accountDetail.make_primary}
                onClick={() =>
                  setAccountDetail({
                    ...accountDetail,
                    make_primary: accountDetail.make_primary ? 0 : 1,
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
            onClick={() => AddBankAcccount()}
            // disabled={qty>0&&simid!=''?false:true}
          >
            Add Bank
          </Button>
        )}
      </div>
    </>
  );
};

export default AddBankAccount;
