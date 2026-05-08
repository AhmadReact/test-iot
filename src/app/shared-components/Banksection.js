import { useEffect, useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  MenuItem,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import Radio from '@mui/material/Radio';

import states from '../data/states.json';

const Banksection = ({
  customeraccounts,
  customeraccount,
  setcustomeraccount,
  formObj,
  setformObj,
  redErrorAccount,
}) => {
  const [rederror, setrederror] = useState('');
  const [loading, setloading] = useState(false);

  const getdefaultAccount = () => {
    if (customeraccounts.length > 0) {
      if (customeraccounts.filter((obj) => obj.is_primary === true).length > 0)
        setcustomeraccount(customeraccounts.filter((obj) => obj.is_primary === true)[0].id);
      else setcustomeraccount(customeraccounts[0].id);

      setloading(false);
    } else {
      setcustomeraccount('new');
      setloading(true);
    }
  };

  useEffect(() => {
    getdefaultAccount();
  }, [customeraccounts]);

  const handlePaste = (event) => {
    event.preventDefault(); // Prevent pasting data
  };

  return (
    <>
      <FormControl>
        <RadioGroup
          aria-labelledby="demo-error-radios"
          name="quiz"
          value={customeraccount}
          onChange={(e) => setcustomeraccount(e.target.value)}
          id="selectedcard"
        >
          {' '}
          {customeraccounts.length > 0 && (
            <>
              {customeraccounts.map((obj) => {
                return (
                  <FormControlLabel
                    onChange={() => {
                      setcustomeraccount(obj.id);
                      setloading(false);
                    }}
                    value={obj.id}
                    control={<Radio />}
                    label={`${obj.name_on_account}  ${obj.account_number}`}
                  />
                );
              })}
            </>
          )}
          <FormControlLabel
            onChange={() => {
              setcustomeraccount('new');
              setloading(true);
            }}
            value="new"
            control={<Radio />}
            label="Add New Account"
          />
        </RadioGroup>
      </FormControl>

      {loading && (
        <>
          <div className="flex gap-6">
            <Typography className="mt-8 font-medium text-3xl leading-none basis-[50%]">
              <TextField
                error={
                  formObj.account_number.length !== 0 &&
                  (formObj.account_number.length < 5 || formObj.account_number.length > 17)
                }
                fullWidth
                id="outlined-required"
                label="Account number"
                value={formObj.account_number}
                onChange={(e) => {
                  if (e.target.value >= 0 && e.target.value.length <= 17) {
                    setformObj({ ...formObj, [e.target.name]: e.target.value });
                  }
                }}
                name="account_number"
                helperText={
                  formObj.account_number.length != 0 &&
                  (formObj.account_number.length < 5 || formObj.account_number.length > 17) &&
                  'Account no. must be between 5 to 17'
                }
              />
            </Typography>

            <Typography className="mt-8 font-medium text-3xl leading-none basis-[50%]">
              <TextField
                error={
                  formObj.confirm_account.length > 0 &&
                  formObj.confirm_account !== formObj.account_number
                }
                fullWidth
                id="outlined-required"
                label="Confirm account number"
                value={formObj.confirm_account}
                onChange={(e) => {
                  if (e.target.value >= 0 && e.target.value.length <= 17) {
                    setformObj({ ...formObj, [e.target.name]: e.target.value });
                  }
                }}
                onPaste={handlePaste}
                name="confirm_account"
                helperText={
                  formObj.confirm_account.length > 0 &&
                  formObj.confirm_account != formObj.account_number &&
                  'This should match with account no.'
                }
              />
            </Typography>
          </div>
          <div className="flex gap-6">
            <Typography className="mt-8 font-medium text-3xl leading-none basis-[50%]">
              <TextField
                error={formObj.routing_number.length !== 0 && formObj.routing_number.length !== 9}
                fullWidth
                id="outlined-required"
                label="Routing number"
                value={formObj.routing_number}
                placeholder="000000000"
                onChange={(e) => {
                  if (e.target.value >= 0 && e.target.value.length <= 9) {
                    setformObj({ ...formObj, [e.target.name]: e.target.value });
                  }
                }}
                helperText={
                  formObj.routing_number.length !== 0 &&
                  formObj.routing_number.length !== 9 &&
                  'The routing number must be 9 digits'
                }
                name="routing_number"
              />
            </Typography>

            <Typography className="mt-8 font-medium text-3xl leading-none basis-[50%]">
              <TextField
                fullWidth
                error={rederror === 1}
                // InputProps={{
                //   inputComponent: TextMaskCustom,
                // }}
                name="name_on_account"
                value={formObj.name_on_account}
                onChange={(e) => {
                  setformObj({ ...formObj, [e.target.name]: e.target.value });
                }}
                id="outlined-required"
                label="Account holder's name"
              />
            </Typography>
          </div>
          <div className="flex gap-6">
            <Typography className="mt-8 font-medium text-3xl leading-none basis-[50%]">
              <TextField
                fullWidth
                id="outlined-required"
                label="Billing first name"
                value={formObj.billing_fname}
                onChange={(e) => {
                  setformObj({ ...formObj, [e.target.name]: e.target.value });
                }}
                name="billing_fname"
              />
            </Typography>

            <Typography className="mt-8 font-medium text-3xl leading-none basis-[50%]">
              <TextField
                fullWidth
                error={rederror === 1}
                // InputProps={{
                //   inputComponent: TextMaskCustom,
                // }}
                name="billing_lname"
                value={formObj.billing_lname}
                onChange={(e) => {
                  setformObj({ ...formObj, [e.target.name]: e.target.value });
                }}
                id="outlined-required"
                label="Billing last name"
              />
            </Typography>
            <Typography className="mt-8 font-medium text-3xl leading-none basis-[50%]">
              <TextField
                fullWidth
                id="outlined-required"
                label="Billing address"
                value={formObj.billing_address1}
                onChange={(e) => {
                  setformObj({ ...formObj, [e.target.name]: e.target.value });
                }}
                name="billing_address1"
              />
            </Typography>
          </div>
          <div className="flex gap-6">
            <Typography className="mt-8 font-medium text-3xl leading-none basis-[50%]">
              <TextField
                fullWidth
                error={rederror === 1}
                // InputProps={{
                //   inputComponent: TextMaskCustom,
                // }}
                name="billing_city"
                value={formObj.billing_city}
                onChange={(e) => {
                  setformObj({ ...formObj, [e.target.name]: e.target.value });
                }}
                id="outlined-required"
                label="City"
              />
            </Typography>
            <Typography className="mt-8 font-medium text-3xl leading-none basis-[50%]">
              <TextField
                className="md:w-[100%]"
                value={formObj.billing_state_id}
                onChange={(e) => {
                  setformObj({ ...formObj, [e.target.name]: e.target.value });
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
            <Typography className="mt-8 font-medium text-3xl leading-none basis-[50%]">
              <TextField
                fullWidth
                error={rederror === 1}
                // InputProps={{
                //   inputComponent: TextMaskCustom,
                // }}
                name="billing_zip"
                value={formObj.billing_zip}
                onChange={(e) => {
                  setformObj({ ...formObj, [e.target.name]: e.target.value });
                }}
                id="outlined-required"
                label="Zip"
              />
            </Typography>
          </div>
        </>
      )}
    </>
  );
};

export default Banksection;
