import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import MenuItem from '@mui/material/MenuItem';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';

import states from '../../../data/states.json';
import { UpdateCustomerInformation } from '../../services/services';

const Billing = ({ customerdetail, setcustomerdetail }) => {
  const [editable, seteditable] = useState();
  const [loading, setloading] = useState(false);
  const updateInfo = () => {
    if (validate()) {
      setloading(true);
      const obj = {
        billing_fname: customerdetail.billing_fname,
        billing_lname: customerdetail.billing_lname,
        billing_address1: customerdetail.billing_address1,
        billing_address2: customerdetail.billing_address2,
        billing_city: customerdetail.billing_city,
        billing_state_id: customerdetail.billing_state_id,
        billing_zip: customerdetail.billing_zip,
      };

      if (validate) {
        UpdateCustomerInformation(obj).then((result) => {
          setloading(false);

          if (result.message) {
            seteditable();
            Swal.fire({
              icon: 'success',
              title: 'Updated Successfully',
              text: 'Billing address updated successfully',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: result.details,
            });
          }
        });
      }
    }
  };

  const validate = () => {
    if (customerdetail.billing_fname == '') {
      setrederror(0);
      return false;
    }
    if (customerdetail.billing_lname == '') {
      setrederror(1);
      return false;
    }
    if (customerdetail.billing_address1 == '') {
      setrederror(2);
      return false;
    }
    if (customerdetail.billing_address2 == '') {
      setrederror(3);
      return false;
    }
    if (customerdetail.billing_city == '') {
      setrederror(4);
      return false;
    }
    if (customerdetail.billing_state_id == '') {
      setrederror(5);
      return false;
    }
    if (customerdetail.billing_zip == '') {
      setrederror(6);
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setrederror();
    const { name, value } = e.target;

    setcustomerdetail({ ...customerdetail, [name]: value });
  };

  const [rederror, setrederror] = useState();
  return (
    <div className="md:px-24">
      <div style={{ rowGap: 15, marginTop: 30 }} className="flex gap-x-20 justify-center">
        {' '}
        <TextField
          value={customerdetail.billing_fname}
          style={{ width: '50%' }}
          onChange={(e) => handleChange(e)}
          maxlengt="3"
          id="outlined-required"
          label="Billing First Name*"
          name="billing_fname"
          // disabled={isSelected[1] == 0?true:}
          error={rederror == 0}
          helperText={rederror == 0 && 'Invalid First Name'}
          inputProps={{ autoFocus: editable === 'firstname' }}
          disabled={!(editable === 'firstname')}
        />
        <TextField
          value={customerdetail.billing_lname}
          style={{ width: '50%' }}
          onChange={(e) => handleChange(e)}
          id="outlined-required"
          label="Billing Last Name*"
          name="billing_lname"
          disabled={!(editable === 'firstname')}
          error={rederror == 1}
          helperText={rederror == 1 && 'Invalid Last Name'}
        />
      </div>

      <div style={{ rowGap: 15, marginTop: 20 }} className="flex gap-x-20 justify-center">
        {' '}
        <TextField
          value={customerdetail.billing_address1}
          style={{ width: '50%' }}
          onChange={(e) => handleChange(e)}
          maxlengt="3"
          id="outlined-required"
          label="Address Line 1*"
          name="billing_address1"
          // disabled={isSelected[1] == 0?true:}
          error={rederror == 2}
          helperText={rederror == 2 && 'Invalid Address 1'}
          inputProps={{ autoFocus: editable === 'firstname' }}
          disabled={!(editable === 'firstname')}
        />
        <TextField
          value={customerdetail.billing_address2}
          style={{ width: '50%' }}
          onChange={(e) => handleChange(e)}
          id="outlined-required"
          label="Address Line 2"
          name="billing_address2"
          disabled={!(editable === 'firstname')}
          error={rederror == 3}
          helperText={rederror == 3 && 'Invalid Address 2'}
        />
      </div>

      <div style={{ rowGap: 15, marginTop: 20 }} className="flex gap-x-20 justify-center">
        {' '}
        <TextField
          value={customerdetail.billing_city}
          style={{ width: '50%' }}
          onChange={(e) => handleChange(e)}
          maxlengt="3"
          id="outlined-required"
          label="City*"
          name="billing_city"
          // disabled={isSelected[1] == 0?true:}
          error={rederror == 4}
          helperText={rederror == 4 && 'Invalid City'}
          inputProps={{ autoFocus: editable === 'firstname' }}
          disabled={!(editable === 'firstname')}
        />
        <TextField
          value={customerdetail.billing_state_id}
          style={{ width: '50%' }}
          onChange={(e) => handleChange(e)}
          id="outlined-required"
          label="State*"
          name="billing_state_id"
          disabled={!(editable === 'firstname')}
          error={rederror == 5}
          helperText={rederror == 5 && 'Invalid State'}
          select
        >
          {states.map((option, i) => (
            <MenuItem key={i} value={option.code}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div style={{ rowGap: 15, marginTop: 20 }} className="flex gap-x-20 justify-center">
        {' '}
        <TextField
          value={customerdetail.billing_zip}
          style={{ width: '50%' }}
          onChange={(e) => handleChange(e)}
          maxlengt="3"
          id="outlined-required"
          label="Postal/Zip code*"
          name="billing_zip"
          // disabled={isSelected[1] == 0?true:}
          error={rederror == 6}
          helperText={rederror == 6 && 'Invalid Zipcode'}
          inputProps={{ autoFocus: editable === 'firstname' }}
          disabled={!(editable === 'firstname')}
        />
        <div style={{ width: '50%' }} />
      </div>

      <div
        className="flex items-center justify-end mt-24 sm:mr-20 sm:mx-8 space-x-12 relative"
        style={{ bottom: 42, marginTop: 50 }}
      >
        {editable == 'firstname' ? (
          <>
            {loading ? (
              <LoadingButton
                loading
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="outlined"
                className="md:ml-10"
              >
                Updating..
              </LoadingButton>
            ) : (
              <Button
                className="whitespace-nowrap md:ml-10 md:mt-3"
                variant="contained"
                color="secondary"
                onClick={() => updateInfo()}
                // disabled={qty>0&&simid!=''?false:true}
              >
                Update
              </Button>
            )}
            <Button
              className="whitespace-nowrap md:ml-10 md:mt-3"
              variant="contained"
              color="secondary"
              onClick={() => seteditable()}
              // disabled={qty>0&&simid!=''?false:true}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            className="whitespace-nowrap pos"
            variant="contained"
            color="secondary"
            onClick={() => seteditable('firstname')}
            // disabled={isSelected[1] == 0}
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};

export default Billing;
