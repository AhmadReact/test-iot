import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import MenuItem from '@mui/material/MenuItem';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';

import states from '../../../data/states.json';
import { UpdateCustomerInformation } from '../../services/services';

export const Shipping = ({ customerdetail, setcustomerdetail }) => {
  const [editable, seteditable] = useState();
  const [loading, setloading] = useState(false);
  const updateInfo = () => {
    if (validate()) {
      setloading(true);
      const obj = {
        shipping_fname: customerdetail.shipping_fname,
        shipping_lname: customerdetail.shipping_lname,
        shipping_address1: customerdetail.shipping_address1,
        shipping_address2: customerdetail.shipping_address2,
        shipping_city: customerdetail.shipping_city,
        shipping_state_id: customerdetail.shipping_state_id,
        shipping_zip: customerdetail.shipping_zip,
      };

      UpdateCustomerInformation(obj).then((result) => {
        setloading(false);
        seteditable();

        if (result.message) {
          Swal.fire({
            icon: 'success',
            title: 'Updated Successfully',
            text: 'Shipping address updated successfully',
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
  };

  const validate = () => {
    if (customerdetail.shipping_fname == '') {
      setrederror(0);
      return false;
    }
    if (customerdetail.shipping_lname == '') {
      setrederror(1);
      return false;
    }
    if (customerdetail.shipping_address1 == '') {
      setrederror(2);
      return false;
    }
    if (customerdetail.shipping_address2 == '') {
      setrederror(3);
      return false;
    }
    if (customerdetail.shipping_city == '') {
      setrederror(4);
      return false;
    }
    if (customerdetail.shipping_state_id == '') {
      setrederror(5);
      return false;
    }
    if (customerdetail.shipping_zip == '') {
      setrederror(6);
      return false;
    }
    return true;
  };

  const [rederror, setrederror] = useState();

  const handleChange = (e) => {
    setrederror();
    const { name, value } = e.target;

    setcustomerdetail({ ...customerdetail, [name]: value });
  };
  return (
    <div className="md:px-24">
      <div style={{ rowGap: 15, marginTop: 30 }} className="flex gap-x-20 justify-center">
        {' '}
        <TextField
          value={customerdetail.shipping_fname}
          style={{ width: '50%' }}
          onChange={(e) => handleChange(e)}
          maxlengt="3"
          id="outlined-required"
          label="Shipping First Name*"
          name="shipping_fname"
          // disabled={isSelected[1] == 0?true:}
          error={rederror === 0}
          helperText={rederror === 0 && 'Invalid First Name'}
          // focused={editable === "shippinge"}
          inputProps={{ autoFocus: editable === 'shipping' }}
          disabled={!(editable === 'shipping')}
        />
        <TextField
          value={customerdetail.shipping_lname}
          style={{ width: '50%' }}
          onChange={(e) => handleChange(e)}
          id="outlined-required"
          label="Shipping Last Name*"
          name="shipping_lname"
          disabled={!(editable === 'shipping')}
          error={rederror === 1}
          helperText={rederror === 1 && 'Invalid Last Name'}
        />
      </div>

      <div style={{ rowGap: 15, marginTop: 20 }} className="flex gap-x-20 justify-center">
        {' '}
        <TextField
          value={customerdetail.shipping_address1}
          style={{ width: '50%' }}
          onChange={(e) => handleChange(e)}
          maxlengt="3"
          id="outlined-required"
          label="Address Line 1*"
          name="shipping_address1"
          // disabled={isSelected[1] == 0?true:}
          error={rederror == 2}
          helperText={rederror == 2 && 'Invalid Address 1'}
          inputProps={{ autoFocus: editable === 'shipping' }}
          disabled={!(editable === 'shipping')}
        />
        <TextField
          value={customerdetail.shipping_address2}
          style={{ width: '50%' }}
          onChange={(e) => handleChange(e)}
          id="outlined-required"
          label="Address Line 2"
          name="shipping_address2"
          disabled={!(editable === 'shipping')}
          error={rederror === 3}
          helperText={rederror === 3 && 'Invalid Address 2'}
        />
      </div>

      <div style={{ rowGap: 15, marginTop: 20 }} className="flex gap-x-20 justify-center">
        {' '}
        <TextField
          value={customerdetail.shipping_city}
          style={{ width: '50%' }}
          onChange={(e) => handleChange(e)}
          maxlengt="3"
          id="outlined-required"
          label="City*"
          name="shipping_city"
          // disabled={isSelected[1] == 0?true:}
          error={rederror == 4}
          helperText={rederror == 4 && 'Invalid City'}
          inputProps={{ autoFocus: editable === 'shipping' }}
          disabled={!(editable === 'shipping')}
        />
        {/* <TextField style={{width:"200px"}} error={rederror==4} value={props.formobj.state} name="state"  onChange={updateEvent} id="outlined-required" select label="State" required > 
         
        
       </TextField> */}
        <TextField
          value={customerdetail.shipping_state_id}
          style={{ width: '50%' }}
          onChange={(e) => handleChange(e)}
          id="outlined-required"
          label="State*"
          name="shipping_state_id"
          disabled={!(editable === 'shipping')}
          error={rederror === 5}
          helperText={rederror === 5 && 'Invalid State'}
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
          value={customerdetail.shipping_zip}
          style={{ width: '50%' }}
          onChange={(e) => handleChange(e)}
          maxlengt="3"
          id="outlined-required"
          label="Postal/Zip code*"
          name="shipping_zip"
          // disabled={isSelected[1] == 0?true:}
          error={rederror == 6}
          helperText={rederror == 6 && 'Invalid Zipcode'}
          inputProps={{ autoFocus: editable === 'shipping' }}
          disabled={!(editable === 'shipping')}
        />
        <div style={{ width: '50%' }} />
      </div>

      <div
        className="flex items-center justify-end mt-24 sm:mr-20 sm:mx-8 space-x-12 relative"
        style={{ bottom: 42, marginTop: 50 }}
      >
        {editable === 'shipping' ? (
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
            className="whitespace-nowrap md:ml-10 md:mt-3"
            variant="contained"
            color="secondary"
            onClick={() => seteditable('shipping')}
            // disabled={qty>0&&simid!=''?false:true}
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};

export default Shipping;
